import { Router, Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate user with Google OAuth
 * @access  Public
 */
router.post('/google', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: 'Google credential is required'
            });
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Google token'
            });
        }

        const { email, name, picture, sub: googleId } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = await User.create({
                name: name || 'Google User',
                email,
                googleId,
                avatar: picture,
                role: 'citizen', // Default role for Google sign-ups
                isEmailVerified: true, // Google emails are verified
                authProvider: 'google'
            });
        } else {
            // Update existing user with Google info if not set
            if (!user.googleId) {
                user.googleId = googleId;
                user.isEmailVerified = true;
                user.authProvider = 'google';
                if (picture && !user.avatar) {
                    user.avatar = picture;
                }
                await user.save();
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error: any) {
        console.error('Google OAuth error:', error);
        res.status(500).json({
            success: false,
            message: 'Google authentication failed',
            error: error.message
        });
    }
});

export default router;

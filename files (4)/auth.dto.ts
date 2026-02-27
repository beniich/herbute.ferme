/**
 * dto/auth.dto.ts
 * express-validator chains for authentication endpoints.
 */
import { body } from 'express-validator';

export const RegisterDto = [
  body('email')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character'),

  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
];

export const LoginDto = [
  body('email')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const RefreshTokenDto = [
  body('refreshToken')
    .notEmpty().withMessage('refreshToken is required')
    .isString().withMessage('refreshToken must be a string'),
];

export const LogoutDto = [
  body('refreshToken')
    .notEmpty().withMessage('refreshToken is required'),
];

export const IntrospectDto = [
  body('token')
    .notEmpty().withMessage('token is required'),
];

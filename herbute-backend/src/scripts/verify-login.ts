
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.join(process.cwd(), '.env') });

const testLogin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error('MONGODB_URI missing');

        await mongoose.connect(mongoUri);
        console.log('Connected to DB');

        const email = 'admin@reclamtrack.com';
        const password = 'Admin123!';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('âŒ User NOT found');
            process.exit(1);
        }

        console.log('âœ… User found:', user.email);

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            console.log('âœ… Password Match: SUCCESS');
        } else {
            console.log('âŒ Password Match: FAILED');
            // Log hash to see if it looks right (starts with $2a$ or $2b$)
            console.log('Stored Hash:', user.password);
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

testLogin();

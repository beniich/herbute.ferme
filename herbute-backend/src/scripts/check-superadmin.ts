import { connectDB } from '../config/db.js';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkUser() {
    await connectDB();
    const email = 'superadmin@herbute.ma';
    const user = await User.findOne({ email }).select('+passwordHash');
    if (user) {
        console.log('User found:');
        console.log('ID:', user._id);
        console.log('Email:', user.email);
        console.log('Role:', user.role);
        console.log('Plan:', user.plan);
        console.log('Active:', user.isActive);
        console.log('Verified:', user.emailVerified);
        console.log('Has Password Hash:', !!user.passwordHash);
    } else {
        console.log('User NOT found:', email);
    }
    process.exit(0);
}

checkUser();

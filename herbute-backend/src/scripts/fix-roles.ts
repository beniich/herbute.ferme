import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Organization } from '../models/Organization.js';
import { connectDB } from '../config/db.js';

async function run() {
    await connectDB();
    const users = await User.find({ role: 'employe' });
    for (const u of users) {
        const org = await Organization.findOne({ ownerId: u._id });
        if (org) {
            u.role = 'admin';
            await u.save();
            console.log(`✅ Mis à jour l'utilisateur ${u.email} en tant qu'administrateur (propriétaire)`);
        }
    }
    console.log('Terminé.');
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});

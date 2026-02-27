import mongoose from 'mongoose';
import { config } from 'dotenv';
import { User } from '../models/User.js';
import { Team } from '../models/Team.js';
import { Complaint } from '../models/Complaint.js';
import { Staff } from '../models/Staff.js';
import { Organization } from '../models/Organization.js';
import { Membership } from '../models/Membership.js';
import { logger } from '../utils/logger.js';

config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI not defined in .env');
        }

        await mongoose.connect(mongoUri);
        logger.info('✅ Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Team.deleteMany({});
        await Complaint.deleteMany({});
        await Staff.deleteMany({});
        await Organization.deleteMany({});
        await Membership.deleteMany({});
        logger.info('🗑️  Cleared existing data');

        // Create Admin User
        const adminUser = await User.create({
            email: 'admin@reclamtrack.com',
            password: 'Admin123!', // Will be hashed by the model
            name: 'Admin System',
            role: 'admin',
            isEmailVerified: true
        });
        logger.info('👤 Created admin user: admin@reclamtrack.com / Admin123!');

        // Create Superadmin User for Monitoring
        const superAdminUser = await User.create({
            email: 'superadmin@reclamtrack.com',
            password: 'SuperAdmin123!',
            name: 'Super Administrator',
            role: 'admin', // Using admin role but can be identified by email for special permissions
            isEmailVerified: true
        });
        logger.info('🔐 Created superadmin user: superadmin@reclamtrack.com / SuperAdmin123!');

        // Create Default Organization
        const organization = await Organization.create({
            name: 'ReclamTrack Default',
            slug: 'reclamtrack-default',
            ownerId: adminUser._id,
            subscription: {
                plan: 'ENTERPRISE',
                status: 'ACTIVE'
            }
        });
        logger.info(`🏢 Created organization: ${organization.name}`);

        // Add Admin to Organization
        await Membership.create({
            userId: adminUser._id,
            organizationId: organization._id,
            roles: ['OWNER', 'ADMIN'],
            status: 'ACTIVE',
            joinedAt: new Date()
        });

        // Add Superadmin to Organization
        await Membership.create({
            userId: superAdminUser._id,
            organizationId: organization._id,
            roles: ['OWNER', 'ADMIN'],
            status: 'ACTIVE',
            joinedAt: new Date()
        });
        logger.info('🔗 Added admin and superadmin to organization');

        // Create Teams
        const teams = await Team.create([
            {
                name: 'Équipe Électricité',
                specialization: 'electrical',
                status: 'disponible',
                organizationId: organization._id,
                isActive: true
            },
            {
                name: 'Équipe Plomberie',
                specialization: 'plumbing',
                status: 'disponible',
                organizationId: organization._id,
                isActive: true
            },
            {
                name: 'Équipe Voirie',
                specialization: 'infrastructure',
                status: 'disponible',
                organizationId: organization._id,
                isActive: true
            }
        ]);
        logger.info(`👥 Created ${teams.length} teams`);

        // Create Staff Members
        const staff = await Staff.create([
            {
                name: 'Jean Dupont',
                email: 'jean.dupont@reclamtrack.com',
                role: 'Technicien Électricité'
            },
            {
                name: 'Marie Martin',
                email: 'marie.martin@reclamtrack.com',
                role: 'Technicienne Plomberie'
            },
            {
                name: 'Pierre Bernard',
                email: 'pierre.bernard@reclamtrack.com',
                role: 'Superviseur Voirie'
            }
        ]);
        logger.info(`🔧 Created ${staff.length} staff members`);

        // Create Sample Complaints
        const complaints = await Complaint.create([
            {
                category: 'Électricité',
                subcategory: 'Panne de courant',
                priority: 'urgent',
                title: 'Panne électrique rue Victor Hugo',
                description: 'Coupure de courant depuis 2 heures dans tout le quartier',
                address: '15 Rue Victor Hugo',
                city: 'Paris',
                district: '16ème',
                postalCode: '75016',
                latitude: 48.8566,
                longitude: 2.3522,
                isAnonymous: false,
                firstName: 'Sophie',
                lastName: 'Dubois',
                email: 'sophie.dubois@example.com',
                phone: '+33612345678',
                status: 'en cours',
                assignedTeamId: teams[0]._id,
                technicianId: adminUser._id, // Assign to a user instead of staff model if possible, or leave blank
                organizationId: organization._id
            },
            {
                category: 'Plomberie',
                subcategory: 'Fuite d\'eau',
                priority: 'high',
                title: 'Fuite importante avenue des Champs',
                description: 'Fuite d\'eau visible sur la chaussée, risque d\'inondation',
                address: '42 Avenue des Champs-Élysées',
                city: 'Paris',
                district: '8ème',
                postalCode: '75008',
                latitude: 48.8698,
                longitude: 2.3078,
                isAnonymous: true,
                status: 'nouvelle',
                organizationId: organization._id
            },
            {
                category: 'Voirie',
                subcategory: 'Nid de poule',
                priority: 'medium',
                title: 'Nid de poule boulevard Saint-Germain',
                description: 'Trou important sur la chaussée, dangereux pour les véhicules',
                address: '120 Boulevard Saint-Germain',
                city: 'Paris',
                district: '6ème',
                postalCode: '75006',
                latitude: 48.8534,
                longitude: 2.3364,
                isAnonymous: false,
                firstName: 'Marc',
                lastName: 'Leroy',
                email: 'marc.leroy@example.com',
                phone: '+33698765432',
                status: 'résolue',
                assignedTeamId: teams[2]._id,
                organizationId: organization._id
            }
        ]);
        logger.info(`📋 Created ${complaints.length} sample complaints`);

        logger.info('✅ Database seeding completed successfully!');

        setTimeout(() => process.exit(0), 1000);
    } catch (error) {
        console.error('❌ Seeding failed (console):', error);
        logger.error('❌ Seeding failed (logger):', error);
        setTimeout(() => process.exit(1), 1000);
    }
};

seedDatabase();

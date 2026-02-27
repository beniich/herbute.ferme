import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri || mongoUri.includes('username:password')) {
            (global as any).IS_DEMO_MODE = true;
            logger.warn('⚠️  MongoDB non configuré - Mode DÉMO activé (données en mémoire)');
            logger.warn('💡 Pour activer MongoDB, configure MONGODB_URI dans backend/.env');
            return;
        }

        await mongoose.connect(mongoUri);
        logger.info('✅ MongoDB connecté');
    } catch (err) {
        mongoose.set('bufferCommands', false);
        (global as any).IS_DEMO_MODE = true;
        logger.warn('⚠️  Impossible de se connecter à MongoDB - Mode DÉMO activé');
        logger.warn('💡 Erreur:', err instanceof Error ? err.message : err);
        logger.warn('💡 L\'application continuera sans base de données (données en mémoire)');
        // Ne pas quitter le processus, continuer en mode démo
    }
};

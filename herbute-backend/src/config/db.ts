import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri || mongoUri.includes('username:password')) {
            (global as any).IS_DEMO_MODE = true;
            logger.warn('âš ï¸  MongoDB non configurÃ© - Mode DÃ‰MO activÃ© (donnÃ©es en mÃ©moire)');
            logger.warn('ðŸ’¡ Pour activer MongoDB, configure MONGODB_URI dans backend/.env');
            return;
        }

        await mongoose.connect(mongoUri);
        logger.info('âœ… MongoDB connectÃ©');
    } catch (err) {
        mongoose.set('bufferCommands', false);
        (global as any).IS_DEMO_MODE = true;
        logger.warn('âš ï¸  Impossible de se connecter Ã  MongoDB - Mode DÃ‰MO activÃ©');
        logger.warn('ðŸ’¡ Erreur:', err instanceof Error ? err.message : err);
        logger.warn('ðŸ’¡ L\'application continuera sans base de donnÃ©es (donnÃ©es en mÃ©moire)');
        // Ne pas quitter le processus, continuer en mode dÃ©mo
    }
};

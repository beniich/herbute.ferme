import { config } from 'dotenv';
config();

// Only what Herbute needs â€” no SMTP, Stripe, or SSH
const REQUIRED: string[] = ['PORT', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'ALLOWED_ORIGINS'];

export const envValidator = (): void => {
  const missing = REQUIRED.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`âŒ Variables manquantes (Herbute) : ${missing.join(', ')}`);
    process.exit(1);
  }

  console.log("âœ… Variables d'environnement Herbute validÃ©es");
};

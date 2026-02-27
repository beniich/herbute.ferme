/**
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * config/jwt.ts â€” Configuration JWT RS256
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 *
 * RS256 vs HS256 :
 *  - HS256 : Une seule clÃ© symÃ©trique â†’ tous les services
 *            peuvent SIGNER ET VÃ‰RIFIER (dangeureux si un service est compromis)
 *  - RS256 : ClÃ© privÃ©e (signe) dans ce backend uniquement
 *            ClÃ© publique (vÃ©rifie seulement) â†’ peut Ãªtre distribuÃ©e
 *
 * Ce backend est le seul Ã  possÃ©der JWT_PRIVATE_KEY.
 * Tout service tiers n'a accÃ¨s qu'Ã  JWT_PUBLIC_KEY.
 */

import fs from 'fs';
import path from 'path';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Chargement des clÃ©s (depuis env ou fichiers)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const loadKey = (envVar: string, filePath?: string): string => {
  // PrioritÃ© 1 : Variable d'environnement (production, CI/CD)
  if (process.env[envVar]) {
    // Les \n Ã©chappÃ©s dans les env vars Docker/CI doivent Ãªtre convertis
    return process.env[envVar]!.replace(/\\n/g, '\n');
  }

  // PrioritÃ© 2 : Fichier local (dÃ©veloppement)
  if (filePath) {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf-8');
    }
  }

  throw new Error(
    `[JWT] ClÃ© manquante: ${envVar} non dÃ©finie et fichier ${filePath} introuvable.\n` +
    `Lancez: chmod +x generate-keys.sh && ./generate-keys.sh`
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Export des clÃ©s et de la configuration
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const jwtConfig = {
  /** ClÃ© privÃ©e RSA â€” signature uniquement, JAMAIS exposÃ©e */
  privateKey: loadKey('JWT_PRIVATE_KEY', './keys/private.pem'),

  /** ClÃ© publique RSA â€” vÃ©rification, peut Ãªtre partagÃ©e */
  publicKey: loadKey('JWT_PUBLIC_KEY', './keys/public.pem'),

  algorithm: 'RS256' as const,

  /** DurÃ©e de vie du access token */
  accessTokenTtl: process.env.JWT_ACCESS_TTL || '15m',

  /** DurÃ©e de vie du refresh token */
  refreshTokenTtl: process.env.JWT_REFRESH_TTL || '7d',

  issuer: process.env.JWT_ISSUER || 'herbute.ma',
  audience: process.env.JWT_AUDIENCE || 'herbute-app',
};

// Validation au dÃ©marrage
const validateKeys = () => {
  if (!jwtConfig.privateKey.includes('-----BEGIN')) {
    throw new Error('[JWT] ClÃ© privÃ©e invalide â€” format PEM requis');
  }
  if (!jwtConfig.publicKey.includes('-----BEGIN')) {
    throw new Error('[JWT] ClÃ© publique invalide â€” format PEM requis');
  }
  console.log('âœ… [JWT] ClÃ©s RS256 chargÃ©es et validÃ©es');
};

validateKeys();

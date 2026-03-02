import compression from 'compression';
import { Request, Response } from 'express';

export const compressionMiddleware = compression({
  level: 6,           // Bonne balance vitesse/taille
  threshold: 1024,    // Ne pas compresser les réponses < 1KB
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
});

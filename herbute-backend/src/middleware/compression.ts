import compression from 'compression';

export const compressionMiddleware = compression({
  level: 6,           // Bonne balance vitesse/taille
  threshold: 1024,    // Ne pas compresser les réponses < 1KB
  filter: (req: any, res: any) => {
    if (req.headers['x-no-compression']) return false;
    return (compression as any).filter(req, res);
  },
});

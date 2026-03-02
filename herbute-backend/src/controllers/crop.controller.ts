import { Request, Response, NextFunction } from 'express';
import { cropService } from '../services/crop.service.js';

/**
 * COUCHE CONTRÔLEUR — crop.controller.ts
 *
 * Responsabilités :
 *  ✅ Extraire les paramètres de req (query, params, body, headers)
 *  ✅ Appeler le Service approprié
 *  ✅ Formater la réponse HTTP (status code + JSON shape)
 *  ✅ Déléguer les erreurs à next(err)
 *
 *  ❌ PAS de logique métier ici
 *  ❌ PAS d'accès direct aux modèles Mongoose
 */
export class CropController {

  // GET /api/crops/stats
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await cropService.getStats(
        req.organizationId!,
        { category: req.query.category as string | undefined }
      );
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  }

  // GET /api/crops
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const crops = await cropService.findAll(req.organizationId!, {
        category: req.query.category as string | undefined,
        status:   req.query.status   as string | undefined,
        plotId:   req.query.plotId   as string | undefined,
        search:   req.query.search   as string | undefined,
      });
      res.json({ success: true, data: crops });
    } catch (err) { next(err); }
  }

  // GET /api/crops/:id
  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const crop = await cropService.findById(req.params.id, req.organizationId!);
      if (!crop) {
        res.status(404).json({ success: false, message: 'Culture introuvable' });
        return;
      }
      res.json({ success: true, data: crop });
    } catch (err) { next(err); }
  }

  // POST /api/crops
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const crop = await cropService.create(req.organizationId!, req.body);
      res.status(201).json({ success: true, data: crop });
    } catch (err) { next(err); }
  }

  // PUT /api/crops/:id
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const crop = await cropService.update(req.params.id, req.organizationId!, req.body);
      if (!crop) {
        res.status(404).json({ success: false, message: 'Culture introuvable' });
        return;
      }
      res.json({ success: true, data: crop });
    } catch (err) { next(err); }
  }

  // POST /api/crops/:id/harvest
  async harvest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const crop = await cropService.harvest(req.params.id, req.organizationId!, {
        actualYield: req.body.actualYield,
        notes:       req.body.notes,
      });
      if (!crop) {
        res.status(404).json({ success: false, message: 'Culture introuvable' });
        return;
      }
      res.json({ success: true, data: crop, message: 'Récolte enregistrée avec succès' });
    } catch (err) {
      // Erreur métier (déjà récoltée) → 409 Conflict
      if (err instanceof Error && err.message.includes('déjà été récoltée')) {
        res.status(409).json({ success: false, message: err.message });
        return;
      }
      next(err);
    }
  }

  // DELETE /api/crops/:id
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await cropService.delete(req.params.id, req.organizationId!);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Culture introuvable' });
        return;
      }
      res.json({ success: true, message: 'Supprimé avec succès' });
    } catch (err) { next(err); }
  }
}

// Export singleton
export const cropController = new CropController();

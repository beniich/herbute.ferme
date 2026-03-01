import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requireOrganization } from '../middleware/security.js';
import { validator } from '../middleware/validator.js';
import Crop from '../models/Crop.js';

const router = Router();
router.use(authenticate, requireOrganization);

// GET /api/crops/stats
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = { organizationId: req.organizationId };
    if (req.query.category) filter.category = req.query.category;

    const [byStatus, byCategory, totalYield] = await Promise.all([
      Crop.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 }, yield: { $sum: '$estimatedYield' } } }
      ]),
      Crop.aggregate([
        { $match: filter },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Crop.aggregate([
        { $match: { ...filter, status: { $in: ['HARVESTED', 'READY'] } } },
        { $group: { _id: null, total: { $sum: '$estimatedYield' } } }
      ])
    ]);

    res.json({
      success: true,
      data: { byStatus, byCategory, totalYield: totalYield[0]?.total || 0 }
    });
  } catch (err) { next(err); }
});

// GET /api/crops
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = { organizationId: req.organizationId };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const crops = await Crop.find(filter).sort({ plantedDate: -1 });
    res.json({ success: true, data: crops });
  } catch (err) { next(err); }
});

// GET /api/crops/:id
router.get('/:id',
  param('id').isMongoId(), validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const crop = await Crop.findOne({ _id: req.params.id, organizationId: req.organizationId });
      if (!crop) return res.status(404).json({ success: false, message: 'Culture introuvable' });
      res.json({ success: true, data: crop });
    } catch (err) { next(err); }
  }
);

// POST /api/crops
router.post('/',
  [
    body('name').notEmpty().withMessage('Nom requis'),
    body('category').isIn(['VEGETABLE', 'HERB', 'NURSERY', 'FOREST']).withMessage('Catégorie invalide'),
    body('plotId').notEmpty().withMessage('Identifiant parcelle requis'),
    body('plantedDate').isISO8601().withMessage('Date de plantation invalide'),
    body('status').optional().isIn(['PLANTED', 'GROWING', 'READY', 'HARVESTED']),
    body('expectedHarvestDate').optional().isISO8601(),
    body('estimatedYield').optional().isFloat({ min: 0 }),
    body('notes').optional().isString(),
    body('surface').optional().isFloat({ min: 0 }),
  ],
  validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const crop = await Crop.create({ ...req.body, organizationId: req.organizationId });
      res.status(201).json({ success: true, data: crop });
    } catch (err) { next(err); }
  }
);

// PUT /api/crops/:id
router.put('/:id',
  param('id').isMongoId(), validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const crop = await Crop.findOneAndUpdate(
        { _id: req.params.id, organizationId: req.organizationId },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!crop) return res.status(404).json({ success: false, message: 'Culture introuvable' });
      res.json({ success: true, data: crop });
    } catch (err) { next(err); }
  }
);

// POST /api/crops/:id/harvest — Enregistrer une récolte
router.post('/:id/harvest',
  param('id').isMongoId(),
  body('actualYield').isFloat({ min: 0 }).withMessage('Rendement réel requis'),
  validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const crop = await Crop.findOneAndUpdate(
        { _id: req.params.id, organizationId: req.organizationId },
        { $set: { status: 'HARVESTED', estimatedYield: req.body.actualYield, harvestedAt: new Date() } },
        { new: true }
      );
      if (!crop) return res.status(404).json({ success: false, message: 'Culture introuvable' });
      res.json({ success: true, data: crop, message: 'Récolte enregistrée avec succès' });
    } catch (err) { next(err); }
  }
);

// DELETE /api/crops/:id
router.delete('/:id',
  param('id').isMongoId(), validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const crop = await Crop.findOneAndDelete({ _id: req.params.id, organizationId: req.organizationId });
      if (!crop) return res.status(404).json({ success: false, message: 'Culture introuvable' });
      res.json({ success: true, message: 'Supprimé avec succès' });
    } catch (err) { next(err); }
  }
);

export default router;

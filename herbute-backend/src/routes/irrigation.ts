import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requireOrganization } from '../middleware/security.js';
import { validator } from '../middleware/validator.js';
import IrrigationLog from '../models/IrrigationLog.js';

const router = Router();
router.use(authenticate, requireOrganization);

// GET /api/irrigation/stats
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = { organizationId: req.organizationId };
    
    const [totalVolume, byPlot, byMethod] = await Promise.all([
      IrrigationLog.aggregate([
        { $match: { ...filter, status: 'COMPLETED' } },
        { $group: { _id: null, total: { $sum: '$volume' } } }
      ]),
      IrrigationLog.aggregate([
        { $match: filter },
        { $group: { _id: '$plotId', total: { $sum: '$volume' }, count: { $sum: 1 } } }
      ]),
      IrrigationLog.aggregate([
        { $match: filter },
        { $group: { _id: '$method', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalVolume: totalVolume[0]?.total || 0,
        byPlot,
        byMethod
      }
    });
  } catch (err) { next(err); }
});

// GET /api/irrigation
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = { organizationId: req.organizationId };
    if (req.query.plotId) filter.plotId = req.query.plotId;
    if (req.query.status) filter.status = req.query.status;

    const logs = await IrrigationLog.find(filter).sort({ date: -1 });
    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
});

// POST /api/irrigation
router.post('/',
  [
    body('plotId').notEmpty().withMessage('Parcelle requise'),
    body('volume').isFloat({ min: 0 }).withMessage('Volume invalide'),
    body('duration').isInt({ min: 0 }).withMessage('Durée invalide'),
    body('date').optional().isISO8601(),
    body('status').optional().isIn(['COMPLETED', 'SCHEDULED', 'IN_PROGRESS']),
    body('method').optional().isIn(['DRIP', 'SPRINKLER', 'SURFACE']),
    body('notes').optional().isString(),
  ],
  validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const log = await IrrigationLog.create({
        ...req.body,
        organizationId: req.organizationId,
        date: req.body.date ? new Date(req.body.date) : new Date(),
      });
      res.status(201).json({ success: true, data: log });
    } catch (err) { next(err); }
  }
);

// PUT /api/irrigation/:id
router.put('/:id',
  param('id').isMongoId(), validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const log = await IrrigationLog.findOneAndUpdate(
        { _id: req.params.id, organizationId: req.organizationId },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!log) return res.status(404).json({ success: false, message: 'Fiche d\'irrigation introuvable' });
      res.json({ success: true, data: log });
    } catch (err) { next(err); }
  }
);

// DELETE /api/irrigation/:id
router.delete('/:id',
  param('id').isMongoId(), validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const log = await IrrigationLog.findOneAndDelete({ _id: req.params.id, organizationId: req.organizationId });
      if (!log) return res.status(404).json({ success: false, message: 'Fiche d\'irrigation introuvable' });
      res.json({ success: true, message: 'Supprimée avec succès' });
    } catch (err) { next(err); }
  }
);

export default router;

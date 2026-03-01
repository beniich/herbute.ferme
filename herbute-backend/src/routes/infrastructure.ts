import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requireOrganization } from '../middleware/security.js';
import { validator } from '../middleware/validator.js';
import Infrastructure from '../models/Infrastructure.js';

const router = Router();
router.use(authenticate, requireOrganization);

// GET /api/infrastructure
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = { organizationId: req.organizationId };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const items = await Infrastructure.find(filter).sort({ name: 1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

// POST /api/infrastructure
router.post('/',
  [
    body('name').notEmpty().withMessage('Nom requis'),
    body('type').isIn(['BUILDING', 'EQUIPMENT', 'WELL', 'FENCE', 'ROAD', 'OTHER']).withMessage('Type invalide'),
    body('status').isIn(['OPERATIONAL', 'MAINTENANCE', 'DAMAGED', 'CONSTRUCTION']).withMessage('Statut invalide'),
    body('location').notEmpty().withMessage('Emplacement requis'),
  ],
  validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await Infrastructure.create({ ...req.body, organizationId: req.organizationId });
      res.status(201).json({ success: true, data: item });
    } catch (err) { next(err); }
  }
);

// PUT /api/infrastructure/:id
router.put('/:id',
  param('id').isMongoId(), validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await Infrastructure.findOneAndUpdate(
        { _id: req.params.id, organizationId: req.organizationId },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!item) return res.status(404).json({ success: false, message: 'Infrastructure introuvable' });
      res.json({ success: true, data: item });
    } catch (err) { next(err); }
  }
);

// DELETE /api/infrastructure/:id
router.delete('/:id',
  param('id').isMongoId(), validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await Infrastructure.findOneAndDelete({ _id: req.params.id, organizationId: req.organizationId });
      if (!item) return res.status(404).json({ success: false, message: 'Infrastructure introuvable' });
      res.json({ success: true, message: 'Supprimée avec succès' });
    } catch (err) { next(err); }
  }
);

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { authenticate, requireOrganization } from '../middleware/security.js';
import { validator } from '../middleware/validator.js';
import FarmTransaction from '../models/FarmTransaction.js';
import FarmKPI from '../models/FarmKPI.js';

const router = Router();
router.use(authenticate, requireOrganization);

// ─── HELPER: Recalculate KPI for a month ───
async function recalculateKPI(organizationId: string, year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const [revenues, expenses] = await Promise.all([
    FarmTransaction.aggregate([
      { $match: { organizationId, type: 'recette', date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    FarmTransaction.aggregate([
      { $match: { organizationId, type: 'depense', date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
  ]);

  const totalRevenue = revenues[0]?.total || 0;
  const totalExpenses = expenses[0]?.total || 0;
  await FarmKPI.findOneAndUpdate(
    { organizationId, month, year },
    { totalRevenue, totalExpenses, netProfit: totalRevenue - totalExpenses, cashFlow: totalRevenue - totalExpenses },
    { upsert: true, new: true }
  );
}

// GET /api/finance/stats
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [monthRevenue, monthExpenses, yearRevenue, yearExpenses, bySector] = await Promise.all([
      FarmTransaction.aggregate([
        { $match: { organizationId: orgId, type: 'recette', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      FarmTransaction.aggregate([
        { $match: { organizationId: orgId, type: 'depense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      FarmTransaction.aggregate([
        { $match: { organizationId: orgId, type: 'recette', date: { $gte: startOfYear } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      FarmTransaction.aggregate([
        { $match: { organizationId: orgId, type: 'depense', date: { $gte: startOfYear } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      FarmTransaction.aggregate([
        { $match: { organizationId: orgId } },
        { $group: { _id: '$sector', revenue: { $sum: { $cond: [{ $eq: ['$type', 'recette'] }, '$amount', 0] } }, expenses: { $sum: { $cond: [{ $eq: ['$type', 'depense'] }, '$amount', 0] } } } }
      ])
    ]);

    const mr = monthRevenue[0]?.total || 0;
    const me = monthExpenses[0]?.total || 0;
    const yr = yearRevenue[0]?.total || 0;
    const ye = yearExpenses[0]?.total || 0;

    res.json({
      success: true,
      data: {
        month: { revenue: mr, expenses: me, profit: mr - me },
        year: { revenue: yr, expenses: ye, profit: yr - ye },
        bySector
      }
    });
  } catch (err) { next(err); }
});

// GET /api/finance/kpis
router.get('/kpis', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month as string) || now.getMonth() + 1;
    const year = parseInt(req.query.year as string) || now.getFullYear();
    const kpi = await FarmKPI.findOne({ organizationId: req.organizationId, month, year });
    res.json({ success: true, data: kpi || { totalRevenue: 0, totalExpenses: 0, netProfit: 0, cashFlow: 0, month, year } });
  } catch (err) { next(err); }
});

// GET /api/finance/transactions
router.get('/transactions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = { organizationId: req.organizationId };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.sector) filter.sector = req.query.sector;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.from) filter.date = { ...filter.date, $gte: new Date(req.query.from as string) };
    if (req.query.to) filter.date = { ...filter.date, $lte: new Date(req.query.to as string) };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      FarmTransaction.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      FarmTransaction.countDocuments(filter)
    ]);

    res.json({ success: true, data: transactions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// POST /api/finance/transactions
router.post('/transactions',
  [
    body('description').notEmpty().withMessage('Description requise'),
    body('category').notEmpty().withMessage('Catégorie requise'),
    body('sector').notEmpty().withMessage('Secteur requis'),
    body('type').isIn(['recette', 'depense']).withMessage('Type invalide (recette ou depense)'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Montant invalide'),
    body('date').optional().isISO8601(),
  ],
  validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await FarmTransaction.create({
        ...req.body,
        organizationId: req.organizationId,
        date: req.body.date ? new Date(req.body.date) : new Date(),
      });
      // Recalculate KPI for the transaction's month
      const d = transaction.date;
      await recalculateKPI(req.organizationId!, d.getFullYear(), d.getMonth() + 1);
      res.status(201).json({ success: true, data: transaction });
    } catch (err) { next(err); }
  }
);

// PUT /api/finance/transactions/:id
router.put('/transactions/:id',
  param('id').isMongoId(), validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await FarmTransaction.findOneAndUpdate(
        { _id: req.params.id, organizationId: req.organizationId },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!transaction) return res.status(404).json({ success: false, message: 'Transaction introuvable' });
      // Recalculate KPI
      const d = transaction.date;
      await recalculateKPI(req.organizationId!, d.getFullYear(), d.getMonth() + 1);
      res.json({ success: true, data: transaction });
    } catch (err) { next(err); }
  }
);

// DELETE /api/finance/transactions/:id
router.delete('/transactions/:id',
  param('id').isMongoId(), validator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await FarmTransaction.findOneAndDelete({ _id: req.params.id, organizationId: req.organizationId });
      if (!transaction) return res.status(404).json({ success: false, message: 'Transaction introuvable' });
      const d = transaction.date;
      await recalculateKPI(req.organizationId!, d.getFullYear(), d.getMonth() + 1);
      res.json({ success: true, message: 'Supprimé avec succès' });
    } catch (err) { next(err); }
  }
);

export default router;

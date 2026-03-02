/**
 * ROUTER — Crops (Version Clean Architecture)
 */
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, requireOrganization } from '../../middleware/security.js';
import { validator } from '../../middleware/validator.js';
import { cacheMiddleware, CACHE_TTL } from '../../middleware/cache.js';
import { cleanCropController } from './crops.setup.js';

const router = Router();
router.use(authenticate, requireOrganization);

const idParam = [param('id').isMongoId()];

router.get('/stats',
  cacheMiddleware(CACHE_TTL.cropStats),
  (req, res, next) => cleanCropController.getStats(req, res, next)
);

router.get('/',
  [query('search').optional().isString()],
  validator,
  cacheMiddleware(CACHE_TTL.default),
  (req, res, next) => cleanCropController.findAll(req, res, next)
);

router.post('/',
  [
    body('name').notEmpty(),
    body('category').isIn(['VEGETABLE', 'HERB', 'NURSERY', 'FOREST']),
    body('plotId').notEmpty(),
  ],
  validator,
  (req, res, next) => cleanCropController.create(req, res, next)
);

router.post('/:id/harvest',
  [...idParam, body('actualYield').isFloat({ min: 0 })],
  validator,
  (req, res, next) => cleanCropController.harvest(req, res, next)
);

export default router;

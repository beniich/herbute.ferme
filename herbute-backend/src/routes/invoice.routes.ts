import { Router } from 'express';
import { authenticate, requireOrganization } from '../middleware/security.js';
import { authorize, Permission } from '../middleware/authorize.js';
import { invoiceController } from '../controllers/invoice.controller.js';

const router = Router();

router.use(authenticate as any, requireOrganization as any);

router.post('/', authorize(Permission.BILLING_MANAGE), invoiceController.create);
router.get('/', authorize(Permission.BILLING_READ), invoiceController.findAll);
router.get('/:id/pdf', authorize(Permission.BILLING_READ), invoiceController.downloadPDF);

export default router;

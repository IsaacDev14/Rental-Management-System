import express from 'express';
const router = express.Router();
import tenantController from '../controllers/tenantController';

// /api/tenants
router.get('/', tenantController.getTenants);
router.post('/', tenantController.createTenant);
router.put('/:id', tenantController.updateTenant);
router.delete('/:id', tenantController.deleteTenant);

export default router;

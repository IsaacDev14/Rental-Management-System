import express from 'express';
import {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
} from '../controllers/tenantController';

const router = express.Router();

router.get('/', getTenants);
router.post('/', createTenant);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

export default router;

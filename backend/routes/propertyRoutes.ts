import express, { RequestHandler } from 'express';
import {
  getProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController';

const router = express.Router();

// Now expecting landlordId in the URL like /api/properties/:landlordId
router.get('/:landlordId', getProperties as RequestHandler);
router.post('/', addProperty as RequestHandler);
router.put('/:id', updateProperty as RequestHandler);
router.delete('/:id', deleteProperty as RequestHandler);

export default router;

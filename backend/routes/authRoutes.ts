import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  register(req, res, next);
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  login(req, res, next);
});

export default router;

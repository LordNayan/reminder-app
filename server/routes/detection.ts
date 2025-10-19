import { Router } from 'express';
import { authMiddleware, requirePaired } from '../src/middleware/auth.js';
import { handleDetection } from '../controllers/detectionController.js';

const router = Router();

router.post('/', authMiddleware, requirePaired, handleDetection);

export default router;

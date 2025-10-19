import { Router } from 'express';
import { listReminders, createReminder } from '../controllers/remindersController.js';
import { authMiddleware } from '../src/middleware/auth.js';

const router = Router();

router.get('/', listReminders);
router.post('/', authMiddleware, createReminder);

export default router;

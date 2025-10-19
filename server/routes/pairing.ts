import { Router } from 'express';
import { pairDevice } from '../controllers/pairingController.js';

const router = Router();

router.post('/', pairDevice);

export default router;

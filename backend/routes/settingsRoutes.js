import express from 'express';
import settingsController from '../controllers/settingsController.js';
import auth from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

router.get('/', settingsController.getSettings);
router.put('/', auth, checkRole('admin'), settingsController.updateSettings);

export default router;

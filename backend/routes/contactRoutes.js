import express from 'express';
import contactController from '../controllers/contactController.js';
import authMiddleware from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

router.post('/', contactController.createContact);
router.get('/', authMiddleware, checkRole('admin', 'manager'), contactController.getAllContacts);
router.patch('/:id/status', authMiddleware, checkRole('admin', 'manager'), contactController.updateStatus);
router.post('/:id/reply', authMiddleware, checkRole('admin', 'manager'), contactController.replyContact);
router.delete('/:id', authMiddleware, checkRole('admin'), contactController.deleteContact);

export default router;

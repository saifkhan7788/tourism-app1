import express from 'express';
import announcementController from '../controllers/announcementController.js';
import authMiddleware from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

router.get('/active', announcementController.getActiveAnnouncement);
router.get('/', authMiddleware, checkRole('admin', 'manager'), announcementController.getAllAnnouncements);
router.post('/', authMiddleware, checkRole('admin', 'manager'), announcementController.createAnnouncement);
router.put('/:id', authMiddleware, checkRole('admin', 'manager'), announcementController.updateAnnouncement);
router.delete('/:id', authMiddleware, checkRole('admin'), announcementController.deleteAnnouncement);

export default router;

const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/active', announcementController.getActiveAnnouncement);
router.get('/', authMiddleware, checkRole('admin', 'manager'), announcementController.getAllAnnouncements);
router.post('/', authMiddleware, checkRole('admin', 'manager'), announcementController.createAnnouncement);
router.put('/:id', authMiddleware, checkRole('admin', 'manager'), announcementController.updateAnnouncement);
router.delete('/:id', authMiddleware, checkRole('admin'), announcementController.deleteAnnouncement);

module.exports = router;

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.post('/', contactController.createContact);
router.get('/', authMiddleware, checkRole('admin', 'manager'), contactController.getAllContacts);
router.patch('/:id/status', authMiddleware, checkRole('admin', 'manager'), contactController.updateStatus);
router.post('/:id/reply', authMiddleware, checkRole('admin', 'manager'), contactController.replyContact);
router.delete('/:id', authMiddleware, checkRole('admin'), contactController.deleteContact);

module.exports = router;

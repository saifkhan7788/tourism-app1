const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', galleryController.getAllGallery);
router.post('/', authMiddleware, checkRole('admin', 'manager'), galleryController.createGallery);
router.put('/:id', authMiddleware, checkRole('admin', 'manager'), galleryController.updateGallery);
router.delete('/:id', authMiddleware, checkRole('admin'), galleryController.deleteGallery);

module.exports = router;

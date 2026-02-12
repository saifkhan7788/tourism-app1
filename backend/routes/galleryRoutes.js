import express from 'express';
import galleryController from '../controllers/galleryController.js';
import authMiddleware from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

router.get('/', galleryController.getAllGallery);
router.post('/', authMiddleware, checkRole('admin', 'manager'), galleryController.createGallery);
router.put('/:id', authMiddleware, checkRole('admin', 'manager'), galleryController.updateGallery);
router.delete('/:id', authMiddleware, checkRole('admin'), galleryController.deleteGallery);

export default router;

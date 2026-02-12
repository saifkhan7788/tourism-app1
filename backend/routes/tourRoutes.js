import express from 'express';
import tourController from '../controllers/tourController.js';
import authMiddleware from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// Public routes
router.get('/', tourController.getAllTours);
router.get('/search', tourController.searchTours);
router.get('/:id', tourController.getTourById);

// Protected routes (Admin and Manager)
router.post('/', authMiddleware, checkRole('admin', 'manager'), tourController.createTour);
router.put('/:id', authMiddleware, checkRole('admin', 'manager'), tourController.updateTour);

// Admin only
router.delete('/:id', authMiddleware, checkRole('admin'), tourController.deleteTour);

export default router;

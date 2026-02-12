const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Public routes
router.get('/', tourController.getAllTours);
router.get('/search', tourController.searchTours);
router.get('/:id', tourController.getTourById);

// Protected routes (Admin and Manager)
router.post('/', authMiddleware, checkRole('admin', 'manager'), tourController.createTour);
router.put('/:id', authMiddleware, checkRole('admin', 'manager'), tourController.updateTour);

// Admin only
router.delete('/:id', authMiddleware, checkRole('admin'), tourController.deleteTour);

module.exports = router;

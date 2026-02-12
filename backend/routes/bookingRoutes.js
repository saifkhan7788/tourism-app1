const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Public routes
router.post('/', bookingController.createBooking);
router.get('/email/:email', bookingController.getBookingsByEmail);

// Protected routes (Admin and Manager)
router.get('/', authMiddleware, checkRole('admin', 'manager'), bookingController.getAllBookings);
router.get('/:id', authMiddleware, checkRole('admin', 'manager'), bookingController.getBookingById);
router.patch('/:id/status', authMiddleware, checkRole('admin', 'manager'), bookingController.updateBookingStatus);

// Admin only
router.delete('/:id', authMiddleware, checkRole('admin'), bookingController.deleteBooking);

module.exports = router;

import express from 'express';
import bookingController from '../controllers/bookingController.js';
import authMiddleware from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// Public routes
router.post('/', bookingController.createBooking);
router.get('/email/:email', bookingController.getBookingsByEmail);
router.get('/check-availability', bookingController.checkAvailability);

// Protected routes (Admin and Manager)
router.get('/', authMiddleware, checkRole('admin', 'manager'), bookingController.getAllBookings);
router.get('/:id', authMiddleware, checkRole('admin', 'manager'), bookingController.getBookingById);
router.patch('/:id/status', authMiddleware, checkRole('admin', 'manager'), bookingController.updateBookingStatus);

// Admin only
router.delete('/:id', authMiddleware, checkRole('admin'), bookingController.deleteBooking);

export default router;

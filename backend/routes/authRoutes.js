import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

// Admin only
router.get('/users', authMiddleware, checkRole('admin'), authController.getAllUsers);
router.put('/users/:id', authMiddleware, checkRole('admin'), authController.updateUser);
router.delete('/users/:id', authMiddleware, checkRole('admin'), authController.deleteUser);
router.patch('/users/:id/password', authMiddleware, checkRole('admin'), authController.updatePassword);

export default router;

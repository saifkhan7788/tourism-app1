const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

// Admin only
router.get('/users', authMiddleware, checkRole('admin'), authController.getAllUsers);
router.put('/users/:id', authMiddleware, checkRole('admin'), authController.updateUser);
router.delete('/users/:id', authMiddleware, checkRole('admin'), authController.deleteUser);
router.patch('/users/:id/password', authMiddleware, checkRole('admin'), authController.updatePassword);

module.exports = router;

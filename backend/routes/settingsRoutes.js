const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', settingsController.getSettings);
router.put('/', auth, checkRole('admin'), settingsController.updateSettings);

module.exports = router;

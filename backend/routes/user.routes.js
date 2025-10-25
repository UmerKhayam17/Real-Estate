// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);

module.exports = router;
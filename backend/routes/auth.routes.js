// auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');
// Public routes
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);

// Protected routes (all verified users)
router.get('/me', auth, authController.me);
router.get('/dealer/status', auth, authController.checkDealerStatus);
router.post('/dealer/profile', auth, authController.completeDealerProfile);
// Admin routes
router.get('/admin/dealers/pending', auth, authController.getPendingDealers);
router.put('/admin/dealers/:dealerId/approve', auth, authController.approveDealer);
router.get('/admin/allusers', auth, authController.getAllUsers);

module.exports = router;
// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);

// Protected routes (all verified users)
router.get('/me', authenticate, authController.me);
router.get('/dealer/status', authenticate, authController.checkDealerStatus);
router.post('/dealer/profile', authenticate, authController.completeDealerProfile);

// Admin routes - role-based access
router.get('/admin/dealers/pending', authController.getPendingDealers);
router.put('/admin/dealers/:dealerId', authController.approveDealer);
router.get('/admin/allusers', authenticate, authorize(['super_admin', 'company_admin']), authController.getAllUsers);

module.exports = router;
// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// ==================== PUBLIC ROUTES ====================
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);

// ==================== PROTECTED ROUTES ====================
router.get('/me', authenticate, authController.getProfile);
router.get('/dealer/status', authenticate, authController.checkDealerStatus);
router.post('/dealer/profile', authenticate, authController.completeDealerProfile);

// ==================== ADMIN ROUTES ====================
router.get('/admin/dealers/pending', authenticate, authorize(['super_admin', 'company_admin']), authController.getPendingDealers);
router.put('/admin/dealers/:dealerId/approval', authenticate, authorize(['super_admin', 'company_admin']), authController.approveDealer);
router.get('/admin/users', authenticate, authorize(['super_admin', 'company_admin']), authController.getAllUsers);

module.exports = router;
// routes/company.routes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Public routes - company registration
router.post('/register', companyController.registerCompany);
router.post('/verify-owner', companyController.verifyCompanyOwner);

// Protected routes
router.use(authenticate);

// Super admin routes
router.get('/pending', authorize(['super_admin']), companyController.getPendingCompanies);
router.patch('/:companyId/status', authorize(['super_admin']), companyController.updateCompanyStatus);

// Company admin & super admin routes
router.get('/', authorize(['super_admin', 'company_admin']), companyController.getCompanies);
router.get('/:companyId/dealers', authorize(['super_admin', 'company_admin']), companyController.getCompanyDealers);

module.exports = router;
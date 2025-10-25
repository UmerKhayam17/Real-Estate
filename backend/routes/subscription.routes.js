// routes/subscription.routes.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Super admin routes
router.post('/assign-plan', authenticate, authorize(['super_admin']), subscriptionController.assignPlanToCompany);

// Company admin routes
router.get('/company-plan', authenticate, authorize(['company_admin']), subscriptionController.getCompanyPlanDetails);
router.post('/change-plan', authenticate, authorize(['company_admin']), subscriptionController.changeCompanyPlan);
router.get('/check-limits', authenticate, authorize(['company_admin']), subscriptionController.checkPlanLimitations);

module.exports = router;
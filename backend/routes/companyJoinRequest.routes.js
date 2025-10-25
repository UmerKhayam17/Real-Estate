// routes/companyJoinRequest.routes.js
const express = require('express');
const router = express.Router(); // Use express.Router() not require('router')
const {
   getCompanyPendingRequests,
   respondToJoinRequest,
   getCompaniesList
} = require('../controllers/companyJoinRequest.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// Public route for companies list (for dropdown)
router.get('/companies-list', getCompaniesList);

// Company admin routes - protected and authorized
router.get('/company/pending',
   authenticate,
   authorize(['company_admin']),
   getCompanyPendingRequests
);

router.post('/company/respond/:requestId',
   authenticate,
   authorize(['company_admin']),
   respondToJoinRequest
);

module.exports = router;
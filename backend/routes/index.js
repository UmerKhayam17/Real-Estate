// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/properties', require('./property.routes'));
router.use('/users', require('./user.routes'));
router.use('/companies', require('./company.routes'));
router.use('/plan', require('./plan.route'));
router.use('/subscriptions', require('./subscription.routes'));

module.exports = router;

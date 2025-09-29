// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/properties', require('./property.routes'));
router.use('/users', require('./user.routes'));
router.use('/subscriptions', require('./subscription.routes') || express.Router());

module.exports = router;

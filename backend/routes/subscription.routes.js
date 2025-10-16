// routes/subscription.routes.js
const express = require('express');
const ctrl = require('../controllers/subscription.controller');
// const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/',  role(['admin']), ctrl.listSubscriptions);

module.exports = router;

// routes/user.routes.js
const express = require('express');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const ctrl = require('../controllers/user.controller');

const router = express.Router();

router.get('/me', auth, ctrl.getProfile);
router.get('/', auth, role(['admin']), ctrl.listUsers);
// Get all users (admin only)

module.exports = router;

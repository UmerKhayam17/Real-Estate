// routes/property.routes.js
const express = require('express');
const router = express.Router(); // Make sure this is express.Router()
const propertyController = require('../controllers/property.controller');
const upload = require('../config/multer.config');
const { authenticate, optionalAuth } = require('../middlewares/auth.middleware');

// Public routes with optional authentication
router.get('/', optionalAuth, propertyController.getProperties);
router.get('/:id', optionalAuth, propertyController.getProperty);

// Protected routes (require authentication)
router.post('/create', authenticate, upload.array('media', 10), propertyController.createProperty);
router.put('/:id', authenticate, upload.array('media', 10), propertyController.updateProperty);
router.delete('/:id', authenticate, propertyController.deleteProperty);

module.exports = router;
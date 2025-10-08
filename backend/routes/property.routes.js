const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const upload = require('../config/multer.config');
const auth = require('../middlewares/auth.middleware');
const optionalAuth = require('../middlewares/optionalAuth.middleware'); // Create this

// Public routes with optional authentication
router.get('/', optionalAuth, propertyController.getProperties);
router.get('/:id', optionalAuth, propertyController.getProperty);

// Protected routes (require authentication)
router.post('/create', auth, upload.array('media', 10), propertyController.createProperty);
router.put('/:id', auth, upload.array('media', 10), propertyController.updateProperty);
router.delete('/:id', auth, propertyController.deleteProperty);

module.exports = router;
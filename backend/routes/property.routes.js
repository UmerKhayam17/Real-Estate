const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const upload = require('../config/multer.config');
const auth = require('../middlewares/auth.middleware');

// Public routes
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);

// Protected routes (require authentication)
router.post('/create', auth, upload.array('media', 10), propertyController.createProperty);
router.put('/:id', auth, upload.array('media', 10), propertyController.updateProperty);
router.delete('/:id', auth, propertyController.deleteProperty);

module.exports = router;
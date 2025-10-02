const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const upload = require('../config/multer.config');
const auth = require('../middlewares/auth.middleware');

// Public routes
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);

// Protected routes
router.post('/create', auth, upload.array('media', 10), propertyController.createProperty);
router.put('/:id', auth, propertyController.updateProperty);
router.delete('/:id', auth, propertyController.deleteProperty);

// Media management routes
router.post('/:id/media', auth, upload.array('media', 10), propertyController.updatePropertyMedia);
router.patch('/:id/media/main', auth, propertyController.setMainMedia);
router.delete('/:id/media', auth, propertyController.deleteMedia);

// Inquiry route
router.post('/:id/contact', propertyController.contactProperty);

module.exports = router;
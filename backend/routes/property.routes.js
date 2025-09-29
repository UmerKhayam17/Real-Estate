// routes/property.routes.js
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/property.controller');

const router = express.Router();

router.get('/', controller.getProperties);
router.post('/', auth, role(['agent','admin']), upload.array('images', 10), controller.createProperty);
router.get('/:id', controller.getProperty);
router.patch('/:id', auth, upload.array('images', 10), controller.updateProperty);
router.delete('/:id', auth, controller.deleteProperty);

router.post('/:id/contact', controller.contactProperty);

module.exports = router;

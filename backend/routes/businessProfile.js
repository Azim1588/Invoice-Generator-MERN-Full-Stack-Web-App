const express = require('express');
const router = express.Router();
const { BusinessProfileController, upload } = require('../controllers/businessProfileController');
const { businessProfileValidation } = require('../middleware/validation');

// Get business profile
router.get('/', BusinessProfileController.getProfile);

// Update business profile
router.put('/', businessProfileValidation.update, BusinessProfileController.updateProfile);

// Upload logo
router.post('/logo', upload.single('logo'), BusinessProfileController.uploadLogo);

// Delete logo
router.delete('/logo', BusinessProfileController.deleteLogo);

// Get logo file
router.get('/logo', BusinessProfileController.getLogo);

// Update invoice settings
router.put('/invoice-settings', BusinessProfileController.updateInvoiceSettings);

// Update branding
router.put('/branding', BusinessProfileController.updateBranding);

module.exports = router; 
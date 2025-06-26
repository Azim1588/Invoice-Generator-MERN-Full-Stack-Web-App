const BusinessProfile = require('../models/BusinessProfile');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/logos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `logo-${req.user.userId}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

class BusinessProfileController {
  // Get business profile
  async getProfile(req, res) {
    try {
      let profile = await BusinessProfile.findOne({ userId: req.user.userId });
      
      if (!profile) {
        // Create default profile if none exists
        profile = new BusinessProfile({
          userId: req.user.userId,
          businessName: 'Your Business Name',
          businessAddress: {
            street: 'Your Business Address',
            city: 'City',
            state: 'State',
            zipCode: '12345',
            country: 'USA'
          }
        });
        await profile.save();
      }

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Error getting business profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve business profile'
      });
    }
  }

  // Update business profile
  async updateProfile(req, res) {
    try {
      const updateData = req.body;
      
      let profile = await BusinessProfile.findOne({ userId: req.user.userId });
      
      if (!profile) {
        // Create new profile if none exists
        profile = new BusinessProfile({
          userId: req.user.userId,
          ...updateData
        });
      } else {
        // Update existing profile
        Object.assign(profile, updateData);
      }

      await profile.save();

      res.json({
        success: true,
        data: profile,
        message: 'Business profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating business profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update business profile'
      });
    }
  }

  // Upload logo
  async uploadLogo(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      let profile = await BusinessProfile.findOne({ userId: req.user.userId });
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'Business profile not found. Please create a business profile first.'
        });
      }

      // Delete old logo if exists
      if (profile.logo && profile.logo.path) {
        try {
          fs.unlinkSync(profile.logo.path);
        } catch (err) {
          console.log('Old logo file not found, continuing...');
        }
      }

      // Update logo information
      profile.logo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      };

      await profile.save();

      res.json({
        success: true,
        data: {
          logo: profile.logo
        },
        message: 'Logo uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload logo'
      });
    }
  }

  // Delete logo
  async deleteLogo(req, res) {
    try {
      const profile = await BusinessProfile.findOne({ userId: req.user.userId });
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'Business profile not found'
        });
      }

      if (profile.logo && profile.logo.path) {
        try {
          fs.unlinkSync(profile.logo.path);
        } catch (err) {
          console.log('Logo file not found, continuing...');
        }
      }

      profile.logo = undefined;
      await profile.save();

      res.json({
        success: true,
        message: 'Logo deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting logo:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete logo'
      });
    }
  }

  // Get logo file
  async getLogo(req, res) {
    try {
      const profile = await BusinessProfile.findOne({ userId: req.user.userId });
      
      if (!profile || !profile.logo || !profile.logo.path) {
        return res.status(404).json({
          success: false,
          error: 'Logo not found'
        });
      }

      if (!fs.existsSync(profile.logo.path)) {
        return res.status(404).json({
          success: false,
          error: 'Logo file not found'
        });
      }

      // Read the file and convert to base64
      const fileBuffer = fs.readFileSync(profile.logo.path);
      const base64String = fileBuffer.toString('base64');
      const dataUrl = `data:${profile.logo.mimeType};base64,${base64String}`;

      res.json({
        success: true,
        data: {
          logoUrl: dataUrl,
          mimeType: profile.logo.mimeType,
          filename: profile.logo.filename
        }
      });
    } catch (error) {
      console.error('Error getting logo:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve logo'
      });
    }
  }

  // Update invoice settings
  async updateInvoiceSettings(req, res) {
    try {
      const { invoiceSettings } = req.body;
      
      let profile = await BusinessProfile.findOne({ userId: req.user.userId });
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'Business profile not found. Please create a business profile first.'
        });
      }

      profile.invoiceSettings = {
        ...profile.invoiceSettings,
        ...invoiceSettings
      };

      await profile.save();

      res.json({
        success: true,
        data: {
          invoiceSettings: profile.invoiceSettings
        },
        message: 'Invoice settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating invoice settings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update invoice settings'
      });
    }
  }

  // Update branding
  async updateBranding(req, res) {
    try {
      const { branding } = req.body;
      
      let profile = await BusinessProfile.findOne({ userId: req.user.userId });
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'Business profile not found. Please create a business profile first.'
        });
      }

      profile.branding = {
        ...profile.branding,
        ...branding
      };

      await profile.save();

      res.json({
        success: true,
        data: {
          branding: profile.branding
        },
        message: 'Branding updated successfully'
      });
    } catch (error) {
      console.error('Error updating branding:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update branding'
      });
    }
  }
}

module.exports = {
  BusinessProfileController: new BusinessProfileController(),
  upload
}; 
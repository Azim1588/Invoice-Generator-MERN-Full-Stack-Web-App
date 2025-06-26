const mongoose = require('mongoose');

const businessProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  businessAddress: {
    street: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    country: {
      type: String,
      default: 'USA',
      trim: true,
      maxlength: 50
    }
  },
  businessPhone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  businessEmail: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  taxId: {
    type: String,
    trim: true,
    maxlength: 50
  },
  website: {
    type: String,
    trim: true,
    maxlength: 200
  },
  logo: {
    filename: {
      type: String,
      trim: true
    },
    originalName: {
      type: String,
      trim: true
    },
    mimeType: {
      type: String,
      trim: true
    },
    size: {
      type: Number
    },
    path: {
      type: String,
      trim: true
    }
  },
  invoiceSettings: {
    defaultTaxRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    },
    paymentTerms: {
      type: String,
      default: 'Net 30',
      enum: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt']
    },
    invoicePrefix: {
      type: String,
      default: 'INV',
      trim: true,
      maxlength: 10
    },
    nextInvoiceNumber: {
      type: Number,
      default: 1
    }
  },
  branding: {
    primaryColor: {
      type: String,
      default: '#F97316',
      trim: true
    },
    secondaryColor: {
      type: String,
      default: '#1e293b',
      trim: true
    },
    fontFamily: {
      type: String,
      default: 'Helvetica',
      enum: ['Helvetica', 'Arial', 'Times New Roman', 'Georgia', 'Verdana']
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
businessProfileSchema.index({ userId: 1 });

// Virtual for full business address
businessProfileSchema.virtual('fullBusinessAddress').get(function() {
  if (!this.businessAddress) return '';
  const addr = this.businessAddress;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Ensure virtuals are serialized
businessProfileSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('BusinessProfile', businessProfileSchema); 
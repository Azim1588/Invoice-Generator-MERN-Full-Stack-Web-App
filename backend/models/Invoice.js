const mongoose = require('mongoose');
const Counter = require('./Counter');

const itemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: true });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  // Sender (business) info
  senderName: { type: String, trim: true },
  senderAddress: { type: String, trim: true },
  senderPhone: { type: String, trim: true },
  senderEmail: { type: String, trim: true },
  // Bill to (buyer) info
  billToName: { type: String, trim: true },
  billToAddress: { type: String, trim: true },
  billToPhone: { type: String, trim: true },
  billToEmail: { type: String, trim: true },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  items: [itemSchema],
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
invoiceSchema.index({ userId: 1, invoiceNumber: 1 });
invoiceSchema.index({ customerId: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ date: -1 });

// Pre-save middleware to calculate totals
invoiceSchema.pre('save', function(next) {
  // Always calculate totals, even if items array is empty
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.total || 0), 0);
    this.tax = this.subtotal * 0.1; // 10% tax
    this.total = this.subtotal + this.tax;
  } else {
    // Set default values when no items
    this.subtotal = 0;
    this.tax = 0;
    this.total = 0;
  }
  
  // Ensure all values are numbers
  this.subtotal = Number(this.subtotal) || 0;
  this.tax = Number(this.tax) || 0;
  this.total = Number(this.total) || 0;
  
  next();
});

// Static method to generate invoice number (atomic, unique)
invoiceSchema.statics.generateInvoiceNumber = async function() {
  const year = new Date().getFullYear();
  const key = `invoice-${year}`;
  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const nextNumber = counter.seq;
  return `INV-${year}-${nextNumber.toString().padStart(3, '0')}`;
};

// Method to calculate totals
invoiceSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.tax = this.subtotal * 0.1;
  this.total = this.subtotal + this.tax;
  return this;
};

module.exports = mongoose.model('Invoice', invoiceSchema); 
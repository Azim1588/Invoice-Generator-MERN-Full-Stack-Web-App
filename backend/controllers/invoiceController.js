const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const BusinessProfile = require('../models/BusinessProfile');
const pdfService = require('../services/pdfService');

class InvoiceController {
  async getAllInvoices(req, res) {
    try {
      const invoices = await Invoice.find({ userId: req.user.userId })
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: invoices,
        count: invoices.length
      });
    } catch (error) {
      console.error('Error getting invoices:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve invoices'
      });
    }
  }

  async getInvoiceById(req, res) {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findOne({
        _id: id,
        userId: req.user.userId
      }).populate('customerId', 'name email phone address');
      
      if (!invoice) {
        return res.status(404).json({
          success: false,
          error: 'Invoice not found'
        });
      }

      res.json({
        success: true,
        data: invoice
      });
    } catch (error) {
      console.error('Error getting invoice:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve invoice'
      });
    }
  }

  async createInvoice(req, res) {
    try {
      const { customerId, date, dueDate, status, items, notes,
        senderName, senderAddress, senderPhone, senderEmail,
        billToName, billToAddress, billToPhone, billToEmail
      } = req.body;

      // Basic validation
      if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Customer ID and at least one item are required'
        });
      }

      // Validate items
      for (const item of items) {
        if (!item.description || !item.quantity || !item.unitPrice) {
          return res.status(400).json({
            success: false,
            error: 'Each item must have description, quantity, and unit price'
          });
        }
      }

      // Get customer details
      const customer = await Customer.findOne({
        _id: customerId,
        userId: req.user.userId
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // Get business profile for default values
      const businessProfile = await BusinessProfile.findOne({ userId: req.user.userId });

      // Generate invoice number
      const invoiceNumber = await Invoice.generateInvoiceNumber();

      // Prepare items with totals
      const invoiceItems = items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice
      }));

      // Calculate totals manually
      const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
      const taxRate = businessProfile?.invoiceSettings?.defaultTaxRate || 0.1;
      const tax = subtotal * taxRate;
      const total = subtotal + tax;

      const invoiceData = {
        invoiceNumber,
        customerId,
        customerName: customer.name,
        date: date || new Date(),
        dueDate,
        status: status || 'pending',
        items: invoiceItems,
        subtotal,
        tax,
        taxRate,
        total,
        notes,
        userId: req.user.userId,
        senderName: senderName || businessProfile?.businessName,
        senderAddress: senderAddress || businessProfile?.fullBusinessAddress,
        senderPhone: senderPhone || businessProfile?.businessPhone,
        senderEmail: senderEmail || businessProfile?.businessEmail,
        billToName: billToName || customer.name,
        billToAddress: billToAddress || customer.fullAddress,
        billToPhone: billToPhone || customer.phone,
        billToEmail: billToEmail || customer.email
      };

      const newInvoice = new Invoice(invoiceData);
      await newInvoice.save();
      
      res.status(201).json({
        success: true,
        data: newInvoice,
        message: 'Invoice created successfully'
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create invoice'
      });
    }
  }

  async updateInvoice(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // If items are being updated, recalculate totals
      if (updateData.items) {
        updateData.items = updateData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice
        }));
      }

      const invoice = await Invoice.findOneAndUpdate(
        { _id: id, userId: req.user.userId },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!invoice) {
        return res.status(404).json({
          success: false,
          error: 'Invoice not found'
        });
      }

      res.json({
        success: true,
        data: invoice,
        message: 'Invoice updated successfully'
      });
    } catch (error) {
      console.error('Error updating invoice:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update invoice'
      });
    }
  }

  async deleteInvoice(req, res) {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findOneAndDelete({
        _id: id,
        userId: req.user.userId
      });
      
      if (!invoice) {
        return res.status(404).json({
          success: false,
          error: 'Invoice not found'
        });
      }

      res.json({
        success: true,
        message: 'Invoice deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete invoice'
      });
    }
  }

  async getInvoicesByCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const invoices = await Invoice.find({
        customerId,
        userId: req.user.userId
      }).populate('customerId', 'name email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: invoices,
        count: invoices.length
      });
    } catch (error) {
      console.error('Error getting invoices by customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve invoices'
      });
    }
  }

  async downloadPDF(req, res) {
    try {
      const { id } = req.params;
      
      // Get invoice with customer details
      const invoice = await Invoice.findOne({
        _id: id,
        userId: req.user.userId
      }).populate('customerId');

      if (!invoice) {
        return res.status(404).json({
          success: false,
          error: 'Invoice not found'
        });
      }

      // Get business profile for branding and logo
      const businessProfile = await BusinessProfile.findOne({ userId: req.user.userId });

      // Generate PDF
      const pdfBuffer = await pdfService.generateInvoicePDF(
        invoice, 
        invoice.customerId, 
        businessProfile
      );

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate PDF'
      });
    }
  }

  async getInvoiceStats(req, res) {
    try {
      const stats = await Invoice.aggregate([
        { $match: { userId: req.user.userId } },
        {
          $group: {
            _id: null,
            totalInvoices: { $sum: 1 },
            totalAmount: { $sum: '$total' },
            averageAmount: { $avg: '$total' },
            pendingInvoices: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            paidInvoices: {
              $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] }
            },
            overdueInvoices: {
              $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] }
            }
          }
        }
      ]);

      const monthlyStats = await Invoice.aggregate([
        { $match: { userId: req.user.userId } },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' }
            },
            count: { $sum: 1 },
            total: { $sum: '$total' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]);

      res.json({
        success: true,
        data: {
          overview: stats[0] || {
            totalInvoices: 0,
            totalAmount: 0,
            averageAmount: 0,
            pendingInvoices: 0,
            paidInvoices: 0,
            overdueInvoices: 0
          },
          monthly: monthlyStats
        }
      });
    } catch (error) {
      console.error('Error getting invoice stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve invoice statistics'
      });
    }
  }
}

module.exports = new InvoiceController(); 
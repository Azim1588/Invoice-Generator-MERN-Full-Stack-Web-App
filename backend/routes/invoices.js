const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const { invoiceValidation } = require('../middleware/validation');

const router = express.Router();

// GET /api/invoices - Get all invoices
router.get('/', invoiceController.getAllInvoices);

// GET /api/invoices/customer/:customerId - Get invoices by customer (must come before /:id)
router.get('/customer/:customerId', invoiceController.getInvoicesByCustomer);

// GET /api/invoices/:id - Get invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// GET /api/invoices/:id/pdf - Download invoice as PDF
router.get('/:id/pdf', invoiceController.downloadPDF);

// POST /api/invoices - Create new invoice
router.post('/', invoiceValidation.create, invoiceController.createInvoice);

// PUT /api/invoices/:id - Update invoice
router.put('/:id', invoiceValidation.update, invoiceController.updateInvoice);

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', invoiceValidation.delete, invoiceController.deleteInvoice);

module.exports = router; 
const express = require('express');
const customerController = require('../controllers/customerController');
const { customerValidation } = require('../middleware/validation');

const router = express.Router();

// GET /api/customers - Get all customers
router.get('/', customerController.getAllCustomers);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', customerController.getCustomerById);

// POST /api/customers - Create new customer
router.post('/', customerValidation.create, customerController.createCustomer);

// PUT /api/customers/:id - Update customer
router.put('/:id', customerValidation.update, customerController.updateCustomer);

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', customerValidation.delete, customerController.deleteCustomer);

module.exports = router; 
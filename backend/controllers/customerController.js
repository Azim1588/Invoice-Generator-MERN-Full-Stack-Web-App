const Customer = require('../models/Customer');

class CustomerController {
  async getAllCustomers(req, res) {
    try {
      const customers = await Customer.find({ userId: req.user.userId })
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: customers,
        count: customers.length
      });
    } catch (error) {
      console.error('Error getting customers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve customers'
      });
    }
  }

  async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.findOne({
        _id: id,
        userId: req.user.userId
      });
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      console.error('Error getting customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve customer'
      });
    }
  }

  async createCustomer(req, res) {
    try {
      const { name, email, phone, address, company, notes } = req.body;

      // Check if customer with same email already exists for this user
      const existingCustomer = await Customer.findOne({
        email,
        userId: req.user.userId
      });

      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          error: 'Customer with this email already exists'
        });
      }

      const customerData = {
        name,
        email,
        phone,
        address,
        company,
        notes,
        userId: req.user.userId
      };

      const newCustomer = new Customer(customerData);
      await newCustomer.save();
      
      res.status(201).json({
        success: true,
        data: newCustomer,
        message: 'Customer created successfully'
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create customer'
      });
    }
  }

  async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const customer = await Customer.findOneAndUpdate(
        { _id: id, userId: req.user.userId },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer,
        message: 'Customer updated successfully'
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update customer'
      });
    }
  }

  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.findOneAndDelete({
        _id: id,
        userId: req.user.userId
      });
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete customer'
      });
    }
  }

  async searchCustomers(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const customers = await Customer.find({
        userId: req.user.userId,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { company: { $regex: query, $options: 'i' } }
        ]
      }).sort({ name: 1 });

      res.json({
        success: true,
        data: customers,
        count: customers.length
      });
    } catch (error) {
      console.error('Error searching customers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search customers'
      });
    }
  }
}

module.exports = new CustomerController(); 
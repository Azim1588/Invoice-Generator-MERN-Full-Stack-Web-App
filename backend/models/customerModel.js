const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const customersFile = path.join(__dirname, '../data/customers.json');

class CustomerModel {
  async getAllCustomers() {
    try {
      const data = await fs.readFile(customersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  async getCustomerById(id) {
    const customers = await this.getAllCustomers();
    return customers.find(customer => customer.id === id);
  }

  async createCustomer(customerData) {
    const customers = await this.getAllCustomers();
    const newCustomer = {
      id: uuidv4(),
      ...customerData,
      createdAt: new Date().toISOString()
    };
    
    customers.push(newCustomer);
    await fs.writeFile(customersFile, JSON.stringify(customers, null, 2));
    return newCustomer;
  }

  async updateCustomer(id, customerData) {
    const customers = await this.getAllCustomers();
    const index = customers.findIndex(customer => customer.id === id);
    
    if (index === -1) {
      return null;
    }

    customers[index] = {
      ...customers[index],
      ...customerData,
      id // Ensure ID doesn't change
    };

    await fs.writeFile(customersFile, JSON.stringify(customers, null, 2));
    return customers[index];
  }

  async deleteCustomer(id) {
    const customers = await this.getAllCustomers();
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    
    if (filteredCustomers.length === customers.length) {
      return false; // Customer not found
    }

    await fs.writeFile(customersFile, JSON.stringify(filteredCustomers, null, 2));
    return true;
  }
}

module.exports = new CustomerModel(); 
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const customerModel = require('./customerModel');

const invoicesFile = path.join(__dirname, '../data/invoices.json');

class InvoiceModel {
  async getAllInvoices() {
    try {
      const data = await fs.readFile(invoicesFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async getInvoiceById(id) {
    const invoices = await this.getAllInvoices();
    return invoices.find(invoice => invoice.id === id);
  }

  async createInvoice(invoiceData) {
    const invoices = await this.getAllInvoices();
    
    // Get customer name
    const customer = await customerModel.getCustomerById(invoiceData.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Generate invoice number
    const invoiceNumber = this.generateInvoiceNumber(invoices);
    
    // Calculate totals
    const items = invoiceData.items.map(item => ({
      ...item,
      id: uuidv4(),
      total: item.quantity * item.unitPrice
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const newInvoice = {
      id: uuidv4(),
      invoiceNumber,
      customerId: invoiceData.customerId,
      customerName: customer.name,
      date: invoiceData.date || new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate,
      status: invoiceData.status || 'pending',
      items,
      subtotal,
      tax,
      total,
      notes: invoiceData.notes || '',
      createdAt: new Date().toISOString()
    };
    
    invoices.push(newInvoice);
    await fs.writeFile(invoicesFile, JSON.stringify(invoices, null, 2));
    return newInvoice;
  }

  async updateInvoice(id, invoiceData) {
    const invoices = await this.getAllInvoices();
    const index = invoices.findIndex(invoice => invoice.id === id);
    
    if (index === -1) {
      return null;
    }

    // Recalculate totals if items changed
    let updatedInvoice = { ...invoices[index], ...invoiceData };
    
    if (invoiceData.items) {
      const items = invoiceData.items.map(item => ({
        ...item,
        id: item.id || uuidv4(),
        total: item.quantity * item.unitPrice
      }));
      
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      
      updatedInvoice = {
        ...updatedInvoice,
        items,
        subtotal,
        tax,
        total
      };
    }

    invoices[index] = updatedInvoice;
    await fs.writeFile(invoicesFile, JSON.stringify(invoices, null, 2));
    return updatedInvoice;
  }

  async deleteInvoice(id) {
    const invoices = await this.getAllInvoices();
    const filteredInvoices = invoices.filter(invoice => invoice.id !== id);
    
    if (filteredInvoices.length === invoices.length) {
      return false;
    }

    await fs.writeFile(invoicesFile, JSON.stringify(filteredInvoices, null, 2));
    return true;
  }

  generateInvoiceNumber(invoices) {
    const year = new Date().getFullYear();
    const existingNumbers = invoices
      .filter(invoice => invoice.invoiceNumber.includes(`INV-${year}`))
      .map(invoice => {
        const match = invoice.invoiceNumber.match(/INV-\d{4}-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `INV-${year}-${nextNumber.toString().padStart(3, '0')}`;
  }

  async getInvoicesByCustomer(customerId) {
    const invoices = await this.getAllInvoices();
    return invoices.filter(invoice => invoice.customerId === customerId);
  }
}

module.exports = new InvoiceModel(); 
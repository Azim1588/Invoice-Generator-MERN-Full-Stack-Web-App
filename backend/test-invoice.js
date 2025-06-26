const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let customerId = '';

// Test data
const testCustomer = {
  name: 'Test Customer',
  email: 'testcustomer@example.com',
  phone: '+1-555-0123',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    country: 'USA'
  }
};

const testInvoice = {
  customerId: '', // Will be set after customer creation
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'pending',
  items: [
    {
      description: 'Web Development Services',
      quantity: 10,
      unitPrice: 100
    },
    {
      description: 'Design Services',
      quantity: 5,
      unitPrice: 75
    }
  ],
  notes: 'Test invoice'
};

async function testInvoiceCreation() {
  console.log('🧾 Testing Invoice Creation...\n');
  
  try {
    // Step 1: Login to get token
    console.log('🔑 Step 1: Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'demo@example.com',
      password: 'password'
    });
    
    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data.error);
      return;
    }
    
    authToken = loginResponse.data.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Create a customer
    console.log('\n👤 Step 2: Creating customer...');
    const customerResponse = await axios.post(`${BASE_URL}/customers`, testCustomer, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (!customerResponse.data.success) {
      console.log('❌ Customer creation failed:', customerResponse.data.error);
      return;
    }
    
    customerId = customerResponse.data.data._id;
    testInvoice.customerId = customerId;
    console.log('✅ Customer created with ID:', customerId);
    
    // Step 3: Create invoice
    console.log('\n📄 Step 3: Creating invoice...');
    const invoiceResponse = await axios.post(`${BASE_URL}/invoices`, testInvoice, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (invoiceResponse.data.success) {
      console.log('✅ Invoice created successfully!');
      console.log('   Invoice Number:', invoiceResponse.data.data.invoiceNumber);
      console.log('   Subtotal:', invoiceResponse.data.data.subtotal);
      console.log('   Tax:', invoiceResponse.data.data.tax);
      console.log('   Total:', invoiceResponse.data.data.total);
      console.log('   Items count:', invoiceResponse.data.data.items.length);
      
      // Step 4: Test getting the invoice
      console.log('\n📋 Step 4: Retrieving invoice...');
      const getInvoiceResponse = await axios.get(`${BASE_URL}/invoices/${invoiceResponse.data.data._id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      if (getInvoiceResponse.data.success) {
        console.log('✅ Invoice retrieved successfully!');
        console.log('   Customer:', getInvoiceResponse.data.data.customerName);
        console.log('   Status:', getInvoiceResponse.data.data.status);
      } else {
        console.log('❌ Failed to retrieve invoice:', getInvoiceResponse.data.error);
      }
      
    } else {
      console.log('❌ Invoice creation failed:', invoiceResponse.data.error);
      if (invoiceResponse.data.error.includes('validation')) {
        console.log('🔍 This appears to be a validation error');
      }
    }
    
  } catch (error) {
    console.log('❌ Error during invoice test:', error.response?.data?.error || error.message);
    
    if (error.response?.data?.error?.includes('validation')) {
      console.log('🔍 Validation error details:', error.response.data.error);
    }
  }
}

// Run the test
testInvoiceCreation(); 
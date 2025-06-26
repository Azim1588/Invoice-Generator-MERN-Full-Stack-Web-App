const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let customerId = '';
let invoiceId = '';

// Test data
const testCustomer = {
  name: 'Test Customer Full',
  email: 'testcustomerfull@example.com',
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
  notes: 'Test invoice for full testing'
};

async function testFullInvoiceFlow() {
  console.log('🧾 Testing Full Invoice Flow (Create, Edit, Download)...\n');
  
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
    
    // Step 2: Get existing customers
    console.log('\n👤 Step 2: Getting existing customers...');
    const customersResponse = await axios.get(`${BASE_URL}/customers`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (customersResponse.data.success && customersResponse.data.data.length > 0) {
      customerId = customersResponse.data.data[0]._id;
      console.log('✅ Using existing customer:', customersResponse.data.data[0].name);
    } else {
      console.log('❌ No customers found');
      return;
    }
    
    testInvoice.customerId = customerId;
    
    // Step 3: Create invoice
    console.log('\n📄 Step 3: Creating invoice...');
    const invoiceResponse = await axios.post(`${BASE_URL}/invoices`, testInvoice, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (invoiceResponse.data.success) {
      invoiceId = invoiceResponse.data.data._id;
      console.log('✅ Invoice created successfully!');
      console.log('   Invoice Number:', invoiceResponse.data.data.invoiceNumber);
      console.log('   Invoice ID:', invoiceId);
      console.log('   Subtotal:', invoiceResponse.data.data.subtotal);
      console.log('   Tax:', invoiceResponse.data.data.tax);
      console.log('   Total:', invoiceResponse.data.data.total);
    } else {
      console.log('❌ Invoice creation failed:', invoiceResponse.data.error);
      return;
    }
    
    // Step 4: Test getting the invoice
    console.log('\n📋 Step 4: Retrieving invoice...');
    const getInvoiceResponse = await axios.get(`${BASE_URL}/invoices/${invoiceId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (getInvoiceResponse.data.success) {
      console.log('✅ Invoice retrieved successfully!');
      console.log('   Customer:', getInvoiceResponse.data.data.customerName);
      console.log('   Status:', getInvoiceResponse.data.data.status);
    } else {
      console.log('❌ Failed to retrieve invoice:', getInvoiceResponse.data.error);
    }
    
    // Step 5: Test editing the invoice
    console.log('\n✏️  Step 5: Testing invoice editing...');
    const updateData = {
      status: 'paid',
      notes: 'Updated test invoice notes'
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/invoices/${invoiceId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (updateResponse.data.success) {
      console.log('✅ Invoice updated successfully!');
      console.log('   New Status:', updateResponse.data.data.status);
      console.log('   New Notes:', updateResponse.data.data.notes);
    } else {
      console.log('❌ Invoice update failed:', updateResponse.data.error);
    }
    
    // Step 6: Test PDF download
    console.log('\n📥 Step 6: Testing PDF download...');
    try {
      const pdfResponse = await axios.get(`${BASE_URL}/invoices/${invoiceId}/pdf`, {
        headers: { Authorization: `Bearer ${authToken}` },
        responseType: 'arraybuffer'
      });
      
      if (pdfResponse.status === 200) {
        console.log('✅ PDF download successful!');
        console.log('   Content-Type:', pdfResponse.headers['content-type']);
        console.log('   Content-Length:', pdfResponse.headers['content-length']);
        console.log('   Is PDF:', pdfResponse.headers['content-type'] === 'application/pdf');
        console.log('   PDF Size:', pdfResponse.data.length, 'bytes');
      } else {
        console.log('❌ PDF download failed with status:', pdfResponse.status);
      }
    } catch (pdfError) {
      console.log('❌ PDF download error:', pdfError.response?.status || pdfError.message);
      if (pdfError.response?.data) {
        console.log('   Error details:', pdfError.response.data.toString());
      }
    }
    
    // Step 7: Test getting all invoices
    console.log('\n📋 Step 7: Testing get all invoices...');
    const allInvoicesResponse = await axios.get(`${BASE_URL}/invoices`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (allInvoicesResponse.data.success) {
      console.log('✅ All invoices retrieved successfully!');
      console.log('   Total invoices:', allInvoicesResponse.data.count);
      console.log('   Invoices in response:', allInvoicesResponse.data.data.length);
    } else {
      console.log('❌ Failed to get all invoices:', allInvoicesResponse.data.error);
    }
    
    console.log('\n🎉 Full invoice flow test completed!');
    
  } catch (error) {
    console.log('❌ Error during full invoice test:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 500) {
      console.log('💡 This might indicate a server error. Check backend logs.');
    }
  }
}

// Run the test
testFullInvoiceFlow(); 
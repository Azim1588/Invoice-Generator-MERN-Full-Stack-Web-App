const http = require('http');

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let userId = '';
let customerId = '';
let invoiceId = '';

// Helper function to make HTTP requests
const makeRequest = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

// Test 1: User Registration
const testUserRegistration = async () => {
  console.log('\n🧪 Test 1: User Registration');
  
  const testUser = {
    name: 'Test Business Owner',
    email: 'testbusiness@example.com',
    password: 'password123'
  };

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options, testUser);
    console.log('Status:', response.status);
    
    if (response.status === 201 && response.data.success) {
      console.log('✅ User registration successful');
      console.log('User ID:', response.data.data.user.id);
      console.log('Token:', response.data.data.token.substring(0, 20) + '...');
      authToken = response.data.data.token;
      userId = response.data.data.user.id;
      return true;
    } else {
      console.log('❌ User registration failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
    return false;
  }
};

// Test 2: User Login
const testUserLogin = async () => {
  console.log('\n🧪 Test 2: User Login');
  
  const loginData = {
    email: 'testbusiness@example.com',
    password: 'password123'
  };

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options, loginData);
    console.log('Status:', response.status);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ User login successful');
      console.log('User ID:', response.data.data.user.id);
      console.log('Token:', response.data.data.token.substring(0, 20) + '...');
      authToken = response.data.data.token;
      userId = response.data.data.user.id;
      return true;
    } else {
      console.log('❌ User login failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return false;
  }
};

// Test 3: Create Customer with Proper Address Object
const testCreateCustomer = async () => {
  console.log('\n🧪 Test 3: Create Customer');
  
  const customerData = {
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '555-123-4567',
    address: {
      street: '123 Business Ave',
      city: 'Business City',
      state: 'BC',
      zipCode: '12345',
      country: 'USA'
    },
    company: 'Acme Corporation Inc.',
    notes: 'Premium customer'
  };

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/customers',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  };

  try {
    const response = await makeRequest(options, customerData);
    console.log('Status:', response.status);
    
    if (response.status === 201 && response.data.success) {
      console.log('✅ Customer creation successful');
      console.log('Customer ID:', response.data.data._id);
      console.log('Customer Name:', response.data.data.name);
      customerId = response.data.data._id;
      return true;
    } else {
      console.log('❌ Customer creation failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Customer creation error:', error.message);
    return false;
  }
};

// Test 4: Create Invoice
const testCreateInvoice = async () => {
  console.log('\n🧪 Test 4: Create Invoice');
  
  const invoiceData = {
    customerId: customerId,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    items: [
      {
        description: 'Web Development Services',
        quantity: 10,
        unitPrice: 100.00
      },
      {
        description: 'Design Consultation',
        quantity: 2,
        unitPrice: 75.00
      }
    ],
    notes: 'Invoice for web development and design services',
    senderName: 'Test Business Solutions',
    senderAddress: '456 Business Ave, Business City, BC 67890',
    senderPhone: '987-654-3210',
    senderEmail: 'business@test.com',
    billToName: 'Acme Corporation',
    billToAddress: '123 Business Ave, Business City, BC 12345',
    billToPhone: '555-123-4567',
    billToEmail: 'contact@acme.com'
  };

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/invoices',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  };

  try {
    const response = await makeRequest(options, invoiceData);
    console.log('Status:', response.status);
    
    if (response.status === 201 && response.data.success) {
      console.log('✅ Invoice creation successful');
      console.log('Invoice ID:', response.data.data._id);
      console.log('Invoice Number:', response.data.data.invoiceNumber);
      console.log('Total Amount:', response.data.data.total);
      invoiceId = response.data.data._id;
      return true;
    } else {
      console.log('❌ Invoice creation failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Invoice creation error:', error.message);
    return false;
  }
};

// Test 5: Get Invoice Details
const testGetInvoice = async () => {
  console.log('\n🧪 Test 5: Get Invoice Details');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/invoices/${invoiceId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  try {
    const response = await makeRequest(options);
    console.log('Status:', response.status);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Invoice retrieval successful');
      console.log('Invoice Number:', response.data.data.invoiceNumber);
      console.log('Customer Name:', response.data.data.customerName);
      console.log('Status:', response.data.data.status);
      console.log('Total:', response.data.data.total);
      console.log('Items Count:', response.data.data.items.length);
      return true;
    } else {
      console.log('❌ Invoice retrieval failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Invoice retrieval error:', error.message);
    return false;
  }
};

// Test 6: Get All Invoices
const testGetAllInvoices = async () => {
  console.log('\n🧪 Test 6: Get All Invoices');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/invoices',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  try {
    const response = await makeRequest(options);
    console.log('Status:', response.status);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Get all invoices successful');
      console.log('Total Invoices:', response.data.count);
      if (response.data.data.length > 0) {
        console.log('First Invoice Number:', response.data.data[0].invoiceNumber);
      }
      return true;
    } else {
      console.log('❌ Get all invoices failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Get all invoices error:', error.message);
    return false;
  }
};

// Test 7: Get All Customers
const testGetAllCustomers = async () => {
  console.log('\n🧪 Test 7: Get All Customers');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/customers',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  try {
    const response = await makeRequest(options);
    console.log('Status:', response.status);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Get all customers successful');
      console.log('Total Customers:', response.data.count);
      if (response.data.data.length > 0) {
        console.log('First Customer Name:', response.data.data[0].name);
      }
      return true;
    } else {
      console.log('❌ Get all customers failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Get all customers error:', error.message);
    return false;
  }
};

// Test 8: Download PDF (Test if endpoint exists)
const testPDFDownload = async () => {
  console.log('\n🧪 Test 8: PDF Download Endpoint');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/invoices/${invoiceId}/pdf`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  try {
    const response = await makeRequest(options);
    console.log('Status:', response.status);
    
    if (response.status === 200) {
      console.log('✅ PDF download endpoint accessible');
      return true;
    } else if (response.status === 404) {
      console.log('⚠️ PDF download endpoint not found (may not be implemented)');
      return false;
    } else {
      console.log('❌ PDF download failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ PDF download error:', error.message);
    return false;
  }
};

// Test 9: Update Invoice
const testUpdateInvoice = async () => {
  console.log('\n🧪 Test 9: Update Invoice');
  
  const updateData = {
    status: 'paid',
    notes: 'Updated invoice notes - payment received'
  };

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/invoices/${invoiceId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  };

  try {
    const response = await makeRequest(options, updateData);
    console.log('Status:', response.status);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Invoice update successful');
      console.log('Updated Status:', response.data.data.status);
      console.log('Updated Notes:', response.data.data.notes);
      return true;
    } else {
      console.log('❌ Invoice update failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Invoice update error:', error.message);
    return false;
  }
};

// Test 10: Delete Invoice
const testDeleteInvoice = async () => {
  console.log('\n🧪 Test 10: Delete Invoice');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/invoices/${invoiceId}`,
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  try {
    const response = await makeRequest(options);
    console.log('Status:', response.status);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Invoice deletion successful');
      return true;
    } else {
      console.log('❌ Invoice deletion failed:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Invoice deletion error:', error.message);
    return false;
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting Core Functionality Evaluation\n');
  
  const tests = [
    testUserRegistration,
    testUserLogin,
    testCreateCustomer,
    testCreateInvoice,
    testGetInvoice,
    testGetAllInvoices,
    testGetAllCustomers,
    testPDFDownload,
    testUpdateInvoice,
    testDeleteInvoice
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log('❌ Test error:', error.message);
      failed++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All core functionalities are working correctly!');
  } else {
    console.log('\n⚠️ Some functionalities need attention.');
  }
};

// Run the tests
runAllTests(); 
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testUserId = '';
let testCustomerId = '';
let testInvoiceId = '';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
};

const testCustomer = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
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
    }
  ],
  notes: 'Test invoice'
};

// Utility function to log test results
const logTest = (testName, success, data = null, error = null) => {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${testName}`);
  if (data) console.log('   Response:', JSON.stringify(data, null, 2));
  if (error) console.log('   Error:', error);
  console.log('');
};

// Test 1: Health Check
const testHealthCheck = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    logTest('Health Check', response.status === 200, response.data);
    return true;
  } catch (error) {
    logTest('Health Check', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 2: User Registration
const testUserRegistration = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    logTest('User Registration', response.status === 201, response.data);
    return true;
  } catch (error) {
    logTest('User Registration', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 3: User Login
const testUserLogin = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    if (response.data.success && response.data.data.token) {
      authToken = response.data.data.token;
      testUserId = response.data.data.user.id;
      logTest('User Login', true, { 
        user: response.data.data.user,
        tokenReceived: !!authToken 
      });
      return true;
    } else {
      logTest('User Login', false, null, 'No token received');
      return false;
    }
  } catch (error) {
    logTest('User Login', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 4: Get User Profile
const testGetProfile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Get User Profile', response.status === 200, response.data);
    return true;
  } catch (error) {
    logTest('Get User Profile', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 5: Create Customer
const testCreateCustomer = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/customers`, testCustomer, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success && response.data.data._id) {
      testCustomerId = response.data.data._id;
      testInvoice.customerId = testCustomerId;
      logTest('Create Customer', true, response.data.data);
      return true;
    } else {
      logTest('Create Customer', false, null, 'No customer ID received');
      return false;
    }
  } catch (error) {
    logTest('Create Customer', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 6: Get All Customers
const testGetCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/customers`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Get All Customers', response.status === 200, {
      count: response.data.count,
      customers: response.data.data.length
    });
    return true;
  } catch (error) {
    logTest('Get All Customers', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 7: Get Customer by ID
const testGetCustomerById = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/customers/${testCustomerId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Get Customer by ID', response.status === 200, response.data.data);
    return true;
  } catch (error) {
    logTest('Get Customer by ID', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 8: Update Customer
const testUpdateCustomer = async () => {
  try {
    const updateData = { name: 'John Doe Updated' };
    const response = await axios.put(`${BASE_URL}/customers/${testCustomerId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Update Customer', response.status === 200, response.data.data);
    return true;
  } catch (error) {
    logTest('Update Customer', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 9: Create Invoice
const testCreateInvoice = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/invoices`, testInvoice, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success && response.data.data._id) {
      testInvoiceId = response.data.data._id;
      logTest('Create Invoice', true, response.data.data);
      return true;
    } else {
      logTest('Create Invoice', false, null, 'No invoice ID received');
      return false;
    }
  } catch (error) {
    logTest('Create Invoice', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 10: Get All Invoices
const testGetInvoices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/invoices`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Get All Invoices', response.status === 200, {
      count: response.data.count,
      invoices: response.data.data.length
    });
    return true;
  } catch (error) {
    logTest('Get All Invoices', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 11: Get Invoice by ID
const testGetInvoiceById = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/invoices/${testInvoiceId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Get Invoice by ID', response.status === 200, response.data.data);
    return true;
  } catch (error) {
    logTest('Get Invoice by ID', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 12: Update Invoice
const testUpdateInvoice = async () => {
  try {
    const updateData = { status: 'paid' };
    const response = await axios.put(`${BASE_URL}/invoices/${testInvoiceId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Update Invoice', response.status === 200, response.data.data);
    return true;
  } catch (error) {
    logTest('Update Invoice', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 13: Download Invoice PDF
const testDownloadPDF = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/invoices/${testInvoiceId}/download`, {
      headers: { Authorization: `Bearer ${authToken}` },
      responseType: 'arraybuffer'
    });
    logTest('Download Invoice PDF', response.status === 200, {
      contentType: response.headers['content-type'],
      contentLength: response.headers['content-length'],
      isPDF: response.headers['content-type'] === 'application/pdf'
    });
    return true;
  } catch (error) {
    logTest('Download Invoice PDF', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 14: Get Invoice Statistics
const testGetInvoiceStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/invoices/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Get Invoice Statistics', response.status === 200, response.data.data);
    return true;
  } catch (error) {
    logTest('Get Invoice Statistics', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 15: Error Handling - Invalid Token
const testInvalidToken = async () => {
  try {
    await axios.get(`${BASE_URL}/customers`, {
      headers: { Authorization: 'Bearer invalid-token' }
    });
    logTest('Invalid Token Test', false, null, 'Should have returned 401');
    return false;
  } catch (error) {
    const isExpectedError = error.response?.status === 401;
    logTest('Invalid Token Test', isExpectedError, null, 
      isExpectedError ? 'Correctly rejected invalid token' : error.response?.data || error.message);
    return isExpectedError;
  }
};

// Test 16: Error Handling - Resource Not Found
const testResourceNotFound = async () => {
  try {
    await axios.get(`${BASE_URL}/customers/nonexistent-id`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Resource Not Found Test', false, null, 'Should have returned 404');
    return false;
  } catch (error) {
    const isExpectedError = error.response?.status === 404;
    logTest('Resource Not Found Test', isExpectedError, null,
      isExpectedError ? 'Correctly returned 404 for non-existent resource' : error.response?.data || error.message);
    return isExpectedError;
  }
};

// Test 17: Cleanup - Delete Invoice
const testDeleteInvoice = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/invoices/${testInvoiceId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Delete Invoice', response.status === 200, response.data);
    return true;
  } catch (error) {
    logTest('Delete Invoice', false, null, error.response?.data || error.message);
    return false;
  }
};

// Test 18: Cleanup - Delete Customer
const testDeleteCustomer = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/customers/${testCustomerId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Delete Customer', response.status === 200, response.data);
    return true;
  } catch (error) {
    logTest('Delete Customer', false, null, error.response?.data || error.message);
    return false;
  }
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting API Endpoint Tests\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Get User Profile', fn: testGetProfile },
    { name: 'Create Customer', fn: testCreateCustomer },
    { name: 'Get All Customers', fn: testGetCustomers },
    { name: 'Get Customer by ID', fn: testGetCustomerById },
    { name: 'Update Customer', fn: testUpdateCustomer },
    { name: 'Create Invoice', fn: testCreateInvoice },
    { name: 'Get All Invoices', fn: testGetInvoices },
    { name: 'Get Invoice by ID', fn: testGetInvoiceById },
    { name: 'Update Invoice', fn: testUpdateInvoice },
    { name: 'Download Invoice PDF', fn: testDownloadPDF },
    { name: 'Get Invoice Statistics', fn: testGetInvoiceStats },
    { name: 'Invalid Token Test', fn: testInvalidToken },
    { name: 'Resource Not Found Test', fn: testResourceNotFound },
    { name: 'Delete Invoice', fn: testDeleteInvoice },
    { name: 'Delete Customer', fn: testDeleteCustomer }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passedTests++;
    } catch (error) {
      console.log(`❌ FAIL ${test.name} - Unexpected error:`, error.message);
    }
  }

  console.log('📊 Test Summary');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! API endpoints are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests }; 
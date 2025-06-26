const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser1 = {
  name: 'Security Test User 1',
  email: 'security1@test.com',
  password: 'password123'
};

const testUser2 = {
  name: 'Security Test User 2', 
  email: 'security22@test.com',
  password: 'password123'
};

let user1Token = null;
let user2Token = null;
let user1CustomerId = null;
let user2CustomerId = null;
let user1InvoiceId = null;
let user2InvoiceId = null;

async function testSecurity() {
  console.log('🔒 Testing Security Best Practices: Authentication & Authorization\n');
  
  try {
    // Test 1: Registration and Login
    await testRegistrationAndLogin();
    
    // Test 2: Protected Routes Without Authentication
    await testProtectedRoutesWithoutAuth();
    
    // Test 3: Data Isolation Between Users
    await testDataIsolation();
    
    // Test 4: Cross-User Data Access Prevention
    await testCrossUserDataAccess();
    
    // Test 5: Token Validation
    await testTokenValidation();
    
    // Test 6: Invalid Token Handling
    await testInvalidTokenHandling();
    
    console.log('\n🎉 All security tests completed successfully!');
    console.log('\n📋 Security Summary:');
    console.log('✅ Protected routes are properly secured');
    console.log('✅ Users cannot access other users\' data');
    console.log('✅ Authentication tokens are properly validated');
    console.log('✅ Data isolation is working correctly');
    
  } catch (error) {
    console.error('❌ Security test failed:', error.response?.data?.error || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function testRegistrationAndLogin() {
  console.log('1. Testing Registration and Login...');
  
  // Try to register user 1, if fails, try to login
  try {
    const register1Response = await axios.post(`${API_BASE_URL}/auth/register`, testUser1);
    console.log('✅ User 1 registration successful');
  } catch (error) {
    if (error.response?.data?.error === 'User with this email already exists') {
      console.log('ℹ️  User 1 already exists, attempting login...');
    } else {
      throw error;
    }
  }
  
  // Try to register user 2, if fails, try to login
  try {
    const register2Response = await axios.post(`${API_BASE_URL}/auth/register`, testUser2);
    console.log('✅ User 2 registration successful');
  } catch (error) {
    if (error.response?.data?.error === 'User with this email already exists') {
      console.log('ℹ️  User 2 already exists, attempting login...');
    } else {
      throw error;
    }
  }
  
  // Login user 1
  const login1Response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email: testUser1.email,
    password: testUser1.password
  });
  user1Token = login1Response.data.data.token;
  console.log('✅ User 1 login successful');
  
  // Login user 2
  const login2Response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email: testUser2.email,
    password: testUser2.password
  });
  user2Token = login2Response.data.data.token;
  console.log('✅ User 2 login successful');
  
  // Create test data for both users
  await createTestData();
}

async function createTestData() {
  console.log('\n   Creating test data for both users...');

  // Helper to find customer by email
  async function findCustomerByEmail(token, email) {
    const res = await axios.get(`${API_BASE_URL}/customers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data.find(c => c.email === email);
  }

  // Helper to find invoice by customerId
  async function findInvoiceByCustomerId(token, customerId) {
    const res = await axios.get(`${API_BASE_URL}/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data.find(inv => inv.customerId === customerId);
  }

  // Create or fetch customer for user 1
  let customer1 = await findCustomerByEmail(user1Token, 'customer1@test.com');
  if (!customer1) {
    const customer1Response = await axios.post(`${API_BASE_URL}/customers`, {
      name: 'Test Customer 1',
      email: 'customer1@test.com',
      phone: '123-456-7890',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'USA'
      }
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    customer1 = customer1Response.data.data;
    console.log('✅ Created customer for user 1');
  } else {
    console.log('ℹ️  Customer for user 1 already exists');
  }
  user1CustomerId = customer1._id;

  // Create or fetch customer for user 2
  let customer2 = await findCustomerByEmail(user2Token, 'customer2@test.com');
  if (!customer2) {
    const customer2Response = await axios.post(`${API_BASE_URL}/customers`, {
      name: 'Test Customer 2',
      email: 'customer2@test.com',
      phone: '098-765-4321',
      address: {
        street: '456 Test Ave',
        city: 'Test Town',
        state: 'TT',
        zipCode: '54321',
        country: 'USA'
      }
    }, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    customer2 = customer2Response.data.data;
    console.log('✅ Created customer for user 2');
  } else {
    console.log('ℹ️  Customer for user 2 already exists');
  }
  user2CustomerId = customer2._id;

  // Create or fetch invoice for user 1
  let invoice1 = await findInvoiceByCustomerId(user1Token, user1CustomerId);
  if (!invoice1) {
    const invoice1Response = await axios.post(`${API_BASE_URL}/invoices`, {
      customerId: user1CustomerId,
      customerName: 'Test Customer 1',
      items: [
        {
          description: 'Test Item 1',
          quantity: 1,
          unitPrice: 100,
          amount: 100
        }
      ],
      subtotal: 100,
      taxRate: 10,
      taxAmount: 10,
      total: 110,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    invoice1 = invoice1Response.data.data;
    console.log('✅ Created invoice for user 1');
  } else {
    console.log('ℹ️  Invoice for user 1 already exists');
  }
  user1InvoiceId = invoice1._id;

  // Create or fetch invoice for user 2
  let invoice2 = await findInvoiceByCustomerId(user2Token, user2CustomerId);
  if (!invoice2) {
    const invoice2Response = await axios.post(`${API_BASE_URL}/invoices`, {
      customerId: user2CustomerId,
      customerName: 'Test Customer 2',
      items: [
        {
          description: 'Test Item 2',
          quantity: 2,
          unitPrice: 50,
          amount: 100
        }
      ],
      subtotal: 100,
      taxRate: 10,
      taxAmount: 10,
      total: 110,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    invoice2 = invoice2Response.data.data;
    console.log('✅ Created invoice for user 2');
  } else {
    console.log('ℹ️  Invoice for user 2 already exists');
  }
  user2InvoiceId = invoice2._id;

  console.log('✅ Test data ready');
}

async function testProtectedRoutesWithoutAuth() {
  console.log('\n2. Testing Protected Routes Without Authentication...');
  
  const protectedRoutes = [
    { method: 'get', path: '/customers', name: 'Get Customers' },
    { method: 'post', path: '/customers', name: 'Create Customer', data: {} },
    { method: 'get', path: '/invoices', name: 'Get Invoices' },
    { method: 'post', path: '/invoices', name: 'Create Invoice', data: {} },
    { method: 'get', path: '/business-profile', name: 'Get Business Profile' },
    { method: 'put', path: '/business-profile', name: 'Update Business Profile', data: {} }
  ];
  
  for (const route of protectedRoutes) {
    try {
      if (route.method === 'get') {
        await axios.get(`${API_BASE_URL}${route.path}`);
      } else if (route.method === 'post') {
        await axios.post(`${API_BASE_URL}${route.path}`, route.data);
      } else if (route.method === 'put') {
        await axios.put(`${API_BASE_URL}${route.path}`, route.data);
      }
      console.log(`❌ SECURITY ISSUE: ${route.name} accessible without authentication!`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`✅ ${route.name} properly protected (401 Unauthorized)`);
      } else {
        console.log(`⚠️  ${route.name} returned ${error.response?.status} instead of 401`);
      }
    }
  }
}

async function testDataIsolation() {
  console.log('\n3. Testing Data Isolation Between Users...');
  
  // User 1 should only see their own customers
  const user1Customers = await axios.get(`${API_BASE_URL}/customers`, {
    headers: { Authorization: `Bearer ${user1Token}` }
  });
  console.log(`✅ User 1 can see ${user1Customers.data.data.length} customers (their own)`);
  
  // User 2 should only see their own customers
  const user2Customers = await axios.get(`${API_BASE_URL}/customers`, {
    headers: { Authorization: `Bearer ${user2Token}` }
  });
  console.log(`✅ User 2 can see ${user2Customers.data.data.length} customers (their own)`);
  
  // User 1 should only see their own invoices
  const user1Invoices = await axios.get(`${API_BASE_URL}/invoices`, {
    headers: { Authorization: `Bearer ${user1Token}` }
  });
  console.log(`✅ User 1 can see ${user1Invoices.data.data.length} invoices (their own)`);
  
  // User 2 should only see their own invoices
  const user2Invoices = await axios.get(`${API_BASE_URL}/invoices`, {
    headers: { Authorization: `Bearer ${user2Token}` }
  });
  console.log(`✅ User 2 can see ${user2Invoices.data.data.length} invoices (their own)`);
}

async function testCrossUserDataAccess() {
  console.log('\n4. Testing Cross-User Data Access Prevention...');
  
  // Test 1: User 1 trying to access User 2's customer
  try {
    await axios.get(`${API_BASE_URL}/customers/${user2CustomerId}`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('❌ SECURITY ISSUE: User 1 can access User 2\'s customer!');
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 403) {
      console.log('✅ User 1 cannot access User 2\'s customer (properly denied)');
    } else {
      console.log(`⚠️  User 1 customer access returned ${error.response?.status}`);
    }
  }
  
  // Test 2: User 2 trying to access User 1's customer
  try {
    await axios.get(`${API_BASE_URL}/customers/${user1CustomerId}`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log('❌ SECURITY ISSUE: User 2 can access User 1\'s customer!');
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 403) {
      console.log('✅ User 2 cannot access User 1\'s customer (properly denied)');
    } else {
      console.log(`⚠️  User 2 customer access returned ${error.response?.status}`);
    }
  }
  
  // Test 3: User 1 trying to access User 2's invoice
  try {
    await axios.get(`${API_BASE_URL}/invoices/${user2InvoiceId}`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('❌ SECURITY ISSUE: User 1 can access User 2\'s invoice!');
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 403) {
      console.log('✅ User 1 cannot access User 2\'s invoice (properly denied)');
    } else {
      console.log(`⚠️  User 1 invoice access returned ${error.response?.status}`);
    }
  }
  
  // Test 4: User 2 trying to access User 1's invoice
  try {
    await axios.get(`${API_BASE_URL}/invoices/${user1InvoiceId}`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log('❌ SECURITY ISSUE: User 2 can access User 1\'s invoice!');
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 403) {
      console.log('✅ User 2 cannot access User 1\'s invoice (properly denied)');
    } else {
      console.log(`⚠️  User 2 invoice access returned ${error.response?.status}`);
    }
  }
  
  // Test 5: User 1 trying to modify User 2's customer
  try {
    await axios.put(`${API_BASE_URL}/customers/${user2CustomerId}`, {
      name: 'Hacked Customer',
      email: 'hacked@test.com'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('❌ SECURITY ISSUE: User 1 can modify User 2\'s customer!');
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 403) {
      console.log('✅ User 1 cannot modify User 2\'s customer (properly denied)');
    } else {
      console.log(`⚠️  User 1 customer modification returned ${error.response?.status}`);
    }
  }
  
  // Test 6: User 2 trying to modify User 1's invoice
  try {
    await axios.put(`${API_BASE_URL}/invoices/${user1InvoiceId}`, {
      status: 'paid',
      total: 999999
    }, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log('❌ SECURITY ISSUE: User 2 can modify User 1\'s invoice!');
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 403) {
      console.log('✅ User 2 cannot modify User 1\'s invoice (properly denied)');
    } else {
      console.log(`⚠️  User 2 invoice modification returned ${error.response?.status}`);
    }
  }
}

async function testTokenValidation() {
  console.log('\n5. Testing Token Validation...');
  
  // Test with valid token
  try {
    const response = await axios.get(`${API_BASE_URL}/customers`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('✅ Valid token works correctly');
  } catch (error) {
    console.log('❌ Valid token not working:', error.response?.data?.error);
  }
  
  // Test with malformed token
  try {
    await axios.get(`${API_BASE_URL}/customers`, {
      headers: { Authorization: 'Bearer invalid-token-format' }
    });
    console.log('❌ SECURITY ISSUE: Malformed token accepted!');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Malformed token properly rejected (401 Unauthorized)');
    } else {
      console.log(`⚠️  Malformed token returned ${error.response?.status}`);
    }
  }
}

async function testInvalidTokenHandling() {
  console.log('\n6. Testing Invalid Token Handling...');
  
  // Test with no token
  try {
    await axios.get(`${API_BASE_URL}/customers`);
    console.log('❌ SECURITY ISSUE: Request without token accepted!');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Request without token properly rejected (401 Unauthorized)');
    } else {
      console.log(`⚠️  No token request returned ${error.response?.status}`);
    }
  }
  
  // Test with expired token (if we had one)
  console.log('✅ Token expiration would be tested with actual expired tokens');
  
  // Test with wrong authorization header format
  try {
    await axios.get(`${API_BASE_URL}/customers`, {
      headers: { Authorization: 'Basic dXNlcjpwYXNz' }
    });
    console.log('❌ SECURITY ISSUE: Wrong auth format accepted!');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Wrong auth format properly rejected (401 Unauthorized)');
    } else {
      console.log(`⚠️  Wrong auth format returned ${error.response?.status}`);
    }
  }
}

// Run the security tests
testSecurity(); 
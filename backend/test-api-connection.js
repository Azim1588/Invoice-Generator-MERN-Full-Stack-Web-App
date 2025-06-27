const axios = require('axios');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'https://invoice-backend1.onrender.com';
const API_BASE_URL = `${BACKEND_URL}/api`;

console.log('🔍 API Connection Test');
console.log('=====================');
console.log(`Backend URL: ${BACKEND_URL}`);
console.log(`API Base URL: ${API_BASE_URL}`);
console.log('');

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPassword123!'
};

const testLoginData = {
  email: 'test@example.com',
  password: 'TestPassword123!'
};

let authToken = null;

// Helper function to make API calls
async function testAPI(endpoint, method = 'GET', data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status,
      details: error.response?.data
    };
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  console.log('1️⃣ Testing Health Check...');
  const result = await testAPI('/health');
  
  if (result.success) {
    console.log('✅ Health Check: PASSED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${JSON.stringify(result.data)}`);
  } else {
    console.log('❌ Health Check: FAILED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
  }
  console.log('');
}

// Test 2: User Registration
async function testRegistration() {
  console.log('2️⃣ Testing User Registration...');
  const result = await testAPI('/auth/register', 'POST', testUser);
  
  if (result.success) {
    console.log('✅ Registration: PASSED');
    console.log(`   Status: ${result.status}`);
    console.log(`   User ID: ${result.data.data?.user?._id || 'N/A'}`);
  } else {
    console.log('❌ Registration: FAILED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
    
    // If user already exists, that's okay
    if (result.status === 400 && result.error?.message?.includes('already exists')) {
      console.log('   ℹ️  User already exists (this is expected)');
    }
  }
  console.log('');
}

// Test 3: User Login
async function testLogin() {
  console.log('3️⃣ Testing User Login...');
  const result = await testAPI('/auth/login', 'POST', testLoginData);
  
  if (result.success) {
    console.log('✅ Login: PASSED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Token: ${result.data.data?.token ? 'Present' : 'Missing'}`);
    console.log(`   User: ${result.data.data?.user?.name || 'N/A'}`);
    
    // Store token for other tests
    authToken = result.data.data?.token;
  } else {
    console.log('❌ Login: FAILED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
    
    // Check specific error types
    if (result.status === 401) {
      console.log('   🔍 This suggests authentication failure - check credentials');
    } else if (result.status === 404) {
      console.log('   🔍 Endpoint not found - check API routes');
    } else if (result.status === 500) {
      console.log('   🔍 Server error - check backend logs');
    }
  }
  console.log('');
}

// Test 4: Get User Profile (with token)
async function testGetProfile() {
  console.log('4️⃣ Testing Get Profile (Authenticated)...');
  
  if (!authToken) {
    console.log('⚠️  Skipping - No auth token available');
    console.log('');
    return;
  }
  
  const result = await testAPI('/auth/profile', 'GET', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Get Profile: PASSED');
    console.log(`   Status: ${result.status}`);
    console.log(`   User: ${result.data.data?.name || 'N/A'}`);
  } else {
    console.log('❌ Get Profile: FAILED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
  }
  console.log('');
}

// Test 5: Business Profile
async function testBusinessProfile() {
  console.log('5️⃣ Testing Business Profile...');
  
  if (!authToken) {
    console.log('⚠️  Skipping - No auth token available');
    console.log('');
    return;
  }
  
  const result = await testAPI('/business-profile', 'GET', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Business Profile: PASSED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Business Name: ${result.data.data?.businessName || 'N/A'}`);
  } else {
    console.log('❌ Business Profile: FAILED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
  }
  console.log('');
}

// Test 6: Customers API
async function testCustomers() {
  console.log('6️⃣ Testing Customers API...');
  
  if (!authToken) {
    console.log('⚠️  Skipping - No auth token available');
    console.log('');
    return;
  }
  
  const result = await testAPI('/customers', 'GET', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Customers API: PASSED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Count: ${result.data.data?.length || 0} customers`);
  } else {
    console.log('❌ Customers API: FAILED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
  }
  console.log('');
}

// Test 7: Invoices API
async function testInvoices() {
  console.log('7️⃣ Testing Invoices API...');
  
  if (!authToken) {
    console.log('⚠️  Skipping - No auth token available');
    console.log('');
    return;
  }
  
  const result = await testAPI('/invoices', 'GET', null, {
    'Authorization': `Bearer ${authToken}`
  });
  
  if (result.success) {
    console.log('✅ Invoices API: PASSED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Count: ${result.data.data?.length || 0} invoices`);
  } else {
    console.log('❌ Invoices API: FAILED');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
  }
  console.log('');
}

// Test 8: CORS Test
async function testCORS() {
  console.log('8️⃣ Testing CORS Configuration...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      headers: {
        'Origin': 'https://invoice-frontend.onrender.com'
      }
    });
    
    const corsHeaders = response.headers;
    console.log('✅ CORS: PASSED');
    console.log(`   Access-Control-Allow-Origin: ${corsHeaders['access-control-allow-origin'] || 'Not set'}`);
    console.log(`   Access-Control-Allow-Credentials: ${corsHeaders['access-control-allow-credentials'] || 'Not set'}`);
  } catch (error) {
    console.log('❌ CORS: FAILED');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

// Test 9: Frontend Environment Variable Check
async function checkFrontendConfig() {
  console.log('9️⃣ Frontend Configuration Check...');
  console.log('   Check these in your Render frontend environment variables:');
  console.log(`   VITE_API_BASE_URL should be: ${API_BASE_URL}`);
  console.log('');
}

// Main test runner
async function runAllTests() {
  try {
    await testHealthCheck();
    await testRegistration();
    await testLogin();
    await testGetProfile();
    await testBusinessProfile();
    await testCustomers();
    await testInvoices();
    await testCORS();
    await checkFrontendConfig();
    
    console.log('🎯 Test Summary:');
    console.log('================');
    console.log(`Backend URL: ${BACKEND_URL}`);
    console.log(`API Base URL: ${API_BASE_URL}`);
    console.log(`Auth Token: ${authToken ? '✅ Available' : '❌ Not available'}`);
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. If health check fails: Backend is not running');
    console.log('2. If login fails: Check user credentials or database connection');
    console.log('3. If CORS fails: Update backend CORS configuration');
    console.log('4. If frontend fails: Check VITE_API_BASE_URL environment variable');
    
  } catch (error) {
    console.error('❌ Test runner error:', error.message);
  }
}

// Run tests
runAllTests(); 
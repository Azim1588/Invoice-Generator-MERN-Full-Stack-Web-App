const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test user data
const testUser = {
  username: 'testuser123',
  email: 'testuser123@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
};

async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow...\n');
  
  try {
    // Step 1: Test User Registration
    console.log('📝 Step 1: Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (registerResponse.data.success) {
      console.log('✅ Registration successful!');
      console.log('   User ID:', registerResponse.data.data.user.id);
      console.log('   Email:', registerResponse.data.data.user.email);
    } else {
      console.log('❌ Registration failed:', registerResponse.data.error);
      return;
    }
    
    console.log('');
    
    // Step 2: Test User Login
    console.log('🔑 Step 2: Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful!');
      console.log('   Token received:', !!loginResponse.data.data.token);
      console.log('   User info:', {
        id: loginResponse.data.data.user.id,
        email: loginResponse.data.data.user.email,
        firstName: loginResponse.data.data.user.firstName,
        lastName: loginResponse.data.data.user.lastName
      });
      
      const token = loginResponse.data.data.token;
      
      // Step 3: Test Protected Endpoint Access
      console.log('\n🔒 Step 3: Testing Protected Endpoint Access...');
      const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (profileResponse.data.success) {
        console.log('✅ Protected endpoint access successful!');
        console.log('   Profile data retrieved');
      } else {
        console.log('❌ Protected endpoint access failed:', profileResponse.data.error);
      }
      
    } else {
      console.log('❌ Login failed:', loginResponse.data.error);
    }
    
    console.log('\n🎉 Authentication flow test completed!');
    
  } catch (error) {
    console.log('❌ Error during authentication test:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 500) {
      console.log('💡 This might indicate a database connection issue.');
    }
  }
}

// Test demo account login
async function testDemoLogin() {
  console.log('\n🔐 Testing Demo Account Login...\n');
  
  try {
    const demoCredentials = {
      email: 'demo@example.com',
      password: 'password'
    };
    
    console.log('📤 Attempting login with demo credentials...');
    const response = await axios.post(`${BASE_URL}/auth/login`, demoCredentials, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.success) {
      console.log('✅ Demo login successful!');
      console.log('   User info:', {
        id: response.data.data.user.id,
        email: response.data.data.user.email,
        firstName: response.data.data.user.firstName,
        lastName: response.data.data.user.lastName
      });
      console.log('   Token received:', !!response.data.data.token);
    } else {
      console.log('❌ Demo login failed:', response.data.error);
    }
    
  } catch (error) {
    console.log('❌ Demo login error:', error.response?.data?.error || error.message);
  }
}

// Run both tests
async function runAllTests() {
  await testAuthFlow();
  await testDemoLogin();
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testAuthFlow, testDemoLogin }; 
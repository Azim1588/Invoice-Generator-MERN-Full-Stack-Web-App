const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Demo credentials
const demoCredentials = {
  email: 'demo@example.com',
  password: 'password'
};

async function testDemoLogin() {
  console.log('🔐 Testing Demo Account Login...\n');
  
  try {
    console.log('📤 Attempting login with demo credentials...');
    const response = await axios.post(`${BASE_URL}/auth/login`, demoCredentials, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.success) {
      console.log('✅ Demo login successful!');
      console.log('📋 User info:', {
        id: response.data.data.user.id,
        username: response.data.data.user.username,
        email: response.data.data.user.email,
        firstName: response.data.data.user.firstName,
        lastName: response.data.data.user.lastName
      });
      console.log('🔑 Token received:', response.data.data.token ? 'Yes' : 'No');
      
      // Test accessing protected endpoint
      const token = response.data.data.token;
      console.log('\n🔒 Testing protected endpoint access...');
      
      try {
        const customersResponse = await axios.get(`${BASE_URL}/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Protected endpoint access successful!');
        console.log('📊 Customers count:', customersResponse.data.count || 0);
      } catch (error) {
        console.log('❌ Protected endpoint access failed:', error.response?.data?.error || error.message);
      }
      
    } else {
      console.log('❌ Demo login failed:', response.data.error);
    }
    
  } catch (error) {
    console.log('❌ Demo login error:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 500) {
      console.log('💡 This might indicate a database connection issue.');
    }
  }
}

// Run the test
testDemoLogin().catch(console.error); 
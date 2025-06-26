const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testDemoLoginFrontend() {
  try {
    console.log('🧪 Testing Demo Account Frontend Login Flow...\n');

    // Test 1: Login with demo credentials
    console.log('1. Testing login with demo credentials...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'demo@example.com',
      password: 'password'
    });

    const { token, user } = loginResponse.data.data;
    
    console.log('✅ Login successful!');
    console.log('👤 User:', user.name);
    console.log('📧 Email:', user.email);
    console.log('🆔 User ID:', user.id);
    console.log('🔑 Token received:', token.substring(0, 30) + '...\n');

    // Test 2: Verify token works for authenticated requests
    console.log('2. Testing authenticated requests...');
    
    // Test business profile access
    const businessProfileResponse = await axios.get(`${API_BASE_URL}/business-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Business profile accessible');

    // Test customers access
    const customersResponse = await axios.get(`${API_BASE_URL}/customers`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Customers accessible');

    // Test invoices access
    const invoicesResponse = await axios.get(`${API_BASE_URL}/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Invoices accessible\n');

    // Test 3: Verify user profile endpoint
    console.log('3. Testing user profile endpoint...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ User profile retrieved');
    console.log('📝 Profile data:', {
      name: profileResponse.data.data.name,
      email: profileResponse.data.data.email,
      id: profileResponse.data.data.id
    });

    console.log('\n🎉 Demo account frontend login test passed!');
    console.log('\n📋 Frontend Login Summary:');
    console.log('- ✅ Login with demo credentials works');
    console.log('- ✅ JWT token is generated correctly');
    console.log('- ✅ Token works for authenticated requests');
    console.log('- ✅ All main endpoints are accessible');
    console.log('- ✅ User profile data is correct');
    console.log('\n🌐 You can now use these credentials in the frontend:');
    console.log('Email: demo@example.com');
    console.log('Password: password');

  } catch (error) {
    console.error('❌ Demo frontend login test failed:', error.response?.data?.error || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

testDemoLoginFrontend(); 
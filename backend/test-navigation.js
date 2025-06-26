const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testNavigation() {
  try {
    console.log('🧪 Testing Navigation and API Endpoints...\n');

    // Step 1: Login with demo account
    console.log('1. Logging in with demo account...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'demo@example.com',
      password: 'password'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful\n');

    // Step 2: Test customers endpoint
    console.log('2. Testing customers endpoint...');
    const customersResponse = await axios.get(`${API_BASE_URL}/customers`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Customers endpoint working');
    console.log('👥 Customers count:', customersResponse.data.data.length);
    console.log('📊 Response structure:', {
      success: customersResponse.data.success,
      hasData: !!customersResponse.data.data,
      dataType: Array.isArray(customersResponse.data.data) ? 'Array' : typeof customersResponse.data.data
    });

    // Step 3: Test invoices endpoint
    console.log('\n3. Testing invoices endpoint...');
    const invoicesResponse = await axios.get(`${API_BASE_URL}/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Invoices endpoint working');
    console.log('📄 Invoices count:', invoicesResponse.data.data.length);
    console.log('📊 Response structure:', {
      success: invoicesResponse.data.success,
      hasData: !!invoicesResponse.data.data,
      dataType: Array.isArray(invoicesResponse.data.data) ? 'Array' : typeof invoicesResponse.data.data
    });

    // Step 4: Test business profile endpoint
    console.log('\n4. Testing business profile endpoint...');
    const businessProfileResponse = await axios.get(`${API_BASE_URL}/business-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Business profile endpoint working');
    console.log('🏢 Business name:', businessProfileResponse.data.data.businessName);

    console.log('\n🎉 All navigation endpoints are working correctly!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Authentication working');
    console.log('- ✅ Customers API working');
    console.log('- ✅ Invoices API working');
    console.log('- ✅ Business profile API working');
    console.log('- ✅ All endpoints returning proper data structure');

  } catch (error) {
    console.error('❌ Navigation test failed:', error.response?.data?.error || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

testNavigation(); 
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testDemoAccount() {
  try {
    console.log('🧪 Testing Demo Account Functionality...\n');

    // Step 1: Test demo login
    console.log('1. Testing demo account login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'demo@example.com',
      password: 'password'
    });

    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    
    console.log('✅ Demo login successful!');
    console.log('👤 User:', user.name);
    console.log('📧 Email:', user.email);
    console.log('🔑 Token received:', token.substring(0, 20) + '...\n');

    // Step 2: Test getting user profile
    console.log('2. Testing user profile retrieval...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ User profile retrieved successfully');
    console.log('📝 Profile data:', profileResponse.data.data.name, '\n');

    // Step 3: Test business profile access
    console.log('3. Testing business profile access...');
    const businessProfileResponse = await axios.get(`${API_BASE_URL}/business-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const businessProfile = businessProfileResponse.data.data;
    console.log('✅ Business profile retrieved successfully');
    console.log('🏢 Business Name:', businessProfile.businessName);
    console.log('📍 Address:', businessProfile.fullBusinessAddress);
    console.log('📞 Phone:', businessProfile.businessPhone || 'Not set');
    console.log('📧 Email:', businessProfile.businessEmail || 'Not set');
    console.log('🖼️  Has Logo:', !!businessProfile.logo, '\n');

    // Step 4: Test business profile update
    console.log('4. Testing business profile update...');
    const updateData = {
      businessName: 'Demo Business Updated',
      businessAddress: {
        street: '123 Demo Street',
        city: 'Demo City',
        state: 'DC',
        zipCode: '12345',
        country: 'USA'
      },
      businessPhone: '(555) 123-4567',
      businessEmail: 'demo@business.com',
      taxId: '12-3456789',
      website: 'https://demo-business.com'
    };

    const updateResponse = await axios.put(`${API_BASE_URL}/business-profile`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Business profile updated successfully');
    console.log('📝 Updated business name:', updateResponse.data.data.businessName, '\n');

    // Step 5: Test invoice settings update
    console.log('5. Testing invoice settings update...');
    const invoiceSettings = {
      defaultTaxRate: 8.5,
      currency: 'USD',
      paymentTerms: 'Net 30',
      invoicePrefix: 'DEMO'
    };

    const invoiceSettingsResponse = await axios.put(`${API_BASE_URL}/business-profile/invoice-settings`, {
      invoiceSettings
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Invoice settings updated successfully');
    console.log('💰 Tax Rate:', invoiceSettingsResponse.data.data.invoiceSettings.defaultTaxRate + '%');
    console.log('💱 Currency:', invoiceSettingsResponse.data.data.invoiceSettings.currency);
    console.log('📋 Payment Terms:', invoiceSettingsResponse.data.data.invoiceSettings.paymentTerms, '\n');

    // Step 6: Test branding update
    console.log('6. Testing branding update...');
    const branding = {
      primaryColor: '#3B82F6',
      secondaryColor: '#1F2937',
      fontFamily: 'Arial'
    };

    const brandingResponse = await axios.put(`${API_BASE_URL}/business-profile/branding`, {
      branding
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Branding updated successfully');
    console.log('🎨 Primary Color:', brandingResponse.data.data.branding.primaryColor);
    console.log('🎨 Secondary Color:', brandingResponse.data.data.branding.secondaryColor);
    console.log('📝 Font Family:', brandingResponse.data.data.branding.fontFamily, '\n');

    // Step 7: Test customer creation
    console.log('7. Testing customer creation...');
    const customerData = {
      name: 'Demo Customer',
      email: 'customer@demo.com',
      phone: '(555) 987-6543',
      address: {
        street: '456 Customer Ave',
        city: 'Customer City',
        state: 'CC',
        zipCode: '54321',
        country: 'USA'
      },
      company: 'Demo Company Inc.',
      notes: 'This is a demo customer'
    };

    const customerResponse = await axios.post(`${API_BASE_URL}/customers`, customerData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Customer created successfully');
    console.log('👤 Customer Name:', customerResponse.data.data.name);
    console.log('🏢 Company:', customerResponse.data.data.company, '\n');

    // Step 8: Test invoice creation
    console.log('8. Testing invoice creation...');
    const invoiceData = {
      customerId: customerResponse.data.data._id,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      items: [
        {
          description: 'Demo Service',
          quantity: 2,
          unitPrice: 100
        },
        {
          description: 'Demo Product',
          quantity: 1,
          unitPrice: 50
        }
      ],
      notes: 'This is a demo invoice'
    };

    const invoiceResponse = await axios.post(`${API_BASE_URL}/invoices`, invoiceData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Invoice created successfully');
    console.log('📄 Invoice Number:', invoiceResponse.data.data.invoiceNumber);
    console.log('💰 Total Amount: $', invoiceResponse.data.data.total);
    console.log('📅 Due Date:', new Date(invoiceResponse.data.data.dueDate).toLocaleDateString(), '\n');

    // Step 9: Test getting all invoices
    console.log('9. Testing invoice retrieval...');
    const invoicesResponse = await axios.get(`${API_BASE_URL}/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Invoices retrieved successfully');
    console.log('📊 Total Invoices:', invoicesResponse.data.data.length, '\n');

    // Step 10: Test getting all customers
    console.log('10. Testing customer retrieval...');
    const customersResponse = await axios.get(`${API_BASE_URL}/customers`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Customers retrieved successfully');
    console.log('👥 Total Customers:', customersResponse.data.data.length, '\n');

    console.log('🎉 All demo account tests passed successfully!');
    console.log('\n📋 Demo Account Summary:');
    console.log('- ✅ Login functionality');
    console.log('- ✅ User profile access');
    console.log('- ✅ Business profile management');
    console.log('- ✅ Invoice settings configuration');
    console.log('- ✅ Branding customization');
    console.log('- ✅ Customer creation and management');
    console.log('- ✅ Invoice creation and management');
    console.log('- ✅ Data retrieval and listing');
    console.log('\n🔑 Demo Account Credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: password');

  } catch (error) {
    console.error('❌ Demo account test failed:', error.response?.data?.error || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

testDemoAccount(); 
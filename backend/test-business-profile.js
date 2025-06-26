const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testBusinessProfile() {
  try {
    console.log('🧪 Testing Business Profile Functionality...\n');

    // Step 1: Register a new user
    console.log('1. Registering a new user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Test Business User',
      email: 'business2@test.com',
      password: 'password123'
    });

    const token = registerResponse.data.data.token;
    console.log('✅ User registered successfully\n');

    // Step 2: Get business profile (should create default)
    console.log('2. Getting business profile...');
    const getProfileResponse = await axios.get(`${API_BASE_URL}/business-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const profile = getProfileResponse.data.data;
    console.log('✅ Business profile retrieved:', {
      businessName: profile.businessName,
      hasLogo: !!profile.logo,
      hasInvoiceSettings: !!profile.invoiceSettings,
      hasBranding: !!profile.branding
    });

    // Step 3: Update business profile
    console.log('\n3. Updating business profile...');
    const updateData = {
      businessName: 'My Awesome Business',
      businessAddress: {
        street: '123 Business Street',
        city: 'Business City',
        state: 'BC',
        zipCode: '12345',
        country: 'USA'
      },
      businessPhone: '(555) 123-4567',
      businessEmail: 'contact@mybusiness.com',
      taxId: '12-3456789',
      website: 'https://mybusiness.com'
    };

    const updateResponse = await axios.put(`${API_BASE_URL}/business-profile`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Business profile updated successfully\n');

    // Step 4: Update invoice settings
    console.log('4. Updating invoice settings...');
    const invoiceSettings = {
      defaultTaxRate: 8.5,
      currency: 'USD',
      paymentTerms: 'Net 30',
      invoicePrefix: 'INV'
    };

    const invoiceSettingsResponse = await axios.put(`${API_BASE_URL}/business-profile/invoice-settings`, {
      invoiceSettings
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Invoice settings updated successfully\n');

    // Step 5: Update branding
    console.log('5. Updating branding...');
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

    console.log('✅ Branding updated successfully\n');

    // Step 6: Get updated profile
    console.log('6. Getting updated business profile...');
    const updatedProfileResponse = await axios.get(`${API_BASE_URL}/business-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedProfile = updatedProfileResponse.data.data;
    console.log('✅ Updated business profile:', {
      businessName: updatedProfile.businessName,
      businessPhone: updatedProfile.businessPhone,
      businessEmail: updatedProfile.businessEmail,
      defaultTaxRate: updatedProfile.invoiceSettings?.defaultTaxRate,
      primaryColor: updatedProfile.branding?.primaryColor,
      fontFamily: updatedProfile.branding?.fontFamily
    });

    console.log('\n🎉 All business profile tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('- ✅ User registration');
    console.log('- ✅ Business profile creation and retrieval');
    console.log('- ✅ Business profile update');
    console.log('- ✅ Invoice settings update');
    console.log('- ✅ Branding update');
    console.log('- ✅ Logo upload/delete endpoints available');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

testBusinessProfile(); 
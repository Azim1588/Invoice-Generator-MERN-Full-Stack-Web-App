const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3000/api';

// Test user credentials
const testUser = {
  name: 'Security Test User',
  email: 'security-advanced@test.com',
  password: 'TestPassword123!'
};

let authToken = '';

console.log('🔒 Advanced Security Testing: Input Validation, Rate Limiting, Error Handling & File Uploads\n');

async function testInputValidationAndSanitization() {
  console.log('1. Testing Input Validation & Sanitization...');
  
  // Test XSS prevention in customer creation
  console.log('\n   Testing XSS Prevention in Customer Creation...');
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    'javascript:alert("XSS")',
    '<img src="x" onerror="alert(\'XSS\')">',
    '"><script>alert("XSS")</script>',
    '${7*7}',
    '{{constructor.constructor("alert(\'XSS\')")()}}'
  ];

  for (const payload of xssPayloads) {
    try {
      const response = await axios.post(`${API_BASE_URL}/customers`, {
        name: payload,
        email: `test${Date.now()}@example.com`,
        phone: payload,
        address: {
          street: payload,
          city: payload,
          state: payload,
          zipCode: '12345',
          country: 'USA'
        }
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      // Check if payload was sanitized (should not contain script tags)
      const customerData = response.data.data;
      if (customerData.name.includes('<script>') || customerData.name.includes('javascript:')) {
        console.log(`❌ XSS payload not sanitized: ${payload}`);
      } else {
        console.log(`✅ XSS payload sanitized: ${payload.substring(0, 20)}...`);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`✅ XSS payload rejected: ${payload.substring(0, 20)}...`);
      } else {
        console.log(`❌ Unexpected error for XSS test: ${error.message}`);
      }
    }
  }

  // Test NoSQL injection prevention
  console.log('\n   Testing NoSQL Injection Prevention...');
  const nosqlPayloads = [
    { email: { $ne: '' } },
    { email: { $gt: '' } },
    { email: { $regex: '.*' } },
    { $where: '1==1' },
    { $or: [{ email: 'test' }, { email: 'admin' }] }
  ];

  for (const payload of nosqlPayloads) {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: payload
      });
      
      if (response.data.data.length > 10) {
        console.log(`❌ NoSQL injection possible: ${JSON.stringify(payload)}`);
      } else {
        console.log(`✅ NoSQL injection prevented: ${JSON.stringify(payload)}`);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`✅ NoSQL injection rejected: ${JSON.stringify(payload)}`);
      } else {
        console.log(`❌ Unexpected error for NoSQL test: ${error.message}`);
      }
    }
  }

  // Test SQL injection prevention (if applicable)
  console.log('\n   Testing SQL Injection Prevention...');
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE customers; --",
    "' UNION SELECT * FROM users --",
    "admin'--",
    "1' OR '1' = '1' --"
  ];

  for (const payload of sqlPayloads) {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { search: payload }
      });
      
      // Check if response contains unexpected data
      if (response.data.data.length > 10) {
        console.log(`❌ SQL injection possible: ${payload}`);
      } else {
        console.log(`✅ SQL injection prevented: ${payload}`);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`✅ SQL injection rejected: ${payload}`);
      } else {
        console.log(`❌ Unexpected error for SQL test: ${error.message}`);
      }
    }
  }
}

async function testRateLimiting() {
  console.log('\n2. Testing Rate Limiting...');
  
  // Test login rate limiting
  console.log('\n   Testing Login Rate Limiting...');
  const loginAttempts = [];
  
  for (let i = 0; i < 10; i++) {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'nonexistent@test.com',
        password: 'wrongpassword'
      });
      const endTime = Date.now();
      loginAttempts.push({ attempt: i + 1, status: response.status, time: endTime - startTime });
    } catch (error) {
      const endTime = Date.now();
      loginAttempts.push({ 
        attempt: i + 1, 
        status: error.response?.status || 'error', 
        time: endTime - startTime,
        message: error.response?.data?.error || error.message
      });
    }
    
    // Small delay between attempts
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Analyze rate limiting
  const failedAttempts = loginAttempts.filter(a => a.status === 429 || a.message?.includes('rate limit'));
  if (failedAttempts.length > 0) {
    console.log(`✅ Rate limiting detected after ${failedAttempts[0].attempt} attempts`);
  } else {
    console.log('⚠️  No rate limiting detected for login attempts');
  }

  // Test API endpoint rate limiting
  console.log('\n   Testing API Endpoint Rate Limiting...');
  const apiAttempts = [];
  
  for (let i = 0; i < 20; i++) {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      apiAttempts.push({ attempt: i + 1, status: response.status });
    } catch (error) {
      apiAttempts.push({ 
        attempt: i + 1, 
        status: error.response?.status || 'error',
        message: error.response?.data?.error || error.message
      });
    }
    
    // Small delay between attempts
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const rateLimited = apiAttempts.filter(a => a.status === 429);
  if (rateLimited.length > 0) {
    console.log(`✅ API rate limiting detected after ${rateLimited[0].attempt} attempts`);
  } else {
    console.log('⚠️  No rate limiting detected for API endpoints');
  }
}

async function testErrorHandling() {
  console.log('\n3. Testing Error Handling & Information Disclosure...');
  
  // Test for stack trace disclosure
  console.log('\n   Testing Stack Trace Disclosure...');
  
  // Try to trigger an error with malformed data
  try {
    const response = await axios.post(`${API_BASE_URL}/customers`, {
      name: null,
      email: 'invalid-email',
      phone: 123, // Should be string
      address: 'not-an-object'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  } catch (error) {
    const errorResponse = error.response?.data;
    
    // Check for stack traces
    if (errorResponse && (
      errorResponse.stack || 
      errorResponse.stackTrace || 
      errorResponse.includes('at ') ||
      errorResponse.includes('Error:') ||
      errorResponse.includes('TypeError:') ||
      errorResponse.includes('ReferenceError:')
    )) {
      console.log('❌ Stack trace disclosed in error response');
      console.log('   Error response:', JSON.stringify(errorResponse, null, 2));
    } else {
      console.log('✅ No stack trace disclosed in error response');
    }
    
    // Check for sensitive information
    if (errorResponse && (
      errorResponse.includes('password') ||
      errorResponse.includes('token') ||
      errorResponse.includes('secret') ||
      errorResponse.includes('key') ||
      errorResponse.includes('database') ||
      errorResponse.includes('connection')
    )) {
      console.log('❌ Sensitive information disclosed in error response');
    } else {
      console.log('✅ No sensitive information disclosed');
    }
  }

  // Test for database error disclosure
  console.log('\n   Testing Database Error Disclosure...');
  try {
    const response = await axios.post(`${API_BASE_URL}/customers`, {
      name: 'A'.repeat(1000), // Very long name
      email: 'A'.repeat(1000) + '@test.com', // Very long email
      phone: 'A'.repeat(1000), // Very long phone
      address: {
        street: 'A'.repeat(1000),
        city: 'A'.repeat(1000),
        state: 'A'.repeat(1000),
        zipCode: 'A'.repeat(1000),
        country: 'A'.repeat(1000)
      }
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
  } catch (error) {
    const errorResponse = error.response?.data;
    
    if (errorResponse && (
      errorResponse.includes('MongoDB') ||
      errorResponse.includes('mongoose') ||
      errorResponse.includes('validation failed') ||
      errorResponse.includes('duplicate key') ||
      errorResponse.includes('index')
    )) {
      console.log('❌ Database error details disclosed');
      console.log('   Error response:', JSON.stringify(errorResponse, null, 2));
    } else {
      console.log('✅ Database error details properly hidden');
    }
  }
}

async function testFileUploadSecurity() {
  console.log('\n4. Testing File Upload Security...');
  
  // Test file type validation
  console.log('\n   Testing File Type Validation...');
  
  // Create a fake image file with wrong extension
  const fakeImagePath = path.join(__dirname, 'test-fake-image.txt');
  fs.writeFileSync(fakeImagePath, 'This is not an image file');
  
  try {
    const formData = new FormData();
    formData.append('logo', fs.createReadStream(fakeImagePath), {
      filename: 'fake-image.jpg',
      contentType: 'image/jpeg'
    });
    
    const response = await axios.post(`${API_BASE_URL}/business-profile/logo`, formData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        ...formData.getHeaders()
      }
    });
    
    console.log('❌ Fake image file accepted');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Fake image file properly rejected');
    } else {
      console.log(`❌ Unexpected error for file type test: ${error.message}`);
    }
  }
  
  // Clean up fake file
  if (fs.existsSync(fakeImagePath)) {
    fs.unlinkSync(fakeImagePath);
  }

  // Test file size limits
  console.log('\n   Testing File Size Limits...');
  
  // Create a large file (5MB)
  const largeFilePath = path.join(__dirname, 'test-large-file.jpg');
  const largeBuffer = Buffer.alloc(5 * 1024 * 1024, 'A'); // 5MB
  fs.writeFileSync(largeFilePath, largeBuffer);
  
  try {
    const formData = new FormData();
    formData.append('logo', fs.createReadStream(largeFilePath), {
      filename: 'large-file.jpg',
      contentType: 'image/jpeg'
    });
    
    const response = await axios.post(`${API_BASE_URL}/business-profile/logo`, formData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        ...formData.getHeaders()
      }
    });
    
    console.log('❌ Large file accepted');
  } catch (error) {
    if (error.response?.status === 413 || error.response?.data?.error?.includes('size')) {
      console.log('✅ Large file properly rejected');
    } else {
      console.log(`❌ Unexpected error for file size test: ${error.message}`);
    }
  }
  
  // Clean up large file
  if (fs.existsSync(largeFilePath)) {
    fs.unlinkSync(largeFilePath);
  }

  // Test malicious file upload
  console.log('\n   Testing Malicious File Upload...');
  
  const maliciousFiles = [
    { name: 'test.php', content: '<?php echo "Hello World"; ?>' },
    { name: 'test.js', content: 'alert("XSS");' },
    { name: 'test.html', content: '<script>alert("XSS")</script>' },
    { name: 'test.exe', content: 'MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00' }
  ];

  for (const file of maliciousFiles) {
    const maliciousPath = path.join(__dirname, file.name);
    fs.writeFileSync(maliciousPath, file.content);
    
    try {
      const formData = new FormData();
      formData.append('logo', fs.createReadStream(maliciousPath), {
        filename: file.name,
        contentType: 'image/jpeg'
      });
      
      const response = await axios.post(`${API_BASE_URL}/business-profile/logo`, formData, {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          ...formData.getHeaders()
        }
      });
      
      console.log(`❌ Malicious file accepted: ${file.name}`);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`✅ Malicious file rejected: ${file.name}`);
      } else {
        console.log(`❌ Unexpected error for ${file.name}: ${error.message}`);
      }
    }
    
    // Clean up
    if (fs.existsSync(maliciousPath)) {
      fs.unlinkSync(maliciousPath);
    }
  }

  // Test upload directory security
  console.log('\n   Testing Upload Directory Security...');
  
  try {
    // Try to access upload directory directly
    const response = await axios.get('http://localhost:3000/uploads/logos/');
    
    if (response.status === 200) {
      console.log('❌ Upload directory is publicly accessible');
    } else {
      console.log('✅ Upload directory is not publicly accessible');
    }
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 403) {
      console.log('✅ Upload directory is properly secured');
    } else {
      console.log(`❌ Unexpected error checking upload directory: ${error.message}`);
    }
  }
}

async function runAdvancedSecurityTests() {
  try {
    // Login or register test user
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      authToken = loginResponse.data.data.token;
      console.log('✅ Test user login successful');
    } catch (error) {
      if (error.response?.status === 401) {
        // Register new user
        const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
        authToken = registerResponse.data.data.token;
        console.log('✅ Test user registration successful');
      } else {
        throw error;
      }
    }

    // Run all security tests
    await testInputValidationAndSanitization();
    await testRateLimiting();
    await testErrorHandling();
    await testFileUploadSecurity();

    console.log('\n🎉 Advanced security tests completed!');
    console.log('\n📋 Security Recommendations:');
    console.log('- Ensure all user inputs are validated and sanitized');
    console.log('- Implement rate limiting for login and API endpoints');
    console.log('- Hide internal errors and stack traces from users');
    console.log('- Validate file types and sizes for uploads');
    console.log('- Secure upload directories from public access');
    console.log('- Use parameterized queries to prevent injection attacks');

  } catch (error) {
    console.error('❌ Advanced security test failed:', error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
runAdvancedSecurityTests();

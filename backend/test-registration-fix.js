const http = require('http');

const testRegistration = async () => {
  console.log('🧪 Testing User Registration with Fixed Validation\n');
  
  const testUser = {
    name: 'Test User Registration',
    email: 'testregistration@example.com',
    password: 'password123'
  };

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          console.log('Status:', res.statusCode);
          console.log('Response:', JSON.stringify(response, null, 2));
          
          if (res.statusCode === 201 && response.success) {
            console.log('✅ User registration successful!');
            console.log('User ID:', response.data.user.id);
            console.log('Token:', response.data.token.substring(0, 20) + '...');
            resolve(true);
          } else {
            console.log('❌ User registration failed');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Error parsing response:', error.message);
          console.log('Raw response:', responseData);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Request error:', error.message);
      resolve(false);
    });

    req.write(JSON.stringify(testUser));
    req.end();
  });
};

// Run the test
testRegistration().then((success) => {
  if (success) {
    console.log('\n🎉 Registration validation is working correctly!');
  } else {
    console.log('\n⚠️ Registration validation still has issues.');
  }
  process.exit(0);
}); 
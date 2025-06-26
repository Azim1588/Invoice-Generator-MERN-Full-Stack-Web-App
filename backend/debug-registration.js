const http = require('http');

const testRegistration = () => {
  const postData = JSON.stringify({
    name: 'Debug User',
    email: 'debug@example.com',
    password: 'password123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Raw response:', data);
      try {
        const response = JSON.parse(data);
        console.log('Parsed response:', JSON.stringify(response, null, 2));
      } catch (error) {
        console.log('Could not parse JSON response');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error.message);
  });

  req.write(postData);
  req.end();
};

console.log('🔍 Debugging registration...');
testRegistration(); 
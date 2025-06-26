const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testDatabaseConnection = async () => {
  console.log('🔍 Testing database connection and User model...\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected successfully');
    
    // Test User model
    console.log('\n🧪 Testing User model...');
    
    // Check if we can create a user
    const testUser = new User({
      name: 'Test User',
      email: 'testdb@example.com',
      password: 'password123'
    });
    
    console.log('✅ User model created successfully');
    console.log('User data:', {
      name: testUser.name,
      email: testUser.email,
      hasPassword: !!testUser.password
    });
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: 'testdb@example.com' });
    if (existingUser) {
      console.log('⚠️ User with this email already exists, deleting...');
      await User.deleteOne({ email: 'testdb@example.com' });
    }
    
    // Try to save the user
    console.log('\n💾 Attempting to save user...');
    await testUser.save();
    console.log('✅ User saved successfully!');
    console.log('User ID:', testUser._id);
    
    // Test password comparison
    console.log('\n🔑 Testing password comparison...');
    const isPasswordValid = await testUser.comparePassword('password123');
    console.log('Password comparison result:', isPasswordValid);
    
    // Clean up
    console.log('\n🧹 Cleaning up...');
    await User.deleteOne({ email: 'testdb@example.com' });
    console.log('✅ Test user deleted');
    
    console.log('\n🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

testDatabaseConnection(); 
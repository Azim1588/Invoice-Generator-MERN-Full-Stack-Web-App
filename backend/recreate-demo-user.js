const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const recreateDemoUser = async () => {
  console.log('🔄 Recreating demo user...\n');
  
  try {
    await connectDB();
    
    // Delete existing demo user
    const deleteResult = await mongoose.connection.db.collection('users').deleteOne({ email: 'demo@example.com' });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing demo user(s)`);
    
    // Create new demo user with proper password hash (bypassing pre-save middleware)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);
    
    console.log('🔑 Generated password hash:', hashedPassword.substring(0, 20) + '...');
    
    const demoUser = {
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert directly into collection to bypass pre-save middleware
    const result = await mongoose.connection.db.collection('users').insertOne(demoUser);
    console.log('✅ Created new demo user with ID:', result.insertedId);
    
    // Verify the fix by testing login
    console.log('\n🔍 Verifying the fix...');
    const testUser = await mongoose.connection.db.collection('users').findOne({ email: 'demo@example.com' });
    
    if (!testUser) {
      console.log('❌ Demo user not found after creation');
      return;
    }
    
    console.log('📝 Found demo user in database');
    console.log('🔑 Password hash in DB:', testUser.password.substring(0, 20) + '...');
    
    const isPasswordValid = await bcrypt.compare('password', testUser.password);
    
    if (isPasswordValid) {
      console.log('✅ Password hash is correct!');
      console.log('\n🔑 Demo Account Credentials:');
      console.log('Email: demo@example.com');
      console.log('Password: password');
      console.log('\n🎉 Demo user is ready for login!');
    } else {
      console.log('❌ Password hash is still incorrect');
      console.log('🔍 Debug info:');
      console.log('  - Stored hash:', testUser.password);
      console.log('  - Expected to match: password');
    }
    
  } catch (error) {
    console.error('❌ Error recreating demo user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the recreation
recreateDemoUser(); 
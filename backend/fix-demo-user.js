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

const fixDemoUser = async () => {
  console.log('🔧 Fixing demo user...\n');
  
  try {
    await connectDB();
    
    // Find existing demo user
    const existingUser = await mongoose.connection.db.collection('users').findOne({ email: 'demo@example.com' });
    
    if (!existingUser) {
      console.log('❌ Demo user not found. Creating new one...');
      
      // Create new demo user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      
      const demoUser = {
        name: 'Demo User',
        email: 'demo@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await mongoose.connection.db.collection('users').insertOne(demoUser);
      console.log('✅ Created new demo user with ID:', result.insertedId);
    } else {
      console.log('📝 Found existing demo user, updating...');
      
      // Update existing user to match new schema
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      
      const updateResult = await mongoose.connection.db.collection('users').updateOne(
        { email: 'demo@example.com' },
        {
          $set: {
            name: 'Demo User',
            password: hashedPassword,
            updatedAt: new Date()
          },
          $unset: {
            username: "",
            firstName: "",
            lastName: "",
            role: ""
          }
        }
      );
      
      console.log('✅ Updated demo user:', updateResult.modifiedCount, 'document(s) modified');
    }
    
    // Verify the fix
    console.log('\n🔍 Verifying the fix...');
    const testUser = await mongoose.connection.db.collection('users').findOne({ email: 'demo@example.com' });
    
    if (!testUser) {
      console.log('❌ Demo user not found after fix');
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
    }
    
  } catch (error) {
    console.error('❌ Error fixing demo user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the fix
fixDemoUser(); 
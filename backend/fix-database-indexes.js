const mongoose = require('mongoose');
require('dotenv').config();

const fixDatabaseIndexes = async () => {
  console.log('🔧 Fixing database indexes...\n');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected successfully');
    
    // Get the database
    const db = mongoose.connection.db;
    
    // Drop old indexes from users collection
    console.log('\n🗑️ Dropping old indexes from users collection...');
    try {
      await db.collection('users').dropIndex('username_1');
      console.log('✅ Dropped username_1 index');
    } catch (error) {
      console.log('⚠️ username_1 index not found or already dropped');
    }
    
    try {
      await db.collection('users').dropIndex('firstName_1');
      console.log('✅ Dropped firstName_1 index');
    } catch (error) {
      console.log('⚠️ firstName_1 index not found or already dropped');
    }
    
    try {
      await db.collection('users').dropIndex('lastName_1');
      console.log('✅ Dropped lastName_1 index');
    } catch (error) {
      console.log('⚠️ lastName_1 index not found or already dropped');
    }
    
    try {
      await db.collection('users').dropIndex('role_1');
      console.log('✅ Dropped role_1 index');
    } catch (error) {
      console.log('⚠️ role_1 index not found or already dropped');
    }
    
    // Create new indexes for the current schema
    console.log('\n🔨 Creating new indexes for current schema...');
    
    // Email index (should already exist)
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('✅ Created email index');
    } catch (error) {
      console.log('⚠️ Email index already exists or error:', error.message);
    }
    
    // Name index
    try {
      await db.collection('users').createIndex({ name: 1 });
      console.log('✅ Created name index');
    } catch (error) {
      console.log('⚠️ Name index already exists or error:', error.message);
    }
    
    // List all current indexes
    console.log('\n📋 Current indexes on users collection:');
    const indexes = await db.collection('users').indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, index.key);
    });
    
    console.log('\n🎉 Database indexes fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database indexes:', error);
    console.error('Error details:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

fixDatabaseIndexes(); 
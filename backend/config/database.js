const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Check if MONGO_URI or MONGODB_URI is defined
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MONGO_URI or MONGODB_URI environment variable is not defined');
      console.error('Available environment variables:', Object.keys(process.env));
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoUri.substring(0, 20) + '...'); // Log first 20 chars for security

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 
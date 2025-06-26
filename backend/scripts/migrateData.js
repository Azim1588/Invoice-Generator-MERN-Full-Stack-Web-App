const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');

// Import JSON data
const usersData = require('../data/users.json');
const customersData = require('../data/customers.json');
const invoicesData = require('../data/invoices.json');

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

const migrateUsers = async () => {
  console.log('🔄 Migrating users...');
  
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('✅ Cleared existing users');
    
    // Migrate users from JSON
    for (const userData of usersData) {
      // Hash password if it's not already hashed
      let hashedPassword = userData.password;
      if (!userData.password.startsWith('$2a$')) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(userData.password, salt);
      }
      
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'user',
        createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date()
      });
      
      await user.save();
      console.log(`✅ Migrated user: ${user.email}`);
    }
    
    console.log(`✅ Successfully migrated ${usersData.length} users`);
  } catch (error) {
    console.error('❌ Error migrating users:', error);
    throw error;
  }
};

const migrateCustomers = async () => {
  console.log('🔄 Migrating customers...');
  
  try {
    // Clear existing customers
    await Customer.deleteMany({});
    console.log('✅ Cleared existing customers');
    
    // Get demo user for customer association
    const demoUser = await User.findOne({ email: 'demo@example.com' });
    if (!demoUser) {
      throw new Error('Demo user not found. Please run user migration first.');
    }
    
    // Migrate customers from JSON
    for (const customerData of customersData) {
      // Ensure address has required fields with defaults
      const address = {
        street: customerData.address?.street || 'Unknown Street',
        city: customerData.address?.city || 'Unknown City',
        state: customerData.address?.state || 'Unknown State',
        zipCode: customerData.address?.zipCode || '00000',
        country: customerData.address?.country || 'USA'
      };
      
      const customer = new Customer({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone || '',
        address: address,
        company: customerData.company || '',
        notes: customerData.notes || '',
        status: customerData.status || 'active',
        userId: demoUser._id
      });
      
      await customer.save();
      console.log(`✅ Migrated customer: ${customer.name}`);
    }
    
    console.log(`✅ Successfully migrated ${customersData.length} customers`);
  } catch (error) {
    console.error('❌ Error migrating customers:', error);
    throw error;
  }
};

const migrateInvoices = async () => {
  console.log('🔄 Migrating invoices...');
  
  try {
    // Clear existing invoices
    await Invoice.deleteMany({});
    console.log('✅ Cleared existing invoices');
    
    // Get demo user and customers for invoice association
    const demoUser = await User.findOne({ email: 'demo@example.com' });
    const customers = await Customer.find({ userId: demoUser._id });
    
    if (!demoUser) {
      throw new Error('Demo user not found. Please run user migration first.');
    }
    
    if (customers.length === 0) {
      throw new Error('No customers found. Please run customer migration first.');
    }
    
    // Migrate invoices from JSON
    for (const invoiceData of invoicesData) {
      // Find corresponding customer
      const customer = customers.find(c => c.email === invoiceData.customerEmail);
      if (!customer) {
        console.log(`⚠️  Customer not found for invoice ${invoiceData.invoiceNumber}, skipping...`);
        continue;
      }
      
      // Prepare items with totals
      const items = invoiceData.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice || item.price,
        total: (item.quantity * (item.unitPrice || item.price))
      }));
      
      const invoice = new Invoice({
        invoiceNumber: invoiceData.invoiceNumber,
        customerId: customer._id,
        customerName: customer.name,
        date: new Date(invoiceData.date),
        dueDate: new Date(invoiceData.dueDate),
        status: invoiceData.status,
        items: items,
        notes: invoiceData.notes,
        userId: demoUser._id
      });
      
      await invoice.save();
      console.log(`✅ Migrated invoice: ${invoice.invoiceNumber}`);
    }
    
    console.log(`✅ Successfully migrated ${invoicesData.length} invoices`);
  } catch (error) {
    console.error('❌ Error migrating invoices:', error);
    throw error;
  }
};

const createDemoData = async () => {
  console.log('🔄 Creating additional demo data...');
  
  try {
    const demoUser = await User.findOne({ email: 'demo@example.com' });
    if (!demoUser) {
      throw new Error('Demo user not found');
    }
    
    // Create additional demo customers
    const additionalCustomers = [
      {
        name: 'Tech Solutions Inc.',
        email: 'contact@techsolutions.com',
        phone: '+1-555-0123',
        address: {
          street: '456 Innovation Drive',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'USA'
        },
        company: 'Tech Solutions Inc.',
        notes: 'Software development company'
      },
      {
        name: 'Green Energy Co.',
        email: 'info@greenenergy.com',
        phone: '+1-555-0456',
        address: {
          street: '789 Renewable Way',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA'
        },
        company: 'Green Energy Co.',
        notes: 'Renewable energy solutions'
      }
    ];
    
    for (const customerData of additionalCustomers) {
      const existingCustomer = await Customer.findOne({ 
        email: customerData.email,
        userId: demoUser._id 
      });
      
      if (!existingCustomer) {
        const customer = new Customer({
          ...customerData,
          userId: demoUser._id
        });
        await customer.save();
        console.log(`✅ Created demo customer: ${customer.name}`);
      }
    }
    
    console.log('✅ Demo data creation completed');
  } catch (error) {
    console.error('❌ Error creating demo data:', error);
    throw error;
  }
};

const runMigration = async () => {
  console.log('🚀 Starting data migration from JSON to MongoDB...\n');
  
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Run migrations in order
    await migrateUsers();
    console.log('');
    
    await migrateCustomers();
    console.log('');
    
    await migrateInvoices();
    console.log('');
    
    await createDemoData();
    console.log('');
    
    console.log('🎉 Migration completed successfully!');
    console.log('\n📊 Migration Summary:');
    console.log(`- Users: ${usersData.length}`);
    console.log(`- Customers: ${customersData.length}`);
    console.log(`- Invoices: ${invoicesData.length}`);
    console.log('\n🔑 Demo Account:');
    console.log('Email: demo@example.com');
    console.log('Password: password');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration }; 
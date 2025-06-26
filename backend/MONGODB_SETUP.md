# MongoDB Setup Guide

This guide will help you set up MongoDB for your Invoice Generator application.

## Prerequisites

1. **MongoDB Installation**

   - Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud service) for easier setup

2. **Node.js Dependencies**
   - All required packages are already installed: `mongoose`, `dotenv`

## Setup Steps

### 1. Install MongoDB Locally

#### Windows:

1. Download MongoDB Community Server
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a service and start automatically
4. Default connection: `mongodb://localhost:27017`

#### macOS (using Homebrew):

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Linux (Ubuntu):

```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Environment Configuration

The `.env` file is already created with the following configuration:

```env
MONGODB_URI=mongodb://localhost:27017/invoice_generator
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### 3. Database Connection

The application will automatically:

- Connect to MongoDB when the server starts
- Create the database `invoice_generator` if it doesn't exist
- Create collections for users, customers, and invoices

### 4. Data Migration

If you have existing data in JSON files, you can migrate it to MongoDB:

```bash
npm run migrate
```

This will:

- Read existing JSON files from the `data/` directory
- Create users, customers, and invoices in MongoDB
- Preserve all relationships between data

### 5. Start the Application

```bash
npm start
# or for development
npm run dev
```

## MongoDB Atlas (Cloud Alternative)

If you prefer to use MongoDB Atlas instead of local installation:

1. **Create Atlas Account**

   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create Cluster**

   - Choose the free tier (M0)
   - Select your preferred cloud provider and region
   - Create the cluster

3. **Get Connection String**

   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update Environment**
   - Replace the `MONGODB_URI` in your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invoice_generator
   ```

## Database Schema

### Users Collection

- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password
- `firstName`, `lastName`: User's name
- `role`: User role (user/admin)
- `createdAt`, `updatedAt`: Timestamps

### Customers Collection

- `name`: Customer name
- `email`: Customer email
- `phone`: Phone number
- `address`: Embedded address object
- `company`: Company name
- `notes`: Additional notes
- `status`: Active/inactive
- `userId`: Reference to user who owns this customer
- `createdAt`, `updatedAt`: Timestamps

### Invoices Collection

- `invoiceNumber`: Unique invoice number
- `customerId`: Reference to customer
- `customerName`: Customer name (denormalized)
- `date`: Invoice date
- `dueDate`: Payment due date
- `status`: Pending/paid/overdue/cancelled
- `items`: Array of invoice items
- `subtotal`, `tax`, `total`: Calculated amounts
- `notes`: Invoice notes
- `userId`: Reference to user who owns this invoice
- `createdAt`, `updatedAt`: Timestamps

## Features

### Multi-tenant Architecture

- Each user can only see their own customers and invoices
- Data is isolated by `userId` field

### Automatic Calculations

- Invoice totals are calculated automatically
- Tax is set to 10% by default

### Data Validation

- All fields are validated using Mongoose schemas
- Required fields and data types are enforced

### Indexing

- Database indexes for faster queries
- Optimized for common search patterns

## Troubleshooting

### Connection Issues

1. **MongoDB not running**: Start MongoDB service
2. **Wrong connection string**: Check your `.env` file
3. **Network issues**: Check firewall settings

### Migration Issues

1. **No data found**: Ensure JSON files exist in `data/` directory
2. **Duplicate data**: Migration script handles duplicates safely
3. **Permission errors**: Check file permissions

### Performance

1. **Slow queries**: Check if indexes are created
2. **Memory usage**: Monitor MongoDB memory consumption
3. **Connection limits**: Adjust connection pool size if needed

## Security Considerations

1. **Change JWT Secret**: Update `JWT_SECRET` in production
2. **Database Access**: Use strong passwords for MongoDB users
3. **Network Security**: Restrict MongoDB access to your application
4. **Data Backup**: Set up regular database backups

## Production Deployment

1. **Environment Variables**: Set production values in `.env`
2. **Database**: Use MongoDB Atlas or dedicated MongoDB server
3. **SSL**: Enable SSL connections for security
4. **Monitoring**: Set up database monitoring and alerts

# 🚀 Render Backend Manual Deployment Guide

This guide provides step-by-step instructions for manually deploying your Invoice Generator backend to Render as a Web Service.

## 📋 Prerequisites

- [Render Account](https://render.com/signup) (Free tier available)
- [GitHub Account](https://github.com)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (for database)
- Your project pushed to GitHub: `https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App.git`

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Sign up for a free account**
3. **Create a new project**

### 1.2 Create Database Cluster

1. **Click "Build a Database"**
2. **Choose "FREE" tier (M0)**
3. **Select your preferred cloud provider and region**
4. **Click "Create"**

### 1.3 Set Up Database Access

1. **Go to "Database Access"**
2. **Click "Add New Database User"**
3. **Create a user:**
   ```
   Username: invoice-user
   Password: your_secure_password
   Role: Atlas admin
   ```
4. **Click "Add User"**

### 1.4 Set Up Network Access

1. **Go to "Network Access"**
2. **Click "Add IP Address"**
3. **Click "Allow Access from Anywhere" (0.0.0.0/0)**
4. **Click "Confirm"**

### 1.5 Get Connection String

1. **Go to "Database"**
2. **Click "Connect"**
3. **Choose "Connect your application"**
4. **Copy the connection string**
5. **Replace `<password>` with your actual password**
6. **Replace `<dbname>` with `invoice-app`**

Your connection string should look like:

```
mongodb+srv://invoice-user:your_password@cluster.mongodb.net/invoice-app?retryWrites=true&w=majority
```

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. **Go to [Render.com](https://render.com)**
2. **Sign up/Login with GitHub**
3. **Click "New +" → "Web Service"**

### 2.2 Connect Repository

1. **Connect your GitHub repository:**
   - Repository: `https://github.com/Azim1588/Invoice-Generator-MERN-Full-Stack-Web-App.git`
   - Branch: `master`

### 2.3 Configure Service Settings

**Basic Settings:**

```
Name: invoice-backend
Environment: Node
Region: Choose closest to you
Branch: master
Root Directory: (leave empty)
```

**Build & Deploy Settings:**

```
Build Command: cd backend && npm install
Start Command: cd backend && npm start
```

### 2.4 Add Environment Variables

Click "Advanced" → "Add Environment Variable" and add:

```
NODE_ENV = production
PORT = 5000
MONGO_URI = mongodb+srv://invoice-user:your_password@cluster.mongodb.net/invoice-app?retryWrites=true&w=majority
JWT_SECRET = your_super_secure_jwt_secret_key_here_make_it_long_and_random
FRONTEND_URL = https://invoice-frontend.onrender.com
```

**Important Notes:**

- Replace `your_password` with your actual MongoDB password
- Replace `cluster.mongodb.net` with your actual cluster URL
- Generate a strong JWT_SECRET (you can use a password generator)
- Update `FRONTEND_URL` after you deploy your frontend

### 2.5 Deploy Backend

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 2-5 minutes)
3. **Copy your backend URL** (e.g., `https://invoice-backend.onrender.com`)

## 🧪 Step 3: Test Your Backend

### 3.1 Health Check

Visit your backend URL + `/api/health`:

```
https://invoice-backend.onrender.com/api/health
```

You should see:

```json
{
  "success": true,
  "message": "Invoice Generator API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3.2 Test API Endpoints

You can test other endpoints using tools like Postman or curl:

```bash
# Test registration
curl -X POST https://invoice-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST https://invoice-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔧 Step 4: Monitor and Debug

### 4.1 Check Service Status

1. **Go to your Render dashboard**
2. **Click on your backend service**
3. **Check the status** (should show "Live")

### 4.2 View Logs

1. **Click "Logs" tab**
2. **Look for any error messages**
3. **Check build logs and runtime logs**

### 4.3 Common Issues and Solutions

#### Build Failures

**Check:**

- All dependencies are in `package.json`
- Build command is correct: `cd backend && npm install`
- No syntax errors in your code

#### Database Connection Issues

**Check:**

- `MONGO_URI` is correct
- MongoDB Atlas network access allows `0.0.0.0/0`
- Database user credentials are correct
- Database cluster is running

#### Port Issues

**Check:**

- `PORT` environment variable is set to `5000`
- Backend code uses `process.env.PORT || 5000`

#### CORS Issues

**Check:**

- `FRONTEND_URL` is set correctly
- Backend CORS configuration allows your frontend domain

## 🔄 Step 5: Continuous Deployment

### 5.1 Automatic Deployments

Render automatically redeploys when you push to your main branch:

```bash
git add .
git commit -m "feat: new feature"
git push origin master
```

### 5.2 Manual Deployments

1. **Go to your service dashboard**
2. **Click "Manual Deploy"**
3. **Select branch to deploy**

## 📊 Step 6: Environment Variables Management

### 6.1 Update Environment Variables

1. **Go to your service dashboard**
2. **Click "Environment" tab**
3. **Add or update variables**
4. **Click "Save Changes"**
5. **Redeploy the service**

### 6.2 Important Environment Variables

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-frontend-domain.onrender.com
```

## 🛠️ Troubleshooting

### Debug Steps

1. **Check Render Logs:**

   - Go to service dashboard
   - Click "Logs" tab
   - Look for error messages

2. **Test Database Connection:**

   ```bash
   # Check if MongoDB is accessible
   curl https://invoice-backend.onrender.com/api/health
   ```

3. **Verify Environment Variables:**

   - Go to service dashboard
   - Click "Environment" tab
   - Verify all variables are set

4. **Check Build Process:**
   - Look at build logs
   - Ensure all dependencies install correctly
   - Check for any build errors

### Common Error Messages

#### "Module not found"

**Solution:** Check if all dependencies are in `package.json`

#### "MongoDB connection failed"

**Solution:** Verify `MONGO_URI` and network access

#### "Port already in use"

**Solution:** Ensure `PORT` is set to `5000`

#### "JWT_SECRET not defined"

**Solution:** Add `JWT_SECRET` environment variable

## 📈 Performance Optimization

### Render Features

1. **Auto-scaling** (if needed)
2. **Health checks**
3. **Performance monitoring**
4. **SSL certificates** (automatic)

### Optimization Tips

1. **Use production mode** (`NODE_ENV=production`)
2. **Optimize database queries**
3. **Enable compression**
4. **Monitor performance metrics**

## 🌐 Custom Domains

### Adding Custom Domain

1. **Go to your service dashboard**
2. **Navigate to "Settings" → "Domains"**
3. **Add your custom domain**
4. **Configure DNS settings**

### SSL Certificates

- Render automatically provides SSL certificates
- Custom domains get free SSL
- HTTPS is enabled by default

## 🎉 Success!

Your backend is now deployed with:

- **URL**: `https://invoice-backend.onrender.com`
- **Database**: MongoDB Atlas
- **Automatic deployments** on every push
- **SSL certificates** enabled
- **Performance monitoring**

## 📞 Support

- **Render Documentation**: https://render.com/docs
- **Render Support**: https://render.com/support
- **MongoDB Atlas Help**: https://docs.atlas.mongodb.com

---

**Deployment Method**: ✅ Manual Backend Deployment
**Status**: ✅ Ready for Production
**Last Updated**: 2024

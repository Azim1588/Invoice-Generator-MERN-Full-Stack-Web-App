# 🔧 MongoDB Connection Fix Guide

This guide will help you fix the "MONGO_URI is undefined" error when deploying your backend to Render.

## 🚨 Error Message

```
Error connecting to MongoDB: The `uri` parameter to `openUri()` must be a string, got "undefined".
Make sure the first parameter to `mongoose.connect()` or `mongoose.createConnection()` is a string.
```

## 🔍 Root Cause

The `MONGO_URI` environment variable is not being set correctly in Render.

## 🛠️ Step-by-Step Fix

### Step 1: Check Environment Variables in Render

1. **Go to your Render dashboard**
2. **Click on your backend service**
3. **Go to "Environment" tab**
4. **Check if `MONGO_URI` is listed**

### Step 2: Add/Update MONGO_URI Environment Variable

If `MONGO_URI` is missing or incorrect:

1. **Click "Add Environment Variable"**
2. **Set the following:**
   ```
   Key: MONGO_URI
   Value: mongodb+srv://invoice-user:your_password@cluster.mongodb.net/invoice-app?retryWrites=true&w=majority
   ```

**Important:** Replace the following in the connection string:

- `your_password` with your actual MongoDB password
- `cluster.mongodb.net` with your actual cluster URL

### Step 3: Verify Your MongoDB Atlas Setup

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Click "Connect" on your cluster**
3. **Choose "Connect your application"**
4. **Copy the connection string**
5. **Replace `<password>` with your actual password**
6. **Replace `<dbname>` with `invoice-app`**

### Step 4: Test the Connection String

Your connection string should look like this:

```
mongodb+srv://invoice-user:your_actual_password@cluster0.abc123.mongodb.net/invoice-app?retryWrites=true&w=majority
```

### Step 5: Redeploy Your Service

1. **Save the environment variable**
2. **Go to "Manual Deploy"**
3. **Click "Deploy latest commit"**
4. **Wait for deployment to complete**

## 🔍 Debugging Steps

### Check Render Logs

1. **Go to your service dashboard**
2. **Click "Logs" tab**
3. **Look for these messages:**
   - "MONGO_URI environment variable is not defined"
   - "Available environment variables: [...]"
   - "Attempting to connect to MongoDB..."

### Verify Environment Variables

The logs will show you what environment variables are available. You should see:

- `MONGO_URI`
- `NODE_ENV`
- `PORT`
- `JWT_SECRET`
- `FRONTEND_URL`

## 🚨 Common Issues and Solutions

### Issue 1: MONGO_URI is not in the list

**Solution:** Add the environment variable in Render dashboard

### Issue 2: MONGO_URI value is incorrect

**Solution:** Update with the correct MongoDB connection string

### Issue 3: MongoDB Atlas network access

**Solution:** Ensure network access allows `0.0.0.0/0`

### Issue 4: Database user credentials

**Solution:** Verify username and password in MongoDB Atlas

## 📋 Complete Environment Variables Checklist

Make sure you have ALL these variables set in Render:

```
NODE_ENV = production
PORT = 5000
MONGO_URI = mongodb+srv://invoice-user:your_password@cluster.mongodb.net/invoice-app?retryWrites=true&w=majority
JWT_SECRET = your_super_secure_jwt_secret_key_here_make_it_long_and_random
FRONTEND_URL = https://invoice-frontend.onrender.com
```

## 🧪 Testing the Fix

After redeploying, test your backend:

1. **Visit your health check endpoint:**

   ```
   https://your-backend.onrender.com/api/health
   ```

2. **You should see:**

   ```json
   {
     "success": true,
     "message": "Invoice Generator API is running",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

3. **Check the logs for:**
   - "Attempting to connect to MongoDB..."
   - "MongoDB Connected: [hostname]"

## 🔄 Alternative: Use Render's MongoDB

If you prefer to use Render's managed MongoDB:

1. **Go to Render dashboard**
2. **Click "New +" → "PostgreSQL" or "MongoDB"**
3. **Create a new database**
4. **Copy the connection string**
5. **Use that as your MONGO_URI**

## 📞 Still Having Issues?

If the problem persists:

1. **Check Render logs** for detailed error messages
2. **Verify MongoDB Atlas** cluster is running
3. **Test connection string** locally
4. **Contact Render support** if needed

## 🎉 Success Indicators

You'll know it's working when:

- ✅ Health check returns success
- ✅ Logs show "MongoDB Connected"
- ✅ No "undefined" errors
- ✅ API endpoints respond correctly

---

**Status**: ✅ Ready to Fix MongoDB Connection
**Last Updated**: 2024

# Quick Start Guide - Connect to Azure Database

## ✅ What I Just Fixed

I've updated your application to connect to Azure SQL Database instead of using localStorage. Now when you:
- Register a new user → It saves to Azure database
- Create a course → It saves to Azure database  
- Enroll in a course → It saves to Azure database
- Update/Delete anything → It updates Azure database

## 🚀 How to Use

### Step 1: Make Sure Server is Running

The server should be starting now. Check if you see:
```
Server is running on http://localhost:3000
Connected to Azure SQL Database
```

If not, open a terminal and run:
```bash
cd "C:\Users\User 1\OneDrive - UMPSA\Desktop\kerja\cloud\project cloud"
node server.js
```

### Step 2: Open Your Application

1. Open `index.html` in your browser
2. OR go to: `http://localhost:3000`

### Step 3: Test It!

1. **Register a new user:**
   - Click "Register here"
   - Fill in the form
   - Click "Register"
   - ✅ Check Azure Query Editor: `SELECT * FROM users;` - you should see your new user!

2. **Login:**
   - Use your new credentials or default ones:
     - Educator: `educator@edufairuzullah.com` / `password123`
     - Learner: `learner@edufairuzullah.com` / `password123`

3. **Create a course (as Educator):**
   - Click "+ Create New Course"
   - Fill in the form
   - Click "Save Course"
   - ✅ Check Azure: `SELECT * FROM courses;` - you should see your course!

## 🔍 Verify in Azure

After registering a new user, run this in Azure Query Editor:
```sql
SELECT * FROM users;
```

You should see your new user in the database!

## ⚠️ Troubleshooting

### "Error loading..." messages
- **Solution:** Make sure the server is running (`node server.js`)

### "Failed to fetch" errors
- **Solution:** Check if server is running on port 3000
- Check browser console (F12) for detailed errors

### Database connection errors
- **Solution:** 
  - Check `db.js` has correct credentials
  - Verify Azure SQL Database firewall allows your IP
  - Make sure database tables exist (run `database.sql`)

## 📝 What Changed

- ✅ `app.js` - Now uses API calls instead of localStorage
- ✅ `educator.html` - Updated to use async API calls
- ✅ `learner.html` - Updated to use async API calls
- ✅ All CRUD operations now connect to Azure SQL Database

## 🎉 You're All Set!

Now everything you do in the application will be saved to your Azure SQL Database. Try registering a new user and check Azure to see it appear!



# Troubleshooting Guide - Login/Registration Issues

## 🔴 "Failed to create user" or "Login failed" Error

### Quick Fix Steps:

### 1. **Check if Server is Running** ⚠️ MOST COMMON ISSUE

Open a terminal/command prompt and run:
```bash
cd "C:\Users\User 1\OneDrive - UMPSA\Desktop\kerja\cloud\project cloud"
node server.js
```

You should see:
```
Server is running on http://localhost:3000
Connected to Azure SQL Database
```

**If you see database connection errors**, check the next steps.

---

### 2. **Check Database Connection**

The server needs to connect to Azure SQL Database. Check:

#### A. Database Credentials
- Open `db.js` and verify:
  - Server name is correct
  - Database name is correct
  - Username and password are correct

#### B. Azure Firewall Rules
- Go to Azure Portal → SQL Server → Networking
- Make sure your IP address is allowed
- OR check "Allow Azure services and resources to access this server"

#### C. Test Database Connection
Run this in Azure Query Editor:
```sql
SELECT * FROM users;
```
If this works, your database is accessible.

---

### 3. **Check Browser Console**

1. Open your browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to register/login again
5. Look for error messages

Common errors:
- `Failed to fetch` → Server not running
- `CORS error` → Server CORS not configured (should be fixed)
- `Network error` → Server not accessible

---

### 4. **Verify Server is Accessible**

Open your browser and go to:
```
http://localhost:3000/api/users
```

You should see a JSON response with users (or empty array `[]`).

If you see "This site can't be reached":
- Server is not running
- Start it with `node server.js`

---

### 5. **Check Port 3000 is Available**

If port 3000 is already in use:
1. Find what's using it:
   ```bash
   netstat -ano | findstr :3000
   ```
2. Change port in `server.js`:
   ```javascript
   const PORT = process.env.PORT || 3001; // Change to 3001
   ```
3. Update `app.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:3001/api'; // Change to 3001
   ```

---

### 6. **Database Tables Exist?**

Make sure you've run the database setup:
1. Go to Azure Query Editor
2. Run the script from `database.sql`
3. Verify tables exist:
   ```sql
   SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
   ```

---

## ✅ Step-by-Step Fix

1. **Start the server:**
   ```bash
   node server.js
   ```

2. **Wait for:**
   ```
   Connected to Azure SQL Database
   Server is running on http://localhost:3000
   ```

3. **Open browser:**
   - Go to `http://localhost:3000`
   - OR open `index.html` directly

4. **Try registering:**
   - Fill in the form
   - Click Register
   - Should see "Registration successful!"

5. **Check Azure:**
   ```sql
   SELECT * FROM users;
   ```
   Your new user should appear!

---

## 🆘 Still Not Working?

### Check Server Logs

Look at the terminal where `node server.js` is running. You should see:
- Connection messages
- Error messages (if any)
- Request logs

### Common Error Messages:

**"Database connection error"**
- Check `db.js` credentials
- Check Azure firewall rules
- Verify database server is running

**"Cannot find module 'mssql'"**
- Run: `npm install`

**"Port 3000 already in use"**
- Change port (see step 5 above)
- Or stop the other application using port 3000

**"ECONNREFUSED"**
- Server is not running
- Start it with `node server.js`

---

## 📞 Quick Test

Run this in your browser console (F12):
```javascript
fetch('http://localhost:3000/api/users')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

If you see an array (even if empty), the server is working!
If you see an error, the server is not running or not accessible.

---

## 🎯 Most Likely Issue

**90% of the time**, the issue is:
- ❌ Server is not running
- ✅ **Solution:** Run `node server.js` in terminal

Make sure the terminal stays open while using the application!



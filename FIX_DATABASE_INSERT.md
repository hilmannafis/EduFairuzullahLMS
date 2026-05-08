# Fix Database Insert Issues - Complete Guide

## ✅ What I Just Fixed

1. **Connection checking** - Server now waits for database connection before handling requests
2. **Better error messages** - Shows actual database errors instead of generic messages
3. **Input validation** - Validates data before inserting
4. **Connection pooling** - Properly checks if pool is connected before use
5. **Detailed logging** - Shows exactly what's happening in server console

---

## 🔍 Step 1: Test Database Connection

Run this command to test if your database connection works:

```bash
node test-db-connection.js
```

### ✅ If it works, you'll see:
```
✅ Connected to Azure SQL Database successfully!
✅ Query test successful!
✅ INSERT test successful!
🎉 All tests passed!
```

### ❌ If it fails, you'll see:
```
❌ Connection failed!
Error: [specific error message]
```

**Common errors and fixes:**

#### Error: "Login failed for user"
- **Fix:** Check credentials in `db.js`
- Verify username and password are correct

#### Error: "Cannot open server"
- **Fix:** Check Azure firewall rules
- Go to Azure Portal → SQL Server → Networking
- Add your current IP address
- OR enable "Allow Azure services"

#### Error: "Timeout"
- **Fix:** Your IP is blocked by firewall
- Add your IP to firewall rules in Azure

---

## 🚀 Step 2: Start the Server

After connection test passes:

```bash
node server.js
```

You should see:
```
✅ Connected to Azure SQL Database
Server is running on http://localhost:3000
```

**Keep this window open!**

---

## 🧪 Step 3: Test Registration

1. Open browser: `http://localhost:3000`
2. Click "Register here"
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Role: Educator
4. Click "Register"

### Check Server Console

You should see in the server terminal:
```
✅ User registered successfully: test@example.com
```

### If you see errors:

**"Database not connected"**
- Server didn't connect to database
- Check `test-db-connection.js` output
- Fix firewall/credentials issues

**"Email already registered"**
- That email exists in database
- Try a different email

**"Database connection timeout"**
- Azure firewall blocking your IP
- Add your IP in Azure Portal

---

## 🔍 Step 4: Verify in Azure

After registering, check Azure Query Editor:

```sql
SELECT * FROM users ORDER BY id DESC;
```

You should see your new user!

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Database not connected"

**Symptoms:**
- Server shows "❌ Database connection error"
- Registration/login fails immediately

**Solutions:**
1. Check Azure firewall:
   - Azure Portal → SQL Server → Networking
   - Add your current IP address
   - Click "Save"

2. Test connection:
   ```bash
   node test-db-connection.js
   ```

3. Check credentials in `db.js`:
   - Server name correct?
   - Database name correct?
   - Username/password correct?

---

### Issue 2: "Failed to create user" (but connection works)

**Symptoms:**
- Connection test passes
- But registration still fails

**Solutions:**
1. Check server console for detailed error
2. Common causes:
   - Email already exists (try different email)
   - Table doesn't exist (run `database.sql`)
   - Missing fields in form

---

### Issue 3: "Timeout" errors

**Symptoms:**
- Connection works sometimes
- But times out during insert

**Solutions:**
1. Check Azure firewall rules
2. Your IP might have changed
3. Add current IP again
4. Enable "Allow Azure services" as backup

---

## 📋 Checklist

Before trying to register:

- [ ] Database connection test passes (`node test-db-connection.js`)
- [ ] Server is running (`node server.js`)
- [ ] Server shows "✅ Connected to Azure SQL Database"
- [ ] Azure firewall allows your IP
- [ ] Database tables exist (run `database.sql` if not)
- [ ] Browser can access `http://localhost:3000/api/users`

---

## 🎯 Quick Diagnostic

Run these in order:

1. **Test connection:**
   ```bash
   node test-db-connection.js
   ```
   Should show: ✅ All tests passed!

2. **Start server:**
   ```bash
   node server.js
   ```
   Should show: ✅ Connected to Azure SQL Database

3. **Test API:**
   Open browser: `http://localhost:3000/api/users`
   Should show: `[]` or list of users

4. **Try registration:**
   - Fill form and submit
   - Check server console for ✅ or ❌ message
   - Check Azure Query Editor for new user

---

## 🆘 Still Not Working?

### Check Server Console

Look at the terminal where `node server.js` is running. You'll see detailed error messages:

- **✅ Success:** "User registered successfully: email@example.com"
- **❌ Error:** "Error creating user: [specific error]"

### Check Browser Console

Press F12 in browser, go to Console tab, look for:
- Network errors
- API errors
- Connection errors

### Check Azure Query Editor

Run:
```sql
SELECT * FROM users;
```

If you see users but registration still fails, it might be:
- Duplicate email
- Form validation issue
- Frontend not calling API correctly

---

## 📞 Need More Help?

Share these details:
1. Output of `node test-db-connection.js`
2. Server console output when trying to register
3. Browser console errors (F12)
4. Azure Query Editor result for `SELECT * FROM users;`

This will help identify the exact issue!



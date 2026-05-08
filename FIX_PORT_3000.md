# Fix "Port 3000 Already in Use" Error

## ✅ What I Just Did

I killed the process that was using port 3000. The server should now start successfully!

---

## 🚀 Quick Fix Methods

### Method 1: Use the Batch File (Easiest)

**Double-click:** `KILL_PORT_3000.bat`

This will automatically:
- Find the process using port 3000
- Kill it
- Free up the port

Then start the server:
```bash
node server.js
```

---

### Method 2: Manual Fix

#### Step 1: Find the Process
```powershell
netstat -ano | findstr :3000
```

Look for the PID (Process ID) in the last column.

#### Step 2: Kill the Process
```powershell
taskkill /PID [PID_NUMBER] /F
```

Replace `[PID_NUMBER]` with the actual PID you found.

#### Step 3: Verify Port is Free
```powershell
netstat -ano | findstr :3000
```

Should return nothing (port is free).

#### Step 4: Start Server
```bash
node server.js
```

---

## 🔍 Why This Happens

Port 3000 was already in use because:
- You started the server before and it's still running
- Another application is using port 3000
- A previous server instance didn't close properly

---

## 💡 Prevention Tips

### Tip 1: Always Stop Server Properly
- Press `Ctrl+C` in the terminal to stop the server
- Don't just close the terminal window

### Tip 2: Check Before Starting
Before starting the server, check if port is in use:
```powershell
netstat -ano | findstr :3000
```

If you see output, kill the process first.

### Tip 3: Use Different Port
If port 3000 is always busy, change it in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change to 3001
```

And update `app.js`:
```javascript
const API_BASE_URL = 'http://localhost:3001/api'; // Change to 3001
```

---

## ✅ Server Should Now Start

The server is starting in the background. You should see:
```
✅ Connected to Azure SQL Database
Server is running on http://localhost:3000
```

---

## 🧪 Test It

1. **Check if server is running:**
   - Open browser: `http://localhost:3000/api/users`
   - Should see JSON response

2. **Try registration:**
   - Go to: `http://localhost:3000`
   - Register a new user
   - Should work now!

---

## 🆘 If It Still Fails

### Check if Port is Still in Use:
```powershell
netstat -ano | findstr :3000
```

If you see output, kill the process again.

### Check Server Logs:
Look at the terminal where you ran `node server.js` for error messages.

### Try Different Port:
Change to port 3001 (see Tip 3 above).

---

## 📋 Quick Reference

**Kill process on port 3000:**
```powershell
# Find PID
netstat -ano | findstr :3000

# Kill it (replace PID with actual number)
taskkill /PID [PID] /F
```

**Or use the batch file:**
- Double-click `KILL_PORT_3000.bat`

**Then start server:**
```bash
node server.js
```

---

**The server should now be running! Try accessing `http://localhost:3000`** 🎉



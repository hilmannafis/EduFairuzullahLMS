# How to Start the Server - Simple Guide

## 🚀 Method 1: Double-Click (Easiest!)

1. **Double-click** the file: `START_SERVER.bat`
2. A window will open showing the server starting
3. You should see:
   ```
   Server is running on http://localhost:3000
   Connected to Azure SQL Database
   ```
4. **Keep this window open** while using the application
5. To stop the server, close this window or press `Ctrl+C`

---

## 🖥️ Method 2: Using Command Prompt/Terminal

### Step 1: Open Terminal
- Press `Windows Key + R`
- Type: `cmd` or `powershell`
- Press Enter

### Step 2: Navigate to Project Folder
```bash
cd "C:\Users\User 1\OneDrive - UMPSA\Desktop\kerja\cloud\project cloud"
```

### Step 3: Start Server
```bash
node server.js
```

### Step 4: You Should See
```
Server is running on http://localhost:3000
Connected to Azure SQL Database
```

**Keep this terminal window open!**

---

## ⚠️ Important Notes

### ✅ What You Should See:
```
Server is running on http://localhost:3000
Connected to Azure SQL Database
```

### ❌ What NOT to Do:
- **DON'T** copy-paste "Server is running..." as a command
- **DON'T** close the terminal window while using the app
- **DON'T** run multiple servers at the same time

### ✅ What TO Do:
- **DO** keep the terminal window open
- **DO** wait for "Connected to Azure SQL Database" message
- **DO** use the application in a separate browser window

---

## 🔍 Check if Server is Running

### Test 1: Open in Browser
Go to: `http://localhost:3000/api/users`

You should see JSON data (even if it's just `[]`)

### Test 2: Check Terminal
The terminal should show the server messages and stay open (not close immediately)

---

## 🆘 Troubleshooting

### "node is not recognized"
- **Solution:** Install Node.js from https://nodejs.org
- Restart your computer after installation

### "Cannot find module 'express'"
- **Solution:** Run: `npm install`
- Then try `node server.js` again

### "Port 3000 already in use"
- **Solution:** Close other applications using port 3000
- Or change the port in `server.js`

### Server starts but closes immediately
- **Solution:** Check for errors in the terminal
- Make sure database connection is working
- Check `db.js` has correct credentials

---

## 📝 Quick Checklist

Before using the application:
- [ ] Server terminal is open
- [ ] You see "Server is running on http://localhost:3000"
- [ ] You see "Connected to Azure SQL Database"
- [ ] Terminal window stays open (doesn't close)
- [ ] Browser can access `http://localhost:3000/api/users`

---

## 🎯 Once Server is Running

1. Open your browser
2. Go to: `http://localhost:3000`
3. OR open `index.html` directly
4. Try registering/login
5. It should work now! ✨

---

**Remember:** The server must be running for the application to work. Keep the terminal window open!



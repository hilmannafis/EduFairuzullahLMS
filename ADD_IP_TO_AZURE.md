# How to Add Your IP to Azure Firewall - Step by Step

## 🎯 Quick Fix (2 minutes)

### Step 1: Click the Auto-Detected IP Button
In Azure Portal, you should see a button:
**"+ Add your client IPv4 address (103.53.34.212)"**

1. **Click this button** - It will automatically add your current IP
2. This creates a firewall rule for `103.53.34.212`

### Step 2: Also Add the Other IP (to be safe)
Since the test showed `103.53.34.200`, let's add that too:

1. Click **"+ Add a firewall rule"**
2. Fill in:
   - **Rule name:** `MyIP_103_53_34_200`
   - **Start IPv4 address:** `103.53.34.200`
   - **End IPv4 address:** `103.53.34.200`
3. Click **OK**

### Step 3: Add IP Range (Recommended)
To cover all IPs in your range, add this:

1. Click **"+ Add a firewall rule"**
2. Fill in:
   - **Rule name:** `MyIPRange_103_53_34`
   - **Start IPv4 address:** `103.53.34.0`
   - **End IPv4 address:** `103.53.34.255`
3. Click **OK**

This covers all IPs from 103.53.34.0 to 103.53.34.255 (your entire subnet)

### Step 4: Save
1. Scroll down to the bottom
2. Click **"Save"** button
3. Wait 1-2 minutes for changes to take effect

---

## ✅ After Saving

### Test Connection Again:
```bash
node test-db-connection.js
```

You should now see:
```
✅ Connected to Azure SQL Database successfully!
🎉 All tests passed!
```

---

## 🔄 Alternative: Use IP Range (Easier)

Instead of adding individual IPs, add a range:

1. Click **"+ Add a firewall rule"**
2. Fill in:
   - **Rule name:** `MyNetworkRange`
   - **Start IPv4 address:** `103.53.34.0`
   - **End IPv4 address:** `103.53.34.255`
3. Click **OK**
4. Click **"Save"**

This covers your entire network range, so even if your IP changes slightly, it will still work!

---

## 📋 What You Should See After Adding

Your firewall rules table should show:
- `ClientIPAddress_2026-1-4_20-19-30` - 14.1.187.65
- `ClientIPAddress_2026-1-6_2-5-13` - 103.53.34.212
- `MyIP_103_53_34_200` - 103.53.34.200 (new)
- `MyIPRange_103_53_34` - 103.53.34.0 to 103.53.34.255 (new)

---

## ⚠️ Important Notes

1. **Wait 1-2 minutes** after saving for changes to take effect
2. **Keep "Allow Azure services" checked** - This helps with Azure-hosted services
3. **Your IP might change** - If you're on a dynamic IP, it might change. Using a range helps.

---

## 🧪 Test After Adding IPs

1. Wait 2 minutes after saving
2. Run: `node test-db-connection.js`
3. Should see: ✅ All tests passed!
4. Start server: `node server.js`
5. Try registration - should work now!

---

## 🆘 Still Not Working?

If it still fails after adding IPs:

1. **Check your current IP:**
   - Go to: https://whatismyipaddress.com
   - See what your current IP is
   - Add that specific IP to Azure

2. **Check if IP changed:**
   - Your IP might have changed since Azure detected it
   - Add the current IP shown on whatismyipaddress.com

3. **Use wider range:**
   - Add range: `103.53.0.0` to `103.53.255.255`
   - This covers a larger network (less secure but more flexible)

---

## ✅ Quick Checklist

- [ ] Clicked "+ Add your client IPv4 address (103.53.34.212)"
- [ ] Added rule for 103.53.34.200 (or added IP range)
- [ ] Clicked "Save" button
- [ ] Waited 1-2 minutes
- [ ] Ran `node test-db-connection.js` - should pass
- [ ] Started server: `node server.js`
- [ ] Tried registration - should work!

---

**After you add the IPs and save, let me know and we'll test it!** 🚀



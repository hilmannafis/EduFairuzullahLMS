# Azure SQL Database Setup - Step by Step Guide

## 🎯 Quick Setup (5 minutes)

You're in the Azure Query Editor! Follow these steps:

### Step 1: Copy the SQL Script
1. Open the file `CREATE_TABLES_AZURE.sql` in this folder
2. **Select ALL** the code (Ctrl+A, then Ctrl+C to copy)

### Step 2: Paste into Azure Query Editor
1. In the Azure Query Editor (where you are now), click in the large white text area
2. **Paste** the SQL script (Ctrl+V)

### Step 3: Run the Script
1. Click the **"Run"** button at the top (or press F5)
2. Wait for the query to complete
3. You should see "Commands completed successfully" in the Messages tab

### Step 4: Verify Tables Were Created
1. In the **Object Explorer** on the left, expand **"Tables"**
2. You should now see:
   - ✅ `users`
   - ✅ `courses`
   - ✅ `enrollments`

### Step 5: Verify Default Users
Run this query to check:
```sql
SELECT * FROM users;
```

You should see 2 users:
- Admin Educator (educator@edufairuzullah.com)
- Test Learner (learner@edufairuzullah.com)

---

## 📋 What Gets Created

### 1. **users** Table
- Stores all user accounts (educators and learners)
- Fields: id, name, email, password, role, createdAt

### 2. **courses** Table
- Stores all courses created by educators
- Fields: id, title, description, category, duration, educatorId, createdAt

### 3. **enrollments** Table
- Tracks which learners are enrolled in which courses
- Fields: id, userId, courseId, enrolledAt

### 4. **Indexes**
- Created for faster queries on educatorId, userId, and courseId

### 5. **Default Users**
- Pre-created accounts for testing:
  - Educator: educator@edufairuzullah.com / password123
  - Learner: learner@edufairuzullah.com / password123

---

## 🔍 Troubleshooting

### Error: "Cannot execute statement. It does not exist or you do not have permission"
**Solution:** Make sure you're connected to the correct database (`nafisproject1`)

### Error: "Invalid object name 'users'"
**Solution:** The table wasn't created. Check the Messages tab for errors and run the script again.

### Tables not showing in Object Explorer
**Solution:** 
1. Right-click on "Tables" → Refresh
2. Or collapse and expand the "Tables" section

### Can't see the Query Editor
**Solution:**
1. In Azure Portal, go to your SQL Database
2. Click "Query editor (preview)" in the left menu
3. You may need to authenticate again

---

## ✅ Verification Checklist

After running the script, verify:

- [ ] Tables appear in Object Explorer:
  - [ ] `users` table exists
  - [ ] `courses` table exists
  - [ ] `enrollments` table exists

- [ ] Default users exist:
  ```sql
  SELECT * FROM users;
  ```
  Should return 2 rows

- [ ] Tables are empty (except users):
  ```sql
  SELECT * FROM courses;      -- Should be empty
  SELECT * FROM enrollments;  -- Should be empty
  ```

---

## 🚀 Next Steps

Once tables are created:

1. **Test the Backend Connection:**
   ```bash
   npm start
   ```
   The server should connect to your database successfully.

2. **Test the API:**
   - Open: http://localhost:3000
   - Try logging in with the default credentials

3. **Update Frontend (Optional):**
   - The frontend currently uses localStorage
   - To use the database, update `app.js` to call the API endpoints

---

## 📞 Need Help?

If you encounter any errors:
1. Check the "Messages" tab in Query Editor for error details
2. Make sure you have the correct permissions
3. Verify you're connected to the right database
4. Try running each CREATE TABLE statement one at a time

---

**Ready?** Copy the entire `CREATE_TABLES_AZURE.sql` file and paste it into the Query Editor, then click Run! 🎉



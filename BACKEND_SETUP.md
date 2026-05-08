# Backend Setup Guide - Connecting to Azure SQL Database

This guide will help you set up a Node.js backend server to connect your LMS to Azure SQL Database.

## Prerequisites

1. **Node.js installed** - Download from [nodejs.org](https://nodejs.org) (version 14 or higher)
2. **Azure SQL Database** - Already configured (based on your db.js file)
3. **npm** - Comes with Node.js

## Step 1: Install Dependencies

Open terminal/command prompt in your project folder and run:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `mssql` - SQL Server driver
- `cors` - Enable CORS for frontend
- `body-parser` - Parse request bodies

## Step 2: Create Database Tables

1. **Connect to your Azure SQL Database:**
   - Use Azure Portal → SQL Databases → Query editor
   - Or use SQL Server Management Studio (SSMS)
   - Or use Azure Data Studio

2. **Run the SQL script:**
   - Open `database-schema.sql`
   - Copy and paste the entire script
   - Execute it to create tables

3. **Verify tables created:**
   ```sql
   SELECT * FROM users;
   SELECT * FROM courses;
   SELECT * FROM enrollments;
   ```

## Step 3: Update Frontend to Use API

The current frontend uses localStorage. You'll need to update `app.js` to call the API instead.

### Option A: Update app.js (Recommended)

Replace localStorage functions with API calls:

```javascript
// Example: Update login function
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const user = await response.json();
            setCurrentUser(user);
            window.location.href = 'dashboard.html';
        } else {
            showMessage('Invalid email or password', 'error');
        }
    } catch (error) {
        showMessage('Login failed. Please try again.', 'error');
    }
}
```

### Option B: Keep Both (Hybrid)

You can keep localStorage as fallback and add API integration gradually.

## Step 4: Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

## Step 5: Test the API

### Test Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"educator@edufairuzullah.com\",\"password\":\"password123\"}"
```

### Test Get Courses:
```bash
curl http://localhost:3000/api/courses
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Courses
- `GET /api/courses` - Get all courses (optional: `?educatorId=1`)
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Enrollments
- `GET /api/enrollments/:userId` - Get user's enrollments
- `POST /api/enrollments` - Enroll in course
- `DELETE /api/enrollments/:userId/:courseId` - Unenroll from course

## Security Considerations

⚠️ **IMPORTANT:** The current implementation has security issues for production:

1. **Password Storage:** Passwords are stored in plain text. Use bcrypt:
   ```bash
   npm install bcrypt
   ```

2. **SQL Injection:** Using parameterized queries (already done) is good, but validate all inputs.

3. **Authentication:** Implement JWT tokens for session management:
   ```bash
   npm install jsonwebtoken
   ```

4. **HTTPS:** Always use HTTPS in production.

5. **Environment Variables:** Move database credentials to environment variables:
   ```bash
   npm install dotenv
   ```
   Create `.env` file:
   ```
   DB_USER=nafis-system-server-admin
   DB_PASSWORD=Insyirah03
   DB_SERVER=nafis-system-server.database.windows.net
   DB_NAME=nafisproject1
   ```

## Deployment Options

### Option 1: Azure App Service
1. Create App Service in Azure Portal
2. Deploy via Git or Azure CLI
3. Configure connection string in App Settings

### Option 2: Azure Functions
- Serverless option
- Pay per execution

### Option 3: Azure Container Instances
- Docker container deployment

### Option 4: Virtual Machine
- Full control over environment

## Troubleshooting

### Connection Error
- Check firewall rules in Azure SQL Database
- Verify server name and credentials
- Ensure "Allow Azure services" is enabled

### Port Already in Use
```bash
# Change PORT in server.js or use environment variable
PORT=3001 npm start
```

### CORS Issues
- CORS is already enabled in server.js
- If issues persist, check browser console

### Database Connection Pool
- The pool automatically manages connections
- Adjust pool size in db.js if needed

## Next Steps

1. ✅ Set up database tables
2. ✅ Test API endpoints
3. ✅ Update frontend to use API
4. ⚠️ Implement password hashing
5. ⚠️ Add JWT authentication
6. ⚠️ Add input validation
7. ⚠️ Deploy to cloud

## Need Help?

- Check Azure SQL Database logs
- Review Node.js console output
- Test API with Postman or curl
- Check browser developer console for frontend errors



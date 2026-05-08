const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { pool, poolConnect, sql } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// Initialize database connection
let dbConnected = false;

poolConnect.then(() => {
  console.log('✅ Connected to Azure SQL Database');
  dbConnected = true;
}).catch(err => {
  console.error('❌ Database connection error:', err);
  console.error('Error details:', err.message);
  console.error('Please check:');
  console.error('1. Database credentials in db.js');
  console.error('2. Azure firewall rules (allow your IP)');
  console.error('3. Database server is running');
  dbConnected = false;
});

// Middleware to check database connection - try to reconnect if needed
app.use('/api', async (req, res, next) => {
  // Try to reconnect if not connected
  if (!dbConnected && !pool.connected) {
    try {
      await poolConnect;
      dbConnected = true;
      console.log('✅ Database reconnected on API request');
    } catch (err) {
      console.error('❌ Failed to reconnect:', err.message);
      return res.status(503).json({ 
        error: 'Database not connected. Please check server logs and Azure firewall settings.' 
      });
    }
  }
  next();
});

// API Routes

// User Routes
app.get('/api/users', async (req, res) => {
  try {
    // Ensure pool is connected
    if (!pool.connected) {
      await poolConnect;
    }

    const request = pool.request();
    const result = await request.query('SELECT id, name, email, role FROM users ORDER BY id');
    console.log(`✅ Fetched ${result.recordset.length} users`);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    console.error('Error message:', err.message);
    res.status(500).json({ error: 'Failed to fetch users: ' + err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const request = pool.request();
    request.input('id', sql.Int, req.params.id);
    const result = await request.query('SELECT id, name, email, role FROM users WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    // Ensure pool is connected
    if (!pool.connected) {
      await poolConnect;
    }

    const { name, email, password, role } = req.body;
    
    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields: name, email, password, role' });
    }

    const request = pool.request();
    request.input('name', sql.NVarChar(255), name);
    request.input('email', sql.NVarChar(255), email);
    request.input('password', sql.NVarChar(255), password);
    request.input('role', sql.NVarChar(50), role);
    
    const result = await request.query(`
      INSERT INTO users (name, email, password, role) 
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role
      VALUES (@name, @email, @password, @role)
    `);
    
    if (result.recordset && result.recordset.length > 0) {
      console.log('✅ User created successfully:', result.recordset[0].email);
      res.status(201).json(result.recordset[0]);
    } else {
      throw new Error('User created but no data returned');
    }
  } catch (err) {
    console.error('❌ Error creating user:', err);
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create user';
    if (err.message.includes('duplicate key') || err.message.includes('UNIQUE constraint')) {
      errorMessage = 'Email already exists';
    } else if (err.message.includes('timeout')) {
      errorMessage = 'Database connection timeout. Check Azure firewall rules.';
    } else if (err.message.includes('Login failed')) {
      errorMessage = 'Database authentication failed. Check credentials.';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const request = pool.request();
    request.input('id', sql.Int, req.params.id);
    request.input('name', sql.NVarChar, name);
    request.input('email', sql.NVarChar, email);
    request.input('role', sql.NVarChar, role);
    
    let query = 'UPDATE users SET name = @name, email = @email, role = @role';
    if (password) {
      request.input('password', sql.NVarChar, password);
      query += ', password = @password';
    }
    query += ' OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role WHERE id = @id';
    
    const result = await request.query(query);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const request = pool.request();
    request.input('id', sql.Int, req.params.id);
    await request.query('DELETE FROM users WHERE id = @id');
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    // Ensure pool is connected
    if (!pool.connected) {
      await poolConnect;
    }

    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const request = pool.request();
    request.input('email', sql.NVarChar(255), email);
    request.input('password', sql.NVarChar(255), password);
    
    const result = await request.query(`
      SELECT id, name, email, role 
      FROM users 
      WHERE email = @email AND password = @password
    `);
    
    if (result.recordset.length === 0) {
      console.log('❌ Login failed for:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = result.recordset[0];
    console.log('✅ Login successful for:', user.email);
    res.json(user);
  } catch (err) {
    console.error('❌ Error during login:', err);
    console.error('Error message:', err.message);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    // Ensure pool is connected
    if (!pool.connected) {
      await poolConnect;
    }

    const { name, email, password, role } = req.body;
    
    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required: name, email, password, role' });
    }
    
    // Check if user already exists
    const checkRequest = pool.request();
    checkRequest.input('email', sql.NVarChar(255), email);
    const checkResult = await checkRequest.query('SELECT id FROM users WHERE email = @email');
    
    if (checkResult.recordset.length > 0) {
      console.log('❌ Registration failed: Email already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create new user
    const request = pool.request();
    request.input('name', sql.NVarChar(255), name);
    request.input('email', sql.NVarChar(255), email);
    request.input('password', sql.NVarChar(255), password);
    request.input('role', sql.NVarChar(50), role);
    
    const result = await request.query(`
      INSERT INTO users (name, email, password, role) 
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role
      VALUES (@name, @email, @password, @role)
    `);
    
    if (result.recordset && result.recordset.length > 0) {
      console.log('✅ User registered successfully:', result.recordset[0].email);
      res.status(201).json(result.recordset[0]);
    } else {
      throw new Error('User created but no data returned');
    }
  } catch (err) {
    console.error('❌ Error during registration:', err);
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    
    // Provide more specific error messages
    let errorMessage = 'Registration failed';
    if (err.message.includes('duplicate key') || err.message.includes('UNIQUE constraint')) {
      errorMessage = 'Email already registered';
    } else if (err.message.includes('timeout')) {
      errorMessage = 'Database connection timeout. Check Azure firewall rules.';
    } else if (err.message.includes('Login failed')) {
      errorMessage = 'Database authentication failed. Check credentials in db.js';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Course Routes
app.get('/api/courses', async (req, res) => {
  try {
    const educatorId = req.query.educatorId;
    const request = pool.request();
    
    let query = 'SELECT c.*, u.name as educatorName FROM courses c LEFT JOIN users u ON c.educatorId = u.id';
    if (educatorId) {
      request.input('educatorId', sql.Int, educatorId);
      query += ' WHERE c.educatorId = @educatorId';
    }
    query += ' ORDER BY c.createdAt DESC';
    
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const request = pool.request();
    request.input('id', sql.Int, req.params.id);
    const result = await request.query(`
      SELECT c.*, u.name as educatorName 
      FROM courses c 
      LEFT JOIN users u ON c.educatorId = u.id 
      WHERE c.id = @id
    `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const { title, description, category, duration, educatorId } = req.body;
    const request = pool.request();
    request.input('title', sql.NVarChar, title);
    request.input('description', sql.NVarChar, description);
    request.input('category', sql.NVarChar, category);
    request.input('duration', sql.Int, duration);
    request.input('educatorId', sql.Int, educatorId);
    
    const result = await request.query(`
      INSERT INTO courses (title, description, category, duration, educatorId, createdAt) 
      OUTPUT INSERTED.*
      VALUES (@title, @description, @category, @duration, @educatorId, GETDATE())
    `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const { title, description, category, duration } = req.body;
    const request = pool.request();
    request.input('id', sql.Int, req.params.id);
    request.input('title', sql.NVarChar, title);
    request.input('description', sql.NVarChar, description);
    request.input('category', sql.NVarChar, category);
    request.input('duration', sql.Int, duration);
    
    const result = await request.query(`
      UPDATE courses 
      SET title = @title, description = @description, category = @category, duration = @duration
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const request = pool.request();
    request.input('id', sql.Int, req.params.id);
    
    // Delete enrollments first
    await request.query('DELETE FROM enrollments WHERE courseId = @id');
    // Then delete course
    await request.query('DELETE FROM courses WHERE id = @id');
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Enrollment Routes
app.get('/api/enrollments/:userId', async (req, res) => {
  try {
    const request = pool.request();
    request.input('userId', sql.Int, req.params.userId);
    const result = await request.query(`
      SELECT e.*, c.title as courseTitle, c.description, c.category, c.duration
      FROM enrollments e
      INNER JOIN courses c ON e.courseId = c.id
      WHERE e.userId = @userId
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching enrollments:', err);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

app.post('/api/enrollments', async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const request = pool.request();
    request.input('userId', sql.Int, userId);
    request.input('courseId', sql.Int, courseId);
    
    // Check if already enrolled
    const checkResult = await request.query(`
      SELECT id FROM enrollments WHERE userId = @userId AND courseId = @courseId
    `);
    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    
    const result = await request.query(`
      INSERT INTO enrollments (userId, courseId, enrolledAt) 
      OUTPUT INSERTED.*
      VALUES (@userId, @courseId, GETDATE())
    `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error creating enrollment:', err);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

app.delete('/api/enrollments/:userId/:courseId', async (req, res) => {
  try {
    const request = pool.request();
    request.input('userId', sql.Int, req.params.userId);
    request.input('courseId', sql.Int, req.params.courseId);
    await request.query('DELETE FROM enrollments WHERE userId = @userId AND courseId = @courseId');
    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    console.error('Error deleting enrollment:', err);
    res.status(500).json({ error: 'Failed to unenroll' });
  }
});

// ============================================
// Materials Routes
// ============================================

// Get materials (optionally by courseId)
app.get('/api/materials', async (req, res) => {
  try {
    if (!pool.connected) await poolConnect;

    const { courseId } = req.query;
    const request = pool.request();
    let query = `
      SELECT m.id, m.courseId, m.title, m.description, m.materialUrl, m.createdAt,
             c.title as courseTitle
      FROM materials m
      LEFT JOIN courses c ON m.courseId = c.id
    `;
    if (courseId) {
      request.input('courseId', sql.Int, courseId);
      query += ' WHERE m.courseId = @courseId';
    }
    query += ' ORDER BY m.createdAt DESC';

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching materials:', err);
    res.status(500).json({ error: 'Failed to fetch materials: ' + err.message });
  }
});

// Create material
app.post('/api/materials', async (req, res) => {
  try {
    if (!pool.connected) await poolConnect;

    const { courseId, title, description, materialUrl } = req.body;
    if (!courseId || !title || !materialUrl) {
      return res.status(400).json({ error: 'courseId, title, and materialUrl are required' });
    }

    const request = pool.request();
    request.input('courseId', sql.Int, courseId);
    request.input('title', sql.NVarChar(255), title);
    request.input('description', sql.NVarChar(sql.MAX), description || '');
    request.input('materialUrl', sql.NVarChar(sql.MAX), materialUrl);

    const result = await request.query(`
      INSERT INTO materials (courseId, title, description, materialUrl, createdAt)
      OUTPUT INSERTED.*
      VALUES (@courseId, @title, @description, @materialUrl, GETDATE())
    `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error creating material:', err);
    res.status(500).json({ error: 'Failed to create material: ' + err.message });
  }
});

// Delete material
app.delete('/api/materials/:id', async (req, res) => {
  try {
    if (!pool.connected) await poolConnect;

    const request = pool.request();
    request.input('id', sql.Int, req.params.id);
    await request.query('DELETE FROM materials WHERE id = @id');
    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting material:', err);
    res.status(500).json({ error: 'Failed to delete material: ' + err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error('💡 Solution: Run KILL_PORT_3000.bat or use:');
    console.error(`   netstat -ano | findstr :${PORT}`);
    console.error(`   taskkill /PID [PID] /F`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});


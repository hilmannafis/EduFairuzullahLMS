-- ============================================
-- EDU FAIRUZULLAH LMS - DATABASE TABLES (FIXED)
-- Run this in Azure SQL Database Query Editor
-- This version fixes the cascade path error
-- ============================================

-- Step 1: Create Users Table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('educator', 'learner')),
    createdAt DATETIME DEFAULT GETDATE()
);

-- Step 2: Create Courses Table
CREATE TABLE courses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    category NVARCHAR(100),
    duration INT NOT NULL,
    educatorId INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (educatorId) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 3: Create Enrollments Table
-- FIXED: Changed userId foreign key to NO ACTION to avoid cascade path conflict
CREATE TABLE enrollments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    enrolledAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE NO ACTION,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(userId, courseId) -- Prevent duplicate enrollments
);

-- Step 4: Create Indexes for Better Performance
CREATE INDEX idx_courses_educator ON courses(educatorId);
CREATE INDEX idx_enrollments_user ON enrollments(userId);
CREATE INDEX idx_enrollments_course ON enrollments(courseId);

-- Step 5: Insert Default Users
-- Password: password123 (in production, these should be hashed)
INSERT INTO users (name, email, password, role) VALUES
('Admin Educator', 'educator@edufairuzullah.com', 'password123', 'educator'),
('Test Learner', 'learner@edufairuzullah.com', 'password123', 'learner');

-- ============================================
-- VERIFICATION QUERIES (Run these to check)
-- ============================================

-- Check if tables were created:
-- SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Check users:
-- SELECT * FROM users;

-- Check courses (should be empty initially):
-- SELECT * FROM courses;

-- Check enrollments (should be empty initially):
-- SELECT * FROM enrollments;



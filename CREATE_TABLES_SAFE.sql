-- ============================================
-- EDU FAIRUZULLAH LMS - DATABASE TABLES (SAFE VERSION)
-- This script checks if tables exist and creates them safely
-- Run this in Azure SQL Database Query Editor
-- ============================================

-- Step 1: Drop existing tables if they exist (in reverse order due to foreign keys)
IF OBJECT_ID('enrollments', 'U') IS NOT NULL
    DROP TABLE enrollments;

IF OBJECT_ID('courses', 'U') IS NOT NULL
    DROP TABLE courses;

IF OBJECT_ID('users', 'U') IS NOT NULL
    DROP TABLE users;

-- Step 2: Create Users Table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('educator', 'learner')),
    createdAt DATETIME DEFAULT GETDATE()
);

-- Step 3: Create Courses Table
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

-- Step 4: Create Enrollments Table (FIXED - no cascade path conflict)
CREATE TABLE enrollments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    enrolledAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE NO ACTION,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(userId, courseId) -- Prevent duplicate enrollments
);

-- Step 5: Create Indexes for Better Performance
CREATE INDEX idx_courses_educator ON courses(educatorId);
CREATE INDEX idx_enrollments_user ON enrollments(userId);
CREATE INDEX idx_enrollments_course ON enrollments(courseId);

-- Step 6: Insert Default Users
-- Password: password123 (in production, these should be hashed)
INSERT INTO users (name, email, password, role) VALUES
('Admin Educator', 'educator@edufairuzullah.com', 'password123', 'educator'),
('Test Learner', 'learner@edufairuzullah.com', 'password123', 'learner');

-- ============================================
-- VERIFICATION - Run these to check
-- ============================================

-- Check tables:
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Check users:
SELECT * FROM users;



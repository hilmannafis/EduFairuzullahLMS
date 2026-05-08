-- ============================================
-- EDU FAIRUZULLAH LMS - COMPLETE DATABASE SETUP
-- Run this ONCE in Azure SQL Database Query Editor
-- This script handles everything: drops existing tables, creates new ones, and sets up default data
-- ============================================

-- ============================================
-- STEP 1: DROP EXISTING TABLES (if they exist)
-- This ensures a clean start
-- ============================================

-- Drop enrollments first (has foreign keys)
IF OBJECT_ID('enrollments', 'U') IS NOT NULL
BEGIN
    DROP TABLE enrollments;
    PRINT 'Dropped enrollments table';
END

-- Drop courses (has foreign key to users)
IF OBJECT_ID('courses', 'U') IS NOT NULL
BEGIN
    DROP TABLE courses;
    PRINT 'Dropped courses table';
END

-- Drop users last (referenced by other tables)
IF OBJECT_ID('users', 'U') IS NOT NULL
BEGIN
    DROP TABLE users;
    PRINT 'Dropped users table';
END

-- ============================================
-- STEP 2: CREATE USERS TABLE
-- ============================================

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('educator', 'learner')),
    createdAt DATETIME DEFAULT GETDATE()
);

PRINT 'Created users table';

-- ============================================
-- STEP 3: CREATE COURSES TABLE
-- ============================================

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

PRINT 'Created courses table';

-- ============================================
-- STEP 4: CREATE ENROLLMENTS TABLE
-- ============================================

CREATE TABLE enrollments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    enrolledAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE NO ACTION,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(userId, courseId) -- Prevent duplicate enrollments
);

PRINT 'Created enrollments table';

-- ============================================
-- STEP 5: CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================

CREATE INDEX idx_courses_educator ON courses(educatorId);
PRINT 'Created index: idx_courses_educator';

CREATE INDEX idx_enrollments_user ON enrollments(userId);
PRINT 'Created index: idx_enrollments_user';

CREATE INDEX idx_enrollments_course ON enrollments(courseId);
PRINT 'Created index: idx_enrollments_course';

-- ============================================
-- STEP 6: INSERT DEFAULT USERS
-- ============================================

INSERT INTO users (name, email, password, role) VALUES
('Admin Educator', 'educator@edufairuzullah.com', 'password123', 'educator'),
('Test Learner', 'learner@edufairuzullah.com', 'password123', 'learner');

PRINT 'Inserted default users';

-- ============================================
-- STEP 7: VERIFICATION
-- ============================================

-- Show all created tables
SELECT 
    'Tables Created Successfully!' AS Status,
    TABLE_NAME AS TableName
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Show default users
SELECT 
    'Default Users:' AS Info,
    id,
    name,
    email,
    role
FROM users;

-- ============================================
-- COMPLETE! Your database is ready to use.
-- ============================================
-- 
-- Login Credentials:
-- Educator: educator@edufairuzullah.com / password123
-- Learner:  learner@edufairuzullah.com / password123
--
-- ============================================



-- ============================================
-- CHECK EXISTING TABLES AND CREATE IF MISSING
-- Run this to see what tables exist, then create missing ones
-- ============================================

-- Check what tables currently exist
SELECT 
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- ============================================
-- IF TABLES DON'T EXIST, RUN THE CREATION SCRIPT BELOW
-- ============================================

-- Only create users table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        role NVARCHAR(50) NOT NULL CHECK (role IN ('educator', 'learner')),
        createdAt DATETIME DEFAULT GETDATE()
    );
    PRINT 'Users table created successfully';
END
ELSE
BEGIN
    PRINT 'Users table already exists';
END

-- Only create courses table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'courses')
BEGIN
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
    PRINT 'Courses table created successfully';
END
ELSE
BEGIN
    PRINT 'Courses table already exists';
END

-- Only create enrollments table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'enrollments')
BEGIN
    CREATE TABLE enrollments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NOT NULL,
        courseId INT NOT NULL,
        enrolledAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE NO ACTION,
        FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE(userId, courseId)
    );
    PRINT 'Enrollments table created successfully';
END
ELSE
BEGIN
    PRINT 'Enrollments table already exists';
END

-- Create indexes (will fail silently if they exist)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_courses_educator')
    CREATE INDEX idx_courses_educator ON courses(educatorId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_enrollments_user')
    CREATE INDEX idx_enrollments_user ON enrollments(userId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_enrollments_course')
    CREATE INDEX idx_enrollments_course ON enrollments(courseId);

-- Insert default users only if they don't exist
IF NOT EXISTS (SELECT * FROM users WHERE email = 'educator@edufairuzullah.com')
BEGIN
    INSERT INTO users (name, email, password, role) VALUES
    ('Admin Educator', 'educator@edufairuzullah.com', 'password123', 'educator');
    PRINT 'Default educator user created';
END

IF NOT EXISTS (SELECT * FROM users WHERE email = 'learner@edufairuzullah.com')
BEGIN
    INSERT INTO users (name, email, password, role) VALUES
    ('Test Learner', 'learner@edufairuzullah.com', 'password123', 'learner');
    PRINT 'Default learner user created';
END

-- Final verification
SELECT 'Tables created successfully!' AS Status;
SELECT * FROM users;



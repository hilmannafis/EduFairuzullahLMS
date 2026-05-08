-- Database Schema for Edu Fairuzullah LMS
-- Run this script in your Azure SQL Database to create the necessary tables

-- Users Table
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('educator', 'learner')),
    createdAt DATETIME DEFAULT GETDATE()
);

-- Courses Table
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

-- Enrollments Table
CREATE TABLE enrollments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    enrolledAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE NO ACTION,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(userId, courseId) -- Prevent duplicate enrollments
);

-- Create Indexes for better performance
CREATE INDEX idx_courses_educator ON courses(educatorId);
CREATE INDEX idx_enrollments_user ON enrollments(userId);
CREATE INDEX idx_enrollments_course ON enrollments(courseId);

-- Insert Default Users (Optional)
-- Password: password123 (in production, these should be hashed)
INSERT INTO users (name, email, password, role) VALUES
('Admin Educator', 'educator@edufairuzullah.com', 'password123', 'educator'),
('Test Learner', 'learner@edufairuzullah.com', 'password123', 'learner');


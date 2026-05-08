-- Add materials table for course resources
-- Run this in Azure SQL Query Editor

CREATE TABLE materials (
    id INT IDENTITY(1,1) PRIMARY KEY,
    courseId INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NULL,
    materialUrl NVARCHAR(MAX) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- Index for faster lookups by course
CREATE INDEX idx_materials_course ON materials(courseId);

-- Verification
-- SELECT TOP 5 * FROM materials;






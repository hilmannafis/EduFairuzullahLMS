-- Query to get all users and their passwords
-- Run this in Azure SQL Database Query Editor

SELECT 
    id,
    name,
    email,
    password,
    role,
    createdAt
FROM users
ORDER BY id;





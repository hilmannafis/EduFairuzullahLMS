@echo off
echo ========================================
echo Killing Process on Port 3000
echo ========================================
echo.

echo Finding process using port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Found process ID: %%a
    echo Killing process...
    taskkill /PID %%a /F
    echo Process killed!
)

echo.
echo Port 3000 is now free!
echo You can now start the server with: node server.js
echo.
pause



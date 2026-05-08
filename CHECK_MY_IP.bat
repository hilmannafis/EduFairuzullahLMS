@echo off
echo ========================================
echo Checking Your Current IP Address
echo ========================================
echo.
echo Your current public IP address is:
curl -s https://api.ipify.org
echo.
echo.
echo Add this IP to Azure Firewall Rules!
echo.
pause



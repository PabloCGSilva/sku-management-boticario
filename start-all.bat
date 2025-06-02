@echo off
echo Starting SKU Management System...

echo Starting API in Docker...
cd sku-api
docker-compose up -d
echo ✅ API started at http://localhost:3001

echo Starting Frontend...
cd ../sku-web
start cmd /k "npm run dev"
echo ✅ Frontend starting at http://localhost:3000

echo.
echo 🚀 System deployed!
echo Frontend: http://localhost:3000
echo API: http://localhost:3001
echo API Health: http://localhost:3001/health
echo Swagger Docs: http://localhost:3001/api-docs
echo.
pause
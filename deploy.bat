@echo off
chcp 65001 >nul
echo 🚀 开始部署消污除腐项目...

echo 📋 检查部署要求...

REM 检查 Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 请先安装 Git
    pause
    exit /b 1
)

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 请先安装 Node.js
    pause
    exit /b 1
)

echo ✅ 环境检查通过

echo 🔨 构建前端...
cd frontend

echo 📦 安装前端依赖...
call npm install
if errorlevel 1 (
    echo ❌ 前端依赖安装失败
    pause
    exit /b 1
)

echo 🔨 构建前端...
call npm run build
if errorlevel 1 (
    echo ❌ 前端构建失败
    pause
    exit /b 1
)

echo ✅ 前端构建完成
cd ..

echo 🔨 构建后端...
cd backend

echo 📦 安装后端依赖...
call npm install
if errorlevel 1 (
    echo ❌ 后端依赖安装失败
    pause
    exit /b 1
)

echo 🔨 构建后端...
call npm run build
if errorlevel 1 (
    echo ❌ 后端构建失败
    pause
    exit /b 1
)

echo ✅ 后端构建完成
cd ..

echo.
echo 🎯 部署指南
echo ================
echo.
echo 1. 🌐 前端部署 (Vercel):
echo    - 访问: https://vercel.com
echo    - 导入 frontend 目录
echo    - 设置环境变量
echo.
echo 2. ⚙️  后端部署 (Railway):
echo    - 访问: https://railway.app
echo    - 导入 backend 目录
echo    - 设置环境变量
echo.
echo 3. 🗄️  数据库部署 (Neon):
echo    - 访问: https://neon.tech
echo    - 创建 PostgreSQL 数据库
echo    - 运行数据库迁移
echo.
echo 📖 详细说明请查看 DEPLOYMENT.md 文件
echo.
pause


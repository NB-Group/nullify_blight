#!/bin/bash

echo "🚀 开始部署消污除腐项目..."

# 检查是否安装了必要的工具
check_requirements() {
    echo "📋 检查部署要求..."
    
    if ! command -v git &> /dev/null; then
        echo "❌ 请先安装 Git"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ 请先安装 Node.js"
        exit 1
    fi
    
    echo "✅ 环境检查通过"
}

# 构建前端
build_frontend() {
    echo "🔨 构建前端..."
    cd frontend
    
    if npm install; then
        echo "✅ 前端依赖安装完成"
    else
        echo "❌ 前端依赖安装失败"
        exit 1
    fi
    
    if npm run build; then
        echo "✅ 前端构建完成"
    else
        echo "❌ 前端构建失败"
        exit 1
    fi
    
    cd ..
}

# 构建后端
build_backend() {
    echo "🔨 构建后端..."
    cd backend
    
    if npm install; then
        echo "✅ 后端依赖安装完成"
    else
        echo "❌ 后端依赖安装失败"
        exit 1
    fi
    
    if npm run build; then
        echo "✅ 后端构建完成"
    else
        echo "❌ 后端构建失败"
        exit 1
    fi
    
    cd ..
}

# 显示部署说明
show_deployment_guide() {
    echo ""
    echo "🎯 部署指南"
    echo "================"
    echo ""
    echo "1. 🌐 前端部署 (Vercel):"
    echo "   - 访问: https://vercel.com"
    echo "   - 导入 frontend 目录"
    echo "   - 设置环境变量"
    echo ""
    echo "2. ⚙️  后端部署 (Railway):"
    echo "   - 访问: https://railway.app"
    echo "   - 导入 backend 目录"
    echo "   - 设置环境变量"
    echo ""
    echo "3. 🗄️  数据库部署 (Neon):"
    echo "   - 访问: https://neon.tech"
    echo "   - 创建 PostgreSQL 数据库"
    echo "   - 运行数据库迁移"
    echo ""
    echo "📖 详细说明请查看 DEPLOYMENT.md 文件"
    echo ""
}

# 主函数
main() {
    check_requirements
    build_frontend
    build_backend
    show_deployment_guide
}

# 运行主函数
main


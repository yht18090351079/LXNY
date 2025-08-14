#!/bin/bash

# 智能化PRD系统开发服务器启动脚本

echo "🚀 启动PRD系统开发服务器..."
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js"
    echo "请先安装Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到package.json文件"
    echo "请确保在正确的目录中运行此脚本"
    exit 1
fi

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已存在"
fi

# 检查端口是否被占用
PORT=3000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  警告: 端口$PORT已被占用"
    echo "请停止占用该端口的程序，或修改api-server-example.js中的端口配置"
    exit 1
fi

echo ""
echo "🌟 启动开发服务器..."
echo "📡 服务地址: http://localhost:$PORT"
echo "📝 查看版本: http://localhost:$PORT/prd-system.html"
echo "🛠️ 开发版本: http://localhost:$PORT/prd-system-dev.html"
echo ""
echo "💡 提示:"
echo "   • 开发模式已自动启用"
echo "   • 支持实时批注同步"
echo "   • 按 Ctrl+C 停止服务器"
echo ""

# 启动服务器
npm start
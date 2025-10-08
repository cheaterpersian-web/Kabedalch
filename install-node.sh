#!/bin/bash

# 🚀 Kabedalch - Node.js Installation Script
# نصب Node.js و npm

echo "🚀 Kabedalch - Node.js Installation"
echo "==================================="

# بررسی سیستم عامل
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Linux detected"
    
    # بررسی Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        echo "📦 نصب Node.js با apt..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    # بررسی CentOS/RHEL
    elif command -v yum &> /dev/null; then
        echo "📦 نصب Node.js با yum..."
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install -y nodejs
    # بررسی Arch
    elif command -v pacman &> /dev/null; then
        echo "📦 نصب Node.js با pacman..."
        sudo pacman -S nodejs npm
    else
        echo "❌ Package manager پشتیبانی نمی‌شود"
        exit 1
    fi

elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS detected"
    
    # بررسی Homebrew
    if command -v brew &> /dev/null; then
        echo "📦 نصب Node.js با Homebrew..."
        brew install node
    else
        echo "❌ Homebrew نصب نیست. لطفاً Homebrew نصب کنید."
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi

else
    echo "❌ سیستم عامل پشتیبانی نمی‌شود"
    echo "   لطفاً Node.js را دستی نصب کنید: https://nodejs.org/"
    exit 1
fi

# بررسی نصب
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo "✅ Node.js $(node -v) و npm $(npm -v) نصب شد"
    echo "🚀 حالا می‌توانید ./quick-install.sh را اجرا کنید"
else
    echo "❌ نصب Node.js ناموفق بود"
    exit 1
fi
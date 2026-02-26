#!/bin/bash

# 项目一键初始化脚本
# 用法: ./init-project.sh <project-name> [description]

set -e

PROJECT_NAME="$1"
DESCRIPTION="$2"
PROJECT_DIR="/home/lazily/projects/$PROJECT_NAME"
OBSIDIAN_VAULT="/mnt/c/Users/CF/Documents/Obsidian Vault"
GITHUB_USER="Lazily01"

if [[ -z "$PROJECT_NAME" ]]; then
  echo "错误: 请提供项目名称"
  echo "用法: $0 <project-name> [description]"
  exit 1
fi

echo "🚀 开始初始化项目: $PROJECT_NAME"
echo ""

# 1. 创建项目目录
echo "📁 创建项目目录..."
mkdir -p "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR/docs"
mkdir -p "$PROJECT_DIR/tests"
mkdir -p "$PROJECT_DIR/src"
echo "   ✅ 目录创建完成"
echo ""

# 2. 初始化 Git
echo "🔧 初始化 Git 仓库..."
cd "$PROJECT_DIR"
git init
git config user.name "lazily"
git config user.email "lazily@example.com"
echo "   ✅ Git 初始化完成"
echo ""

# 3. 创建标准文件结构
echo "📄 创建标准文件..."

# README.md
cat > "$PROJECT_DIR/README.md" << EOF
# $PROJECT_NAME

$DESCRIPTION

## 项目结构

- \`src/\` - 源代码
- \`tests/\` - 测试文件
- \`docs/\` - 项目文档

## 开发

\`\`\`bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 运行测试
npm test
\`\`\`

## 部署

\`\`\`bash
# 构建生产版本
npm run build
\`\`\`

---

*创建时间: $(date '+%Y-%m-%d %H:%M:%S')*
EOF

# .gitignore
cat > "$PROJECT_DIR/.gitignore" << EOF
# Dependencies
node_modules/

# Build output
dist/
build/
.next/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF

# package.json（如果需要）
cat > "$PROJECT_DIR/package.json" << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "description": "$DESCRIPTION",
  "scripts": {
    "dev": "echo '请配置 dev 命令'",
    "build": "echo '请配置 build 命令'",
    "test": "echo '请配置 test 命令'"
  },
  "keywords": [],
  "author": "lazily",
  "license": "MIT"
}
EOF

echo "   ✅ 标准文件创建完成"
echo ""

# 4. 第一次提交
echo "💾 创建初始提交..."
git add .
git commit -m "feat: 初始化项目 $PROJECT_NAME"
echo "   ✅ 初始提交完成"
echo ""

# 5. 创建 GitHub 仓库
echo "🌐 创建 GitHub 仓库..."
echo "   注意: 需要先登录 GitHub CLI (gh auth login)"

if command -v gh &> /dev/null; then
  gh repo create "$GITHUB_USER/$PROJECT_NAME" \
    --public \
    --description "$DESCRIPTION" \
    --source="$PROJECT_DIR" \
    --remote=origin \
    --push

  if [[ $? -eq 0 ]]; then
    echo "   ✅ GitHub 仓库创建完成"
  else
    echo "   ⚠️  GitHub 仓库创建可能失败，请手动检查"
  fi
else
  echo "   ⚠️  未安装 GitHub CLI，跳过自动创建"
  echo "   提示: 安装后运行: gh repo create $GITHUB_USER/$PROJECT_NAME --public --source='$PROJECT_DIR'"
fi
echo ""

# 6. 在 Obsidian 中创建项目记录
echo "📝 在 Obsidian 中创建项目记录..."
PROJECT_NOTE="$OBSIDIAN_VAULT/项目/${PROJECT_NAME}.md"
mkdir -p "$(dirname "$PROJECT_NOTE")"

cat > "$PROJECT_NOTE" << EOF
# 项目: $PROJECT_NAME

**创建时间:** $(date '+%Y-%m-%d %H:%M:%S')
**状态:** 🟢 活跃

## 项目描述

$DESCRIPTION

## 技术栈

- 待填写

## 项目链接

- **本地路径:** \`$PROJECT_DIR\`
- **GitHub:** https://github.com/$GITHUB_USER/$PROJECT_NAME

## 开发日志

### $(date '+%Y-%m-%d')

- 初始化项目
- 创建标准目录结构
- 配置 Git 和 GitHub

---

## TODO

- [ ] 配置开发环境
- [ ] 编写第一个功能
- [ ] 添加测试
EOF

echo "   ✅ Obsidian 记录创建完成"
echo ""

# 7. 完成
echo "✨ 项目初始化完成！"
echo ""
echo "📂 项目路径: $PROJECT_DIR"
echo "🌐 GitHub: https://github.com/$GITHUB_USER/$PROJECT_NAME"
echo "📝 Obsidian: $PROJECT_NOTE"
echo ""
echo "🚀 快速开始:"
echo "   cd $PROJECT_DIR"
echo "   # 编辑代码..."
echo "   git add . && git commit -m 'feat: xxx' && git push"

#!/bin/bash

# X 文章自动归档脚本
# 用法: ./archive-x-article.sh <x-url>

set -e

X_URL="$1"
OBSIDIAN_VAULT="/mnt/c/Users/CF/Documents/Obsidian Vault"

if [[ -z "$X_URL" ]]; then
  echo "错误: 请提供 X 文章链接"
  echo "用法: $0 <x-url>"
  exit 1
fi

# 检查 URL 格式
if [[ ! "$X_URL" =~ ^https?://(x\.com|twitter\.com)/ ]]; then
  echo "错误: 不是有效的 X/Twitter 链接"
  exit 1
fi

echo "🔍 正在获取 X 文章内容..."
# 使用 twitter-reader skill 获取内容
X_CONTENT=$(cd /home/lazily/.openclaw/workspace/skills/twitter-reader && \
  node scripts/fetch.js "$X_URL" 2>/dev/null)

if [[ -z "$X_CONTENT" ]]; then
  echo "❌ 获取文章内容失败"
  exit 1
fi

echo "🤖 正在分析文章价值..."
# 判断是否值得归档（调用 AI 分析）
ANALYSIS=$(echo "以下 X 文章，判断是否值得存入 Obsidian 知识库。
只回答：归档 或 跳过

文章内容：
$X_CONTENT" | node /home/lazily/.openclaw/workspace/scripts/ask-ai.mjs 2>/dev/null)

if [[ "$ANALYSIS" != *"归档"* ]]; then
  echo "⏭️  文章不值得归档，已跳过"
  exit 0
fi

# 提取文章 ID 用于文件名
POST_ID=$(echo "$X_URL" | grep -oP '(?<=/status/)\d+')
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FILENAME="X文章-${TIMESTAMP}-${POST_ID}.md"

# 生成归档内容
cat > "$OBSIDIAN_VAULT/X文章归档/$FILENAME" << EOF
# X 文章归档

**链接:** $X_URL
**归档时间:** $(date '+%Y-%m-%d %H:%M:%S')

---

## 文章内容

$X_CONTENT

---

## 归档理由

自动分析后决定归档
EOF

echo "✅ 已归档到 Obsidian: X文章归档/$FILENAME"

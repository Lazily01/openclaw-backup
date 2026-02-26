#!/bin/bash
# OpenClaw 每日备份脚本
# 每天 0 点打包 .openclaw 目录并上传到 GitHub
# 使用 SSH 方式推送（更安全）

set -e

BACKUP_DIR="$HOME/.openclaw-backup"
SOURCE_DIR="$HOME/.openclaw"
REPO_SSH="git@github.com:Lazily01/openclaw-backup.git"
DATE=$(date +"%Y-%m-%d")
DATETIME=$(date +"%Y-%m-%d %H:%M:%S")

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
  echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# 初始化备份目录
init_backup_dir() {
  if [ ! -d "$BACKUP_DIR" ]; then
    log "创建备份目录: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
  fi

  cd "$BACKUP_DIR"

  # 初始化 git 仓库
  if [ ! -d ".git" ]; then
    log "初始化 Git 仓库..."
    git init
    git remote add origin "$REPO_SSH" 2>/dev/null || git remote set-url origin "$REPO_SSH"

    # 设置 Git 配置
    git config user.name "Claw AI"
    git config user.email "lazily@openclaw.ai"
  fi
}

# 创建 .gitignore 排除敏感文件
create_gitignore() {
  cat > "$BACKUP_DIR/.gitignore" << 'EOF'
# ===== 敏感信息 - 绝对不提交 =====

# 凭证目录
credentials/

# 密钥文件
*.key
*.pem
*.p12
*.pfx
id_rsa*
id_ed25519*
*.pub

# API Keys 和 Tokens
.env
.env.*
*.env

# 配置文件（包含 token）
openclaw.json
openclaw.json.*
*.json.bak
*.json.bak.*

# 会话文件（包含对话内容，可能有敏感信息）
agents/*/sessions/*.jsonl
agents/*/sessions/*.jsonl.*
sessions/
*.jsonl

# Auth 配置
auth-profiles.json
auth.json
auth/*.json

# ===== 日志和临时文件 =====

logs/
*.log
tmp/
temp/
*.tmp
*.swp
*.swo
*~

# ===== 缓存和依赖 =====

cache/
*.cache
node_modules/

# ===== 数据库文件 =====

*.sqlite
*.db

# ===== 备份文件本身 =====

*.tar.gz
*.zip

# ===== 其他敏感文件 =====

device-auth.json
device.json
paired.json
pending.json
exec-approvals.json
EOF
}

# 同步文件（排除敏感信息）
sync_files() {
  log "同步文件到备份目录..."

  # 清理旧的备份
  rm -rf "$BACKUP_DIR/openclaw" 2>/dev/null || true

  # 使用 rsync 同步，排除敏感文件
  rsync -av --delete \
    --exclude 'credentials/' \
    --exclude '*.key' \
    --exclude '*.pem' \
    --exclude '*.p12' \
    --exclude '*.pfx' \
    --exclude 'id_rsa*' \
    --exclude 'id_ed25519*' \
    --exclude '.env' \
    --exclude '.env.*' \
    --exclude '*.env' \
    --exclude 'openclaw.json' \
    --exclude 'openclaw.json.*' \
    --exclude '*.json.bak' \
    --exclude '*.json.bak.*' \
    --exclude 'agents/*/sessions/*.jsonl' \
    --exclude 'agents/*/sessions/*.jsonl.*' \
    --exclude '*.jsonl' \
    --exclude 'auth-profiles.json' \
    --exclude 'auth.json' \
    --exclude 'auth/' \
    --exclude 'logs/' \
    --exclude '*.log' \
    --exclude 'tmp/' \
    --exclude 'temp/' \
    --exclude '*.tmp' \
    --exclude 'cache/' \
    --exclude '*.cache' \
    --exclude 'node_modules/' \
    --exclude '*.sqlite' \
    --exclude '*.db' \
    --exclude '.git/' \
    --exclude 'device-auth.json' \
    --exclude 'device.json' \
    --exclude 'paired.json' \
    --exclude 'pending.json' \
    --exclude 'exec-approvals.json' \
    "$SOURCE_DIR/" "$BACKUP_DIR/openclaw/" 2>/dev/null || true

  log "文件同步完成"
}

# 清理敏感信息（替换所有已知的 token 和 key）
clean_secrets() {
  log "清理敏感信息..."

  cd "$BACKUP_DIR"

  # 已知的敏感信息模式
  # GitHub Token
  find openclaw -type f \( -name "*.md" -o -name "*.txt" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) \
    -exec sed -i 's/ghp_[A-Za-z0-9_]\{36\}/[REDACTED_TOKEN]/g' {} \; 2>/dev/null || true

  # VolcEngine / 火山引擎 API Key
  find openclaw -type f \( -name "*.md" -o -name "*.txt" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) \
    -exec sed -i 's/[A-Za-z0-9]\{8\}-[A-Za-z0-9]\{4\}-[A-Za-z0-9]\{4\}-[A-Za-z0-9]\{4\}-[A-Za-z0-9]\{12\}/[REDACTED_KEY]/g' {} \; 2>/dev/null || true

  # 阿里云 API Key
  find openclaw -type f \( -name "*.md" -o -name "*.txt" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) \
    -exec sed -i 's/sk-[A-Za-z0-9]\{32\}/[REDACTED_API_KEY]/g' {} \; 2>/dev/null || true

  # Telegram Bot Token
  find openclaw -type f \( -name "*.md" -o -name "*.txt" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) \
    -exec sed -i 's/[0-9]\{10\}:[A-Za-z0-9_-]\{35\}/[REDACTED_BOT_TOKEN]/g' {} \; 2>/dev/null || true

  # Tencent VDB endpoint
  find openclaw -type f \( -name "*.md" -o -name "*.txt" -o -name "*.json" \) \
    -exec sed -i 's/bj-vdb-[A-Za-z0-9-]\+\.sql\.tencentcdb\.com[0-9:]*/[REDACTED_VDB]/g' {} \; 2>/dev/null || true

  # Coze API Token
  find openclaw -type f \( -name "*.md" -o -name "*.txt" -o -name "*.json" \) \
    -exec sed -i 's/pat_[A-Za-z0-9]\{50,\}/[REDACTED_PAT]/g' {} \; 2>/dev/null || true

  log "敏感信息清理完成"
}

# 创建 GitHub 仓库
create_github_repo() {
  log "检查/创建 GitHub 仓库..."

  # 使用 SSH 检查仓库（通过 git ls-remote）
  if git ls-remote "$REPO_SSH" &>/dev/null 2>&1; then
    log "GitHub 仓库已存在"
    return 0
  fi

  # 仓库不存在，创建它（使用 openclaw.json 里的 token）
  TOKEN=$(cat ~/.openclaw/openclaw.json 2>/dev/null | grep -o '"GITHUB_TOKEN": "[^"]*"' | cut -d'"' -f4)

  if [ -n "$TOKEN" ]; then
    log "创建 GitHub 仓库: openclaw-backup"
    curl -s -X POST \
      -H "Authorization: token $TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      "https://api.github.com/user/repos" \
      -d '{"name":"openclaw-backup","description":"OpenClaw 每日自动备份 - '"$DATE"'","private":false}' \
      2>/dev/null || warn "无法创建仓库，可能已存在"
    log "仓库创建完成"
  else
    warn "未找到 GITHUB_TOKEN，跳过仓库创建"
  fi
}

# 提交并推送
commit_and_push() {
  cd "$BACKUP_DIR"

  # 添加所有文件
  git add -A

  # 检查是否有变更
  if git diff --staged --quiet; then
    log "没有变更需要提交"
    return 0
  fi

  # 提交
  log "提交变更: $DATE"
  git commit -m "备份 $DATE - $DATETIME"

  # 推送（使用 SSH）
  log "推送到 GitHub..."
  git branch -M main
  git push -u origin main --force 2>&1 || {
    error "推送失败，请检查 SSH 配置"
    return 1
  }

  log "推送成功！"
}

# 生成备份报告
generate_report() {
  cd "$BACKUP_DIR"

  # 统计文件数量和大小
  FILE_COUNT=$(find openclaw -type f 2>/dev/null | wc -l || echo "0")
  DIR_SIZE=$(du -sh openclaw 2>/dev/null | cut -f1 || echo "未知")

  log "===== 备份报告 ====="
  log "日期: $DATE"
  log "文件数: $FILE_COUNT"
  log "大小: $DIR_SIZE"
  log "仓库: https://github.com/Lazily01/openclaw-backup"
  log "===================="
}

# 主函数
main() {
  log "=========================================="
  log "OpenClaw 每日备份开始: $DATETIME"
  log "=========================================="

  # 1. 初始化
  init_backup_dir

  # 2. 创建 .gitignore
  create_gitignore

  # 3. 创建 GitHub 仓库（如果不存在）
  create_github_repo

  # 4. 同步文件
  sync_files

  # 5. 清理敏感信息
  clean_secrets

  # 6. 提交并推送
  commit_and_push

  # 7. 生成报告
  generate_report

  log "备份完成！"
}

# 执行
main "$@"

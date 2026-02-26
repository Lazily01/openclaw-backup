#!/bin/bash
# 知识复利 - 自动从日志提炼精华
# 每天凌晨 4 点运行

MEMORY_DIR="$HOME/.openclaw/workspace/memory"
INSIGHTS_DIR="$HOME/.openclaw/workspace/insights"
TODAY=$(date +%Y-%m-%d)
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)

echo "[$TODAY] 开始知识复利..."

# 创建 insights 目录
mkdir -p "$INSIGHTS_DIR"

# 获取昨天的日志
YESTERDAY_LOG="$MEMORY_DIR/$YESTERDAY.md"

if [ ! -f "$YESTERDAY_LOG" ]; then
    echo "[$TODAY] 警告：找不到昨天的日志 $YESTERDAY_LOG"
    exit 1
fi

# 提取昨天的日期（用于命名）
YESTERDAY_DATE=$(echo $YESTERDAY | sed 's/-/g')

# 1. 提取关键决策
extract_decisions() {
    grep -i "决定\|决策\|选了\|选择了" "$YESTERDAY_LOG" | head -5
}

# 2. 提取成功经验
extract_success() {
    grep -i "成功\|搞定\|完成\|解决了" "$YESTERDAY_LOG" | head -5
}

# 3. 提取失败教训
extract_lessons() {
    grep -i "失败\|问题\|错误\|坑\|教训" "$YESTERDAY_LOG" | head -5
}

# 执行提取
DECISIONS=$(extract_decisions)
SUCCESSES=$(extract_success)
LESSONS=$(extract_lessons)

# 生成 insights 文件
INSIGHTS_FILE="$INSIGHTS_DIR/insights-$YESTERDAY_DATE.md"

cat > "$INSIGHTS_FILE" << EOF
# Insights - $YESTERDAY

自动从 $YESTERDAY 的日志中提炼

---

## 🎯 关键决策

$DECISIONS

---

## ✅ 成功经验

$SUCCESSES

---

## ❌ 失败教训

$LESSONS

---

*生成时间：$(date +%Y-%m-%d\ %H:%M)*
EOF

# 在 MEMORY.md 中标记已提炼
if [ -f "$INSIGHTS_FILE" ]; then
    echo "  ✓ Insights 已生成: $INSIGHTS_FILE"
    echo "  ✓ 请人工审核后手动合并到 MEMORY.md 的 Lessons Learned 部分"
else
    echo "  ✗ Insights 生成失败"
fi

echo "[$TODAY] 知识复利完成"

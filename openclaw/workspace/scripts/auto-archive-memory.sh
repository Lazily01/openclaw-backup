#!/bin/bash
# 自动归档过期记忆
# 每天凌晨 3 点运行

MEMORY_DIR="$HOME/.openclaw/workspace/memory"
ARCHIVE_DIR="$MEMORY_DIR/archive"
TODAY=$(date +%Y-%m-%d)

echo "[$TODAY] 开始记忆归档..."

# 创建归档目录
mkdir -p "$ARCHIVE_DIR"

# 查找并归档过期文件
for file in "$MEMORY_DIR"/20*.md; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        file_date=$(echo $filename | grep -oP '[0-9]\{4\}')

        if [ -n "$file_date" ]; then
            # 计算文件天数
            file_epoch=$(date -d "$file_date" +%s)
            today_epoch=$(date +%s)
            days_old=$(( (today_epoch - file_epoch) / 86400))

            echo "检查文件: $filename ($days_old 天前)"

            # P1: 超过 90 天
            if [ $days_old -gt 90 ]; then
                echo "  [P1] 归档 90 天前的文件: $filename"
                mv "$file" "$ARCHIVE_DIR/"

            # P2: 超过 30 天但不超过 90 天
            elif [ $days_old -gt 30 ]; then
                echo "  [P2] 归档 30 天前的文件: $filename"
                mv "$file" "$ARCHIVE_DIR/"
            fi
        fi
    fi
done

echo "[$TODAY] 记忆归档完成"

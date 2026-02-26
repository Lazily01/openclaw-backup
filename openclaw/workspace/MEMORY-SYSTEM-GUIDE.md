# 🧠 AI Agent 记忆系统使用说明

> 基于三层架构设计（日志 → 长期记忆 → 工作缓冲）

---

## 📁 目录结构

```
workspace/
├── MEMORY.md              ← 长期记忆（精华，常驻加载）
├── memory/
│   ├── 2026-02-17.md    ← 每日日志（原始流水）
│   └── archive/           ← 归档的旧记忆
├── insights/              ← 提炼的知识洞察
├── SESSION-STATE.md      ← 工作缓冲区（防压缩丢失）
└── scripts/
    ├── auto-archive-memory.sh      ← 自动归档脚本
    └── auto-extract-insights.sh     ← 知识复利脚本
```

---

## 🔄 三层架构说明

### 第一层：每日日志

**文件：** `memory/YYYY-MM-DD.md`

**作用：**
- 原始素材，回溯时有据可查
- 不精炼，不整理，先倒进去
- 每天一个新文件

**使用场景：**
- 记录日常操作、对话、决策
- 保存原始数据，不过滤

---

### 第二层：长期记忆

**文件：** `MEMORY.md`

**作用：**
- 定期从日志里提炼精华
- 你的偏好、重要决策、踩过的坑、关键信息
- Agent 每次启动先读这个文件

**内容结构：**
```markdown
## About 张老板
## Active Projects
## Key Decisions
## Lessons Learned
## Important Data (API Keys、账号等)
## Boundaries & Security
```

**使用场景：**
- 快速检索重要信息
- 跨天项目上下文不丢失
- 避免重复说明偏好

---

### 第三层：工作缓冲区

**文件：** `SESSION-STATE.md`

**作用：**
- 救过好几次（压缩后重要细节被压没）
- 记录当前任务状态
- 记录重要背景信息
- 压缩后第一件事读它

**内容结构：**
```markdown
## 当前任务
## 上下文
## 待确认
## 优先级标签（P0/P1/P2）
```

**使用场景：**
- 长对话中途压缩，防止丢失
- 记录进行中的任务状态
- 保存关键背景信息

---

## 🤖 自动化脚本

### 1. 自动归档脚本

**文件：** `scripts/auto-archive-memory.sh`

**功能：**
- 每天（凌晨 3 点）自动扫描 `memory/` 目录
- P1 超过 90 天 → 移到 `memory/archive/`
- P2 超过 30 天 → 移到 `memory/archive/`
- P0 永久不动（MEMORY.md 等核心文件）

**使用方法：**
```bash
# 手动执行
./scripts/auto-archive-memory.sh

# 配置 cron（自动运行）
0 3 * * * /home/lazily/.openclaw/workspace/scripts/auto-archive-memory.sh >> /tmp/auto-archive.log 2>&1
```

---

### 2. 知识复利脚本

**文件：** `scripts/auto-extract-insights.sh`

**功能：**
- 每天（凌晨 4 点）自动检查昨天的日志
- 提取关键决策
- 提取成功经验
- 提取失败教训
- 生成 insights 文件到 `insights/` 目录

**使用方法：**
```bash
# 手动执行
./scripts/auto-extract-insights.sh

# 配置 cron（自动运行）
0 4 * * * /home/lazily/.openclaw/workspace/scripts/auto-extract-insights.sh >> /tmp/auto-extract.log 2>&1
```

---

## 🚀 快速开始

### 1. 手动添加记忆

**方式一：记录到今日日志**
```bash
echo "## 今天做了什么

- 完成了任务 X
- 学到了 Y
- 踩了坑 Z" >> ~/.openclaw/workspace/memory/$(date +%Y-%m-%d).md
```

**方式二：更新长期记忆**
编辑 `MEMORY.md`，添加：
- 重要决策
- 新学到的经验
- 踩过的坑
- API Keys（先检查是否已存在）

**方式三：记录当前状态**
编辑 `SESSION-STATE.md`，添加：
- 当前任务
- 重要背景信息

---

### 2. 配置自动运行

**编辑 crontab：**
```bash
crontab -e
```

**添加以下内容：**
```
# 每天凌晨 3 点自动归档记忆
0 3 * * * /home/lazily/.openclaw/workspace/scripts/auto-archive-memory.sh >> /tmp/auto-archive.log 2>&1

# 每天凌晨 4 点自动提取知识
0 4 * * * /home/lazily/.openclaw/workspace/scripts/auto-extract-insights.sh >> /tmp/auto-extract.log 2>&1
```

---

## 📊 记忆管理策略

### 优先级标签

- **[P0]** 永久保留（核心架构文件）
  - MEMORY.md
  - SESSION-STATE.md
  - scripts/
- **[P1]** 90天后归档（次要信息）
  - memory/ 中的旧日志
- **[P2]** 30天后归档（临时信息）
  - 测试记录、临时笔记

### 信息分类

**长期记忆（MEMORY.md）：**
- ✅ 基本信息（GitHub、账号、偏好）
- ✅ 重要决策
- ✅ 经验教训
- ✅ API Keys（加密存储建议）

**工作缓冲（SESSION-STATE.md）：**
- ✅ 当前任务
- ✅ 临时状态
- ✅ 优先级标记
- ⚠️ 定期清理（保留最近 7 天的）

**每日日志：**
- ✅ 原始记录
- ⚠️ 自动归档（30/90 天）

**知识洞察：**
- ✅ 自动提炼
- ✅ 人工审核后合并到 MEMORY.md

---

## 🎯 最佳实践

1. **记录及时**
   - 重要决策立即写入 MEMORY.md
   - 任务状态更新 SESSION-STATE.md

2. **定期整理**
   - 每周审查 insights/ 文件
   - 合并有价值的内容到 MEMORY.md

3. **优先级管理**
   - P0 优先确保核心文件不丢失
   - P1/P2 定期归档，防止臃肿

4. **备份重要**
   - MEMORY.md 定期备份到其他位置
   - GitHub 同步建议

---

## 📝 示例

### 示例 1：记录重要决策

编辑 `MEMORY.md`：
```markdown
## Key Decisions

### 2026-02-17
- **决定：** 使用三层记忆架构
- **原因：** 解决 Agent "健忘症"问题
- **状态：** 已实现基础结构
```

### 示例 2：记录当前任务

编辑 `SESSION-STATE.md`：
```markdown
## 当前任务

[P0] 实现三层记忆架构
状态：进行中

## 上下文

[重要] 正在实现记忆架构
- 来源：https://x.com/xxx111god/status/2023521632673763473
```

---

## 🔒 安全提醒

- ⚠️ **不要在 MEMORY.md 中存储敏感信息**（密码、私钥）
- ⚠️ **SESSION-STATE.md 可能包含敏感信息**，定期清理
- ✅ **日志文件相对安全**（不包含密钥，只是操作记录）
- ✅ **归档文件需要清理**（不要永久保存所有日志）

---

**创建时间：** 2026-02-17
**最后更新：** 2026-02-17

# 自动化工具使用指南

## 1. X 文章自动归档

### 使用方法

**方式 1: 直接链接发送给我**
发送任何 X/Twitter 链接，我会自动检测并询问是否归档

**方式 2: 手动执行脚本**
```bash
# 归档单篇文章
/home/lazily/.openclaw/workspace/scripts/archive-x-article.sh "https://x.com/username/status/123456789"
```

### 功能说明

- 🔍 自动获取 X 文章内容
- 🤖 AI 分析是否值得归档
- 📝 自动生成格式化的 Markdown 文件
- 💾 保存到 Obsidian Vault 的 `X文章归档/` 目录

### 归档位置

```
/mnt/c/Users/CF/Documents/Obsidian Vault/X文章归档/
├── X文章-20260218-093015-123456789.md
└── X文章-20260218-094512-987654321.md
```

### 归档格式

```markdown
# X 文章归档

**链接:** https://x.com/username/status/123456789
**归档时间:** 2026-02-18 09:30:15

---

## 文章内容

（文章内容）

---

## 归档理由

自动分析后决定归档
```

---

## 2. 项目一键初始化

### 使用方法

**方式 1: 命令行执行**
```bash
# 基础用法
/home/lazily/.openclaw/workspace/scripts/init-project.sh my-project

# 带描述
/home/lazily/.openclaw/workspace/scripts/init-project.sh "my-awesome-project" "这是一个很棒的项目"
```

**方式 2: 让我执行**
直接告诉我：初始化项目 "项目名" "描述"

### 自动完成的任务

✅ 创建项目目录结构
```
~/projects/my-project/
├── src/          # 源代码
├── tests/        # 测试文件
├── docs/         # 项目文档
├── README.md     # 项目说明
├── .gitignore    # Git 忽略配置
└── package.json  # 项目配置
```

✅ 初始化 Git 仓库
- `git init`
- 配置用户信息
- 创建初始提交

✅ 创建 GitHub 仓库（需安装 GitHub CLI）
- 使用 `gh` 命令自动创建
- 自动关联远程仓库
- 自动推送初始代码

✅ 在 Obsidian 中创建项目记录
- 项目描述
- 技术栈
- 开发日志
- TODO 列表

### 项目位置

- **本地:** `/home/lazily/projects/<项目名>/`
- **GitHub:** `https://github.com/Lazily01/<项目名>`
- **Obsidian:** `Obsidian Vault/项目/<项目名>.md`

### 前置条件

#### 使用 GitHub 自动创建功能需要：

```bash
# 安装 GitHub CLI
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 登录
gh auth login
```

---

## 3. 辅助工具

### ask-ai.mjs - AI 助手

简单的 AI 查询脚本，用于自动化判断和决策。

```bash
echo "是否值得做这件事？" | node /home/lazily/.openclaw/workspace/scripts/ask-ai.mjs
```

---

## 定时任务（已配置）

以下任务已通过 cron 自动配置：

### ✅ 每周技能检查
- **时间:** 每周一 09:00
- **功能:** 检查新技能并推荐适合的技能

### ✅ 三天一次技能快速检查
- **频率:** 每 3 天
- **功能:** 快速检查新技能/更新

### ✅ 7天记忆整理
- **频率:** 每 7 天
- **功能:**
  - 归档 30/90 天前的日志
  - 从日志提取知识到 MEMORY.md
  - 清理过期 SESSION-STATE.md
  - 更新 HEARTBEAT.md

---

## 快速参考

### 查看所有脚本
```bash
ls -la /home/lazily/.openclaw/workspace/scripts/
```

### 查看定时任务
```bash
openclaw cron list
```

### 手动执行记忆整理
```bash
# 创建一个临时系统事件触发
```

---

*最后更新: 2026-02-18*

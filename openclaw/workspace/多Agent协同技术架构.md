# 多 Agent 协同技术架构

> 详细说明数字员工系统的技术实现

---

## 1. 架构概览

### 1.1 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      OpenClaw Gateway                        │
│                    (统一入口和路由)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Main Agent                              │
│  - Workspace: ~/.openclaw/workspace                          │
│  - 职责：用户交互、协调子 Agent                               │
│  - Skills: 9 个全局技能                                      │
│  - 心跳：30 分钟                                             │
└─────────────────────────────────────────────────────────────┘
        ↓ sessions_spawn        ↓ sessions_spawn
        ↓                       ↓
┌───────────────┐       ┌───────────────┐
│   PM Agent    │       │  Dev Agent    │
│ (产品经理)     │ ──→   │  (开发者)      │
└───────────────┘       └───────────────┘
        │                       │
        │                       ↓ sessions_spawn
        │               ┌───────────────┐
        │               │   QA Agent    │
        │               │  (测试工程师)  │
        │               └───────────────┘
        │                       │
        │                       ↓ sessions_spawn
        │               ┌───────────────┐
        └──────────────→│Growth Agent   │
                        │  (增长黑客)    │
                        └───────────────┘
```

---

## 2. Agent 配置详解

### 2.1 配置文件位置

```
~/.openclaw/openclaw.json          # 主配置文件
~/.openclaw/agents/
├── main/agent/                    # Main Agent 状态
│   ├── auth-profiles.json         # 认证配置
│   ├── models.json                # 模型配置
│   └── sessions/                  # 会话存储
├── pm-agent/agent/                # PM Agent 状态
├── dev-agent/agent/               # Dev Agent 状态
├── qa-agent/agent/                # QA Agent 状态
└── growth-agent/agent/            # Growth Agent 状态
```

### 2.2 Agent 配置结构

```json5
{
  "id": "dev-agent",              // Agent 唯一标识
  "name": "Dev Agent",            // 显示名称
  "workspace": "/path/to/workspace", // 工作目录
  "agentDir": "/path/to/agent",   // 状态目录
  "model": "zai/glm-5",           // 使用的模型
  "subagents": {
    "allowAgents": ["qa-agent"]   // 允许调用的子 Agent
  }
}
```

---

## 3. Workspace 隔离机制

### 3.1 Workspace 目录结构

每个 Agent 都有独立的 workspace，完全隔离：

```
workspace-main/           # Main Agent
├── AGENTS.md            # Agent 行为规则
├── SOUL.md              # 个性定义
├── USER.md              # 用户信息
├── MEMORY.md            # 长期记忆
├── HEARTBEAT.md         # 心跳检查
├── skills/              # 技能目录
│   ├── agent-reach/
│   ├── ai-image-generation/
│   └── ...
└── memory/              # 日志目录

workspace-pm/            # PM Agent
├── AGENTS.md
├── SKILL.md             # PM 专属技能
├── skills/
│   └── pm-agent/
└── docs/                # 需求文档

workspace-dev/           # Dev Agent
├── AGENTS.md
├── SKILL.md
├── skills/
│   ├── frontend-design/
│   ├── code-simplifier/
│   └── fullstack-developer/
└── todo-app/            # 项目代码

workspace-qa/            # QA Agent
├── AGENTS.md
├── SKILL.md
├── skills/
│   ├── webapp-testing/
│   └── e2e-testing-patterns/
├── tests/
└── test-reports/

workspace-growth/        # Growth Agent
├── AGENTS.md
├── SKILL.md
├── skills/
│   ├── postbridge-social-growth/
│   └── developer-growth-analysis/
└── 增长策略.md
```

### 3.2 Workspace 作用域

**文件访问：**
- Agent 只能访问自己的 workspace
- 通过绝对路径可以访问其他位置（如项目目录）
- Main Agent 可以访问所有子 Agent 的 workspace（但不应该）

**状态隔离：**
- 每个 Agent 有独立的会话历史
- 每个 Agent 有独立的认证配置
- 每个 Agent 有独立的模型注册表

---

## 4. Skills 管理

### 4.1 Skills 目录结构

```
# Main Agent Skills (全局)
~/.openclaw/workspace/skills/
├── agent-reach/
│   ├── SKILL.md
│   ├── scripts/
│   └── resources/
├── ai-image-generation/
├── file-organizer/
├── find-skills/
├── multi-agent-workflow/
├── proactive-agent/
├── tavily-search/
└── twitter-reader/

# Dev Agent Skills (专属)
~/.openclaw/workspace-dev/.agents/skills/
├── frontend-design/
│   └── SKILL.md
├── code-simplifier/
│   └── SKILL.md
└── fullstack-developer/
    └── SKILL.md
```

### 4.2 Skills 加载优先级

```
1. <workspace>/.agents/skills/     # Agent 专属技能
2. <workspace>/skills/             # Workspace 技能
3. ~/.openclaw/skills/             # 全局共享技能
4. Bundled skills                   # 内置技能
```

### 4.3 Skills 配置示例

```json5
// SKILL.md
---
name: dev-agent
description: 开发 Agent 专用技能
metadata:
  openclaw:
    requires:
      bins: ["node", "npm", "git"]
      env: ["GITHUB_TOKEN"]
---

# Dev Agent 技能说明

## 核心能力
- 前端开发
- 后端开发
- 测试编写
```

---

## 5. Agent 通信机制

### 5.1 sessions_spawn 工具

**调用方式：**

```javascript
// Main Agent 调用 PM Agent
sessions_spawn({
  agentId: "pm-agent",
  task: "分析需求并输出文档",
  timeoutSeconds: 300,
  mode: "run"  // 或 "session"
})
```

**参数说明：**

| 参数 | 类型 | 说明 |
|------|------|------|
| agentId | string | 目标 Agent ID |
| task | string | 任务描述 |
| timeoutSeconds | number | 超时时间（秒） |
| mode | string | "run"(一次性) 或 "session"(持久) |
| runtime | string | "subagent"(默认) 或 "acp" |

### 5.2 通信流程

```
Main Agent
    ↓ sessions_spawn
    ↓ 创建子会话
    ↓
PM Agent (子会话)
    ├─ 读取 workspace-pm/AGENTS.md
    ├─ 读取 workspace-pm/SKILL.md
    ├─ 执行任务
    ├─ 生成文档
    └─ 完成 → 自动通知 Main Agent
    
Main Agent
    ↓ 收到完成通知
    ↓ sessions_spawn
    ↓
Dev Agent (子会话)
    ├─ 读取 workspace-dev/AGENTS.md
    ├─ 读取 workspace-dev/SKILL.md
    ├─ 读取 PM Agent 生成的文档
    ├─ 开发代码
    └─ 完成 → 自动通知 Main Agent
```

### 5.3 子 Agent 关系链

```
Main Agent
    ↓ allowAgents: [pm-agent, dev-agent, qa-agent, growth-agent]
    
PM Agent
    ↓ allowAgents: [dev-agent]
    
Dev Agent
    ↓ allowAgents: [qa-agent]
    
QA Agent
    ↓ allowAgents: [growth-agent, dev-agent]
    
Growth Agent
    └─ 无子 Agent
```

**关系规则：**
- Agent 只能调用 `allowAgents` 列表中的子 Agent
- 形成调用链：Main → PM → Dev → QA → Growth
- 防止循环调用

---

## 6. 心跳机制

### 6.1 心跳配置

```json5
// Main Agent (默认配置)
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "30m",           // 心跳间隔
        "target": "last",          // 投递目标
        "activeHours": {           // 活跃时间窗口
          "start": "08:00",
          "end": "24:00",
          "timezone": "Asia/Shanghai"
        }
      }
    }
  }
}

// 子 Agent (默认禁用心跳)
PM Agent:   heartbeat.disabled
Dev Agent:  heartbeat.disabled
QA Agent:   heartbeat.disabled
Growth Agent: heartbeat.disabled
```

### 6.2 心跳流程

```
1. Cron 定时触发 (daily-heartbeat)
   ↓
2. Agent 读取 HEARTBEAT.md
   ↓
3. 执行检查清单
   ├─ proactive-tracker.md
   ├─ recurring-patterns.md
   ├─ outcome-journal.md
   └─ session_status
   ↓
4. 生成报告
   ↓
5. 发送到目标 (last 或指定 channel)
```

### 6.3 HEARTBEAT_OK 机制

```javascript
// 如果无事需注意，返回 HEARTBEAT_OK
if (nothingNeedsAttention) {
  return "HEARTBEAT_OK"
}

// OpenClaw 会自动抑制空消息
// 只有在有问题时才会发送通知
```

---

## 7. 会话管理

### 7.1 会话键映射

```
Main Agent:
  - agent:main:main                     # 主会话
  - agent:main:cron:<job-id>            # Cron 任务会话
  - agent:main:subagent:<uuid>          # 子 Agent 会话

PM Agent:
  - agent:pm-agent:subagent:<uuid>      # 被 Main Agent 调用
  
Dev Agent:
  - agent:dev-agent:subagent:<uuid>     # 被 PM Agent 或 Main Agent 调用
```

### 7.2 会话存储

```
~/.openclaw/agents/<agent-id>/sessions/
├── sessions.json          # 会话索引
└── <session-id>.jsonl     # 会话历史
```

### 7.3 会话隔离

每个子 Agent 调用都会创建新的会话：
- 独立的上下文
- 独立的工具权限
- 独立的历史记录
- 完成后自动归档

---

## 8. 工具权限

### 8.1 子 Agent 工具限制

**默认规则：**
- 子 Agent 拥有**除 session tools 外的所有工具**
- Session tools 包括：`sessions_spawn`, `sessions_send`, `sessions_list`, `sessions_history`

**层级规则：**
```
Main Agent (maxSpawnDepth: 2)
    ├─ 可以 spawn 子 Agent
    └─ 可以获得 session tools (depth-1 编排器)
    
子 Agent (depth-1)
    ├─ 可以 spawn 孙 Agent
    └─ 可以获得 session tools
    
孙 Agent (depth-2, 叶子节点)
    └─ 不能 spawn，没有 session tools
```

### 8.2 配置示例

```json5
{
  "agents": {
    "defaults": {
      "subagents": {
        "maxSpawnDepth": 2,        // 最大嵌套深度
        "maxChildrenPerAgent": 5,   // 每个 Agent 最大子 Agent 数
        "maxConcurrent": 8,         // 全局并发上限
        "archiveAfterMinutes": 60   // 自动归档时间
      }
    }
  }
}
```

---

## 9. 实际工作流示例

### 9.1 完整调用链

```javascript
// 1. 用户提需求
user: "做一个待办清单"

// 2. Main Agent 启动 PM Agent
sessions_spawn({
  agentId: "pm-agent",
  task: "分析需求，输出需求文档、技术方案、任务清单"
})

// 3. PM Agent 完成，自动通知 Main Agent
// 4. Main Agent 启动 Dev Agent
sessions_spawn({
  agentId: "dev-agent",
  task: "根据需求文档开发"
})

// 5. Dev Agent 完成，自动通知 Main Agent
// 6. Main Agent 启动 QA Agent
sessions_spawn({
  agentId: "qa-agent",
  task: "测试应用，生成报告"
})

// 7. QA Agent 完成，自动通知 Main Agent
// 8. 如有 Bug，通知 Dev Agent 修复
// 9. 测试通过，通知 Growth Agent
sessions_spawn({
  agentId: "growth-agent",
  task: "分析增长机会"
})

// 10. Growth Agent 完成，上传 GitHub
```

### 9.2 数据流转

```
workspace-pm/
├─ 需求文档.md  ────────┐
├─ 技术方案.md  ────────┤
└─ 任务清单.md  ────────┤
                         ↓
                    Dev Agent 读取
                         ↓
workspace-dev/           
└─ todo-app/            ────────┐
    ├─ src/                      │
    └─ README.md                 ↓
                           QA Agent 读取
                                ↓
workspace-qa/                    
└─ test-reports/        ────────┐
    ├─ test_report.txt           │
    └─ screenshots/              ↓
                          Growth Agent 读取
                                ↓
workspace-growth/
├─ 增长策略.md
├─ KPI 建议.md
└─ 功能建议.md

最后：全部上传 GitHub
```

---

## 10. 最佳实践

### 10.1 Workspace 管理

✅ **推荐：**
- 每个 Agent 有专属 workspace
- 项目代码放在独立的目录（如 `/home/lazily/projects/`）
- 文档放在各自的 workspace

❌ **避免：**
- 不要让多个 Agent 写入同一个文件
- 不要在 workspace 外创建临时文件

### 10.2 Skills 管理

✅ **推荐：**
- Agent 专属技能放在 `<workspace>/.agents/skills/`
- 共享技能放在 `~/.openclaw/skills/`
- 每个技能都有 SKILL.md 说明

❌ **避免：**
- 不要在多个地方重复安装同一技能
- 不要修改技能的核心文件

### 10.3 通信优化

✅ **推荐：**
- 任务描述清晰具体
- 合理设置 timeout
- 使用 `mode: "run"` 执行一次性任务

❌ **避免：**
- 不要频繁轮询子 Agent 状态
- 不要设置过长的 timeout（会导致资源占用）

---

## 11. 故障排查

### 11.1 Agent 无法启动

```bash
# 检查 Agent 配置
openclaw config get agents.list

# 检查 workspace 是否存在
ls -la ~/.openclaw/workspace-*/

# 检查 agent 目录
ls -la ~/.openclaw/agents/*/agent/
```

### 11.2 子 Agent 无法调用

```bash
# 检查 allowAgents 配置
openclaw config get agents.list | grep -A 5 "subagents"

# 检查 maxSpawnDepth
openclaw config get agents.defaults.subagents
```

### 11.3 Skills 加载失败

```bash
# 检查 skills 目录
ls -la ~/.openclaw/workspace-dev/.agents/skills/

# 检查 SKILL.md 格式
cat ~/.openclaw/workspace-dev/.agents/skills/*/SKILL.md
```

---

## 12. 性能优化

### 12.1 并发控制

```json5
{
  "agents": {
    "defaults": {
      "maxConcurrent": 4,           // Main Agent 最大并发
      "subagents": {
        "maxConcurrent": 8,          // 全局子 Agent 并发上限
        "maxChildrenPerAgent": 5     // 每个 Agent 最大子 Agent 数
      }
    }
  }
}
```

### 12.2 上下文管理

```json5
{
  "agents": {
    "defaults": {
      "contextTokens": 200000,      // 上下文窗口大小
      "compaction": {
        "mode": "safeguard",         // 压缩模式
        "reserveTokensFloor": 24000  // 保留最小 token
      }
    }
  }
}
```

---

## 13. 总结

**核心概念：**
1. **Workspace 隔离** - 每个 Agent 有独立的工作目录和状态
2. **Skills 分层** - Agent 专属技能 > Workspace 技能 > 全局技能
3. **会话隔离** - 每次调用创建新的会话，独立上下文
4. **权限控制** - allowAgents 控制调用关系，maxSpawnDepth 控制深度
5. **自动通知** - 子 Agent 完成后自动通知调用者

**工作流：**
```
用户 → Main Agent → PM Agent → Dev Agent → QA Agent → Growth Agent → GitHub
```

**关键优势：**
- 完全自动化，用户只需确认需求
- 每个 Agent 专注自己的领域
- 清晰的数据流转和文档输出
- 可扩展的技能系统

---

*文档版本：v1.0*
*创建日期：2026-02-27*
*作者：Claw (Main Agent)*

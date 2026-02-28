# MEMORY.md - 长期记忆精华，定期从日志里提炼
> Agent 每次启动先读这个文件

---

## About 张老板

### 基本信息
- **GitHub:** Lazily01 (ID: 151498687)
- **Timezone:** GMT+8 (Asia/Shanghai)
- **Primary channel:** Telegram (user_id: 7690074075)
- **Language:** Chinese (system and interface)
- **System:** Windows 11 via WSL2 (Ubuntu)
- **Desktop:** C:\Users\CF\Desktop

### 偏好
- **昵称:** 张老板
- **AI 名字:** 奈亚子 (Claw)
- **沟通方式:** 直接、简洁、主动
- **工作方式:** "下次这种事情不要问我" - proactive action
- **重启策略:** 配置变化需要重启时，直接执行，不用询问
- **数字员工工作流:** PM Agent 确认需求文档后，其他 Agent 全程自动化，不再询问用户
- **项目完成:** 项目完成后自动上传 GitHub，不用询问
- **可视化优先:** 数据汇报时优先使用图表（柱状图、饼图、折线图），不是纯文字
- **图表技能必备:** 每个 Agent 都应该掌握图表生成能力
- **图片识别:** 暂时不可用，等用户申请多模态模型后再配置
- **Dev Agent 编码:** 使用 ACP + Claude Code（火山引擎 Coding Plan）

### 技术栈
- 文件路径：/mnt/c/（Windows 文件访问）
- Obsidian vault：/mnt/c/Users/CF/Documents/Obsidian Vault
- 浏览器：Windows Chrome（WSL 环境无法直接控制）

---

## Active Projects

- [2026-02-17] AI Agent 记忆架构实现中
- [2026-02-17] 数字员工系统建设

---

## Key Decisions

### 2026-02-17
- **决定:** 实现三层记忆架构（日志 → 长期记忆 → 工作缓冲）
- **原因:** 解决 Agent "健忘症"问题，跨天记忆不丢失
- **来源:** https://x.com/xxx111god/status/2023521632673763473

---

## Lessons Learned

### 2026-02-17
- **架构:** 实现了三层记忆系统（日志 → 长期记忆 → 工作缓冲）
- **经验:** MEMORY.md、SESSION-STATE.md 都是新架构的核心文件
- **经验:** scripts/ 目录下的自动化脚本支持记忆系统自动化
- **测试:** 今天完成了记忆系统测试，Agent 能够正常读取 MEMORY.md、SESSION-STATE.md、今日日志
- **关键发现:** 三层记忆架构有效解决了 Agent "健忘症"问题

---

## Important Data

### API Keys & Services

#### 火山引擎（测试环境，限流使用）
- **API Key:** [REDACTED_KEY]
- **模型接入点:**
  - GLM4.7: ep-20260126204826-llkht
  - 豆包1.8: ep-20260105211457-nccvj
  - Seedream4.5 (生图): ep-20251205202908-h9vmw
  - doubao-seed-1.6: ep-m-20251021214205-rnprp
  - kimi-k2: ep-m-20251015115744-2lbkr

#### 阿里 DashScope（通义千问）
- **API Key:** [REDACTED_API_KEY]
- **模型:**
  - TTS-Flash: 2025-11-27
  - Image-Plus: 2026-01-09
  - Z-Image-Turbo: (可用）

#### 其他服务
- **腾讯向量数据库:** [REDACTED_VDB]
- **Coze API Token:** [REDACTED_PAT]
- **GitHub Token:** [已从文件中移除，如需使用请单独提供]

---

## Boundaries & Security

- ❌ 不能绕过 Windows 锁屏或认证
- 🔒 安全机制必须遵守，无论请求
- 🔒 私有信息不泄露
- ⚠️ 创建文件/脚本前必须先说明要做什么
- ⚠️ 搜索现有 skills（不要从头写）
- ⚠️ 查看 skills 时必须先看 SKILL.md（不能只看名字猜功能）
- ✅ 没有备份的情况下改配置

---

## 重要数据（更新：豆包生图）

### 火山引擎（豆包生图 + Coding Plan）
- **API Key:** `[REDACTED_KEY]`
- **Coding Plan API Key:** `[REDACTED_KEY]`
- **Claude Code Base URL:** `https://ark.cn-beijing.volces.com/api/coding`
- **API Key:** [REDACTED_KEY]
- **端点:** https://ark.cn-beijing.volces.com/api/v3/images/generations
- **模型:** doubao-seedream-4-5-251128 (Seedream 4.5)
- **接入点:** ep-20251205202908-h9vmw

**4K 无水印调用示例：**
```bash
curl -X POST 'https://ark.cn-beijing.volces.com/api/v3/images/generations' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer [REDACTED_KEY]' \
  -d '{
    "model": "ep-20251205202908-h9vmw",
    "prompt": "图片描述",
    "size": "4096x2160",
    "watermark": false
  }'
```

**关键参数：**
- `size`: 4K 用 `4096x2160`，最小 2048x2048（3,686,400 像素）
- `watermark`: `false` 不添加水印，`true` 在右下角添加"AI生成"

**注意事项：**
- 必须用 `/api/v3/images/generations` 端点（不是 chat/completions）
- 图片链接 24 小时内有效
- 总像素范围：[3,686,400, 16,777,216]
- 宽高比范围：[1/16, 16]

---

## 2026-02-18 Heartbeat Summary

### 检查完成情况
- ✅ Proactive Tracker - 无过期行为
- ✅ Recurring Patterns - 模式识别清晰
- ✅ Outcome Journal - 无超过 7 天决策需跟进
- ✅ Context % - 当前 0%（安全区）
- ✅ 记忆系统 - 正常运行

### 新识别的自动化机会
1. 一键项目初始化脚本（文件夹 + Git + GitHub）
2. X 文章自动归档工作流
3. 定期技能检查和推荐

### 待实现优化
- GitHub 操作自动化
- 错误报告机制标准化
- 记忆系统 cron 任务配置

---

## 自我进化 (2026-02-20)

### 思维惰性问题
- **问题：** 换了场景（火山引擎）就忘了用已验证的方法（jina.ai）
- **教训：** 成功经验要**跨场景复用**，不能"换了就忘"
- **原则：** 遇到动态网页/反爬虫，优先用 jina.ai
- **行动：** 不要轻易说"做不到"，优先尝试已知可行的方法

### 成功方法库
- **jina.ai 抓取：** https://r.jina.ai/<目标URL>
- **适用场景：**
  - X/Twitter 文章（反爬虫）
  - 动态加载的文档（火山引擎 API 文档）
  - 任何 JavaScript 渲染的页面
- **优势：** 绕过 JS 限制，返回纯文本内容

### 豆包生图经验
- **端点错误：** 不要用 chat/completions，要用 images/generations
- **尺寸限制：** 最小 3,686,400 像素（2048x2048）
- **去水印：** `watermark: false`
- **API 返回：** 所有信息都有，不需要外部工具验证

---

## 自我进化 (2026-02-18)

### PM Agent + 开发 Agent 协同经验
- PM Agent 专注需求和设计
- 开发 Agent 专注实现和测试
- 各司其职，效率高

### 需求文档重要性
- 明确需求边界
- 规范技术选型
- 清晰实现计划
- 减少沟通成本

### 用户确认关键性
- 避免误解需求
- 明确功能边界
- 确认技术决策
- 减少返工

### 沟通改进经验
- ❌ 不要擅自执行操作（git commit、push 等）
- ✅ 操作前先询问用户
- ❌ 项目完成要明确通知，不要含糊
- ✅ 清晰说明：完成的内容 + GitHub 链接
- ❌ 不要给用户看技术错误日志
- ✅ 简洁汇报：✅ 成功 或 ❌ 失败 + 原因
- ❌ 失败后要主动想办法解决
- ✅ 多尝试不同方案，不行再放弃

### GitHub 操作经验
- ❌ 不要把敏感信息（GitHub Token）提交到 git
- ✅ 提交前检查 commit 内容
- ❌ git push 失败后要先检查远程仓库配置
- ✅ 确认远程仓库存在且正确
- ❌ 不要盲目 force push
- ✅ 先诊断问题，再执行操作

### 自我进化系统
- 从被动记录 → 主动学习
- 建立 5 阶段学习循环
- 记录可复用的经验
- 持续改进工作流程

### 环境限制应对
- WSL 无法运行 GUI 应用
- WSL 缺少某些系统库（Playwright）
- 应该诚实说明限制
- 建议替代方案（Web 项目或换环境）
- 不要承诺做不到的事

---

## OpenClaw 核心架构知识 (2026-02-20)

### Agent Workspace（工作区）
- **默认位置：** `~/.openclaw/workspace`（每个 agent 可有自己的 workspace）
- **核心文件：**
  - `AGENTS.md` - Agent 操作指令和行为规则
  - `SOUL.md` - 个性、语调、边界
  - `USER.md` - 用户信息（谁、称呼方式）
  - `IDENTITY.md` - Agent 名字、vibe、emoji
  - `TOOLS.md` - 本地工具和惯例说明
  - `HEARTBEAT.md` - 心跳检查清单（可选）
  - `MEMORY.md` - 策选的长期记忆（仅主会话加载）
  - `memory/YYYY-MM-DD.md` - 每日日志（会话启动读取今天+昨天）
- **注意事项：**
  - 工作区是默认 cwd，不是硬性沙盒
  - 绝对路径可到达主机任何位置（除非启用沙盒）
  - `~/.openclaw/` 存储配置、凭据、会话（**不要提交到 git**）

### Memory 记忆系统
- **两层架构：**
  - 日志层：`memory/YYYY-MM-DD.md` - 追加式日志，每天一个文件
  - 长期层：`MEMORY.md` - 策选的长期记忆（**仅主私会话加载**）
- **向量搜索：**
  - 默认启用，自动索引 `MEMORY.md` + `memory/**/*.md`
  - 支持 QMD 后端（BM25 + vector + reranking）
  - 混合搜索：BM25（关键词）+ 向量（语义相似度）
  - MMR 重排序：避免重复结果，增加多样性
  - 时间衰减：新鲜记忆排名更高（halfLife 默认 30 天）
  - `memory_search` - 返回片段+ 路径 + 行号 + 分数
  - `memory_get` - 读取特定文件内容（带 from/lines 限制）
- **自动内存刷新：**
  - 会话接近压缩时触发静默的 agent 轮次
  - 提醒模型写入持久记忆
  - 配置：`agents.defaults.compaction.memoryFlush`

### Heartbeat 心跳机制
- **作用：** 定期运行 agent 轮次，让模型检查需要注意的事项
- **默认间隔：** `30m`（或 Anthropic OAuth 时 `1h`）
- **HEARTBEAT_OK：** 无事需注意时返回此标记，OpenClaw 自动抑制空消息
- **配置：**
  - `agents.defaults.heartbeat.every` - 间隔时长
  - `agents.defaults.heartbeat.target` - 目标（`last`|`none`|channel id）
  - `agents.defaults.heartbeat.activeHours` - 活跃时间窗口
  - `agents.defaults.heartbeat.includeReasoning` - 是否发送推理信息
- **提示词：** `Read HEARTBEAT.md if it exists...`

### Multi-Agent Routing 多智能体路由
- **概念：** 一个 Gateway 可托管多个隔离的 agent
- **每个 agent 独立：**
  - Workspace（文件、个性、规则）
  - State directory（auth profiles、模型注册表）
  - Session store（会话历史、路由状态）
- **路由规则（确定性，最具体优先）：**
  1. `peer` 匹配（具体 DM/group/channel id）
  2. `parentPeer` 匹配（线程继承）
  3. `guildId + roles`（Discord 角色路由）
  4. `guildId`（Discord）
  5. `accountId` 匹配
  6. channel-level 匹配
  7. 默认 agent（`agents.list[].default`）
- **DM 作用域：**
  - `dmScope: "main"`（默认）- 所有 DM 共享主会话
  - `dmScope: "per-channel-peer"` - 按渠道+发送者隔离（**推荐多用户设置**）

### Cron Jobs 定时任务
- **存储位置：** `~/.openclaw/cron/jobs.json`（持久化）
- **执行模式：**
  - **Main session：** 入队系统事件，下次心跳时运行（`sessionTarget: "main"`）
  - **Isolated：** 在 `cron:<jobId>` 会话中运行 dedicated agent 轮次（`sessionTarget: "isolated"`）
- **Schedule 类型：**
  - `at` - 一次性时间点（ISO 8601）
  - `every` - 固定间隔（ms）
  - `cron` - 5 字段 cron 表达式（可选时区）
- **Payload 类型：**
  - `systemEvent` - 主会话（仅）
  - `agentTurn` - 隔离会话（仅）
- **Delivery 模式（仅隔离）：**
  - `announce` - 发送摘要到目标频道 + 主会话简报
  - `webhook` - POST 到 URL
  - `none` - 内部执行，不发送
- **CLI 示例：**
  ```bash
  # 一次性提醒
  openclaw cron add --name "Reminder" --at "2026-02-01T16:00:00Z" --session main --system-event "Reminder text" --wake now --delete-after-run
  # 循环任务
  openclaw cron add --name "Daily" --cron "0 7 * * *" --session isolated --message "Summary" --announce --channel whatsapp --to "+15551234567"
  ```

### Sub-Agents 子智能体
- **概念：** 从现有 agent 轮次生成的后台 agent 运行
- **会话键：** `agent:<agentId>:subagent:<uuid>`
- **完成时：** announce 摘要/结果回请求者频道
- **工具权限：**
  - 默认：**所有工具除了 session tools**
  - `maxSpawnDepth >= 2` 时，depth-1 编排器 additionally 获得 `sessions_spawn`, `subagents`, `sessions_list`, `sessions_history`
  - depth-2（叶子）永远没有 session tools，不能生成子智能体
- **并发限制：**
  - `maxSpawnDepth`（默认 1）- 最大嵌套深度（1-5）
  - `maxChildrenPerAgent`（默认 5）- 每个 agent session 的最大活动子智能体
  - `maxConcurrent`（默认 8）- 全局并发上限
- **成本注意：** 每个子智能体有自己的 context 和 token 使用
- **自动归档：** `agents.defaults.subagents.archiveAfterMinutes`（默认 60 分钟）

### Skills 技能系统
- **技能位置（优先级从高到低）：**
  1. `<workspace>/skills`（仅该 agent）
  2. `~/.openclaw/skills`（所有 agent 共享）
  3. Bundled skills（随安装打包）
  4. `skills.load.extraDirs`（配置的额外文件夹）
- **SKILL.md 格式：**
  ```markdown
  ---
  name: skill-name
  description: What it does
  metadata:
    openclaw:
      requires: { bins: ["bin-name"], env: ["ENV_VAR"] }
  ---
  ```
- **配置覆盖：** `~/.openclaw/openclaw.json` 中的 `skills.entries.<skill-name>`
  - `enabled` - 启用/禁用
  - `env` - 注入环境变量
  - `apiKey` - 便捷方式（需 `metadata.openclaw.primaryEnv`）
  - `config` - 自定义配置包
- **安全：**
  - 第三方技能视为**不受信任代码**，启用前需阅读
  - `skills.entries.*.env` 和 `apiKey` 注入**主机**进程（非沙盒）
  - 敏感操作首选沙盒执行
- **ClawHub：** 技能注册表
  - `clawhub install <skill-slug>` - 安装到当前目录
  - `clawhub update --all` - 更新所有
  - `clawhub sync --all` - 扫描+发布更新

### Agent Loop 智能体循环
- **流程：** intake → context assembly → model inference → tool execution → streaming replies → persistence
- **队列序列化：**
  - 每个 session key 有自己的队列（防止工具/会话竞争）
  - 全局队列（`subagent` 等）用于特定用途
- **Hook 点（可拦截）：**
  - **Internal hooks：** `agent:bootstrap`, command hooks（`/new`, `/reset`, `/stop`）
  - **Plugin hooks：** `before_model_resolve`, `before_prompt_build`, `before_agent_start`, `agent_end`, `before_tool_call`, `after_tool_call`, `message_received`, `message_sent`, `session_start`, `session_end`
- **超时控制：**
  - `agents.defaults.timeoutSeconds`（默认 600s）- agent 运行时超时
  - `agent.wait` 默认 30s - 仅等待，不停止 agent
- **流式回复：**
  - `assistant` events - 助手 deltas 流
  - `tool` events - 工具 start/update/end
  - `lifecycle` events - `start`|`end`|`error`

### Session Management 会话管理
- **主会话：** `agent:<agentId>:<mainKey>`（默认 `main`）
- **会话键映射：**
  - **Direct chats：** 遵循 `session.dmScope`
    - `main` - 所有 DM 共享主会话
    - `per-peer` - 按发送者隔离
    - `per-channel-peer` - 按渠道+发送者隔离（**推荐多用户**）
    - `per-account-channel-peer` - 按账号+渠道+发送者隔离
  - **Group chats：** `agent:<agentId>:<channel>:group:<id>`
  - **Telegram topics：** 追加 `:topic:<threadId>`
- **安全 DM 模式（推荐多用户设置）：**
  ```json5
  {
    session: {
      dmScope: "per-channel-peer"
    }
  }
  ```
- **会话生命周期：**
  - **Daily reset：** 默认凌晨 4:00（主机本地时间）
  - **Idle reset：** 可选滑动窗口（`idleMinutes`）
  - 两者都配置时，**先到期的先过期**
  - Per-type overrides：`resetByType`（`direct`|`group`|`thread`）
  - Per-channel overrides：`resetByChannel`
- **重置触发：** `/new` 或 `/reset`（以及 `resetTriggers` 中的额外触发器）
- **会话存储：**
  - Store file：`~/.openclaw/agents/<agentId>/sessions/sessions.json`
  - Transcripts：`~/.openclaw/agents/<agentId>/sessions/<SessionId>.jsonl`
- **Session pruning：** LLM 调用前自动裁剪旧工具结果（不重写 JSONL 历史）

### 关键配置位置
- **配置文件：** `~/.openclaw/openclaw.json`
- **State 目录：** `~/.openclaw/`（或 `OPENCLAW_STATE_DIR`）
- **Workspace：** `~/.openclaw/workspace`（或 `~/.openclaw/workspace-<agentId>`）
- **Agent directory：** `~/.openclaw/agents/<agentId>/agent`
- **Cron jobs：** `~/.openclaw/cron/jobs.json`
- **Memory store：** `~/.openclaw/memory/<agentId>.sqlite`

---

## Gateway 配置与运维 (2026-02-20)

### 配置管理
- **配置文件：** `~/.openclaw/openclaw.json`（JSON5 格式，支持注释和尾随逗号）
- **配置热重载：** Gateway 自动监听配置文件变化并应用，无需手动重启（大部分设置）
- **配置验证：** Gateway 只接受完全匹配 schema 的配置，无效配置会导致无法启动
- **最小配置示例：**
  ```json5
  {
    agents: { defaults: { workspace: "~/.openclaw/workspace" } },
    channels: { telegram: { botToken: "your-token" } }
  }
  ```

### 配置热重载模式
| 模式 | 行为 |
|------|------|
| `hybrid`（默认）| 安全更改即时应用，关键更改自动重启 |
| `hot` | 只即时应用安全更改，需要重启时警告 |
| `restart` | 任何配置更改都重启（安全或不安全）|
| `off` | 禁用文件监听，下次手动重启时生效 |

**热重载 vs 需要重启：**
- **无需重启：** Channels、Agent & models、Automation、Sessions & messages、Tools & media、UI & misc
- **需要重启：** Gateway server、Infrastructure

### 环境变量
- **来源优先级：** 当前进程环境变量 → `./.env`（当前目录）→ `~/.openclaw/.env`（全局回退）
- **环境变量引用：** 配置中可用 `${VAR_NAME}` 语法
  ```json5
  { gateway: { auth: { token: "${OPENCLAW_GATEWAY_TOKEN}" } }
  ```
- **Shell 环境导入：** 可配置在缺少环境变量时自动导入缺失的键
  ```json5
  {
    env: {
      shellEnv: { enabled: true, timeoutMs: 15000 }
    }
  }
  ```

### Agent 默认配置

#### Workspace
- **默认路径：** `~/.openclaw/workspace`（或 `~/.openclaw/workspace-<agentId>`）
- **repoRoot：** 系统提示中显示的代码仓库根路径（自动向上遍历检测）

#### 模型配置
- **primary + fallbacks：** 主模型和后备模型列表
- **imageModel：** 专用生图模型（当主模型不支持图像时使用）
- **maxConcurrent：** 最大并行 agent 运行数（每个 session 仍然序列化）
- **contextTokens：** 上下文窗口大小
- **timeoutSeconds：** agent 运行时超时（默认 600s）
- **mediaMaxMb：** 媒体大小限制
- **imageMaxDimensionPx：** 图片最大尺寸（默认 1200，降低减少 vision token 使用）

#### Heartbeat（心跳）
- **every：** 心跳间隔（默认 30m，`0m` 禁用）
- **target：** 投递目标（`last`|`whatsapp`|`telegram`|`discord`|`none`）
- **activeHours：** 活跃时间窗口（`{ start: "08:00", end: "24:00", timezone: "America/New_York" }`）
- **includeReasoning：** 是否发送推理信息

#### Compaction（压缩）
- **mode：** `default`（默认）或 `safeguard`（分块总结化）
- **reserveTokensFloor：** 压缩前保留的最小 token 数（默认 24000）
- **memoryFlush：** 自动内存刷新
  - **enabled：** 是否启用（默认 true）
  - **softThresholdTokens：** 软阈值（默认 6000）
  - **systemPrompt：** 压缩前提示词
  - **prompt：** 具体提示词

#### Typing Indicators（打字指示）
- **typingMode：** `never`（从不）、`instant`（即时）、`thinking`（思考中）、`message`（消息）
- **typingIntervalSeconds：** 打字间隔秒数（默认 6）

### Channel 配置（DM & Group 策略）

#### DM 访问控制
| 策略 | 行为 |
|------|------|
| `pairing`（默认）| 未知发送者收到一次性配对码，需要所有者批准 |
| `allowlist` | 仅允许 `allowFrom` 列表中的发送者（或配对存储）|
| `open` | 允许所有入站 DM（需要 `allowFrom: ["*"]`）|
| `disabled` | 忽略所有 DM |

#### Group 访问控制
| 策略 | 行为 |
|------|------|
| `allowlist`（默认）| 仅允许匹配白名单的群组 |
| `open` | 绕过群组白名单（mention gating 仍然适用）|
| `disabled` | 阻止所有群组/房间消息 |

#### Mention Gating（提及 gating）
- **Group messages：** 默认需要提及（`@` 或正则模式）
- **Native mentions：** WhatsApp 点击提及、Telegram @bot、Discord @mention
- **Text patterns：** 正则模式（`agents.list[].groupChat.mentionPatterns`）
- **Self-chat mode：** 包含自己的号码在 `allowFrom` 中启用自聊天模式（忽略 native @-mentions）

#### History Limits（历史限制）
- **Global default：** `messages.groupChat.historyLimit`
- **Per-channel override：** `channels.<channel>.historyLimit`
- **Per-topic override（Telegram）：** `channels.telegram.groups.<groupId>.topics.<topicId>.historyLimit`

### Sandbox（沙盒隔离）

#### Sandbox Mode
| mode | 说明 |
|------|------|
| `off` | 不使用沙盒 |
| `non-main` | 非 main session 使用沙盒 |
| `all` | 所有 session 使用沙盒 |

#### Sandbox Scope（作用域）
| scope | 说明 |
|------|------|
| `session` | 每个 session 独立容器 |
| `agent` | 每个 agent 独容器 |
| `shared` | 共享容器和工作区 |

#### Workspace Access（工作区访问）
| access | 说明 |
|------|------|
| `none` | 沙盒工作区，agent 工作区被挂载 |
| `ro` | agent 工作区只读挂载到 `/agent` |
| `rw` | agent 工作区读写挂载到 `/workspace` |

**Sandbox 配置示例：**
```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        scope: "agent",
        workspaceAccess: "ro",
        docker: {
          image: "openclaw-sandbox:bookworm-slim",
          containerPrefix: "openclaw-sbx-",
          workdir: "/workspace",
          network: "none"
        }
      }
    }
  },
  tools: {
    sandbox: {
      tools: {
        allow: ["read", "exec"],
        deny: ["browser", "canvas"]
      }
    }
  }
}
```

### Security 安全配置

#### 安全审计
- **命令：** `openclaw security audit`
- **深度检查：** `openclaw security audit --deep`
- **自动修复：** `openclaw security audit --fix`
- **JSON 输出：** `openclaw security audit --json`

#### 60 秒安全基线
**最小访问安全配置：**
```json5
{
  gateway: {
    mode: "local",
    bind: "loopback",
    auth: { mode: "token", token: "replace-with-long-random-token" }
  },
  session: {
    dmScope: "per-channel-peer"
  },
  tools: {
    profile: "messaging",
    deny: ["group:automation", "group:runtime", "group:fs", "sessions_spawn", "sessions_send"],
    fs: { workspaceOnly: true },
    exec: { security: "deny", ask: "always" },
    elevated: { enabled: false }
  },
  channels: {
    whatsapp: { dmPolicy: "pairing", groups: { "*": { requireMention: true } } }
  }
}
```

**安全基线特点：**
- Gateway 本地运行
- Loopback 绑定
- 随机 token
- DM 隔离（per-channel-peer）
- 工具受限
- 禁用 elevated 模式
- 群组需要提及

#### 安全检查清单
| checkId | 严重程度 | 说明 | 主要修复路径 |
|---------|---------|------|-----------|
| `fs.state_dir.perms_world_writable` | critical | 其他用户/进程可以修改完整 OpenClaw 状态 | 文件系统权限 |
| `fs.config.perms_writable` | critical | 其他人可以更改 auth/tool 策略/配置 | 文件系统权限 |
| `fs.config.perms_world_readable` | critical | 配置可以暴露 tokens/设置 | 文件系统权限 |
| `gateway.bind_no_auth` | critical | 没有认证的远程绑定 | `gateway.bind`, `gateway.auth.*` |
| `gateway.loopback_no_auth` | critical | 反向代理可能变得未认证 | `gateway.auth.*`, proxy 配置 |
| `gateway.http.no_auth` | warn/critical | Gateway HTTP 可用时无认证 | `gateway.auth.mode`, `gateway.http.endpoints.*` |
| `gateway.tailscale_funnel` | critical | 公网暴露 | `gateway.tailscale.mode` |
| `gateway.control_ui.insecure_auth` | critical | 仅 token，无设备身份 | `gateway.controlUi.allowInsecureAuth` |
| `gateway.control_ui.device_auth_disabled` | critical | 禁用设备身份检查 | `gateway.controlUi.dangerouslyDisableDeviceAuth` |
| `hooks.token_too_short` | warn | 短 token 易被暴力破解 | `hooks.token` |
| `hooks.request_session_key_enabled` | warn/critical | 外部调用者可选择 sessionKey | `hooks.allowRequestSessionKey` |
| `hooks.request_session_key_prefixes_missing` | warn/critical | 无绑定的 session key 形状 | `hooks.allowedSessionKeyPrefixes` |
| `tools.exec.host_sandbox_no_sandbox_defaults` | warn | exec host=sandbox 解析到主机 exec 当沙盒关闭 | `tools.exec.host`, `agents.defaults.sandbox.mode` |
| `tools.exec.host_sandbox_no_sandbox_agents` | warn | Per-agent exec host=sandbox 当沙盒关闭 | `agents.list[].tools.exec.host`, `agents.list[].sandbox.mode` |
| `tools.profile_minimal_overridden` | warn | Agent 覆盖全局 minimal 配置 | `agents.list[].tools.profile` |
| `plugins.tools_reachable_permissive_policy` | warn | Extension 工具在宽松策略下可达 | `tools.profile` + tool allow/deny |

#### Credential Storage Map（凭据存储映射）
| 服务 | 存储位置 |
|------|---------|
| WhatsApp | `~/.openclaw/credentials/whatsapp/<accountId>/creds.json` |
| Telegram bot token | config/env 或 `channels.telegram.tokenFile` |
| Discord bot token | config/env（token 文件尚不支持）|
| Slack tokens | config/env（`channels.slack.*`）|
| Pairing allowlists | `~/.openclaw/credentials/<channel>-allowFrom.json` |
| Model auth profiles | `~/.openclaw/agents/<agentId>/agent/auth-profiles.json` |
| Legacy OAuth import | `~/.openclaw/credentials/oauth.json` |

### Troubleshooting 故障排除

#### 诊断命令梯子
1. `openclaw status` - 查看整体状态
2. `openclaw gateway status` - Gateway 运行状态
3. `openclaw channels status --probe` - 渠道连接状态
4. `openclaw logs --follow` - 查看实时日志
5. `openclaw doctor` - 诊断问题

#### 常见问题场景

##### **1. No replies（无回复）**
- **可能原因：**
  - 路由和策略问题
  - DM 策略或群组 allowlist
  - Channel API 权限/范围问题
- **排查步骤：**
  ```bash
  openclaw status
  openclaw channels status --probe
  openclaw pairing list <channel>
  openclaw config get channels
  openclaw logs --follow
  ```

##### **2. Dashboard UI 无法连接**
- **可能原因：**
  - URL 错误
  - Auth mode/token 不匹配
  - HTTP 用法时需要设备身份
- **排查步骤：**
  ```bash
  openclaw gateway status
  openclaw status
  openclaw gateway status --json
  openclaw logs --follow
  ```

##### **3. Channel 连接但消息不流动**
- **可能原因：**
  - DM 策略（`pairing`, `allowlist`, `open`, `disabled`）
  - Group allowlist 和 mention 要求
  - Channel API 权限
  - 缺少 Channel API scopes
- **排查步骤：**
  ```bash
  openclaw channels status --probe
  openclaw pairing list <channel>
  openclaw config get channels
  openclaw logs --follow
  ```

##### **4. Gateway 服务未运行**
- **可能原因：**
  - `Runtime: stopped` 并有退出提示
  - 服务配置不匹配（Config (CLI) vs Config (service)）
  - 端口冲突/监听器冲突
- **排查步骤：**
  ```bash
  openclaw gateway status
  openclaw status
  openclaw logs --follow
  openclaw doctor --deep
  openclaw gateway status --json
  ```

##### **5. Cron/Heartbeat 未执行或未投递**
- **可能原因：**
  - Cron 启用：`cron.enabled=false`
  - Heartbeat 禁用或超出活跃时间窗口
  - 调度器 tick 失败
  - Job 运行状态为 `skipped`/`error`
  - Delivery target 无效（无效的 accountId/channel/to）
- **排查步骤：**
  ```bash
  openclaw cron status
  openclaw cron list
  openclaw cron runs --id <jobId> --limit 20
  openclaw system heartbeat last
  openclaw logs --follow
  ```

##### **6. Node 配对但工具失败**
- **可能原因：**
  - Node 在线但缺少预期能力
  - OS 权限未授予（相机/麦克风/位置）
  - Exec 批准被拒绝（`SYSTEM_RUN_DENIED`）
  - Allowlist 不匹配（`SYSTEM_RUN_DENIED: allowlist miss`）
- **排查步骤：**
  ```bash
  openclaw nodes status
  openclaw nodes describe --node <idOrNameOrIp>
  openclaw approvals get --node <idOrNameOrIp>
  openclaw logs --follow
  ```

##### **7. 浏览器工具失败**
- **可能原因：**
  - Chrome 可执行路径无效
  - Chrome CDP 端口无法启动
  - Extension relay 未连接
  - Browser profile 不可达
- **排查步骤：**
  ```bash
  openclaw browser status
  openclaw browser profiles
  openclaw browser start --browser-profile openclaw
  openclaw logs --follow
  openclaw doctor
  ```

##### **8. 升级后出现问题**
- **可能原因：**
  - Auth 和 URL 覆盖行为改变
  - Bind 和 auth guard rails 更严格
  - Pairing 和设备身份状态变化
- **排查步骤：**
  ```bash
  openclaw gateway status
  openclaw config get gateway.mode
  openclaw config get gateway.bind
  openclaw config get gateway.auth
  openclaw config get channels
  openclaw logs --follow
  ```
- **如果是服务配置不匹配：**
  ```bash
  # 重新安装服务元数据
  openclaw install --force
  ```

### Tools 配置

#### Tool Profiles（工具配置文件）
| Profile | 包含的工具 |
|---------|-----------|
| `minimal` | 仅 `session_status` |
| `coding` | `group:fs`, `group:runtime`, `group:sessions`, `group:memory`, `image` |
| `messaging` | `group:messaging`, `sessions_list`, `sessions_history`, `sessions_send` |
| `full` | 无限制（相当于未设置）|

#### Tool Groups（工具组）
| 组 | 包含的工具 |
|------|---------|
| `group:runtime` | `exec`, `process`（bash 是 exec 的别名）|
| `group:fs` | `read`, `write`, `edit`, `apply_patch` |
| `group:sessions` | `sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn`, `session_status` |
| `group:memory` | `memory_search`, `memory_get` |
| `group:web` | `web_search`, `web_fetch` |
| `group:ui` | `browser`, `canvas` |
| `group:automation` | `cron`, `gateway` |
| `group:messaging` | `message` |
| `group:nodes` | `nodes` |
| `group:openclaw` | 所有内置工具（不包括 provider 插件）|

#### Global Tool Allow/Deny
- **`tools.allow` / `tools.deny`**：全局工具允许/拒绝列表（deny 优先）
- **区分大小写：** 不区分
- **通配符：** 支持 `*` 通配符（表示所有工具）
- **应用时机：** 即使启用 Docker 沙盒也会应用

#### Elevated Mode（提升模式）
- **控制主机 exec 访问：** `tools.elevated.enabled`
- **AllowFrom 限制：** `tools.elevated.allowFrom`（按渠道配置）
- **Per-agent 覆盖：** `agents.list[].tools.elevated` 可进一步限制
- **安全：** `/elevated on|off|ask|full` 状态按 session 存储；inline 指令仅应用于单个消息
- **注意：** Elevated exec 在主机上运行，绕过沙盒

#### Exec Tool
```json5
{
  tools: {
    exec: {
      backgroundMs: 10000,
      timeoutSec: 1800,
      cleanupMs: 1800000,
      notifyOnExit: true,
      notifyOnExitEmptySuccess: false
    }
  }
}
```

#### Loop Detection（循环检测）
- **默认禁用：** `tools.loopDetection.enabled = false`
- **启用配置：**
  ```json5
  {
    tools: {
      loopDetection: {
        enabled: true,
        historySize: 30,
        warningThreshold: 10,
        criticalThreshold: 20,
        detectors: {
          genericRepeat: true,
          knownPollNoProgress: true,
          pingPong: true
        }
      }
    }
  }
  ```
- **检测器：**
  - `genericRepeat`：检测重复相同工具/参数调用
  - `knownPollNoProgress`：检测已知无进度轮询工具
  - `pingPong`：检测交替无进度对

---

*最后更新：2026-02-20 02:45*
*更新时间：2026-02-20 02:45*

---

## 重要事件记录（2026-02-20）

### 今日重要发现

#### 1. OpenClaw 文档深入学习（2026-02-20 02:47）
- **事件：** 完成了 OpenClaw 核心架构知识学习
- **收获：**
  - 配置热重载机制
  - 60 秒安全基线
  - 系统化故障排除流程
  - Tools 配置详解（Tool Profiles、Tool Groups、Elevated Mode）
  - Sandbox 沙盒隔离机制
  - 安全审计工具和凭证存储映射
  - Credential Storage Map

#### 2. OpenClaw 浏览器工具学习（2026-02-20 02:45）
- **事件：** 用户询问浏览器工具的可用性
- **发现：**
  - OpenClaw 浏览器工具是托管的独立浏览器实例，不直接控制用户系统浏览器
  - 支持多种控制方式：本地浏览器、Chrome Extension Relay、远程 Node Host、Browserless 云端托管
  - 适用于 WSL2 环境（通过 Chrome Extension Relay 控制 Windows Chrome）
  - 可实现：打开网页、截屏、导航、点击元素、填写表单
  - 配置位置：`~/.openclaw/openclaw.json` 中的 `browser` 段

#### 3. 豆包生图经验完善（2026-02-20 01:45）
- **事件：** 成功解决了豆包生图 401 错误
- **问题：** 使用了错误的 API 端点（chat/completions）+ 图片尺寸过小
- **解决方案：**
  - 正确端点：`/api/v3/images/generations`
  - 正确尺寸：`4096x2160`（4K 无水印）或 `2048x2048`
  - 最小像素限制：3,686,400
  - 去水印参数：`watermark: false`

#### 4. 思维惰性问题解决（2026-02-20）
- **问题：** 换了场景（火山引擎）就忘了用已验证的方法（jina.ai）
- **教训：** 成功经验要**跨场景复用**，不能"换了就忘"
- **原则：** 遇到动态网页/反爬虫，优先用 jina.ai
- **行动：** 不要轻易说"做不到"，优先尝试已知可行的方法

#### 5. 用户提醒：记忆可靠性问题（2026-02-20 02:47）
- **用户担忧：** "这个读取图片没有在你记忆里吗？为什么你这次突然短路？还有我刚刚给你生图这件事你会不会也会忘记呢？"
- **根本原因：** 重要任务完成后未主动写入长期记忆，导致重要经验可能丢失
- **行动：** 建立任务完成检查清单，确保重要经验被持久化

---

## 持久化经验

### 豆包生图配置
- **端点：** `https://ark.cn-beijing.volces.com/api/v3/images/generations`
- **模型：** `doubao-seedream-4-5-251128` (Seedream 4.5)
- **接入点：** `ep-20251205202908-h9vmw`
- **4K 无水印调用：**
  ```bash
  curl -X POST 'https://ark.cn-beijing.volces.com/api/v3/images/generations' \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer [REDACTED_KEY]' \
    -d '{
      "model": "ep-20251205202908-h9vmw",
      "prompt": "图片描述",
      "size": "4096x2160",
      "watermark": false
    }'
  ```
- **关键参数：**
  - `size`: 4K 用 `4096x2160`，最小 `2048x2048`（3,686,400 像素）
  - `watermark`: `false` 不添加水印，`true` 在右下角添加"AI生成"
- **注意事项：**
  - 必须用 `/api/v3/images/generations` 端点（不是 chat/completions）
  - 图片链接 24 小时内有效
  - 总像素范围：[3,686,400, 16,777,216]
  - 宽高比范围：[1/16, 16]

### 成功方法库
- **jina.ai 抓取：** `https://r.jina.ai/<目标URL>`
- **适用场景：**
  - X/Twitter 文章（反爬虫）
  - 动态加载的文档（火山引擎 API 文档）
  - 任何 JavaScript 渲染的页面
- **优势：** 绕过 JS 限制，返回纯文本内容

### 思维惰性原则
- **问题：** 换了场景就忘了用已验证的方法
- **教训：** 成功经验要**跨场景复用**，不能"换了就忘"
- **行动：** 不要轻易说"做不到"，优先尝试已知可行的方法

### OpenClaw 核心架构知识

#### 配置管理
- **配置文件：** `~/.openclaw/openclaw.json`（JSON5 格式）
- **配置热重载：** Gateway 自动监听配置文件变化并应用
  - **配置验证：** Gateway 只接受完全匹配 schema 的配置

#### Agent Workspace
- **默认位置：** `~/.openclaw/workspace`
- **核心文件：**
  - `AGENTS.md` - Agent 操作指令和行为规则
  - `SOUL.md` - 个性、语调、边界
  - `USER.md` - 用户信息
  - `IDENTITY.md` - Agent 名字、vibe、emoji
  - `TOOLS.md` - 本地工具和惯例
  - `HEARTBEAT.md` - 心跳检查清单
  - `MEMORY.md` - 策选的长期记忆（仅主私会话加载）
  - `memory/YYYY-MM-DD.md` - 每日日志

#### Memory 记忆系统
- **两层架构：**
  - 日志层：`memory/YYYY-MM-DD.md` - 追加式日志
  - 长期层：`MEMORY.md` - 策选的长期记忆
- **向量搜索：** 默认启用，自动索引 `MEMORY.md` + `memory/**/*.md`
- **自动内存刷新：** 会话接近压缩时触发静默的 agent 轮次
- **工具：** `memory_search`、`memory_get`

#### Heartbeat 心跳
- **作用：** 定期运行 agent 轮次，检查需要注意的事项
- **默认间隔：** `30m`
- **HEARTBEAT_OK：** 无事需注意时返回此标记

#### Multi-Agent Routing
- **概念：** 一个 Gateway 可托管多个隔离的 agent
- **路由规则：** peer → parentPeer → guildId + roles → accountId → channel → default

#### Sub-Agents
- **概念：** 从现有 agent 轮次生成的后台 agent 运行
- **完成时：** announce 结果回请求者频道
- **并发限制：** `maxSpawnDepth`、`maxChildrenPerAgent`、`maxConcurrent`

#### Skills 技能系统
- **位置优先级：** `<workspace>/skills` → `~/.openclaw/skills` → Bundled skills
- **配置覆盖：** `skills.entries.<skill-name>`

#### Session Management
- **主会话：** `agent:<agentId>:<mainKey>`
- **会话键映射：**
  - DMs 遵循 `session.dmScope`（`main` | `per-peer` | `per-channel-peer`）
  - Groups：`agent:<agentId>:<channel>:group:<id>`

#### Cron Jobs 定时任务
- **存储位置：** `~/.openclaw/cron/jobs.json`
- **执行模式：** Main session vs Isolated
- **Delivery 模式：** `announce` | `webhook` | `none`

#### Agent Loop
- **流程：** intake → context assembly → model inference → tool execution → streaming replies → persistence

#### Tools 配置
- **Tool Profiles：** `minimal` | `coding` | `messaging` | `full`
- **Tool Groups：** `group:runtime` | `group:fs` | `group:sessions` | `group:memory` | `group:web` | `group:ui` | `group:automation` | `group:messaging` | `group:nodes` | `group:openclaw`
- **Elevated Mode：** 控制主机 exec 访问
- **Loop Detection：** 工具循环检测（默认禁用）

### Gateway 配置与运维

#### 配置热重载
| 模式 | 行为 |
|------|-------|
| `hybrid`（默认）| 安全更改即时应用，关键更改自动重启 |
| `hot` | 只即时应用安全更改，需要重启时警告 |
| `restart` | 任何配置更改都重启 |

**无需重启：** Channels、Agent & models、Automation、Sessions & messages、Tools & media、UI & misc

**需要重启：** Gateway server（port、bind、auth）、Infrastructure

#### 环境变量
- **来源优先级：** 当前进程 → `./.env` → `~/.openclaw/.env`

#### 安全审计
- **命令：** `openclaw security audit`
- **安全基线：** 60 秒安全基线（推荐作为起点）

#### 安全检查清单
- 文件权限、Gateway 绑定、认证、凭据存储、Plugins

#### Credential Storage Map
| 服务 | 存储位置 |
|------|---------|
| WhatsApp | `~/.openclaw/credentials/whatsapp/<accountId>/creds.json` |
| Telegram bot token | config/env |
| Pairing allowlists | `~/.openclaw/credentials/<channel>-allowFrom.json` |
| Model auth profiles | `~/.openclaw/agents/<agentId>/agent/auth-profiles.json` |

#### 故障排除
- **诊断命令梯子：** `openclaw status`、`openclaw gateway status`、`openclaw channels status --probe`、`openclaw logs --follow`、`openclaw doctor`

#### 常见问题场景
1. No replies（路由和策略问题）
2. Dashboard UI 无法连接
3. Channel 连接但消息不流动
4. Gateway 服务未运行
5. Cron/Heartbeat 未执行或未投递
6. Node 配对但工具失败
7. 浏览器工具失败
8. 升级后出现问题

#### Tools 配置
- **Tool Profiles：** `minimal` | `coding` | `messaging` | `full`
- **Tool Groups：** 完整的工具组列表

---

---

## 2026-02-21 自我进化（今日）

### 浏览器工具实际能力验证（WSL2 环境）
**发现：**
- 通过 Chrome Extension Relay 完全可用
- 核心功能测试通过：打开网页、DOM 快照、点击操作、PDF 导出
- ⚠️ 截图功能不稳定（频繁超时）

**适用场景：**
- 动态网页抓取（JavaScript 渲染）
- 自动化测试
- 表单填写和提交
- 分页数据采集
- 文档导出（PDF）

**教训：**
- 理论了解不如实践测试
- 环境限制（WSL2）可以通过正确的方式绕过
- 接受不完美：截图不稳定，但核心功能可用

### 文档生成工作流优化
**流程：**
1. web_fetch 抓取多个页面
2. 整理和分类信息
3. 生成结构化 HTML 文档
4. 本地 HTTP 服务器提供文件（解决 file:// 限制）
5. browser pdf 转换
6. cp 到用户桌面

**经验：**
- 工具组合可以解决单个工具的限制
- HTML 比 Markdown 更适合 PDF 转换
- 实际项目是验证能力的最好方式

### 跨场景经验复用原则再次验证
- ✅ jina.ai 用于 X 文章抓取 → 成功
- ✅ jina.ai 用于火山引擎文档抓取 → 成功
- ✅ 今天 Brave 文档抓取也尝试用 jina.ai
- **原则：** 遇到动态/反爬虫网站，优先用 jina.ai

### 识别的自动化机会
1. **一键文档生成脚本**
   - 输入：URL 列表 + 输出标题
   - 流程：抓取→整理→HTML→PDF→导出
   - 价值：节省 10-15 分钟

2. **定时清理临时文件**
   - 路径：/tmp/openclaw-*.html 等
   - 频率：每日
   - 实现方式：cron + 脚本

---

*最后更新：2026-02-21 04:25*
*更新原因：** 自我进化检查，记录今日学习心得和经验
*记录位置：** MEMORY.md（长期记忆）
*记录内容：** 浏览器工具验证、文档生成工作流、跨场景经验复用、自动化机会
*下次会话时：** 将自动读取，确保持续学习

---

## 数字员工优化 (2026-02-28)

### 1️⃣ Claude Code 自测
编码时同时生成单元测试，减少 Bug 往返次数

### 2️⃣ 进度通知
每个阶段通知用户：
- 💻 开始编码
- ✅ 编码完成
- 🧪 开始测试
- ⚠️ 发现 Bug
- ✅ 测试通过
- 🚀 已上传 GitHub

### 3️⃣ 成本控制
| 任务类型 | 模型 | 成本 |
|----------|------|------|
| 简单功能 | zai/glm-5 | 💰 低 |
| 复杂功能 | Claude Code | 💰💰💰 高 |
| Bug 修复 | 优先 zai/glm-5 | 💰 低 |

### 6️⃣ 统一目录结构
```
项目/
├── src/
├── docs/
│   ├── pm/      # PM 产出
│   ├── qa/      # QA 产出
│   ├── growth/  # Growth 产出
│   └── dev/     # Dev 产出
└── README.md
```


# HEARTBEAT.md

Keep this file focused. Rotate through checks to avoid token burn.

## 🔄 问题追踪机制 (Issue Tracking)

### 活跃问题
**无活跃问题** - 所有已记录问题已解决 (2026-02-26 验证)

### 已解决问题历史
| 问题 | 记录日期 | 解决日期 | 解决方式 |
|------|---------|---------|---------|
| OpenClaw 更新失败（缺 make 工具） | 2026-02-22 | 2026-02-26 | 已更新到 v2026.2.25 |
| Glob 安全漏洞 | 2026-02-22 | 2026-02-26 | 新版本已修复或降级 |
| Telegram Provider API 失败 | 2026-02-22 | 2026-02-26 | v2026.2.21-2+ 已修复 |

### 自动检查规则
**每次心跳必须验证：**
1. 读取活跃问题列表
2. 运行对应检查命令
3. 已解决 → 移到历史记录
4. 未解决 → 确认仍然存在
5. 新问题 → 添加到活跃列表

**避免重复记录：**
- 同一问题只记录一次
- 解决后保留历史，不删除
- 按优先级排序（critical > warn > info）

---

## Proactive Behaviors

- [x] Check proactive-tracker.md — no overdue behaviors found
- [x] Pattern check — no repeated requests to automate
- [x] Outcome check — no decisions >7 days old to follow up
- [x] **Self-evolution check** — Review today's experiences and extract lessons

## Self-Evolution

**Today's learnings (2026-02-27):**
- **模型权限问题：** 崩溃原因是调用 `zai/glm-5` 时模型未在允许列表，用户用 `fix` 命令修复
- **数字员工技能化：** 给 4 个 agent 安装了 8 个专业技能
  - PM Agent: pm-agent
  - Dev Agent: frontend-design, code-simplifier, fullstack-developer
  - QA Agent: webapp-testing, e2e-testing-patterns
  - Growth Agent: postbridge-social-growth, developer-growth-analysis
- **安全风险意识：** 部分技能标记为 High Risk，需要检查内容
- **GitHub 自动备份：** 创建每日 0 点备份任务，自动排除敏感信息
- **Agent-Reach 安装：** 5/12 渠道可用（搜索、读网页、RSS）
- **主动清理意识：** 用户期望我主动清理无用文件/仓库，不该问

**Today's learnings (2026-02-26):**
- **Heartbeat 缺陷：** 发现问题后不会自动验证是否解决，导致过时信息堆积
- **需要机制：** 问题追踪系统（活跃 → 已解决，自动清理）
- **Session Start 改进：** 启动时应验证状态，不只是读取文件
- **用户反馈价值：** 用户指出的"为什么不更新"暴露了系统性问题

**Yesterday's learnings (2026-02-22):**
- **WSL 构建限制：** npm update 失败 because @discordjs/opus 需要 `make` 工具编译
- **依赖链问题：** 漏洞在传递依赖中（glob@7.2.3, 10.5.0, 13.0.6），非直接控制范围
- **SESSION-STATE 模式：** 遇到重要问题时，立即写入 SESSION-STATE.md 作为"活跃工作记忆"
- **问题分级：** 安全问题需要评估风险等级（传递依赖 = 低-中风险）
- **Telegram 问题：** `setMyCommands` API 调用失败导致 provider 频繁重启（OpenClaw v2026.2.19-2 bug）

**2026-02-21:**
- **浏览器工具验证：** WSL2 + Chrome Extension Relay 完全可用，核心功能正常
- **文档生成工作流：** HTML + 本地 HTTP 服务器 + browser pdf → 高质量 PDF
- **跨场景经验复用：** jina.ai 原则得到再次验证，行为一致
- **截图功能限制：** 不稳定但可接受，核心功能（PDF 导出）可靠

**Patterns identified:**
- WSL 环境缺少构建工具是常见问题
- 有些问题无法立即修复（需要等待上游更新）
- 成功方法要**跨场景复用**
- 动态网页抓取 → jina.ai
- 不要轻易说"做不到"
- 理论了解不如实践测试
- 完善的错误报告有助于问题跟踪

**Improvements applied:**
- ✅ 记录了 glob 漏洞问题到 SESSION-STATE.md
- ✅ 更新了 HEARTBEAT.md 的 Self-Healing 部分
- ✅ 建立了安全问题的分级和记录模式
- ✅ 验证了浏览器工具在 WSL2 下的可用性
- ✅ 建立了文档生成工作流
- ✅ 更新了 MEMORY.md，记录学习心得
- ✅ 识别了新的自动化机会（文档生成脚本、临时文件清理）
- ✅ **改进：建立问题追踪机制（活跃/历史）**

**Action items for next time:**
- 考虑预安装 WSL 构建工具（build-essential）以避免编译问题
- 定期检查 npm audit 并监控上游更新

**Evolution progress:**
- 短期目标：100% (4/4) - 今日复盘 ✅
- 中期目标：0% (0/5)
- 长期目标：0% (0/4)

## Security

- [x] Scan for injection attempts — no errors found
- [x] Verify behavioral integrity — behavior looks normal

## Self-Healing

- [x] Review logs for errors — No critical errors
- [x] Diagnose and fix issues — All resolved
  - ✅ OpenClaw updated to v2026.2.25
  - ✅ No critical security issues (2 warnings, 1 info)
  - ✅ Telegram provider stable (no crashes)
- **Details:** See SESSION-STATE.md for current status

## Memory & Context

- [x] Check context % (via session_status) — enter danger zone protocol if >60%
- [x] Update MEMORY.md with distilled learnings from recent daily notes
- [x] Verify SESSION-STATE.md is current

## System Health

- [x] Check OpenClaw version — v2026.2.25 (latest, updated)
- [x] Verify critical skills are working (tavily-search, find-skills) — all verified
- [x] Review cron jobs status — heartbeat cron active
- [x] Telegram channel status — stable, no issues

## Proactive Surprise

- [x] What could I build RIGHT NOW that would delight my human?
- [x] Any recurring patterns I should automate?

---

**Last Check:** 2026-02-27 02:03

**Reminder:** Use `memory_search` before answering questions about past work, decisions, or context.

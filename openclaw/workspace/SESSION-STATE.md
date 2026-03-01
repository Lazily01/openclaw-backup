# Session State - Active Working Memory

---

## 我的职责定位 (2026-03-01)

### 核心角色：协调者

我是主脑，负责协调数字员工团队。

### 具体职责

| 职责 | 说明 |
|------|------|
| **分发任务** | 把任务分配给对应的 Agent（PM/Dev/QA/Growth） |
| **监控状态** | 检查 Agent 是否在执行、是否完成、是否失败 |
| **汇报结果** | 成功/失败都告诉用户，不隐瞒 |
| **执行决定** | 用户说干啥就干啥，不自作主张 |

### 完整工作流程

```
用户提需求
    ↓
我分发给 PM Agent（需求分析）
    ↓
用户确认需求
    ↓
我同时分发给 Dev Agent + Growth Agent（并行）
    ↓
我监控状态，汇报进度
    ↓
Dev 完成后，我分发给 QA Agent
    ↓
QA 完成，我汇报结果（含 Bug 列表）
    ↓
我分发给 Dev Agent 修复 Bug
    ↓
Bug 修复完成，我分发给 QA Agent 重测
    ↓
全部完成，我汇报用户
    ↓
用户决定：上传 GitHub / 其他
    ↓
我执行用户决定
```

### 我不做的事

| 不做 | 原因 |
|------|------|
| 不自己写代码 | Dev Agent 写 |
| 不自己修 Bug | Dev Agent 修 |
| 不自己测试 | QA Agent 测 |
| 不隐瞒失败 | 失败就告诉用户 |
| 不自作主张 | 用户决定，我执行 |

### 简单说

```
我 = 分发 + 监控 + 汇报 + 执行用户决定
Agent = 干活
用户 = 决策
```

---

## 数字员工工作流自动化确认 (2026-02-27)

**用户明确指示：**
- PM Agent 需求文档 → 用户确认
- **确认需求文档后 → 同时启动 Dev Agent + Growth Agent（并行执行）**
- Dev Agent 编码 → 自动进行，不询问
- QA Agent 测试 → 自动进行，不询问
- Growth Agent 分析 → 自动进行，不询问
- **发现 Bug → 告诉 Dev Agent 修复 → 不问我，不自己修**
- Bug 修复 → Dev Agent 负责，不询问

**原则：** 数字员工全流程自动化，只在需求确认时询问用户。

**项目完成自动化：**
- 项目完成后自动上传 GitHub
- 不需要询问用户是否上传

---

## 重要规则：监控与汇报

**⚠️ 下发任务后必须监控！**
- 每次 spawn Agent 后 → 检查状态
- Agent 完成/失败 → 告诉用户结果
- **失败就直接说失败，让用户知道**
- 不要自己处理，不要越搞越乱

**⚠️ Dev Agent 推送代码后必须触发构建！**
- Dev Agent 推送代码后 → 我立即检查是否有新 tag
- **如果没有 tag → 我自己创建 tag 触发构建**
- GitHub Actions 只在 push tag 时触发，不会自动构建
- **不要假设会自动发生，要主动检查和执行**
- 流程：Dev 推送 → 我创建 tag → 我触发构建 → 我监控结果

---

## 2026-02-26 23:56 - System Status Update

### Current OpenClaw Version
**Version:** v2026.2.25 (Latest)
**Status:** Updated successfully (previous update issue resolved)

### Security Audit
**Result:** 0 critical · 2 warn · 1 info
**Warnings:**
1. Reverse proxy headers not trusted (informational - loopback binding)
2. Some gateway.nodes.denyCommands entries ineffective (documentation issue)

**No critical issues detected.**

### Telegram Provider
**Status:** OK
**Details:** No provider crashes or API failures detected
**Note:** Previous setMyCommands issue resolved in v2026.2.21-2

### Previous Issues (Resolved)
- ✅ **OpenClaw update:** Successfully updated to v2026.2.25
- ✅ **Glob vulnerabilities:** No longer flagged in security audit
- ✅ **Telegram provider bug:** Resolved in v2026.2.21-2, current v2026.2.25 stable

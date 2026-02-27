# 📝 待办清单应用

一款简洁高效的 Web 端待办清单应用，帮助用户管理日常任务，提升工作效率。

## ✨ 功能特性

### 核心功能
- ✅ **添加任务** - 输入任务内容，按回车或点击按钮快速添加
- ✅ **删除任务** - 点击删除按钮移除不需要的任务
- ✅ **标记完成** - 点击复选框切换任务完成状态，已完成任务有视觉区分
- ✅ **数据持久化** - 所有数据保存在浏览器 localStorage，刷新页面不丢失

### 扩展功能
- ✅ **编辑任务** - 双击任务内容进入编辑模式，按 Enter 保存，按 Esc 取消
- ✅ **任务筛选** - 支持查看全部/未完成/已完成任务
- ✅ **清除已完成** - 一键清除所有已完成的任务
- ✅ **响应式设计** - 完美适配桌面端和移动端

## 🛠️ 技术栈

- **前端框架:** Vue 3 (Composition API)
- **构建工具:** Vite 5
- **数据存储:** localStorage API
- **样式方案:** 原生 CSS 变量

## 📁 项目结构

```
todo-app/
├── index.html              # 入口页面
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
├── README.md               # 项目文档
└── src/
    ├── main.js             # 应用入口
    ├── App.vue             # 根组件
    ├── components/
    │   ├── TodoInput.vue   # 输入组件
    │   ├── TodoList.vue    # 列表组件
    │   └── TodoItem.vue    # 单项组件
    ├── composables/
    │   └── useTodoStorage.js  # localStorage 封装
    └── styles/
        └── main.css        # 全局样式
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录

### 预览生产版本

```bash
npm run preview
```

## 📖 使用指南

### 添加任务
1. 在输入框中输入任务内容
2. 按 **Enter** 键或点击 **添加** 按钮
3. 任务将添加到列表顶部

### 完成任务
1. 点击任务左侧的复选框
2. 已完成任务会显示删除线和灰色样式

### 编辑任务
1. 双击任务文本进入编辑模式
2. 修改内容后按 **Enter** 保存
3. 按 **Esc** 取消编辑

### 删除任务
1. 点击任务右侧的删除按钮（×）
2. 任务将立即从列表中移除

### 筛选任务
- 点击 **全部** 查看所有任务
- 点击 **未完成** 仅查看未完成任务
- 点击 **已完成** 仅查看已完成任务

### 清除已完成
- 点击 **清除已完成** 按钮一键删除所有已完成的任务

## 🎨 设计特点

- **极简主义** - 界面简洁清爽，专注任务本身
- **响应式布局** - 完美适配各种屏幕尺寸
- **流畅动画** - 列表项添加/删除有平滑过渡效果
- **直观交互** - 鼠标悬停、点击等操作有清晰反馈

## 💾 数据存储

应用使用浏览器 localStorage 存储数据：

- **存储 Key:** `todo-app-data`
- **存储格式:** JSON 数组
- **存储限制:** 约 5MB（浏览器限制）

## 🌐 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端浏览器

## 📝 开发说明

### 组件架构

```
App.vue (根组件 - 状态管理)
├── TodoInput.vue (输入组件)
└── TodoList.vue (列表组件)
    └── TodoItem.vue (单项组件)
```

### 数据流

1. **App.vue** 管理所有状态和核心逻辑
2. 通过 `props` 向下传递数据
3. 通过 `emit` 向上触发事件
4. localStorage 自动同步持久化

### 组合式函数

`useTodoStorage.js` 封装了 localStorage 操作：

```javascript
import { useTodoStorage } from './composables/useTodoStorage.js'

const { loadTodos, saveTodos } = useTodoStorage()

// 读取数据
const todos = loadTodos()

// 保存数据
saveTodos(todos)
```

## 📄 License

MIT License

## 👥 作者

Dev Agent - OpenClaw 开发团队

---

**提示：** 所有数据保存在浏览器本地，清除浏览器数据会导致任务丢失，请谨慎操作。

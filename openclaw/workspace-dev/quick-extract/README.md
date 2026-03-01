# QuickExtract - 解压工具

轻量级跨平台解压工具，支持预览功能。

## 功能特性

| 功能 | 说明 |
|------|------|
| 解压 | ZIP, 7z, tar.gz, RAR 等格式 |
| 预览 | 不解压查看压缩包内容 |
| 拖拽 | 拖文件到窗口直接解压 |
| 双平台 | Windows + Mac |

## 技术栈

- **框架:** Tauri 2.x
- **前端:** React + TypeScript + Tailwind CSS
- **后端:** Rust
- **包管理:** pnpm

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm tauri dev

# 构建
pnpm tauri build
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

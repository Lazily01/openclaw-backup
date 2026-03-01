# QuickExtract Bug 列表

**项目名称:** QuickExtract  
**报告日期:** 2026-03-01  
**报告人员:** QA Agent

---

## Bug 统计

| 级别 | 数量 |
|------|------|
| CRITICAL | 0 |
| MAJOR | 2 |
| MINOR | 3 |
| **总计** | **5** |

---

## MAJOR 级别问题

### BUG-001: 拖拽功能未真正实现

| 属性 | 值 |
|------|-----|
| **级别** | MAJOR |
| **模块** | 前端 - DropZone.tsx |
| **影响** | 用户无法通过拖拽方式添加文件，与需求文档不符 |
| **状态** | 待修复 |

**问题描述:**

DropZone 组件的 `handleDrop` 函数没有处理实际拖拽进来的文件，而是直接调用文件选择对话框：

```tsx
const handleDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(false);
  // 问题：直接调用文件选择，未处理拖拽的文件
  handleSelectFile();
}, []);
```

**预期行为:**

应该从 `e.dataTransfer.files` 获取拖拽的文件，并处理文件路径。

**修复建议:**

```tsx
const handleDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(false);
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    // 在 Tauri 环境中，需要获取文件的实际路径
    // 可能需要使用 Tauri 的文件系统 API
    const file = files[0];
    // 处理文件...
  }
}, []);
```

**注意:** Tauri 的安全模型可能限制直接访问拖拽文件的路径，可能需要使用 `tauri-plugin-fs` 或其他方式处理。

---

### BUG-002: 缺少 7z 格式支持

| 属性 | 值 |
|------|-----|
| **级别** | MAJOR |
| **模块** | 后端 - lib.rs |
| **影响** | 不支持需求文档中 P0 优先级的 7z 格式 |
| **状态** | 待实现 |

**问题描述:**

根据需求文档，7z 是 P0 优先级的格式，但当前代码未实现 7z 支持：

```rust
fn get_archive_format(path: &str) -> Option<&'static str> {
    let path_lower = path.to_lowercase();
    if path_lower.ends_with(".zip") {
        Some("zip")
    } else if path_lower.ends_with(".tar.gz") || path_lower.ends_with(".tgz") {
        Some("tar.gz")
    } else if path_lower.ends_with(".tar.bz2") || path_lower.ends_with(".tbz2") {
        Some("tar.bz2")
    } else if path_lower.ends_with(".tar") {
        Some("tar")
    } else {
        None  // 不支持 7z
    }
}
```

**影响范围:**

| 格式 | 需求优先级 | 当前支持 |
|------|-----------|---------|
| ZIP | P0 | ✅ |
| 7z | P0 | ❌ |
| tar.gz | P0 | ✅ |
| tar.bz2 | P0 | ✅ |

**修复建议:**

1. 使用 `sevenz-rust` crate 实现 7z 支持
2. 或通过子进程调用系统 7z 命令行工具

---

## MINOR 级别问题

### BUG-003: 大文件列表缺少虚拟滚动

| 属性 | 值 |
|------|-----|
| **级别** | MINOR |
| **模块** | 前端 - FileList.tsx |
| **影响** | 超多文件压缩包（>1000 文件）可能导致界面卡顿 |
| **状态** | 待优化 |

**问题描述:**

FileList 组件使用普通表格渲染所有文件，未实现虚拟滚动：

```tsx
<tbody className="divide-y divide-slate-700/30">
  {entries.map((entry, index) => (
    <tr key={`${entry.path}-${index}`}>
      {/* 渲染每一行 */}
    </tr>
  ))}
</tbody>
```

**影响分析:**

- 100 文件：无明显影响
- 1000 文件：可能有轻微延迟
- 10000+ 文件：明显的性能问题

**修复建议:**

使用虚拟滚动库（如 `react-virtualized` 或 `@tanstack/react-virtual`）：

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

// 在组件中
const rowVirtualizer = useVirtualizer({
  count: entries.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 40, // 每行高度
});
```

---

### BUG-004: 符号链接未处理

| 属性 | 值 |
|------|-----|
| **级别** | MINOR |
| **模块** | 后端 - lib.rs |
| **影响** | 潜在安全风险，压缩包中的符号链接可能导致意外行为 |
| **状态** | 待实现 |

**问题描述:**

当前代码未检测和处理符号链接，攻击者可能通过构造包含恶意符号链接的压缩包进行攻击：

```rust
// 当前代码只检查 is_dir，未检查符号链接
if file.is_dir() {
    fs::create_dir_all(&out_path).map_err(|e| format!("无法创建目录: {}", e))?;
}
```

**潜在风险:**

1. 符号链接指向系统敏感目录
2. 符号链接指向其他用户目录
3. 符号链接造成路径逃逸

**修复建议:**

```rust
// 检查是否为符号链接
#[cfg(unix)]
use std::os::unix::fs::FileTypeExt;

fn is_symlink(entry: &zip::read::ZipFile) -> bool {
    // 检查文件类型
    // ZIP 中符号链接的特殊处理
}

// 在解压时
if is_symlink(&file) {
    // 选择性处理：
    // 1. 跳过符号链接
    // 2. 解引用符号链接
    // 3. 提示用户
}
```

---

### BUG-005: 解压炸弹未检测

| 属性 | 值 |
|------|-----|
| **级别** | MINOR |
| **模块** | 后端 - lib.rs |
| **影响** | 恶意压缩包可能导致磁盘空间耗尽或内存溢出 |
| **状态** | 待实现 |

**问题描述:**

当前代码未检测解压炸弹（Zip Bomb），如著名的 `42.zip`，解压后大小可达 4.5GB。

**潜在风险:**

1. 磁盘空间耗尽
2. 内存溢出
3. 拒绝服务

**修复建议:**

添加预检查机制：

```rust
const MAX_COMPRESSION_RATIO: f64 = 100.0; // 最大压缩比
const MAX_TOTAL_SIZE: u64 = 10 * 1024 * 1024 * 1024; // 10GB

fn check_zip_bomb(path: &str) -> Result<(), String> {
    // 1. 计算总大小
    let total_uncompressed: u64 = /* 遍历计算 */;
    let total_compressed = fs::metadata(path)?.len();
    
    // 2. 检查压缩比
    let ratio = total_uncompressed as f64 / total_compressed as f64;
    if ratio > MAX_COMPRESSION_RATIO {
        return Err("检测到可能的解压炸弹，压缩比过高".to_string());
    }
    
    // 3. 检查总大小
    if total_uncompressed > MAX_TOTAL_SIZE {
        return Err("解压后文件过大，请确认后继续".to_string());
    }
    
    Ok(())
}
```

---

## 改进建议（非 Bug）

### IMP-001: 密码处理优化

**当前实现:**
```rust
archive.by_index_decrypt(i, password.unwrap_or("").as_bytes())
```

**问题:** 使用空字符串作为默认密码可能不是最佳实践。

**建议:** 检测 ZIP 是否加密后再决定是否需要密码：

```rust
if file.is_encrypted() && password.is_none() {
    return Err("文件已加密，请提供密码".to_string());
}
```

---

### IMP-002: 错误信息国际化

**当前实现:** 所有错误信息硬编码为中文。

**建议:** 考虑使用国际化方案：

```rust
// 使用枚举或常量
enum ErrorMessage {
    FileNotFound,
    InvalidFormat,
    PasswordRequired,
    // ...
}

impl ErrorMessage {
    fn to_string(&self, lang: &str) -> String {
        // 根据语言返回对应消息
    }
}
```

---

## 更新日志

| 日期 | 操作 | 说明 |
|------|------|------|
| 2026-03-01 | 创建 | 初始 Bug 列表，基于代码审查 |

---

**注意:** 以上 Bug 和改进建议基于代码审查，实际测试结果可能有所不同。建议在获取运行环境后进行实际测试验证。

use std::fs::{self, File};
use std::io::{self, Read, BufReader};
use std::path::{Path, PathBuf, Component};
use serde::{Deserialize, Serialize};
use tauri::{Manager, Emitter};
use tauri_plugin_dialog::DialogExt;
use walkdir::WalkDir;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArchiveEntry {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub is_dir: bool,
    pub modified: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtractProgress {
    pub current: u64,
    pub total: u64,
    pub current_file: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SupportedFormat {
    pub extension: String,
    pub name: String,
    pub mime_type: String,
}

/// 检查路径是否安全（防止 Zip Slip 攻击）
fn is_path_safe(base_path: &Path, target_path: &Path) -> bool {
    let canonical_base = match base_path.canonicalize() {
        Ok(p) => p,
        Err(_) => return false,
    };
    
    let canonical_target = match target_path.canonicalize() {
        Ok(p) => p,
        // 如果目标路径不存在，检查其父路径
        Err(_) => {
            let parent = target_path.parent();
            match parent {
                Some(p) => match p.canonicalize() {
                    Ok(cp) => cp.join(target_path.file_name().unwrap_or_default()),
                    Err(_) => return false,
                },
                None => return false,
            }
        }
    };
    
    canonical_target.starts_with(&canonical_base)
}

/// 检查压缩包内的路径是否安全
fn is_entry_path_safe(entry_path: &str) -> bool {
    let path = Path::new(entry_path);
    
    // 检查是否包含绝对路径
    if path.is_absolute() {
        return false;
    }
    
    // 检查是否包含父目录引用
    for component in path.components() {
        match component {
            Component::ParentDir => return false,
            Component::Prefix(_) => return false,
            _ => continue,
        }
    }
    
    true
}

/// 获取文件扩展名对应的格式
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
    } else if path_lower.ends_with(".7z") {
        Some("7z")
    } else {
        None
    }
}

/// 预览 ZIP 文件
fn preview_zip(path: &str) -> Result<Vec<ArchiveEntry>, String> {
    let file = File::open(path).map_err(|e| format!("无法打开文件: {}", e))?;
    let reader = BufReader::new(file);
    let mut archive = zip::ZipArchive::new(reader).map_err(|e| format!("无效的 ZIP 文件: {}", e))?;
    
    let mut entries = Vec::new();
    
    for i in 0..archive.len() {
        let file = archive.by_index(i).map_err(|e| format!("读取 ZIP 条目失败: {}", e))?;
        let name = file.name().to_string();
        
        // 安全检查
        if !is_entry_path_safe(&name) {
            return Err(format!("检测到不安全的路径: {}", name));
        }
        
        let is_dir = file.is_dir();
        let size = file.size();
        let modified = file.last_modified()
            .map(|m| format!("{}-{:02}-{:02} {:02}:{:02}", m.year(), m.month(), m.day(), m.hour(), m.minute()));
        
        entries.push(ArchiveEntry {
            name: Path::new(&name)
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or(&name)
                .to_string(),
            path: name,
            size,
            is_dir,
            modified,
        });
    }
    
    Ok(entries)
}

/// 预览 TAR 文件
fn preview_tar<R: Read>(mut archive: tar::Archive<R>) -> Result<Vec<ArchiveEntry>, String> {
    let mut entries = Vec::new();
    
    let iter = archive.entries().map_err(|e| format!("读取 TAR 条目失败: {}", e))?;
    
    for entry in iter {
        let entry = entry.map_err(|e| format!("读取 TAR 条目失败: {}", e))?;
        let path = entry.path().map_err(|e| format!("读取路径失败: {}", e))?;
        let path_str = path.to_string_lossy().to_string();
        
        // 安全检查
        if !is_entry_path_safe(&path_str) {
            return Err(format!("检测到不安全的路径: {}", path_str));
        }
        
        let is_dir = entry.header().entry_type().is_dir();
        let size = entry.size();
        let modified = entry.header().mtime()
            .ok()
            .map(|ts| {
                chrono::DateTime::from_timestamp(ts as i64, 0)
                    .map(|dt| dt.format("%Y-%m-%d %H:%M").to_string())
                    .unwrap_or_default()
            });
        
        entries.push(ArchiveEntry {
            name: path
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or(&path_str)
                .to_string(),
            path: path_str,
            size,
            is_dir,
            modified,
        });
    }
    
    Ok(entries)
}

/// 预览 TAR.GZ 文件
fn preview_tar_gz(path: &str) -> Result<Vec<ArchiveEntry>, String> {
    let file = File::open(path).map_err(|e| format!("无法打开文件: {}", e))?;
    let reader = BufReader::new(file);
    let decoder = flate2::read::GzDecoder::new(reader);
    let archive = tar::Archive::new(decoder);
    preview_tar(archive)
}

/// 预览 TAR.BZ2 文件
fn preview_tar_bz2(path: &str) -> Result<Vec<ArchiveEntry>, String> {
    let file = File::open(path).map_err(|e| format!("无法打开文件: {}", e))?;
    let reader = BufReader::new(file);
    let decoder = bzip2::read::BzDecoder::new(reader);
    let archive = tar::Archive::new(decoder);
    preview_tar(archive)
}

/// 预览纯 TAR 文件
fn preview_tar_file(path: &str) -> Result<Vec<ArchiveEntry>, String> {
    let file = File::open(path).map_err(|e| format!("无法打开文件: {}", e))?;
    let reader = BufReader::new(file);
    let archive = tar::Archive::new(reader);
    preview_tar(archive)
}

#[tauri::command]
async fn preview_archive(path: String) -> Result<Vec<ArchiveEntry>, String> {
    let format = get_archive_format(&path)
        .ok_or_else(|| "不支持的文件格式".to_string())?;
    
    match format {
        "zip" => preview_zip(&path),
        "tar.gz" => preview_tar_gz(&path),
        "tar.bz2" => preview_tar_bz2(&path),
        "tar" => preview_tar_file(&path),
        "7z" => preview_7z(&path),
        _ => Err("不支持的文件格式".to_string()),
    }
}

/// 解压 ZIP 文件
fn extract_zip(
    path: &str,
    target: &str,
    password: Option<&str>,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let file = File::open(path).map_err(|e| format!("无法打开文件: {}", e))?;
    let reader = BufReader::new(file);
    let mut archive = zip::ZipArchive::new(reader).map_err(|e| format!("无效的 ZIP 文件: {}", e))?;
    
    let total = archive.len() as u64;
    let target_path = PathBuf::from(target);
    
    // 确保目标目录存在
    fs::create_dir_all(&target_path).map_err(|e| format!("无法创建目标目录: {}", e))?;
    
    for i in 0..archive.len() {
        let mut file = archive.by_index_decrypt(i, password.unwrap_or("").as_bytes())
            .map_err(|e| format!("解密失败: {:?}", e))?;
        
        let name = file.name().to_string();
        
        // 安全检查
        if !is_entry_path_safe(&name) {
            return Err(format!("检测到不安全的路径: {}", name));
        }
        
        let out_path = target_path.join(&name);
        
        // 安全检查：确保输出路径在目标目录内
        if !is_path_safe(&target_path, &out_path) {
            return Err(format!("路径遍历攻击检测: {}", name));
        }
        
        if file.is_dir() {
            fs::create_dir_all(&out_path).map_err(|e| format!("无法创建目录: {}", e))?;
        } else {
            if let Some(p) = out_path.parent() {
                fs::create_dir_all(p).map_err(|e| format!("无法创建父目录: {}", e))?;
            }
            let mut out_file = File::create(&out_path).map_err(|e| format!("无法创建文件: {}", e))?;
            io::copy(&mut file, &mut out_file).map_err(|e| format!("写入文件失败: {}", e))?;
        }
        
        // 发送进度事件
        let _ = app_handle.emit("extract-progress", ExtractProgress {
            current: (i + 1) as u64,
            total,
            current_file: name.clone(),
        });
    }
    
    Ok(())
}

/// 解压 TAR 文件
fn extract_tar<R: Read>(
    mut archive: tar::Archive<R>,
    target: &str,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let target_path = PathBuf::from(target);
    
    // 确保目标目录存在
    fs::create_dir_all(&target_path).map_err(|e| format!("无法创建目标目录: {}", e))?;
    
    // 先计算总数
    let entries: Vec<_> = archive.entries()
        .map_err(|e| format!("读取 TAR 条目失败: {}", e))?
        .collect();
    let total = entries.len() as u64;
    let mut current = 0u64;
    
    for entry in entries {
        let mut entry = entry.map_err(|e| format!("读取 TAR 条目失败: {}", e))?;
        let path = entry.path().map_err(|e| format!("读取路径失败: {}", e))?;
        let path_str = path.to_string_lossy().to_string();
        
        // 安全检查
        if !is_entry_path_safe(&path_str) {
            return Err(format!("检测到不安全的路径: {}", path_str));
        }
        
        let out_path = target_path.join(&path);
        
        // 安全检查：确保输出路径在目标目录内
        if !is_path_safe(&target_path, &out_path) {
            return Err(format!("路径遍历攻击检测: {}", path_str));
        }
        
        entry.unpack(&out_path).map_err(|e| format!("解压文件失败: {}", e))?;
        
        current += 1;
        
        // 发送进度事件
        let _ = app_handle.emit("extract-progress", ExtractProgress {
            current,
            total,
            current_file: path_str.clone(),
        });
    }
    
    Ok(())
}

/// 解压 TAR.GZ 文件
fn extract_tar_gz(path: &str, target: &str, app_handle: tauri::AppHandle) -> Result<(), String> {
    let file = File::open(path).map_err(|e| format!("无法打开文件: {}", e))?;
    let reader = BufReader::new(file);
    let decoder = flate2::read::GzDecoder::new(reader);
    let archive = tar::Archive::new(decoder);
    extract_tar(archive, target, app_handle)
}

/// 解压 TAR.BZ2 文件
fn extract_tar_bz2(path: &str, target: &str, app_handle: tauri::AppHandle) -> Result<(), String> {
    let file = File::open(path).map_err(|e| format!("无法打开文件: {}", e))?;
    let reader = BufReader::new(file);
    let decoder = bzip2::read::BzDecoder::new(reader);
    let archive = tar::Archive::new(decoder);
    extract_tar(archive, target, app_handle)
}

/// 解压纯 TAR 文件
fn extract_tar_file(path: &str, target: &str, app_handle: tauri::AppHandle) -> Result<(), String> {
    let file = File::open(path).map_err(|e| format!("无法打开文件: {}", e))?;
    let reader = BufReader::new(file);
    let archive = tar::Archive::new(reader);
    extract_tar(archive, target, app_handle)
}

#[tauri::command]
async fn extract_archive(
    path: String,
    target: String,
    password: Option<String>,
    app_handle: tauri::AppHandle,
) -> Result<String, String> {
    let format = get_archive_format(&path)
        .ok_or_else(|| "不支持的文件格式".to_string())?;
    
    match format {
        "zip" => extract_zip(&path, &target, password.as_deref(), app_handle)?,
        "tar.gz" => extract_tar_gz(&path, &target, app_handle)?,
        "tar.bz2" => extract_tar_bz2(&path, &target, app_handle)?,
        "tar" => extract_tar_file(&path, &target, app_handle)?,
        "7z" => extract_7z(&path, &target, password.as_deref())?,
        _ => return Err("不支持的文件格式".to_string()),
    }
    
    // 计算解压后的总大小
    let total_size = WalkDir::new(&target)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter_map(|e| e.metadata().ok())
        .filter(|m| m.is_file())
        .map(|m| m.len())
        .sum::<u64>();
    
    Ok(format!("解压完成！共 {} 字节", total_size))
}

#[tauri::command]
fn get_supported_formats() -> Vec<SupportedFormat> {
    vec![
        SupportedFormat {
            extension: ".zip".to_string(),
            name: "ZIP 压缩文件".to_string(),
            mime_type: "application/zip".to_string(),
        },
        SupportedFormat {
            extension: ".tar".to_string(),
            name: "TAR 归档文件".to_string(),
            mime_type: "application/x-tar".to_string(),
        },
        SupportedFormat {
            extension: ".tar.gz".to_string(),
            name: "GZIP 压缩 TAR".to_string(),
            mime_type: "application/gzip".to_string(),
        },
        SupportedFormat {
            extension: ".tar.bz2".to_string(),
            name: "BZIP2 压缩 TAR".to_string(),
            mime_type: "application/x-bzip2".to_string(),
        },
    ]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            preview_archive,
            extract_archive,
            get_supported_formats,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// ============ 7z 格式支持 ============

/// 预览 7z 文件
fn preview_7z(path: &str) -> Result<Vec<ArchiveEntry>, String> {
    use std::process::Command;
    
    // 使用系统 7z 命令
    let output = Command::new("7z")
        .args(["l", "-slt", path])
        .output()
        .map_err(|e| format!("无法执行 7z 命令: {}。请安装 p7zip-full", e))?;
    
    if !output.status.success() {
        return Err("无法读取 7z 文件".to_string());
    }
    
    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut entries = Vec::new();
    
    for line in stdout.lines() {
        if line.starts_with("Path = ") {
            let name = line.strip_prefix("Path = ").unwrap_or("");
            if !name.is_empty() {
                entries.push(ArchiveEntry {
                    name: name.split('/').last().unwrap_or(name).to_string(),
                    path: name.to_string(),
                    size: 0,
                    is_dir: name.ends_with('/'),
                    modified: None,
                });
            }
        }
    }
    
    Ok(entries)
}

/// 解压 7z 文件
fn extract_7z(src: &str, target: &str, _password: Option<&str>) -> Result<(), String> {
    use std::process::Command;
    
    // 安全检查
    let target_path = std::path::Path::new(target);
    std::fs::create_dir_all(target_path).map_err(|e| format!("无法创建目标目录: {}", e))?;
    
    let output = Command::new("7z")
        .args(["x", "-y", &format!("-o{}", target), src])
        .output()
        .map_err(|e| format!("无法执行 7z 命令: {}。请安装 p7zip-full", e))?;
    
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("解压失败: {}", stderr));
    }
    
    Ok(())
}

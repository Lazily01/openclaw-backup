import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import DropZone from './components/DropZone';
import FileList, { type ArchiveEntry } from './components/FileList';
import ProgressBar from './components/ProgressBar';

interface ExtractProgress {
  current: number;
  total: number;
  current_file: string;
}

type AppStatus = 'idle' | 'previewing' | 'ready' | 'extracting' | 'success' | 'error';

function App() {
  // 状态管理
  const [status, setStatus] = useState<AppStatus>('idle');
  const [filePath, setFilePath] = useState<string>('');
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [targetPath, setTargetPath] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [progress, setProgress] = useState<ExtractProgress | null>(null);
  const [message, setMessage] = useState<string>('');
  const [needsPassword, setNeedsPassword] = useState(false);

  // 监听解压进度事件
  useEffect(() => {
    const unlisten = listen<ExtractProgress>('extract-progress', (event) => {
      setProgress(event.payload);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  // 预览压缩包
  const handleFileSelected = useCallback(async (path: string) => {
    setFilePath(path);
    setStatus('previewing');
    setMessage('');
    setEntries([]);
    setNeedsPassword(false);

    try {
      const result = await invoke<ArchiveEntry[]>('preview_archive', { path });
      setEntries(result);
      setStatus('ready');
      
      // 自动设置默认目标目录（与压缩包同目录）
      const defaultTarget = path.replace(/\.(zip|tar|tar\.gz|tgz|tar\.bz2|tbz2)$/i, '');
      setTargetPath(defaultTarget);
    } catch (err) {
      const errorMsg = String(err);
      if (errorMsg.includes('password') || errorMsg.includes('encrypted')) {
        setNeedsPassword(true);
        setStatus('ready');
        setMessage('此压缩包需要密码');
      } else {
        setStatus('error');
        setMessage(`预览失败: ${errorMsg}`);
      }
    }
  }, []);

  // 使用密码重新预览
  const handleRetryWithPassword = useCallback(async () => {
    if (!filePath || !password) return;
    
    setStatus('previewing');
    setMessage('');

    try {
      const result = await invoke<ArchiveEntry[]>('preview_archive', { 
        path: filePath,
        password: password 
      });
      setEntries(result);
      setStatus('ready');
      setNeedsPassword(false);
    } catch (err) {
      setStatus('error');
      setMessage(`预览失败: ${String(err)}`);
    }
  }, [filePath, password]);

  // 选择目标目录
  const handleSelectTarget = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });
      
      if (selected) {
        setTargetPath(selected as string);
      }
    } catch (err) {
      console.error('Failed to select directory:', err);
    }
  };

  // 开始解压
  const handleExtract = useCallback(async () => {
    if (!filePath || !targetPath) {
      setMessage('请先选择压缩文件和目标目录');
      return;
    }

    setStatus('extracting');
    setMessage('');
    setProgress(null);

    try {
      const result = await invoke<string>('extract_archive', {
        path: filePath,
        target: targetPath,
        password: password || null,
      });
      
      setStatus('success');
      setMessage(result);
    } catch (err) {
      const errorMsg = String(err);
      if (errorMsg.includes('password') || errorMsg.includes('encrypted') || errorMsg.includes('decrypt')) {
        setNeedsPassword(true);
        setStatus('ready');
        setMessage('密码错误或压缩包已加密');
      } else {
        setStatus('error');
        setMessage(`解压失败: ${errorMsg}`);
      }
    }
  }, [filePath, targetPath, password]);

  // 重置应用
  const handleReset = () => {
    setStatus('idle');
    setFilePath('');
    setEntries([]);
    setTargetPath('');
    setPassword('');
    setProgress(null);
    setMessage('');
    setNeedsPassword(false);
  };

  // 渲染不同状态的 UI
  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <DropZone 
            onFileSelected={handleFileSelected} 
            isProcessing={false}
          />
        );

      case 'previewing':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400">正在读取压缩包内容...</p>
          </div>
        );

      case 'extracting':
        return (
          <div className="space-y-6">
            {/* 进度显示 */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-medium text-slate-200 mb-4">正在解压</h3>
              {progress ? (
                <ProgressBar
                  current={progress.current}
                  total={progress.total}
                  currentFile={progress.current_file}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-400">准备解压...</span>
                </div>
              )}
            </div>
            
            {/* 文件列表预览 */}
            <div className="opacity-50 pointer-events-none">
              <FileList entries={entries} filePath={filePath} />
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6">
            {/* 成功消息 */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-green-400">解压完成</h3>
              </div>
              <p className="text-slate-400">{message}</p>
              <p className="text-slate-500 text-sm mt-2">目标目录: {targetPath}</p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
              >
                解压其他文件
              </button>
            </div>
          </div>
        );

      case 'error':
      case 'ready':
        return (
          <div className="space-y-6">
            {/* 错误消息 */}
            {status === 'error' && message && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{message}</span>
                </div>
              </div>
            )}

            {/* 密码输入 */}
            {(needsPassword || status === 'ready') && (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  压缩包密码（如果需要）
                </label>
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入密码..."
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  {needsPassword && (
                    <button
                      onClick={handleRetryWithPassword}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                      重试
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 文件列表 */}
            {entries.length > 0 && (
              <FileList entries={entries} filePath={filePath} />
            )}

            {/* 目标目录选择 */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                解压到
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  placeholder="选择目标目录..."
                  className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSelectTarget}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                >
                  浏览
                </button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleExtract}
                disabled={!targetPath}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  targetPath
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                开始解压
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* 标题栏 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            QuickExtract
          </h1>
          <p className="text-slate-400">
            快速、安全的压缩文件解压工具
          </p>
        </div>

        {/* 主内容区 */}
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
          {renderContent()}
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-6 text-slate-500 text-sm">
          <p>支持格式: ZIP, TAR, TAR.GZ, TAR.BZ2</p>
        </div>
      </div>
    </div>
  );
}

export default App;

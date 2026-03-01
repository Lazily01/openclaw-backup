import React, { useCallback, useState, useEffect } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';

interface DropZoneProps {
  onFileSelected: (path: string) => void;
  isProcessing: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelected, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState('点击选择压缩文件');

  // 监听 Tauri 文件拖放事件
  useEffect(() => {
    const setupListeners = async () => {
      const unlistenDrag = await listen('tauri://drag', () => {
        setIsDragging(true);
        setStatusText('松开以添加文件');
      });

      const unlistenDragEnd = await listen('tauri://drag-cancelled', () => {
        setIsDragging(false);
        setStatusText('点击选择压缩文件');
      });

      const unlistenDrop = await listen<string[]>('tauri://drag-drop', (event) => {
        setIsDragging(false);
        const paths = event.payload;
        if (paths && paths.length > 0) {
          const file = paths[0];
          const ext = file.toLowerCase();
          const supportedFormats = ['.zip', '.tar', '.tar.gz', '.tgz', '.tar.bz2', '.tbz2', '.7z'];
          const isSupported = supportedFormats.some(fmt => ext.endsWith(fmt));
          
          if (isSupported) {
            onFileSelected(file);
          } else {
            setStatusText('不支持的格式');
            setTimeout(() => setStatusText('点击选择压缩文件'), 2000);
          }
        }
      });

      return () => {
        unlistenDrag();
        unlistenDragEnd();
        unlistenDrop();
      };
    };

    const cleanup = setupListeners();
    return () => { cleanup.then(fn => fn()); };
  }, [onFileSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleSelectFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          { name: 'Archive Files', extensions: ['zip', 'tar', 'gz', 'bz2', 'tgz', 'tbz2', '7z'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });
      if (selected) onFileSelected(selected as string);
    } catch (err) {
      console.error('Failed to select file:', err);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleSelectFile}
      className={`
        relative flex flex-col items-center justify-center
        w-full h-48 rounded-2xl border-2 border-dashed
        cursor-pointer transition-all duration-300
        ${isDragging ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'}
        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <div className="text-center">
        <div className="mb-4">
          <svg className={`w-16 h-16 mx-auto transition-colors duration-300 ${isDragging ? 'text-blue-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-300 mb-1">{isDragging ? '松开以添加文件' : statusText}</p>
        <p className="text-sm text-slate-500">支持 ZIP, TAR, TAR.GZ, TAR.BZ2, 7Z</p>
      </div>
      {isDragging && <div className="absolute inset-0 rounded-2xl bg-blue-500/5 pointer-events-none" />}
    </div>
  );
};

export default DropZone;

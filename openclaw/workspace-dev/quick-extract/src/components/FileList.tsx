import React from 'react';

export interface ArchiveEntry {
  name: string;
  path: string;
  size: number;
  is_dir: boolean;
  modified: string | null;
}

interface FileListProps {
  entries: ArchiveEntry[];
  filePath: string;
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (name: string, isDir: boolean): React.ReactNode => {
  if (isDir) {
    return (
      <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    );
  }
  
  const ext = name.split('.').pop()?.toLowerCase() || '';
  
  // 图片文件
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
    return (
      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  
  // 代码文件
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'go', 'rs', 'rb'].includes(ext)) {
    return (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    );
  }
  
  // 文档文件
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'rtf'].includes(ext)) {
    return (
      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  
  // 压缩文件
  if (['zip', 'tar', 'gz', 'bz2', 'rar', '7z'].includes(ext)) {
    return (
      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    );
  }
  
  // 默认文件图标
  return (
    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
};

const FileList: React.FC<FileListProps> = ({ entries, filePath }) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p>压缩包为空</p>
      </div>
    );
  }

  // 计算统计信息
  const totalFiles = entries.filter(e => !e.is_dir).length;
  const totalDirs = entries.filter(e => e.is_dir).length;
  const totalSize = entries.filter(e => !e.is_dir).reduce((sum, e) => sum + e.size, 0);

  return (
    <div className="w-full">
      {/* 文件信息头部 */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="font-medium text-slate-200">
            {filePath.split('/').pop() || filePath}
          </span>
          <span className="text-slate-600">•</span>
          <span>{totalFiles} 个文件</span>
          {totalDirs > 0 && (
            <>
              <span className="text-slate-600">•</span>
              <span>{totalDirs} 个文件夹</span>
            </>
          )}
          <span className="text-slate-600">•</span>
          <span>{formatSize(totalSize)}</span>
        </div>
      </div>

      {/* 文件列表 */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/80 sticky top-0">
              <tr className="text-left text-slate-400">
                <th className="px-4 py-3 font-medium">名称</th>
                <th className="px-4 py-3 font-medium text-right w-24">大小</th>
                <th className="px-4 py-3 font-medium text-right w-32">修改时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {entries.map((entry, index) => (
                <tr
                  key={`${entry.path}-${index}`}
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      {getFileIcon(entry.name, entry.is_dir)}
                      <span className={`${entry.is_dir ? 'text-slate-200' : 'text-slate-300'} truncate max-w-xs`}>
                        {entry.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-400">
                    {entry.is_dir ? '—' : formatSize(entry.size)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-500">
                    {entry.modified || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileList;

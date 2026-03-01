import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  currentFile: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, currentFile }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {/* 进度条背景 */}
      <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
        {/* 进度条填充 */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* 光效 */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
          style={{ 
            width: `${percentage}%`,
            animation: 'shimmer 2s infinite'
          }}
        />
      </div>

      {/* 进度信息 */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-400 truncate">
            正在解压: <span className="text-slate-300">{currentFile}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 ml-4 text-sm">
          <span className="text-slate-400">
            {current} / {total}
          </span>
          <span className="text-blue-400 font-medium">
            {percentage}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;

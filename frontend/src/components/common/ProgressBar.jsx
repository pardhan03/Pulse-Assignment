export const ProgressBar = ({ progress, status }) => {
    const isProcessing = status?.toLowerCase().includes('processing');
    const isCompleted = progress === 100;

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {status || 'Uploading...'}
                </span>
                <span className="text-xs font-mono font-bold text-blue-400">
                    {progress}%
                </span>
            </div>
            <div className="w-full bg-slate-800 border border-slate-700/50 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out relative ${isCompleted
                            ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                            : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                        }`}
                    style={{ width: `${progress}%` }}
                >
                    {isProcessing && progress < 100 && (
                        <div className="absolute inset-0 w-full h-full animate-pulse bg-white/20"></div>
                    )}
                </div>
            </div>
        </div>
    );
};
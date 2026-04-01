import { ProgressBar } from '../common/ProgressBar';
import { Loader2, CheckCircle2, Activity } from 'lucide-react';

export const LiveMonitor = ({ processingVideos }) => {

  if (processingVideos.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm text-center">
        <div className="bg-slate-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <Activity className="text-slate-600" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Queue Empty</h3>
        <p className="text-sm text-slate-500">No videos currently in the pipeline</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Loader2 className="text-blue-400 animate-spin" size={20} />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Active Pipeline</h3>
        </div>
        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.1)]">
          {processingVideos?.length} In-Progress
        </span>
      </div>

      <div className="space-y-4">
        {processingVideos?.map((video) => (
          <div key={video?.videoId} className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-bold text-slate-200 text-sm mb-1 truncate max-w-[200px]">
                  {video?.filename || 'Encoding Asset...'}
                </h4>
                <p className="text-[10px] font-mono text-slate-500 uppercase">UID: {video?.videoId.slice(-12)}</p>
              </div>
              {video?.progress === 100 ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase">
                  <CheckCircle2 size={14} /> Completed
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-bold uppercase">
                  <Loader2 size={14} className="animate-spin" /> {video?.status || 'Processing'}
                </div>
              )}
            </div>
            <ProgressBar
              progress={video?.progress || 0}
              status={video?.status}
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { label: 'Metadata', threshold: 25 },
                { label: 'Analysis', threshold: 50 },
                { label: 'Optimization', threshold: 75 },
                { label: 'Deployment', threshold: 100 },
              ].map((step) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-2 text-[10px] font-medium transition-colors ${video?.progress >= step.threshold ? 'text-blue-400' : 'text-slate-600'
                    }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${video?.progress >= step.threshold ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]' : 'bg-slate-800'
                    }`} />
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
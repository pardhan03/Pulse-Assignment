import React from 'react';
import { Search, XCircle } from 'lucide-react';
import { VIDEO_STATUS, SENSITIVITY_FLAG } from '../../utils/constant';


const VideoFilters = ({ filters, onFilterChange }) => {

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm mb-6 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5">
          <label htmlFor="search" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Search Assets
          </label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input
              type="text"
              id="search"
              value={filters?.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search by title, uploader, or ID..."
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <label htmlFor="status" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Processing Status
          </label>
          <select
            id="status"
            value={filters?.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-400">All Statuses</option>
            <option value={VIDEO_STATUS.UPLOADING} className="bg-slate-900">Uploading</option>
            <option value={VIDEO_STATUS.PROCESSING} className="bg-slate-900">Processing</option>
            <option value={VIDEO_STATUS.COMPLETED} className="bg-slate-900">Completed</option>
            <option value={VIDEO_STATUS.FAILED} className="bg-slate-900">Failed</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label htmlFor="sensitivity" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Safety Level
          </label>
          <select
            id="sensitivity"
            value={filters?.sensitivity || ''}
            onChange={(e) => onFilterChange({ ...filters, sensitivity: e.target.value })}
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-400">All Levels</option>
            <option value={SENSITIVITY_FLAG.SAFE} className="bg-slate-900 text-emerald-400">Safe Content</option>
            <option value={SENSITIVITY_FLAG.FLAGGED} className="bg-slate-900 text-red-400">Flagged Items</option>
            <option value={SENSITIVITY_FLAG.PENDING} className="bg-slate-900 text-yellow-400">Pending Review</option>
          </select>
        </div>
        <div className="md:col-span-1 flex justify-end">
          <button
            onClick={() => onFilterChange({})}
            disabled={false}
            className={`p-2.5 rounded-lg border transition-all duration-200 cursor-pointer`}
            title="Clear all filters"
          >
            <XCircle size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoFilters;
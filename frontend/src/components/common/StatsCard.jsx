import React from 'react';
import { Users, Crown, Pencil, Eye, TrendingUp } from 'lucide-react';

const CARD_THEMES = {
  total: {
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-800/20"
  },
  admin: {
    icon: Crown,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-800/20"
  },
  editor: {
    icon: Pencil,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-800/20"
  },
  viewer: {
    icon: Eye,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-800/20"
  }
};

const StatsCard = ({ themeKey, title, value, footer, trending }) => {
  const theme = CARD_THEMES[themeKey] || CARD_THEMES.total;
  const Icon = theme.icon;

  return (
    <div className={`relative bg-slate-800/40 border ${theme.borderColor} p-5 rounded-xl backdrop-blur-sm shadow-md hover:bg-slate-800/60 transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
          {footer && <p className="text-slate-500 text-[10px] mt-1">{footer}</p>}
        </div>
        <div className={`p-3 rounded-full ${theme.bgColor} ${theme.color} border ${theme.borderColor}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      {trending && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400">
           <TrendingUp size={12} /> <span>{trending}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
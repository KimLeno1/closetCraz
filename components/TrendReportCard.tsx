
import React from 'react';
import { TrendReport } from '../extraMockData';
import { TrendingUp } from 'lucide-react';

interface TrendReportCardProps {
  report: TrendReport;
}

export const TrendReportCard: React.FC<TrendReportCardProps> = ({ report }) => {
  return (
    <div className="p-6 border border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-sm transition-all duration-500 hover:border-white/20 group">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-serif text-xl text-white group-hover:italic transition-all">{report.name}</h4>
        <TrendingUp size={16} className="text-stone-600 group-hover:text-white transition-colors" />
      </div>
      
      <p className="text-stone-500 text-xs font-light leading-relaxed mb-6">
        {report.description}
      </p>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] uppercase tracking-widest text-stone-600">Market Relevance</span>
          <span className="text-[10px] font-bold text-white">{report.relevance}%</span>
        </div>
        <div className="h-[2px] w-full bg-stone-900 overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-out"
            style={{ width: `${report.relevance}%` }}
          />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { RefreshCw, Search, Sparkles, PlusCircle } from 'lucide-react';

interface PageHeaderProps {
  appName: string;
  linkedinProfileId: string;
  onSimulateIngest: () => void;
  isIngesting: boolean;
  onOpenPasteModal: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export default function PageHeader({
  appName,
  linkedinProfileId,
  onSimulateIngest,
  isIngesting,
  onOpenPasteModal,
  onRefreshData,
  isRefreshing
}: PageHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {isRefreshing ? "Syncing..." : "Sync Active: 08:00 AM"}
          </span>
        </div>
        <h1 className="font-bold text-xl tracking-tight text-slate-800 uppercase mt-0.5">
          {appName}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Active network profile Target: <span className="font-mono font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-sm">@{linkedinProfileId}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-all cursor-pointer"
          title="Refresh Data from Server DB"
        >
          <RefreshCw size={14} className={`text-slate-400 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
          {isRefreshing ? "Syncing..." : "Refresh App"}
        </button>

        <button
          onClick={onOpenPasteModal}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <PlusCircle size={14} className="text-slate-400" />
          Paste Feed Content
        </button>

        <button
          onClick={onSimulateIngest}
          disabled={isIngesting}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <Sparkles size={14} className={isIngesting ? "animate-spin" : ""} />
          {isIngesting ? "Scavenging Past 24h..." : "Simulate Live Scavenge"}
        </button>
      </div>
    </header>
  );
}

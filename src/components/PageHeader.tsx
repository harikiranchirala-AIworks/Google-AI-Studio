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
  runMode: 'server' | 'browser';
  onToggleRunMode: () => void;
}

export default function PageHeader({
  appName,
  linkedinProfileId,
  onSimulateIngest,
  isIngesting,
  onOpenPasteModal,
  onRefreshData,
  isRefreshing,
  runMode,
  onToggleRunMode
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
          Active network profile Target: <span className="font-mono font-medium text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-md">@{linkedinProfileId}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Interactive App Run Mode Engine Badge/Toggle */}
        <button
          onClick={onToggleRunMode}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
            runMode === 'server'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
              : 'bg-brand-50 border-brand-200 text-brand-800 hover:bg-brand-100/70'
          }`}
          title="Click to switch between Cloud Server Mode and Standalone Browser (localStorage) Mode"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${runMode === 'server' ? 'bg-emerald-500 animate-pulse' : 'bg-brand-500 animate-pulse'}`} />
          <span className="font-mono text-[9px] uppercase font-bold tracking-widest">
            {runMode === 'server' ? 'Mode: Cloud Server' : 'Mode: In-Browser'}
          </span>
        </button>

        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-full hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer"
          title="Refresh Data from Server DB"
        >
          <RefreshCw size={14} className={`text-slate-500 ${isRefreshing ? "animate-spin text-brand-600" : ""}`} />
          {isRefreshing ? "Syncing..." : "Refresh App"}
        </button>

        <button
          onClick={onOpenPasteModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <PlusCircle size={14} className="text-slate-500" />
          Paste Feed Content
        </button>

        <button
          onClick={onSimulateIngest}
          disabled={isIngesting}
          className="inline-flex items-center gap-2 px-4-5 py-2 text-xs font-semibold text-white bg-brand-600 border border-transparent rounded-full hover:bg-brand-700 transition-all disabled:opacity-50 cursor-pointer shadow-sm font-sans"
        >
          <Sparkles size={14} className={isIngesting ? "animate-spin" : ""} />
          {isIngesting ? "Scavenging Past 24h..." : "Simulate Live Scavenge"}
        </button>
      </div>
    </header>
  );
}

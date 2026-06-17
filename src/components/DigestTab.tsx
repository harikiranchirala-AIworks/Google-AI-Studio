import React from 'react';
import { DigestSummary, AppSettings } from '../types';
import { Mail, Calendar, HelpCircle, CheckSquare, Square, Sparkles, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

interface DigestTabProps {
  digest: DigestSummary | null;
  onGenerateDigest: () => void;
  isGenerating: boolean;
  onSendEmail: (id: string) => void;
  isEmailing: boolean;
  settings: AppSettings;
  isEmailSuccess: boolean;
  postsCount?: number;
}

export default function DigestTab({
  digest,
  onGenerateDigest,
  isGenerating,
  onSendEmail,
  isEmailing,
  settings,
  isEmailSuccess,
  postsCount
}: DigestTabProps) {
  const [completedInsights, setCompletedInsights] = React.useState<Record<string, boolean>>({});

  const toggleInsight = (index: number) => {
    setCompletedInsights(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Action card for generating digest */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-brand-600 animate-pulse" />
            AI MORNING DIGEST HUB
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Synthesize all ingested updates from the past 24 hours into a structured daily briefing utilizing <span className="font-semibold text-slate-800">{settings.aiProvider === 'gemini' ? 'Google Gemini 2.5 Flash' : 'OpenAI ChatGPT'}</span>.
          </p>
        </div>
        <button
          onClick={onGenerateDigest}
          disabled={isGenerating}
          className="md:self-center inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-brand-600 rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {isGenerating ? (
            <>
              <Terminal size={14} className="animate-spin" />
              SYNTHESIZING UPDATES...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              GENERATE TODAY'S DIGEST
            </>
          )}
        </button>
      </div>

      {digest ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header info & email action */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="bg-brand-50 text-brand-600 p-2 ml-1 rounded-lg shrink-0 mt-0.5 border border-brand-100">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wednesday, Oct 25 • Past 24 Hours Analysis</span>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">{digest.date}</h1>
                    <p className="text-xs text-slate-500 mt-1">Briefing Summary ID: <span className="font-mono text-brand-600 bg-brand-50/50 px-1.5 py-0.5 rounded-sm">{digest.id.substring(0, 11)}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {digest.isEmailed && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-green-50 text-green-700 border border-green-150">
                      <CheckCircle2 size={12} />
                      Emailed
                    </span>
                  )}
                  <button
                    onClick={() => onSendEmail(digest.id)}
                    disabled={isEmailing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 rounded-full hover:bg-brand-100/80 transition-colors cursor-pointer"
                  >
                    <Mail size={14} className={isEmailing ? "animate-spin" : ""} />
                    {isEmailing ? "Dispatching..." : "Email Me Digest"}
                  </button>
                </div>

                <div className="text-right shrink-0 hidden sm:block">
                  <span className="text-4xl font-light text-brand-600 leading-none block font-display font-medium">
                    {postsCount !== undefined ? postsCount : 14}
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Updates Scanned</p>
                </div>
              </div>

              {isEmailSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
                  <span>Digest successfully sent via email! Review configuration and history logs for transmission details.</span>
                </div>
              )}

              {/* Executive summary block */}
              <div className="p-4 bg-brand-50 border-l-4 border-brand-600 rounded-lg">
                <strong className="font-bold text-brand-900 text-xs uppercase tracking-wider block mb-1">Quick Sync & Briefing</strong>
                <p className="text-sm text-brand-900 leading-relaxed font-sans">
                  "{digest.overallSummary}"
                </p>
              </div>

              {/* Categories */}
              <div className="space-y-6 pt-2">
                {/* Jobs */}
                <div className="group border border-slate-200 rounded-xl p-5 hover:border-brand-300 hover:bg-brand-50/20 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-brand-50 text-brand-700 border border-brand-100">
                      💼 Jobs & Job Opportunities
                    </div>
                  </div>
                  <p className="text-slate-750 text-sm leading-relaxed">
                    {digest.byCategory.jobs || "No specific job matches identified or extracted in past 24 hours."}
                  </p>
                </div>

                {/* AI */}
                <div className="group border border-slate-200 rounded-xl p-5 hover:border-brand-300 hover:bg-brand-50/20 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-brand-50 text-brand-700 border border-brand-100">
                      🤖 Artificial Intelligence & Tech Hubs
                    </div>
                  </div>
                  <p className="text-slate-750 text-sm leading-relaxed">
                    {digest.byCategory.ai || "No key AI paradigm shifts or updates scraped in past 24 hours."}
                  </p>
                </div>

                {/* General */}
                <div className="group border border-slate-200 rounded-xl p-5 hover:border-brand-300 hover:bg-slate-50/50 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-705 border border-slate-200">
                      📢 General updates
                    </div>
                  </div>
                  <p className="text-slate-755 text-sm leading-relaxed">
                    {digest.byCategory.general || "No structural general tech updates recorded in past 24 hours."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Actionable Insights Column */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-4">
                <div className="bg-brand-50 text-brand-600 p-1.5 rounded-lg border border-brand-100">
                  <CheckSquare size={15} />
                </div>
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest">Actionable Takeaways</h3>
              </div>
              
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Practical next steps derived from your professional network feeds today:
              </p>

              <div className="space-y-3">
                {digest.actionableInsights && digest.actionableInsights.length > 0 ? (
                  digest.actionableInsights.map((insight, index) => {
                    const isCompleted = !!completedInsights[index];
                    return (
                      <button
                        key={index}
                        onClick={() => toggleInsight(index)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-brand-50/25 border-brand-100/50 text-slate-400 line-through'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-brand-200 hover:bg-brand-50/10'
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 size={15} className="text-brand-500" />
                          ) : (
                            <div className="h-3.5 w-3.5 rounded border border-slate-300 bg-slate-50" />
                          )}
                        </div>
                        <p className="leading-tight">{insight}</p>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs italic text-gray-400">No specific actionable items compiled.</p>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Completed Tasks</span>
                <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                  {Object.values(completedInsights).filter(Boolean).length} / {digest.actionableInsights?.length || 0}
                </span>
              </div>
            </div>

            {/* Keyword configuration summary status */}
            <div className="bg-slate-900 text-white p-5 shadow-lg rounded-xl">
              <h2 className="text-xs font-black uppercase tracking-tighter text-brand-200 mb-4 flex items-center gap-1.5 leading-none">
                <AlertCircle size={14} className="text-brand-200 shrink-0" />
                Keyword Alerts
              </h2>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                Scanning targets matching these query fields:
              </p>
              <div className="flex flex-wrap gap-2">
                {settings.keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-800 border border-slate-700 text-brand-200 text-[11px] font-medium rounded-full">
                    #{kw}
                  </span>
                ))}
                {settings.keywords.length === 0 && (
                  <span className="text-[10px] text-slate-500 italic">No custom words saved.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto mt-8 shadow-xs">
          <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">No digest synthesized yet for today</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Please run "Simulate Live Scavenge" or use the paste input option to load some updates into your feed, then click "Generate Today's Digest" to synthesize high-quality reports.
          </p>
          <button
            onClick={onGenerateDigest}
            disabled={isGenerating}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-brand-600 rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Sparkles size={13} className={isGenerating ? "animate-spin" : ""} />
            {isGenerating ? "Synthesizing Briefings..." : "Generate Digest Now"}
          </button>
        </div>
      )}
    </div>
  );
}

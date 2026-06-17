import React from 'react';
import { LinkedInPost } from '../types';
import { Award, Briefcase, Cpu, Network, ArrowUpRight, TrendingUp, Key, Calendar } from 'lucide-react';

interface InsightsTabProps {
  posts: LinkedInPost[];
}

export default function InsightsTab({ posts }: InsightsTabProps) {
  const jobsCount = posts.filter(p => p.category === 'jobs').length;
  const aiCount = posts.filter(p => p.category === 'ai').length;
  const generalCount = posts.filter(p => p.category === 'general').length;
  const totalCount = posts.length;

  const jobsPercent = totalCount > 0 ? Math.round((jobsCount / totalCount) * 100) : 0;
  const aiPercent = totalCount > 0 ? Math.round((aiCount / totalCount) * 100) : 0;
  const generalPercent = totalCount > 0 ? Math.round((generalCount / totalCount) * 100) : 0;

  // Compile a list of all matched keywords across active posts to show keyword hot-ranks
  const keywordFreqs: Record<string, number> = {};
  posts.forEach(p => {
    p.matchedKeywords.forEach(kw => {
      keywordFreqs[kw] = (keywordFreqs[kw] || 0) + 1;
    });
  });

  const sortedKeywords = Object.entries(keywordFreqs).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Analytics stats dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Past 24 Hours Total Scraped</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{totalCount}</span>
            <span className="text-[10px] text-brand-605 font-bold bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Active Pulse</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">LinkedIn updates processed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Job Postings</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-brand-600 tracking-tight">{jobsCount}</span>
            <span className="text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 px-2   py-0.5 rounded-full">{jobsPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Matched salary profiles & openings</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">AI Core Breakthroughs</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-brand-600 tracking-tight">{aiCount}</span>
            <span className="text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 px-2   py-0.5 rounded-full">{aiPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Framework benchmarks & paradigms</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">General Core Currents</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-700 tracking-tight">{generalCount}</span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded-sm">{generalPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">General tech & workspace trends</p>
        </div>
      </div>

      {/* Visual charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Network focus metric & keyword frequency chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:col-span-1 space-y-6 shadow-sm">
          <div>
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-widest">Insight Categories Share</h3>
            <p className="text-xs text-slate-500 mt-0.5">Distribution ratio comparing key feed categories</p>
          </div>
          
          <div className="space-y-4">
            {/* Custom visual progress bars */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1 leading-none">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-600" /> Jobs Updates</span>
                <span>{jobsCount} posts ({jobsPercent}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-201">
                <div className="bg-brand-600 h-full rounded-full" style={{ width: `${jobsPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1 leading-none">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-200" /> AI Breakthroughs</span>
                <span>{aiCount} posts ({aiPercent}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-201">
                <div className="bg-brand-205 h-full rounded-full" style={{ width: `${aiPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1 leading-none">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400" /> General Trends</span>
                <span>{generalCount} posts ({generalPercent}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-201">
                <div className="bg-slate-450 h-full rounded-full" style={{ width: `${generalPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-950 flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp size={14} className="text-brand-600" />
                Keyword Interest Frequency
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Most matched keywords across ingested feeds</p>
            </div>

            <div className="space-y-2">
              {sortedKeywords.length > 0 ? (
                sortedKeywords.slice(0, 5).map(([kw, f], idx) => {
                  const kwPercent = Math.min(100, Math.round((f / Math.max(1, totalCount)) * 100));
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full text-[10px]">
                        #{kw}
                      </span>
                      <div className="flex items-center gap-2 w-1/2">
                        <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-150">
                          <div className="bg-brand-600 h-full rounded-full" style={{ width: `${kwPercent}%` }} />
                        </div>
                        <span className="font-bold text-slate-600 text-[11px] w-6 text-right">{f}x</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center p-4 border border-dashed border-slate-200 rounded-lg text-xs italic text-slate-400 bg-slate-50">
                  No keyword matches found yet. Keep running scavenges with your alert setup keywords list!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Actionable Insights Feed Connected dynamically to original messages */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:col-span-2 space-y-6 shadow-sm">
          <div>
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-widest">Active Actionable Insights</h3>
            <p className="text-xs text-slate-500 mt-0.5">Scraped takeaways mapped specifically to LinkedIn professional source updates</p>
          </div>

          <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-2">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 hover:bg-slate-50/50 transition-all gap-3.5">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 border ${
                      post.category === 'jobs' 
                        ? 'bg-brand-50 text-brand-600 border-brand-100' 
                        : post.category === 'ai' 
                        ? 'bg-brand-50 text-brand-600 border-brand-100' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {post.category === 'jobs' ? <Briefcase size={16} /> : post.category === 'ai' ? <Cpu size={16} /> : <Network size={16} />}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {post.insights}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans line-clamp-2">
                        "{post.content}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 border-t border-slate-150 pt-2.5 mt-0.5 gap-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        referrerPolicy="no-referrer"
                        className="h-4 w-4 rounded-full border border-slate-200"
                      />
                      <span className="font-bold text-slate-700">{post.authorName}</span>
                      <span className="text-slate-200">|</span>
                      <span className="text-slate-400 font-mono">{post.timeAgo}</span>
                    </div>

                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 font-bold text-brand-600 hover:text-brand-700 transition-all self-end uppercase text-[10px] underline tracking-tight"
                    >
                      Original Post Link
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 border border-dashed border-slate-200 rounded-lg text-xs italic text-slate-400 bg-slate-50">
                LinkedIn feed is empty. Initialize feeds to visualize category-mapped insights.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

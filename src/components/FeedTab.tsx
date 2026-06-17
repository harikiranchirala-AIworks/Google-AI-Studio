import React, { useState } from 'react';
import { LinkedInPost, AppSettings } from '../types';
import { Search, Brain, Briefcase, Network, Trash2, ArrowUpRight, Filter, AlertCircle, FileText } from 'lucide-react';

interface FeedTabProps {
  posts: LinkedInPost[];
  onDeletePost: (id: string) => void;
  settings: AppSettings;
}

export default function FeedTab({ posts, onDeletePost, settings }: FeedTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'jobs' | 'ai' | 'general'>('all');
  const [selectedKeywordFilter, setSelectedKeywordFilter] = useState<string | null>(null);

  // Filter logic
  const filteredPosts = posts.filter(post => {
    // Search keyword or content
    const matchesSearch = 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorHeadline.toLowerCase().includes(searchTerm.toLowerCase());

    // Category match
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;

    // Selected keyword filter
    const matchesKeywordFilter = !selectedKeywordFilter || post.matchedKeywords.includes(selectedKeywordFilter);

    return matchesSearch && matchesCategory && matchesKeywordFilter;
  });

  // Highlight keywords in post text
  const highlightKeywords = (text: string, keywords: string[]) => {
    if (keywords.length === 0) return text;
    
    // Escape keywords for regex safety and join
    const escaped = keywords.map(kw => kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
    
    const parts = text.split(pattern);
    return parts.map((part, index) => {
      const isMatch = keywords.some(kw => kw.toLowerCase() === part.toLowerCase());
      return isMatch ? (
        <mark key={index} className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-medium border border-amber-200">
          {part}
        </mark>
      ) : (
        part
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Segment */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search feed updates by author, content, or matched headlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-sans"
            />
          </div>
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              All Scrapes ({posts.length})
            </button>
            <button
              onClick={() => setSelectedCategory('jobs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                selectedCategory === 'jobs'
                  ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Briefcase size={12} />
              Jobs ({posts.filter(p => p.category === 'jobs').length})
            </button>
            <button
              onClick={() => setSelectedCategory('ai')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                selectedCategory === 'ai'
                  ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Brain size={12} />
              AI Updates ({posts.filter(p => p.category === 'ai').length})
            </button>
            <button
              onClick={() => setSelectedCategory('general')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                selectedCategory === 'general'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Network size={12} />
              General ({posts.filter(p => p.category === 'general').length})
            </button>
          </div>
        </div>

        {/* Hot Keyword Tags Navigation */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Filter size={12} />
            Filter by Keyword Alert:
          </span>
          <button
            onClick={() => setSelectedKeywordFilter(null)}
            className={`px-2.5 py-1 text-[10px] font-mono rounded-full hover:bg-slate-100 cursor-pointer border ${
              selectedKeywordFilter === null
                ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            SHOW ALL
          </button>
          {settings.keywords.map((kw, idx) => {
            const matchCount = posts.filter(p => p.matchedKeywords.includes(kw)).length;
            return (
              <button
                key={idx}
                onClick={() => setSelectedKeywordFilter(kw)}
                className={`px-2.5 py-1 text-[10px] font-mono rounded-full border transition-all cursor-pointer ${
                  selectedKeywordFilter === kw
                    ? 'bg-blue-600 border-blue-700 text-white font-bold'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                #{kw} ({matchCount})
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts List rendering */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-400 pl-1 font-bold uppercase tracking-widest">
            Showing {filteredPosts.length} matches from the last 24 hours
          </p>

          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-xs transition-all flex flex-col justify-between shadow-sm">
                <div>
                  {/* Author detail block */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{post.authorName}</h4>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5 font-bold uppercase tracking-wider">{post.authorHeadline}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">{post.timeAgo}</span>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Dismiss Update"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="mt-4 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap font-medium">
                    {highlightKeywords(post.content, settings.keywords)}
                  </div>

                  {/* Matched Keyword pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.matchedKeywords.map((kw, i) => (
                      <span key={i} className="text-[9px] font-mono font-bold tracking-tight px-2 py-0.5 rounded-sm bg-blue-50 border border-blue-200 text-blue-700 uppercase">
                        ✨ Alert: {kw}
                      </span>
                    ))}
                    {post.category === 'jobs' && (
                      <span className="text-[9px] font-mono font-bold tracking-tight px-2 py-0.5 rounded-sm bg-orange-50 border border-orange-100 text-orange-700 uppercase">
                        💼 Job Opening
                      </span>
                    )}
                    {post.category === 'ai' && (
                      <span className="text-[9px] font-mono font-bold tracking-tight px-2 py-0.5 rounded-sm bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase">
                        🤖 Tech Trend
                      </span>
                    )}
                  </div>
                </div>

                {/* Analytical Action insights derived */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-bold text-[10px] uppercase text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-sm tracking-widest">Takeaway</span>
                    <span className="font-medium italic">"{post.insights}"</span>
                  </div>
                  
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="self-end sm:self-center text-[10px] font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5 transition-colors underline uppercase tracking-tight"
                  >
                    View Post
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto mt-4 shadow-xs">
          <AlertCircle size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest">No posts matched current filters</h3>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Try adjusting your search queries or clearing keyword and tag filters. You can also simulate new live scavenger posts representing updated parameters.
          </p>
          {(searchTerm || selectedCategory !== 'all' || selectedKeywordFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedKeywordFilter(null);
              }}
              className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-slate-705 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

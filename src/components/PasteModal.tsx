import React, { useState } from 'react';
import { X, FileText, BrainCircuit, Loader2 } from 'lucide-react';

interface PasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (text: string) => Promise<void>;
  isImporting: boolean;
}

export default function PasteModal({ isOpen, onClose, onImport, isImporting }: PasteModalProps) {
  const [pastedText, setPastedText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    await onImport(pastedText);
    setPastedText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full shadow-lg overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-widest">Paste Raw LinkedIn Feed Content</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 p-1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest">
              Copied Timeline / Post Block Text
            </label>
            <p className="text-[11px] text-slate-500 font-medium">
              Open LinkedIn, highlight and copy a post's content (including author header, timestamps, and details), and paste it below. Our server-side AI parsing agent will automatically isolate profiles, categorise keywords, identify matching filters, and extract active takeaways.
            </p>
          </div>

          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            disabled={isImporting}
            className="w-full h-44 px-3.5 py-3 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-sans leading-relaxed text-slate-800 bg-slate-50/20"
            placeholder="Sarah Jenkins | Director of AI at TechCorp Ex-Brain...&#10;Incredible progress on local workflows! We just finished integrating React arrays..."
            required
          />

          {/* Guidelines info */}
          <div className="bg-slate-50 rounded-lg p-3 text-[10px] text-slate-500 flex items-start gap-1.5 leading-relaxed border border-slate-200">
            <BrainCircuit size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[9px]">Advanced AI Splitting:</span>
              <p className="mt-0.5 font-medium">You can paste multiple posts stacked together. The translation engine identifies block borders, authors, and metadata seamlessly, adding multiple discrete elements directly, saving substantial manual entry time.</p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              type="button"
              className="px-3.5 py-2 border border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isImporting || !pastedText.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold uppercase tracking-wide text-[10px] rounded-lg transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {isImporting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  AI Parsing Content...
                </>
              ) : (
                "Parse & Add to Feed"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

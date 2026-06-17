import React, { useState } from 'react';
import { SimulatedEmail } from '../types';
import { Mail, ShieldCheck, Forward, Clock, Copy, Check, FileText, Globe, AlertCircle } from 'lucide-react';

interface InboxTabProps {
  emails: SimulatedEmail[];
}

export default function InboxTab({ emails }: InboxTabProps) {
  const [selectedEmail, setSelectedEmail] = useState<SimulatedEmail | null>(
    emails.length > 0 ? emails[0] : null
  );
  const [copied, setCopied] = useState(false);

  // Auto focus first email when emails change and nothing is selected
  React.useEffect(() => {
    if (emails.length > 0 && !selectedEmail) {
      setSelectedEmail(emails[0]);
    }
  }, [emails]);

  const handleCopyHTML = (html: string) => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px] shadow-sm">
      {/* Left side: Emails list */}
      <div className="border-r border-slate-200 bg-slate-50 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Mail size={16} className="text-blue-600" />
            Inbox & Dispatch History
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Simulated logs and real SMTP transmissions</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-150">
          {emails.length > 0 ? (
            emails.map((email) => {
              const isActive = selectedEmail?.id === email.id;
              const sentDate = new Date(email.sentAt);
              return (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`w-full text-left p-4 transition-all hover:bg-white cursor-pointer ${
                    isActive ? 'bg-white border-l-4 border-blue-600 pl-3' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-mono font-bold tracking-tight px-1.5 py-0.5 rounded-sm ${
                      email.status === 'delivered'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : email.status === 'simulated'
                        ? 'bg-slate-100 text-slate-705 border border-slate-200'
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {email.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight mt-2 line-clamp-1">
                    {email.subject}
                  </h4>
                  
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                    <span className="truncate">To: {email.recipient}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs italic bg-slate-50/50">
              No briefs emailed or logged yet. Run summaries to log actions.
            </div>
          )}
        </div>
      </div>

      {/* Right side: Email body visualizer */}
      <div className="md:col-span-2 flex flex-col h-full bg-white">
        {selectedEmail ? (
          <div className="flex flex-col h-full">
            {/* Subject summary header bar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {selectedEmail.subject}
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] text-slate-500 font-sans">
                  <span>From: <strong className="text-slate-700">LinkedIn Morning Digest App</strong></span>
                  <span>•</span>
                  <span>Recipient: <strong className="text-slate-700">{selectedEmail.recipient}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1 select-none font-mono">
                    <Clock size={11} />
                    {new Date(selectedEmail.sentAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyHTML(selectedEmail.htmlContent)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 text-[11px] font-bold text-slate-900 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Copy Raw E-mail HTML"
                >
                  {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                  {copied ? "Copied HTML!" : "Copy HTML Code"}
                </button>
              </div>
            </div>

            {/* Error logs, if failed */}
            {selectedEmail.status === 'failed' && selectedEmail.errorMessage && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 text-red-800 rounded-lg text-[11px] flex items-start gap-2 animate-fade-in">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-red-500" />
                <div>
                  <p className="font-bold">SMTP Dispatch Interruption Logged</p>
                  <p className="mt-0.5 font-mono">{selectedEmail.errorMessage}</p>
                </div>
              </div>
            )}

            {/* Simulated Desktop client viewport */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 flex justify-center">
              <div className="bg-white border border-slate-200 shadow-sm w-full max-w-[620px] rounded-xl p-6 overflow-x-hidden min-h-[400px]">
                {/* We render the raw HTML using dangerouslySetInnerHTML because SMTP server outputs pristine table formatting */}
                <div 
                  className="email-rendered-viewport" 
                  dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }} 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <Mail size={44} className="text-slate-200 mb-3" />
            <p className="text-sm px-6">Select an email to explore transmission parameters, copy HTML tables, or view summary mockups in the client preview.</p>
          </div>
        )}
      </div>
    </div>
  );
}

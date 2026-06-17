import React, { useState, useEffect } from 'react';
import { 
  LinkedInPost, 
  DigestSummary, 
  AppSettings, 
  SimulatedEmail 
} from './types';
import PageHeader from './components/PageHeader';
import DigestTab from './components/DigestTab';
import FeedTab from './components/FeedTab';
import InsightsTab from './components/InsightsTab';
import SettingsTab from './components/SettingsTab';
import InboxTab from './components/InboxTab';
import ReadmeTab from './components/ReadmeTab';
import PasteModal from './components/PasteModal';

import { 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Mail, 
  Settings as SettingsIcon, 
  Menu, 
  X, 
  User, 
  Clock,
  Briefcase,
  BookOpen
} from 'lucide-react';

export default function App() {
  // Sidebar / view tabs management
  const [activeTab, setActiveTab] = useState<'digest' | 'feed' | 'insights' | 'settings' | 'inbox' | 'readme'>('digest');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core application database states
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [digests, setDigests] = useState<DigestSummary[]>([]);
  const [emails, setEmails] = useState<SimulatedEmail[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    linkedinProfileId: 'your-linkedin-id',
    keywords: [],
    emailRecipient: '',
    openaiApiKey: '',
    aiProvider: 'gemini',
    smtpEnabled: false,
    smtpHost: '',
    smtpPort: 465,
    smtpUser: '',
    smtpPass: '',
    digestFrequency: 'Every Morning'
  });

  // UI loading feedback variables
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isGeneratingDigest, setIsGeneratingDigest] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isImportingPaste, setIsImportingPaste] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  // Advanced SMTP testing feedback
  const [isTestingSMTP, setIsTestingSMTP] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Initial DB loading
  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, feedRes, digestsRes, emailsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/feed'),
          fetch('/api/digests'),
          fetch('/api/emails')
        ]);

        if (settingsRes.ok) {
          const s = await settingsRes.json();
          setSettings(s);
        }
        if (feedRes.ok) {
          const f = await feedRes.json();
          setPosts(f);
        }
        if (digestsRes.ok) {
          const d = await digestsRes.json();
          setDigests(d);
        }
        if (emailsRes.ok) {
          const em = await emailsRes.json();
          setEmails(em);
        }
      } catch (err) {
        console.error("Error standard API fetching on initial bootstrap:", err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadData();
  }, []);

  // Manual synchronization to refresh all data states
  const handleRefreshAllData = async () => {
    setIsRefreshing(true);
    try {
      const [settingsRes, feedRes, digestsRes, emailsRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/feed'),
        fetch('/api/digests'),
        fetch('/api/emails')
      ]);

      if (settingsRes.ok) {
        const s = await settingsRes.json();
        setSettings(s);
      }
      if (feedRes.ok) {
        const f = await feedRes.json();
        setPosts(f);
      }
      if (digestsRes.ok) {
        const d = await digestsRes.json();
        setDigests(d);
      }
      if (emailsRes.ok) {
        const em = await emailsRes.json();
        setEmails(em);
      }
    } catch (err) {
      console.error("Error manual refresh action:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Simulating active LinkedIn past 24h timeline ingestion
  const handleSimulateIngest = async () => {
    setIsIngesting(true);
    try {
      const res = await fetch('/api/feed/ingest-simulate', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        
        // Refresh feed entries
        const feedRes = await fetch('/api/feed');
        if (feedRes.ok) {
          setPosts(await feedRes.json());
        }
      } else {
        console.error("Simulation response failed");
      }
    } catch (err) {
      console.error("Error dispatching simulation feeds ingest:", err);
    } finally {
      setIsIngesting(false);
    }
  };

  // Parsing pasted raw copy paste timeline block content
  const handleImportPaste = async (text: string) => {
    setIsImportingPaste(true);
    try {
      const res = await fetch('/api/feed/ingest-paste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pastedText: text })
      });

      if (res.ok) {
        const feedRes = await fetch('/api/feed');
        if (feedRes.ok) {
          setPosts(await feedRes.json());
        }
      } else {
        console.error("Failed pasting parser");
      }
    } catch (err) {
      console.error("Error executing custom clipboard imports parser:", err);
    } finally {
      setIsImportingPaste(false);
    }
  };

  // Compile summary digest of past 24 hours
  const handleGenerateDigest = async () => {
    setIsGeneratingDigest(true);
    try {
      const res = await fetch('/api/feed/summarize', { method: 'POST' });
      if (res.ok) {
        // Refresh digests list
        const digRes = await fetch('/api/digests');
        if (digRes.ok) {
          setDigests(await digRes.json());
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed generating summarizes briefing digest.");
      }
    } catch (err) {
      console.error("Error starting AI model summary briefings compiler:", err);
    } finally {
      setIsGeneratingDigest(false);
    }
  };

  // Delete/dismiss individual timeline posts
  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/feed/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Error removing post record:", err);
    }
  };

  // Save modified user configurations
  const handleSaveSettings = async (updatedSettings: AppSettings) => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Error committing settings adjustments:", err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Trigger dispatching compiled morning briefing via email (real SMTP or mock simulation)
  const handleSendEmail = async (digestId: string) => {
    setIsEmailing(true);
    setEmailSuccess(false);
    try {
      const res = await fetch('/api/email/send-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digestId })
      });
      if (res.ok) {
        setEmailSuccess(true);
        // Refresh history log & emails queue
        const [emRes, digRes] = await Promise.all([
          fetch('/api/emails'),
          fetch('/api/digests')
        ]);
        if (emRes.ok) setEmails(await emRes.json());
        if (digRes.ok) setDigests(await digRes.json());

        // clear successes message after a while
        setTimeout(() => setEmailSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error calling e-mail endpoints:", err);
    } finally {
      setIsEmailing(false);
    }
  };

  // Save current setting fields state momentarily, and fire connection test
  const handleTestSMTPConnection = async () => {
    setIsTestingSMTP(true);
    setSmtpTestResult(null);
    try {
      // We will trigger a quick settings save since we need parameters present on the backend, 
      // then we'll send a test dispatch matching the latest generated digest (or a starter test)
      const currentDigestToTest = digests[0];
      if (!currentDigestToTest) {
        setSmtpTestResult({
          success: false,
          message: "No digest exists today to transmit. Generate a digest briefing before triggering test dispatches."
        });
        setIsTestingSMTP(false);
        return;
      }

      const res = await fetch('/api/email/send-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digestId: currentDigestToTest.id })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.record.status === 'delivered') {
          setSmtpTestResult({
            success: true,
            message: `SMTP Connection test successful! E-mail successfully dispatched and verified by host relay.`
          });
        } else {
          setSmtpTestResult({
            success: false,
            message: `SMTP connected but mail was SIMULATED. Please ensure "SMTP toggle" is turned ON inside advanced metrics and valid credentials are saved.`
          });
        }
        // Refresh emails in background
        const emRes = await fetch('/api/emails');
        if (emRes.ok) setEmails(await emRes.json());
      } else {
        setSmtpTestResult({
          success: false,
          message: data.error || "Failed sending verification connection test via host."
        });
      }
    } catch (err: any) {
      setSmtpTestResult({
        success: false,
        message: err.message || "Failed running connection test. Verify host domain address."
      });
    } finally {
      setIsTestingSMTP(false);
    }
  };

  // Nav metadata helper
  const sidebarItems = [
    { id: 'digest', label: 'Morning Digest', icon: Sparkles, detail: 'AI Daily Summary' },
    { id: 'feed', label: 'Ingested Updates', icon: FileText, detail: `${posts.length} posts past 24h` },
    { id: 'insights', label: 'Insights & Charts', icon: TrendingUp, detail: 'Analytical Graphs' },
    { id: 'inbox', label: 'Inbox Simulator', icon: Mail, detail: `${emails.length} briefs logged` },
    { id: 'settings', label: 'Alert & AI Settings', icon: SettingsIcon, detail: 'Fields and Keywords' },
    { id: 'readme', label: 'Deployment Guide', icon: BookOpen, detail: 'Setup & GitHub Readme' },
  ] as const;

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-3 w-3 rounded-full bg-brand-600 animate-ping" />
          <h2 className="font-display font-medium text-slate-800 tracking-tight text-sm">Synchronizing LinkedIn Feeds Database...</h2>
        </div>
        <p className="text-xs text-gray-400">Past 24 hours stats compiling engine booting up.</p>
      </div>
    );
  }

  const latestDigest = digests[0] || null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden border-b border-gray-150 bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="text-brand-600 h-5 w-5" />
          <span className="font-display font-black text-gray-900 text-sm tracking-tight">Morning Digest</span>
        </div>
        
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-gray-600 rounded-md hover:bg-slate-100 cursor-pointer"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Persistent Desktop Sidebar Navigation */}
        <aside className={`
          fixed md:sticky top-0 left-0 h-full w-[265px] bg-white text-slate-800 z-40 flex flex-col border-r border-slate-200 transition-transform duration-300 md:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Workspace Title Card */}
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold select-none shrink-0">
                L
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-tight text-slate-800 uppercase leading-none">LinkedIn Intel</h2>
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 mt-1 block">Digest Hub v1.4</span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border transition-all text-left cursor-pointer
                    ${isActive 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-xs' 
                      : 'bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }
                  `}
                >
                  <Icon size={15} className={isActive ? "text-blue-600" : "text-slate-400"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs tracking-tight">{item.label}</p>
                    <p className={`text-[9px] font-mono whitespace-nowrap overflow-hidden text-ellipsis mt-0.5 ${isActive ? 'text-blue-600/80' : 'text-slate-400'}`}>
                      {item.detail}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Profile footer section */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-xs flex items-center justify-center overflow-hidden shrink-0">
              <div className="text-slate-500 text-xs font-bold uppercase">
                {settings.linkedinProfileId.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs text-slate-800 truncate">@{settings.linkedinProfileId}</p>
              <p className="text-[10px] text-slate-400 truncate">{settings.emailRecipient}</p>
            </div>
          </div>
        </aside>

        {/* Outer overlay when mobile panel open */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}

        {/* Primary application view segment */}
        <main className="flex-1 flex flex-col bg-[#F8FAFC] min-w-0">
          
          {/* Header */}
          <PageHeader
            appName="LinkedIn Morning Digest"
            linkedinProfileId={settings.linkedinProfileId}
            onSimulateIngest={handleSimulateIngest}
            isIngesting={isIngesting}
            onOpenPasteModal={() => setIsPasteModalOpen(true)}
            onRefreshData={handleRefreshAllData}
            isRefreshing={isRefreshing}
          />

          {/* Embedded workspace Content container */}
          <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'digest' && (
              <DigestTab
                digest={latestDigest}
                onGenerateDigest={handleGenerateDigest}
                isGenerating={isGeneratingDigest}
                onSendEmail={handleSendEmail}
                isEmailing={isEmailing}
                settings={settings}
                isEmailSuccess={emailSuccess}
                postsCount={posts.length}
              />
            )}

            {activeTab === 'feed' && (
              <FeedTab
                posts={posts}
                onDeletePost={handleDeletePost}
                settings={settings}
              />
            )}

            {activeTab === 'insights' && (
              <InsightsTab
                posts={posts}
              />
            )}

            {activeTab === 'inbox' && (
              <InboxTab
                emails={emails}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                settings={settings}
                onSaveSettings={handleSaveSettings}
                isSaving={isSavingSettings}
                onTestSMTP={handleTestSMTPConnection}
                isTestingSMTP={isTestingSMTP}
                smtpTestStatus={smtpTestResult}
              />
            )}

            {activeTab === 'readme' && (
              <ReadmeTab />
            )}
          </div>
        </main>
      </div>

      {/* Paste Copied updates modal */}
      <PasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onImport={handleImportPaste}
        isImporting={isImportingPaste}
      />
    </div>
  );
}

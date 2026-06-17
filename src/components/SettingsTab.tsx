import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Save, Plus, X, Server, Key, Eye, EyeOff, Mail, HelpCircle, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

interface SettingsTabProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  isSaving: boolean;
  onTestSMTP: () => void;
  isTestingSMTP: boolean;
  smtpTestStatus: { success: boolean; message: string } | null;
}

export default function SettingsTab({
  settings,
  onSaveSettings,
  isSaving,
  onTestSMTP,
  isTestingSMTP,
  smtpTestStatus
}: SettingsTabProps) {
  const [profileId, setProfileId] = useState(settings.linkedinProfileId);
  const [emailRecipient, setEmailRecipient] = useState(settings.emailRecipient);
  const [openaiKey, setOpenaiKey] = useState(settings.openaiApiKey);
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || '');
  const [aiProvider, setAiProvider] = useState(settings.aiProvider);
  const [newKeyword, setNewKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>(settings.keywords);
  
  // SMTP advanced parameters
  const [smtpEnabled, setSmtpEnabled] = useState(settings.smtpEnabled);
  const [smtpHost, setSmtpHost] = useState(settings.smtpHost);
  const [smtpPort, setSmtpPort] = useState(settings.smtpPort);
  const [smtpUser, setSmtpUser] = useState(settings.smtpUser);
  const [smtpPass, setSmtpPass] = useState(settings.smtpPass);
  const [showPassword, setShowPassword] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Keyword additions
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWord = newKeyword.trim();
    if (cleanWord && !keywords.includes(cleanWord)) {
      setKeywords([...keywords, cleanWord]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (wordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== wordToRemove));
  };

  const handleSave = () => {
    const updatedSettings: AppSettings = {
      linkedinProfileId: profileId.trim() || 'your-linkedin-id',
      keywords: keywords,
      emailRecipient: emailRecipient.trim() || 'your-email@example.com',
      openaiApiKey: openaiKey,
      geminiApiKey: geminiKey,
      aiProvider: aiProvider,
      smtpEnabled,
      smtpHost: smtpHost.trim(),
      smtpPort,
      smtpUser: smtpUser.trim(),
      smtpPass: smtpPass,
      digestFrequency: settings.digestFrequency || 'Every Morning'
    };
    onSaveSettings(updatedSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        
        {/* Core Profile & Alerts Configuration */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-widest">Profile & Alerts Setup</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Configure your target accounts and alert keyword triggers</p>
          </div>

          <div className="space-y-4">
            {/* Profile ID */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                LinkedIn Profile Identifier
              </label>
              <div className="flex rounded-md shadow-xs max-w-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-105 text-slate-400 text-xs font-mono select-none">
                  linkedin.com/in/
                </span>
                <input
                  type="text"
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 text-xs border border-slate-200 rounded-r-md focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 font-sans"
                  placeholder="your-linkedin-id"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                The target LinkedIn profile ID to simulate feeds and summaries (e.g., as specified in URL parameters).
              </p>
            </div>

            {/* Keyword tag configuration list */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                Alert Keywords list of Interest
              </label>
              <form onSubmit={handleAddKeyword} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="e.g. Next.js, OpenAI, Remote, Hiring"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-full focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 font-sans bg-slate-50/50"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors inline-flex items-center gap-1 text-xs font-bold uppercase tracking-tight cursor-pointer shadow-sm"
                >
                  <Plus size={14} /> Add Alert
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-50 border border-brand-200 text-brand-700 uppercase"
                  >
                    #{kw}
                    <button
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-brand-400 hover:text-brand-700 rounded-full transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">
                Posts matching any of these keywords will be marked with a star, filtered, and emphasized inside your reports.
              </p>
            </div>
          </div>
        </div>

        {/* AI & Summarization Engines Configuration */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-widest">AI Configuration Parameters</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Specify which AI intelligence models fuel your summaries</p>
          </div>

          <div className="space-y-5">
            {/* Provider Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                Active Provider
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  onClick={() => setAiProvider('gemini')}
                  className={`p-3 border rounded-lg text-left flex flex-col justify-between transition-all cursor-pointer ${
                    aiProvider === 'gemini'
                      ? 'border-brand-600 bg-brand-50/25 ring-1 ring-brand-600'
                      : 'border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900">Google Gemini API</span>
                  <span className="text-[10px] text-slate-400 mt-1.5 font-medium leading-relaxed">Uses pre-configured server-side workspace keys. Works immediately.</span>
                </button>

                <button
                  onClick={() => setAiProvider('openai')}
                  className={`p-3 border rounded-lg text-left flex flex-col justify-between transition-all cursor-pointer ${
                    aiProvider === 'openai'
                      ? 'border-brand-600 bg-brand-50/25 ring-1 ring-brand-600'
                      : 'border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900">OpenAI ChatGPT API</span>
                  <span className="text-[10px] text-slate-400 mt-1.5 font-medium leading-relaxed">Provide a key below or write one in secrets panel.</span>
                </button>
              </div>
            </div>

            {/* Google Gemini API Key */}
            {aiProvider === 'gemini' && (
              <div className="space-y-1.5 max-w-md">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center justify-between">
                  <span>Google Gemini Secret Key</span>
                  <span className="text-[10px] text-slate-400 font-normal normal-case">Optional if set in .env</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 text-xs border border-slate-200 rounded-full focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 font-mono"
                    placeholder="AIzaSy................................"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                  Required to run Standalone Browser AI summarization directly. Paste your free key from Google AI Studio. Stored strictly in your browser local storage.
                </p>
              </div>
            )}

            {/* OpenAI API Key */}
            {aiProvider === 'openai' && (
              <div className="space-y-1.5 max-w-md">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center justify-between">
                  <span>OpenAI Secret Key</span>
                  <span className="text-[10px] text-slate-400 font-normal normal-case">Optional if set in .env</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 text-xs border border-slate-200 rounded-full focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 font-mono"
                    placeholder="sk-proj-................................"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save button card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Unsaved parameters will be discarded upon tab switching.</p>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                <CheckCircle size={14} /> Saved!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold uppercase tracking-wide text-[10px] rounded-full transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save size={14} />
              {isSaving ? "Saving Config..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Professional Email Delivery (SMTP Settings) */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <Mail size={16} className="text-brand-600" />
                SMTP Email Delivery
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Control how morning digests reach your inbox</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smtpEnabled}
                onChange={(e) => setSmtpEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="space-y-4">
            {/* Recipient box */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Recipient Email
              </label>
              <input
                type="email"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                className="w-full px-4 py-2 text-xs border border-slate-200 rounded-full focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 font-sans bg-slate-50/50"
                placeholder="your-email@example.com"
              />
              <p className="text-[9px] text-slate-400 mt-1.5 font-medium">Recipient mail box where digest PDFs or HTML briefs are forwarded.</p>
            </div>

            {smtpEnabled ? (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                {/* SMTP Server */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    SMTP Host Server
                  </label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full px-4 py-2 text-xs border border-slate-200 rounded-full focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 font-sans"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                {/* SMTP Port */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(parseInt(e.target.value) || 465)}
                    className="w-full px-4 py-2 text-xs border border-slate-200 rounded-full focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 font-sans"
                    placeholder="465"
                  />
                  <p className="text-[9px] text-slate-400 mt-1 font-medium">Common ports: 465 (SSL secure) or 587 (TLS safe).</p>
                </div>

                {/* SMTP User */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    SMTP Username / Login
                  </label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full px-4 py-2 text-xs border border-slate-200 rounded-full focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 font-mono"
                    placeholder="username@gmail.com"
                  />
                </div>

                {/* SMTP Password */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    SMTP Password / App Password
                  </label>
                  <input
                    type="password"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    className="w-full px-4 py-2 text-xs border border-slate-200 rounded-full focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 font-mono"
                    placeholder="••••••••••••••••"
                  />
                  <p className="text-[9px] text-amber-600 bg-amber-50 rounded-lg p-3 mt-1.5 flex items-start gap-1">
                    <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                    <span>For Gmail, you MUST use a 16-character <strong>App Password</strong> generated under security panel rather than password root.</span>
                  </p>
                </div>

                {/* Save core parameters then test SMTP */}
                <div className="pt-2">
                  <button
                    onClick={onTestSMTP}
                    disabled={isTestingSMTP || !smtpUser || !smtpPass}
                    type="button"
                    className="w-full py-2.5 bg-brand-50 hover:bg-brand-100 disabled:opacity-50 text-brand-800 font-bold uppercase tracking-wider text-[10px] border border-brand-200 rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {isTestingSMTP ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        Testing SMTP Connection...
                      </>
                    ) : (
                      <>
                        <Server size={13} />
                        Save & Test SMTP Dispatch
                      </>
                    )}
                  </button>
                  {smtpTestStatus && (
                    <div className={`p-3 rounded-lg text-xs mt-3 border ${
                      smtpTestStatus.success 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-100 text-red-800'
                    }`}>
                      <p className="font-bold">{smtpTestStatus.success ? "Success!" : "SMTP Dispatch Failed:"}</p>
                      <p className="leading-relaxed mt-0.5">{smtpTestStatus.message}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs leading-relaxed space-y-2 font-medium">
                <p className="font-bold text-slate-900 uppercase tracking-wide">📬 Local simulation mode active</p>
                <p>Since SMTP email metrics are disabled or credentials are blank, dispatch will be safely simulated.</p>
                <p>All morning briefs generated are exported and logged to our **mock inbox simulator tab** right here in this dashboard, allowing you to copy HTML and verify styling anytime.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { BookOpen, Terminal, Key, Shield, Mail, Zap, RefreshCw, Github } from 'lucide-react';

export default function ReadmeTab() {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <BookOpen size={240} className="text-slate-100" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded-sm uppercase font-mono font-bold tracking-widest">
            Deployment & Setup Guide
          </span>
          <h2 className="text-2xl font-bold mt-3 uppercase tracking-tight font-sans">
            How to Setup & Deploy LinkedIn Intel
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Welcome! This app compiles past 24-hour LinkedIn feeds into highly curated markdown summaries, digests briefs, categories insights, and dispatches them straight to your SMTP email box. Follow this quick guide to run the codebase locally or deploy it to production.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Architecture Block */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm col-span-1 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Zap size={18} className="text-blue-600" />
            <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider">
              Application Core Flow
            </h3>
          </div>
          
          <ul className="space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
            <li className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">1</span>
              <div>
                <strong className="text-slate-900 block font-bold">1. Gather / Ingest Feeds</strong>
                Use the <strong className="text-blue-600">"Simulate Live Scavenge"</strong> button to load mock past 24h updates or paste live timeline blocks directly with the Clipboard Importer.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">2</span>
              <div>
                <strong className="text-slate-900 block font-bold">2. Custom Tag Filtering</strong>
                Keywords defined in Settings automatically highlight posts, tag interests, and calculate live analytical focus frequency shares.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">3</span>
              <div>
                <strong className="text-slate-900 block font-bold">3. AI Categorization / Summaries</strong>
                Google Gemini model analyzes the ingested posts, filters major breakthroughs, matches target jobs, and writes clean bullet points.
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">4</span>
              <div>
                <strong className="text-slate-900 block font-bold">4. Email Delivery Dispatch</strong>
                SMTP sends pristine HTML tables to your recipient inbox. The integrated <strong className="text-blue-600">Inbox Simulator</strong> stores a local log copy for instant debugging.
              </div>
            </li>
          </ul>
        </div>

        {/* Local Command Trigger Console */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm col-span-1 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Terminal size={18} className="text-blue-600" />
            <h3 className="font-bold text-xs text-slate-950 uppercase tracking-wider">
              Local Setup & Running Commands
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              To download this application to your local computer and start editing, follow these three commands inside your system terminal:
            </p>

            <div className="space-y-3 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 text-[10px] block font-bold font-sans uppercase mb-1">1. Install Node Dependencies:</span>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg border border-slate-800">
                  npm install
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block font-bold font-sans uppercase mb-1">2. Run in Development Mode:</span>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg border border-slate-800">
                  npm run dev
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block font-bold font-sans uppercase mb-1">3. Compile & Start Production Bundle:</span>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg border border-slate-800">
                  npm run build && npm start
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secrets & Credentials configuration detail card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Key size={18} className="text-blue-600" />
          <h3 className="font-bold text-xs text-slate-950 uppercase tracking-widest">
            Environment Secrets Setup (.env)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 text-xs leading-relaxed font-medium text-slate-600">
            <p>
              By default, our server-side API integrates directly with <strong className="text-slate-800">Google Gemini</strong> to parse and summarize ingested updates.
            </p>
            <p>
              To run the system without any manual keys inside the web panel, create a file named <strong className="text-slate-800 font-mono">.env</strong> in the root folder of your project and populate it as follows:
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg font-mono text-[11px] text-slate-700 space-y-1">
              <p className="text-green-600"># Google Gemini Workspace Core Key</p>
              <p>GEMINI_API_KEY=your_gemini_api_key_here</p>
              <p className="text-green-600 mt-2"># Optional OpenAI Core Key</p>
              <p>OPENAI_API_KEY=your_openai_api_key_here</p>
            </div>
            
            <p className="text-[11px] text-slate-400 mt-2">
              If no API key is specified inside the `.env` file, you can easily input keys inside the **Alert & AI Settings** page directly within the web panel instead.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Mail size={15} className="text-blue-600" />
                SMTP Host Delivery Guidelines
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                To have Morning Digests reach your physical mobile inbox (instead of just simulated dashboards), configure the advanced SMTP options in Settings:
              </p>
              <ul className="text-[11px] text-slate-600 space-y-2 list-disc pl-4 font-medium leading-relaxed">
                <li>
                  <strong className="text-slate-900">Gmail Delivery:</strong> Go to Google Account Settings → Security → 2-Step Verification → <strong className="text-blue-600">App Passwords</strong>. Enter a label and generate a unique 16-character string. Use this as your SMTP password (instead of your normal account password).
                </li>
                <li>
                  <strong className="text-slate-900">Alternative Providers:</strong> Works seamlessly with SendGrid, Mailgun, Amazon SES or corporate Outlook Exchange ports. Turn on SSL on port 465 or TLS on port 587.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Repository Push Guidelines */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 uppercase tracking-wide">
            <Github size={16} className="text-slate-800" />
            Ready for your GitHub Profile?
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            This repository is configured out-of-the-box to preserve user modifications. Download the directory or click Export ZIP within settings, then run <code className="bg-slate-200 font-mono px-1 py-0.5 rounded text-[10px]">git init</code> to push to your GitHub profile and share your digest automation with friends.
          </p>
        </div>
        <div className="flex-shrink-0 text-slate-400 font-mono text-[9px] uppercase tracking-widest text-right">
          Port: 3000 Ingress Ready
        </div>
      </div>
    </div>
  );
}

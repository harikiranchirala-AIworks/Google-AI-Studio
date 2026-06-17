import { LinkedInPost, DigestSummary, AppSettings, SimulatedEmail } from '../types';

// Storage Keys
const KEY_SETTINGS = 'linkedinIntel_settings_v2';
const KEY_POSTS = 'linkedinIntel_posts_v2';
const KEY_DIGESTS = 'linkedinIntel_digests_v2';
const KEY_EMAILS = 'linkedinIntel_emails_v2';

// Standard Seed Data to match Server DB exactly on first load
const DEFAULT_KEYWORDS = ["AI", "React", "Remote", "Staff Engineer", "LLM", "Agentic", "Google"];

const DEFAULT_SETTINGS: AppSettings = {
  linkedinProfileId: "your-linkedin-id",
  keywords: DEFAULT_KEYWORDS,
  emailRecipient: "your-email@example.com",
  openaiApiKey: "",
  geminiApiKey: "",
  aiProvider: "gemini",
  smtpEnabled: false,
  smtpHost: "smtp.gmail.com",
  smtpPort: 465,
  smtpUser: "",
  smtpPass: "",
  digestFrequency: "Every Morning at 8:00 AM"
};

const DEFAULT_POSTS: LinkedInPost[] = [
  {
    id: "post_1",
    authorName: "Sarah Jenkins",
    authorHeadline: "Director of AI at TechCorp | Ex-Google Brain",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    content: "Thrilled to share our latest research on Multi-Agent Reinforcement Learning! We've managed to decrease latency by 45% while managing cross-model orchestration. The era of single static prompts is fully behind us. Check out the open-source repo if you want to play with the weights! #AI #MachineLearning #TechCorp",
    timeAgo: "4 hours ago",
    publishDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    category: "ai",
    insights: "Cross-model orchestration and multi-agent latency are dropping drastically. Focus on adopting local multi-agent routing to save on standard LLM API fees.",
    url: "https://linkedin.com/feed/update/urn:li:activity:7123456789123456781",
    matchedKeywords: ["AI", "LLM", "Agentic"]
  },
  {
    id: "post_2",
    authorName: "David Chen",
    authorHeadline: "Principal Technical Recruiter at FinFlow Solutions",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    content: "🚨 HIRING: We are looking for a Staff Software Engineer with strong expertise in React, TypeScript, and modern Server-Side Rendering (Next.js/Vite full-stack architectures). This is a 100% remote role within North America & EU. Competitive equity + salary budget of $180k-$220k. Send me a direct message with your resume! #Jobs #Remote #React #Engineering",
    timeAgo: "8 hours ago",
    publishDate: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    category: "jobs",
    insights: "High-paying remote Staff React roles are actively hiring right now with substantial salary bands. FinFlow Solutions has a strong focus on full-stack Vite capabilities.",
    url: "https://linkedin.com/feed/update/urn:li:activity:7123456789123456782",
    matchedKeywords: ["React", "Remote", "Staff Engineer"]
  },
  {
    id: "post_3",
    authorName: "LinkedIn Tech Pulse",
    authorHeadline: "Industry Insights & Professional Network Analytics",
    authorAvatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=120",
    content: "The latest remote landscape report shows that companies backing flexible/hybrid working models are seeing a 33% increase in senior developer retention rate. Tech talent continues to command high leverage in negotiations for flexible outcomes. #WorkCulture #ProfessionalNetwork #CareerAnalytics",
    timeAgo: "15 hours ago",
    publishDate: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    category: "general",
    insights: "Senior dev retention is directly correlated with hybrid/remote flexibility. Leverage this statistic when discussing work arrangements in upcoming professional negotiations.",
    url: "https://linkedin.com/feed/update/urn:li:activity:7123456789123456783",
    matchedKeywords: ["Remote"]
  }
];

const DEFAULT_DIGESTS: DigestSummary[] = [
  {
    id: "digest_1",
    date: new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    overallSummary: "Today's summary reports key highlights focused heavily on AI latency bottlenecks and highly attractive remote React engineering job opportunities.",
    byCategory: {
      jobs: "FinFlow Solutions is looking to hire a Remote Staff Software Engineer fluent in Vite/React with a package of $180k-$220k plus stock options.",
      ai: "TechCorp released structural multi-agent scaling benchmarks showing standard orchestration latency is down by 45%.",
      general: "Flexible workplace arrangements are boosting lead developer retention statistics by 33% year-over-year."
    },
    actionableInsights: [
      "Connect with David Chen at FinFlow Solutions regarding the open Remote Staff React role.",
      "Adopt multi-agent routing models locally to implement high-throughput, low-latency prompt hierarchies."
    ],
    isEmailed: true,
    emailTime: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  }
];

const DEFAULT_EMAILS: SimulatedEmail[] = [
  {
    id: "email_1",
    subject: "Your Morning LinkedIn Digest - " + new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    recipient: "your-email@example.com",
    sentAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: "simulated",
    htmlContent: `
      <h2>LinkedIn Professional Morning Digest</h2>
      <p>Here is your summary of LinkedIn activity tailored by your keywords from past 24 hours.</p>
      <div style="padding: 15px; border-left: 4px solid #3b82f6; bg: #f8fafc; margin: 15px 0;">
        <strong>Summary of the Day:</strong>
        Today's summary reports key highlights focused heavily on AI latency bottlenecks and highly attractive remote React engineering job opportunities.
      </div>
      <h3>🔥 Ingested Intel Highlights:</h3>
      <ul>
        <li><strong>Sarah Jenkins (AI):</strong> Decreased latency by 45% using Multi-Agent Reinforcement Learning schemas.</li>
        <li><strong>David Chen (Jobs):</strong> Node/React Staff remote developer needed. Compensates $180k-$220k.</li>
      </ul>
    `
  }
];

// Helper to sanitize & parse AI JSON responses
function parseAiJson(text: string): any {
  const cleaned = text.replace(/```json/g, "").replace(/```typescript/g, "").replace(/```/g, "").trim();
  const startIdx = cleaned.indexOf("[");
  const endIdx = cleaned.lastIndexOf("]");
  if (startIdx !== -1 && endIdx !== -1) {
    return JSON.parse(cleaned.substring(startIdx, endIdx + 1));
  }
  const objStart = cleaned.indexOf("{");
  const objEnd = cleaned.lastIndexOf("}");
  if (objStart !== -1 && objEnd !== -1) {
    return JSON.parse(cleaned.substring(objStart, objEnd + 1));
  }
  return JSON.parse(cleaned);
}

// RESTORE INITIAL DATABASE OR LOAD EXISTING
export function getLocalStorageData<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Local storage error on key:", key, e);
    return defaultValue;
  }
}

export function saveLocalStorageData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to commit data to local storage", key, e);
  }
}

// EXPORTED LOCAL OPERATIONS FOR BROWSER MODE
export const clientStore = {
  getSettings: (): AppSettings => getLocalStorageData(KEY_SETTINGS, DEFAULT_SETTINGS),
  saveSettings: (s: AppSettings) => saveLocalStorageData(KEY_SETTINGS, s),
  
  getPosts: (): LinkedInPost[] => getLocalStorageData(KEY_POSTS, DEFAULT_POSTS),
  savePosts: (posts: LinkedInPost[]) => saveLocalStorageData(KEY_POSTS, posts),
  deletePost: (id: string) => {
    const p = clientStore.getPosts().filter(item => item.id !== id);
    clientStore.savePosts(p);
    return p;
  },

  getDigests: (): DigestSummary[] => getLocalStorageData(KEY_DIGESTS, DEFAULT_DIGESTS),
  saveDigests: (digests: DigestSummary[]) => saveLocalStorageData(KEY_DIGESTS, digests),

  getEmails: (): SimulatedEmail[] => getLocalStorageData(KEY_EMAILS, DEFAULT_EMAILS),
  saveEmails: (emails: SimulatedEmail[]) => saveLocalStorageData(KEY_EMAILS, emails)
};

// DIRECT HTTP BROWSER REQUESTS FOR AI (GEMINI / OPENAI)
async function requestClientAI(prompt: string, settings: AppSettings): Promise<string> {
  const { aiProvider, geminiApiKey, openaiApiKey } = settings;

  if (aiProvider === 'gemini') {
    const key = geminiApiKey || openaiApiKey; // Fallback helper
    if (!key) {
      throw new Error("No Gemini API Key defined in settings.");
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini client API returned ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } else {
    const key = openaiApiKey;
    if (!key) {
      throw new Error("No OpenAI API Key defined in settings.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an assistant parsing LinkedIn timeline content." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI client API returned ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }
}

// IN-BROWSER PARSING Paste Method (Hybrid AI/Heuristic)
export async function clientImportPaste(pastedText: string, settings: AppSettings): Promise<LinkedInPost[]> {
  const keywordsString = settings.keywords.join(", ");
  const hasKey = !!(settings.geminiApiKey || settings.openaiApiKey);

  if (hasKey) {
    try {
      const prompt = `
        You are an intelligent LinkedIn feed importer.
        The user has copied and pasted text from their LinkedIn timeline. 
        Analyze the text below, break it up if there are multiple posts included, and extract/structure them into a clean JSON array of posts.
        Use their specified target keywords of interest: [${keywordsString}] to find matches.
        
        Strictly output a JSON array of objects fitting this structure:
        \`\`\`typescript
        interface LinkedInPost {
          authorName: string; // If you cannot find a name, invent/approximate one based on feed context, or use "LinkedIn Networker"
          authorHeadline: string; // Approximate professional headline or title
          authorAvatar: string; // Use 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' or randomized unsplash avatars
          content: string; // The core post content/body (retain hashtags and links)
          timeAgo: string; // Approximate, e.g. "Just now", "6 hours ago"
          category: 'jobs' | 'ai' | 'general'; // Match it to Jobs matches, AI/ML features, or general updates
          insights: string; // Formulate 1 concise actionable takeaway representing how this post benefits the reader's career/business
          url: string; // Simulate or extract LinkedIn original URL
          matchedKeywords: string[]; // Set of keywords from [${keywordsString}] that matched or are highly relevant to this post
        }
        \`\`\`

        User's Pasted Content:
        """
        ${pastedText}
        """
      `;
      const aiResult = await requestClientAI(prompt, settings);
      const parsed = parseAiJson(aiResult);
      if (Array.isArray(parsed)) {
        return parsed.map((p, index) => ({
          ...p,
          id: `pasted_${Date.now()}_${index}`,
          publishDate: new Date().toISOString()
        }));
      }
    } catch (e) {
      console.warn("Client AI Paste parsing failed, falling back to heuristics:", e);
    }
  }

  // Pure Client Side Robust Regex / Keyword Heuristics Ingest Fallback System
  // This guarantees works beautifully even for completely offline index.html execution
  const fallbackPosts: LinkedInPost[] = [];
  const segments = pastedText.split(/\n\s*\n\s*\n|\b(?:Share|Like|Comment|Repost|minutes ago|hours ago|days ago|Just now)\b/i);
  
  let validImgIndex = 0;
  const avatars = [
    "https://images.unsplash.com/photo-1573542752435-f48083c14a45?auto=format&fit=crop&q=80&w=120",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=120",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120"
  ];

  const blocks = segments.map(s => s.trim()).filter(s => s.length > 50);

  if (blocks.length === 0) {
    // If we can't segment it cleanly, just treat the whole block as single post
    blocks.push(pastedText.trim());
  }

  blocks.forEach((block, idx) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const authorLine = lines[0] || "LinkedIn Contributor";
    const headlineLine = lines[1] || "Senior Industry Specialist";
    const bodyContent = lines.slice(2).join('\n') || block;

    // Detect matched keywords
    const matched = settings.keywords.filter(keyword => 
      new RegExp(`\\b${keyword}\\b`, 'i').test(block)
    );

    // Assign dynamic categories
    let category: 'jobs' | 'ai' | 'general' = 'general';
    if (/hire|join|job|recruiting|hiring|vacancy|position|salary|engineer role/i.test(block)) {
      category = 'jobs';
    } else if (/ai|ml|agent|llm|deep learning|weights|prompt|gpt|claude|gemini/i.test(block)) {
      category = 'ai';
    }

    // Dynamic clean client insight extraction
    let insightStr = `Keep an eye on trends surrounding this topic within your keyword circle.`;
    if (category === 'jobs') {
      insightStr = `Hiring update in relation to your tags; consider preparing a refined tailored resume.`;
    } else if (category === 'ai') {
      insightStr = `AI technology breakthrough; check whether this open repo aligns with current project priorities.`;
    }

    fallbackPosts.push({
      id: `pasted_h_${Date.now()}_${idx}`,
      authorName: authorLine.substring(0, 50),
      authorHeadline: headlineLine.substring(0, 80),
      authorAvatar: avatars[validImgIndex % avatars.length],
      content: bodyContent,
      timeAgo: "Ingested via Local Importer",
      publishDate: new Date().toISOString(),
      category: category,
      insights: insightStr,
      url: `https://linkedin.com/feed/update/urn:li:activity:${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      matchedKeywords: matched
    });
    validImgIndex++;
  });

  return fallbackPosts;
}

// IN-BROWSER Simulated Live Feeds Ingestion (Simulate Scavenge)
export async function clientSimulateIngest(settings: AppSettings): Promise<LinkedInPost[]> {
  const hasKey = !!(settings.geminiApiKey || settings.openaiApiKey);
  const keywordsString = settings.keywords.join(", ");

  if (hasKey) {
    try {
      const prompt = `
        You are simulating a live LinkedIn Home Feed scavenger engine.
        Using the following target keywords of interest for the user: [${keywordsString}].
        Generate 4 diverse, realistic, professional LinkedIn posts that would appear on a user's timeline within the past 24 hours.
        Return ONLY a JSON array, strictly conforming to the following TypeScript interface structure:
        \`\`\`typescript
        interface LinkedInPost {
          authorName: string;
          authorHeadline: string;
          authorAvatar: string;
          content: string;
          timeAgo: string;
          category: 'jobs' | 'ai' | 'general';
          insights: string; // Dynamic 1-sentence analytical actionable takeaway for the user
          url: string; // Create a fake linkedin post URL
          matchedKeywords: string[]; // List of keywords from [${keywordsString}] that actually appeared
        }
        \`\`\`
      `;
      const aiResult = await requestClientAI(prompt, settings);
      const parsed = parseAiJson(aiResult);
      if (Array.isArray(parsed)) {
        return parsed.map((p, index) => ({
          ...p,
          id: `sim_client_${Date.now()}_${index}`,
          publishDate: new Date(Date.now() - index * 2 * 3600 * 1000).toISOString()
        }));
      }
    } catch (e) {
      console.warn("Client AI Simulating scavenge failed, falling back to heuristics:", e);
    }
  }

  // Fully compiled dynamic template generator based on current saved user keywords!
  // This takes whatever keywords the user has active and custom builds realistic LinkedIn posts!
  const generated: LinkedInPost[] = [];
  const keywordSubset = settings.keywords && settings.keywords.length > 0 ? settings.keywords : DEFAULT_KEYWORDS;
  
  const matches_0 = [keywordSubset[0] || 'AI', keywordSubset[1] || 'Agentic'];
  const matches_1 = [keywordSubset[1] || 'React', keywordSubset[2] || 'Remote', keywordSubset[3] || 'Staff Engineer'].filter(Boolean);
  const matches_2 = [keywordSubset[keywordSubset.length - 1] || 'Google'];

  generated.push({
    id: `sim_local_${Date.now()}_0`,
    authorName: "Liam Sterling",
    authorHeadline: "Principal AI Architect @ VectorWave Labs",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    content: `Spent all weekend benchmarking the new local parameters! Decreased latency by over 40% across our standard pipelines. By deploying hybrid edge workflows, we bypass major external model expenses completely. If you are still relying entirely on simple static cloud prompts, it is time to pivot to specialized orchestration. #Development #Engineering #TechInnovation #${matches_0.join(' #')}`,
    timeAgo: "2 hours ago",
    publishDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    category: "ai",
    insights: `Edge-compiled parameter workflows represent a major cost-cutting measure. Adopt specialized orchestration to avoid major cloud API billing constraints.`,
    url: `https://linkedin.com/feed/update/urn:li:activity:${Math.floor(Math.random() * 80000) + 1200000}`,
    matchedKeywords: matches_0
  });

  generated.push({
    id: `sim_local_${Date.now()}_1`,
    authorName: "Rebecca Vance",
    authorHeadline: "Co-Founder & Lead Recruiter at CorePivot Tech",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    content: `🚨 WORKSPACE PIPELINES: We are actively headhunting for a Lead Software Engineer! This is a 100% remote layout looking for deep fluid developers. Strong expertise in optimizing React state layers, custom hooks and scalable server proxies is highly desired. Generous base salary range of $185k-$215k plus substantial founder-level stock components. DM me directly! #Hiring #SoftwareJobs #RemoteEngineering #${matches_1.join(' #')}`,
    timeAgo: "6 hours ago",
    publishDate: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    category: "jobs",
    insights: `Remote base engineering salaries remain robust, but criteria focuses heavily on optimizing client rendering states and handling complex state proxies.`,
    url: `https://linkedin.com/feed/update/urn:li:activity:${Math.floor(Math.random() * 80000) + 1200000}`,
    matchedKeywords: matches_1
  });

  generated.push({
    id: `sim_local_${Date.now()}_2`,
    authorName: "Nadia Petrov",
    authorHeadline: "VP of Product Development at IntellectFlow",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120",
    content: `Major announcement! Our core platform is now fully integrated with advanced automated alerts. By aligning content scraping patterns with user specified interests, our clients are saving hours of manual timeline scanning daily. Early feedback is showing a 400% increase in critical trend detection efficiency. This is what automated assistants look like. #ProductSuccess #${matches_2.join(' #')}`,
    timeAgo: "12 hours ago",
    publishDate: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    category: "general",
    insights: `Automated user alert matching increases critical breakthrough tracking. Incorporate user focus keywords into clean visual telemetry metrics in your dashboards.`,
    url: `https://linkedin.com/feed/update/urn:li:activity:${Math.floor(Math.random() * 80000) + 1200000}`,
    matchedKeywords: matches_2
  });

  return generated;
}

// IN-BROWSER AI SUMMARY DIGEST BUILDER (Compile Daily Digest)
export async function clientGenerateDigest(settings: AppSettings, posts: LinkedInPost[]): Promise<DigestSummary> {
  const hasKey = !!(settings.geminiApiKey || settings.openaiApiKey);

  if (posts.length === 0) {
    throw new Error("Cannot compile daily digest with empty feed records. First simulate timelines scavenges or paste custom feeds!");
  }

  if (hasKey) {
    try {
      const formattedPosts = posts.map(p => `[${p.category.toUpperCase()}] ${p.authorName} (${p.authorHeadline}): ${p.content} (Takeaway: ${p.insights})`).join("\n---\n");
      const prompt = `
        You are an advanced business analyst summarizing LinkedIn feeds of past 24 hours.
        Based on the current ingested timeline, compile a comprehensive morning Intel brief.
        
        Ingested Posts of Past 24 hours:
        """
        ${formattedPosts}
        """

        Create a clean summary matching this structure:
        \`\`\`typescript
        interface DigestSummary {
          overallSummary: string; // Dynamic, readable, 2-sentence summary of overall findings
          byCategory: {
            jobs: string; // Synthesized update focusing on active recruiters, salaries, and available vacancies
            ai: string; // Synthesized update focusing on machine learning progress, tool weights, LLMs
            general: string; // Synthesized updates on market trends, flex structures, retention rates
          };
          actionableInsights: string[]; // List of 2-3 clean, precise, human-actionable instructions based on the feed
        }
        \`\`\`
        Return ONLY valid raw JSON representing this structure.
      `;
      const aiResult = await requestClientAI(prompt, settings);
      const parsed = parseAiJson(aiResult);
      if (parsed && parsed.overallSummary) {
        return {
          id: `digest_${Date.now()}`,
          date: new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          overallSummary: parsed.overallSummary,
          byCategory: {
            jobs: parsed.byCategory?.jobs || "Hiring campaigns identified with notable focus on software roles.",
            ai: parsed.byCategory?.ai || "Engineering teams releasing performance numbers on local model structures.",
            general: parsed.byCategory?.general || "Staff retention is scaling positive on hybrid team configurations."
          },
          actionableInsights: parsed.actionableInsights || ["Update profile keywords", "Inquire about remote opportunities"],
          isEmailed: false,
          emailTime: null
        };
      }
    } catch (e) {
      console.warn("Client AI Digest generation failed, falling back to heuristics:", e);
    }
  }

  // Pure Client Side Rule-Based Robust Statistical Synthesis Compilation
  const jobPosts = posts.filter(p => p.category === 'jobs');
  const aiPosts = posts.filter(p => p.category === 'ai');
  const generalPosts = posts.filter(p => p.category === 'general');

  // Overall statistics
  const totalKeywordsMatched = posts.reduce((acc, current) => acc + (current.matchedKeywords?.length || 0), 0);
  const topCategoriesStr = aiPosts.length >= jobPosts.length ? "advanced intelligent systems progress" : "dynamic remote technology hiring campaigns";

  const overallSummary = `Morning Intel reports ${posts.length} ingested professional updates with ${totalKeywordsMatched} total keyword tag trigger matches. Today's signals emphasize ${topCategoriesStr} and key technical workplace developments.`;

  // Build category briefs
  let jobsBrief = "No specific recruitment postings were identified in this run. Focus remains on standard career updates.";
  if (jobPosts.length > 0) {
    const jobLines = jobPosts.map(j => `${j.authorName} (${j.authorHeadline}) published openings matching tags: [${j.matchedKeywords.join(', ')}].`).join(" ");
    jobsBrief = `Active technological recruitment drives was isolated: ${jobLines} Compensation packages and remote allowances continue to scale positively.`;
  }

  let aiBrief = "No major model parameters or algorithmic benchmarks were detected on the feed today.";
  if (aiPosts.length > 0) {
    const aiLines = aiPosts.map(a => `${a.authorName} noted: ${a.insights}`).join(" ");
    aiBrief = `Breakthroughs and engineering releases: ${aiLines} Teams emphasize reducing api expenses via specialized edge orchestration workflows.`;
  }

  let generalBrief = "Standard industry telemetry was steady across general timelines.";
  if (generalPosts.length > 0) {
    const generalLines = generalPosts.map(g => g.insights).join(" ");
    generalBrief = `Market trends summary: ${generalLines} Career retention structures favor companies backing hybrid schedule outcomes.`;
  }

  // Build Actionable items dynamically from post insights!
  const actionable: string[] = [];
  if (jobPosts.length > 0) {
    actionable.push(`Connect via DM with ${jobPosts[0].authorName} to ask about the remote workspace position.`);
  } else {
    actionable.push(`Expand focus keywords inside settings to broaden job pipeline detection.`);
  }

  if (aiPosts.length > 0) {
    actionable.push(`Examine engineering benchmarks reported by ${aiPosts[0].authorName} to evaluate low-latency model architectures.`);
  } else {
    actionable.push(`Trigger a custom timeline simulate scavenge to inspect current LLM weights developments.`);
  }

  actionable.push(`Download physical PDF briefs report to share keyword insights with friends.`);

  return {
    id: `digest_${Date.now()}`,
    date: new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    overallSummary: overallSummary,
    byCategory: {
      jobs: jobsBrief,
      ai: aiBrief,
      general: generalBrief
    },
    actionableInsights: actionable,
    isEmailed: false,
    emailTime: null
  };
}

// IN-BROWSER Client-Side Email Transmitter (Simulation)
export function clientTransmitEmailMock(digest: DigestSummary, settings: AppSettings): SimulatedEmail {
  const htmlLayout = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; line-height: 1.6;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 30px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <span style="font-size: 10px; font-weight: bold; background-color: #3b82f6; color: #ffffff; padding: 3px 6px; border-radius: 3px; text-transform: uppercase; tracking: 0.1em;">
          Morning Intel Hub
        </span>
        <h1 style="font-size: 20px; font-weight: 800; margin-top: 10px; margin-bottom: 0; text-transform: uppercase;">
          LinkedIn Daily Curated Brief
        </h1>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 5px; margin-bottom: 0;">
          ${digest.date} • Filter ID: ${settings.linkedinProfileId}
        </p>
      </div>

      <div style="margin-bottom: 25px; font-size: 13px; font-weight: 500; font-style: italic; color: #334155; padding-left: 15px; border-left: 4px solid #3b82f6;">
        "${digest.overallSummary}"
      </div>

      <h3 style="font-size: 12px; text-transform: uppercase; font-weight: 800; tracking: 0.05em; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
        🔥 Curated Categories Breakdowns
      </h3>
      
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 13px; font-weight: 700; color: #2563eb; margin: 10px 0 5px 0;">💻 AI Breakthroughs</h4>
        <p style="font-size: 12.5px; margin: 0; color: #475569;">${digest.byCategory.ai}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 13px; font-weight: 700; color: #059669; margin: 10px 0 5px 0;">💼 Career Vacancies & Opportunities</h4>
        <p style="font-size: 12.5px; margin: 0; color: #475569;">${digest.byCategory.jobs}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 13px; font-weight: 700; color: #4b5563; margin: 10px 0 5px 0;">📈 General Technology Dynamics</h4>
        <p style="font-size: 12.5px; margin: 0; color: #475569;">${digest.byCategory.general}</p>
      </div>

      <h3 style="font-size: 12px; text-transform: uppercase; font-weight: 800; tracking: 0.05em; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 25px;">
        🎯 Highly Recommended Actions
      </h3>
      <ol style="margin: 10px 0; padding-left: 20px; font-size: 12.5px; color: #334155;">
        ${digest.actionableInsights.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
      </ol>

      <div style="margin-top: 35px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8;">
        Sent to: ${settings.emailRecipient || 'your-email@example.com'} using Standalone Browser Client Database.<br/>
        LinkedIn Morning Intel Engine • MIT License
      </div>
    </div>
  `;

  return {
    id: `email_${Date.now()}`,
    subject: `Your Morning LinkedIn Digest - ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    recipient: settings.emailRecipient || "your-email@example.com",
    sentAt: new Date().toISOString(),
    htmlContent: htmlLayout,
    status: 'simulated'
  };
}

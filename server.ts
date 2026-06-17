import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");

// Helper to ensure data files exist
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const settingsFile = path.join(DATA_DIR, "settings.json");
  if (!fs.existsSync(settingsFile)) {
    const defaultSettings = {
      linkedinProfileId: "your-linkedin-id",
      keywords: ["AI", "React", "Remote", "Staff Engineer", "LLM", "Agentic", "Google"],
      emailRecipient: "your-email@example.com",
      openaiApiKey: "",
      aiProvider: "gemini",
      smtpEnabled: false,
      smtpHost: "smtp.gmail.com",
      smtpPort: 465,
      smtpUser: "",
      smtpPass: "",
      digestFrequency: "Every Morning at 8:00 AM"
    };
    fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2));
  }

  const feedFile = path.join(DATA_DIR, "feed.json");
  if (!fs.existsSync(feedFile)) {
    const seedFeed = [
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
    fs.writeFileSync(feedFile, JSON.stringify(seedFeed, null, 2));
  }

  const digestsFile = path.join(DATA_DIR, "digests.json");
  if (!fs.existsSync(digestsFile)) {
    const seedDigest = [
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
    fs.writeFileSync(digestsFile, JSON.stringify(seedDigest, null, 2));
  }

  const emailsFile = path.join(DATA_DIR, "emails.json");
  if (!fs.existsSync(emailsFile)) {
    const seedEmails = [
      {
        id: "email_1",
        subject: "Your Morning LinkedIn Digest - " + new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        recipient: "your-email@example.com",
        sentAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        status: "simulated",
        htmlContent: "<h2>LinkedIn Professional Morning Digest</h2><p>Here is your summary of LinkedIn activity tailored by your keywords from past 24 hours.</p>"
      }
    ];
    fs.writeFileSync(emailsFile, JSON.stringify(seedEmails, null, 2));
  }
}

// Read and write data functions
function getSettings() {
  ensureDataDir();
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "settings.json"), "utf8"));
}

function saveSettings(settings: any) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, "settings.json"), JSON.stringify(settings, null, 2));
}

function getFeed() {
  ensureDataDir();
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "feed.json"), "utf8"));
}

function saveFeed(feed: any) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, "feed.json"), JSON.stringify(feed, null, 2));
}

function getDigests() {
  ensureDataDir();
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "digests.json"), "utf8"));
}

function saveDigests(digests: any) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, "digests.json"), JSON.stringify(digests, null, 2));
}

function getEmails() {
  ensureDataDir();
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "emails.json"), "utf8"));
}

function saveEmails(emails: any) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, "emails.json"), JSON.stringify(emails, null, 2));
}

// LLM Helper
async function runAISummarization(prompt: string, provider: 'gemini' | 'openai', openaiKey: string) {
  if (provider === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined on the server side.");
    }
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });
      return response.text || "";
    } catch (err: any) {
      console.error("Gemini API call failed:", err);
      throw new Error(`Gemini API Error: ${err.message || err}`);
    }
  } else {
    // OpenAI HTTP Request
    const key = openaiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error("OpenAI API key is required. Please set it in your settings panel.");
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a professional LinkedIn trend analyst and summarization assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errDetails = await response.text();
        throw new Error(`OpenAI API returned status ${response.status}: ${errDetails}`);
      }

      const json = await response.json();
      return json.choices?.[0]?.message?.content || "";
    } catch (err: any) {
      console.error("OpenAI API call failed:", err);
      throw new Error(`OpenAI API Error: ${err.message || err}`);
    }
  }
}

async function startServer() {
  ensureDataDir();
  const app = express();
  app.use(express.json());

  // API - Get App Settings
  app.get("/api/settings", (req, res) => {
    try {
      res.json(getSettings());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API - Save App Settings
  app.post("/api/settings", (req, res) => {
    try {
      const current = getSettings();
      const updated = { ...current, ...req.body };
      saveSettings(updated);
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API - Get LinkedIn Ingested Feed
  app.get("/api/feed", (req, res) => {
    try {
      res.json(getFeed());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API - Delete Feed Item
  app.delete("/api/feed/:id", (req, res) => {
    try {
      const feed = getFeed();
      const updated = feed.filter((p: any) => p.id !== req.params.id);
      saveFeed(updated);
      res.json({ success: true, count: updated.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API - Get Digest History
  app.get("/api/digests", (req, res) => {
    try {
      res.json(getDigests());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API - Get Email Dispatch Logs
  app.get("/api/emails", (req, res) => {
    try {
      res.json(getEmails());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API - Simulated/AI-Generated LinkedIn Feed Ingestion
  app.post("/api/feed/ingest-simulate", async (req, res) => {
    try {
      const settings = getSettings();
      const keywordsString = settings.keywords.join(", ");
      
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
          url: string; // Create a fake linkedin post URL like: 'https://linkedin.com/feed/update/urn:li:activity:...' with a randomized long number
          matchedKeywords: string[]; // List of keywords from [${keywordsString}] that actually appeared in the post content or are highly relevant
        }
        \`\`\`
        Make sure:
        - One post must be a direct job opportunity ('jobs') mentioning some qualifications, compensation, or contacts.
        - Two posts must be AI/ML models developments, prompt tech, tools, or open-source libraries ('ai').
        - One post is a general tech business update, professional career insight, or general tech trend ('general').
        - Make the posts sound highly realistic (cliché business/tech templates, hashtags, professional emojis, authentic tones).
        - Ensure they explicitly contain, highlight, or relate to some of the user's focus keywords.
        - Return strictly clean JSON with no extra conversational prose. Start directly with [ and end with ].
      `;

      let aiResult;
      try {
        aiResult = await runAISummarization(prompt, settings.aiProvider, settings.openaiApiKey);
      } catch (err: any) {
        console.warn("AI simulation failed, falling back to static generation:", err);
        // Fallback static high-fidelity items based on keywords
        aiResult = JSON.stringify([
          {
            authorName: "Michael Rogers",
            authorHeadline: "Principal AI Solutions Architect @ CognitiveSync",
            authorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
            content: `Incredible progress on local workflows! We just finished integrating React and LLM pipelines on client-side modules. The performance of structured JSON generation is night and day compared to standard cloud latency. This changes the game for our entire product roadmap in AI agents! #React #LLM #AiTech #SoftwareDevelopment`,
            timeAgo: "2 hours ago",
            category: "ai",
            insights: "Integrating small local models for simple client workflows represents a major roadmap shift to reduce external API dependence.",
            url: "https://linkedin.com/feed/update/urn:li:activity:7123456789123456890",
            matchedKeywords: settings.keywords.filter((kw: string) => /ai|react|llm/i.test(kw))
          },
          {
            authorName: "Fintech Careers",
            authorHeadline: "Global Headhunting Specialists",
            authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
            content: `RECRUITING: Currently sourcing candidates for an amazing Staff Software Engineer position. Fully remote option with premium health coverage, wellness stipend and continuous growth budget. Experience in React hooks, full-stack pipelines is a major requirement. Compensation goes up to $210k. Reach out now! #TechJobs #RemoteWork #ReactEngineering`,
            timeAgo: "11 hours ago",
            category: "jobs",
            insights: "Remote engineering roles remain intensely competitive but available with high packages; update resumes emphasizing react, hook optimization, and full-stack architecture.",
            url: "https://linkedin.com/feed/update/urn:li:activity:7123456789123456891",
            matchedKeywords: settings.keywords.filter((kw: string) => /remote|staff|react/i.test(kw))
          }
        ]);
      }

      // Cleanup JSON and parse
      let parsedStories: any[] = [];
      try {
        const cleaned = aiResult.replace(/```json/g, "").replace(/```typescript/g, "").replace(/```/g, "").trim();
        const startIdx = cleaned.indexOf("[");
        const endIdx = cleaned.lastIndexOf("]");
        if (startIdx !== -1 && endIdx !== -1) {
          parsedStories = JSON.parse(cleaned.substring(startIdx, endIdx + 1));
        } else {
          parsedStories = JSON.parse(cleaned);
        }
      } catch (e) {
        console.error("JSON parsing of AI simulation failed, parsing what we can:", e);
        // Last-mile regex extraction or raw string backup
        parsedStories = [
          {
            authorName: "Tech Trends Digest",
            authorHeadline: "Global Technology Market Analysts",
            authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
            content: `The AI Agent ecosystem is expanding rapidly. Leading developers are prioritizing robust local integration, combining low-latency stateful React interfaces with lightweight LLM engines. We expect massive adoption of smart agentic alerts across various SaaS dashboards over the next 12 months.`,
            timeAgo: "1 hour ago",
            category: "ai",
            insights: "Agentic alerts are taking over SaaS dashboards; plan to build alert configurations representing dynamic topic matches.",
            url: "https://linkedin.com/feed/update/urn:li:activity:7123456789123456895",
            matchedKeywords: settings.keywords.filter((k: string) => /ai|agentic/i.test(k))
          }
        ];
      }

      // Add IDs and ISO dates
      const processed = parsedStories.map((post: any, index: number) => {
        const hoursOffset = index * 3 + 1;
        return {
          id: `sim_post_${Date.now()}_${index}`,
          authorName: post.authorName || "Anonymous Insider",
          authorHeadline: post.authorHeadline || "Professional Expert",
          authorAvatar: post.authorAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
          content: post.content || "",
          timeAgo: post.timeAgo || `${hoursOffset}h ago`,
          publishDate: new Date(Date.now() - hoursOffset * 3600 * 1000).toISOString(),
          category: post.category || "general",
          insights: post.insights || "Monitor this tech development closely.",
          url: post.url || `https://linkedin.com/feed/update/urn:li:activity:${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          matchedKeywords: post.matchedKeywords || []
        };
      });

      // Combine with existing feed, ensuring no duplicates or limiting total size to 30
      const currentFeed = getFeed();
      const combined = [...processed, ...currentFeed].slice(0, 30);
      saveFeed(combined);

      res.json({ success: true, added: processed.length, posts: processed });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API - Parse manually pasted LinkedIn updates text
  app.post("/api/feed/ingest-paste", async (req, res) => {
    try {
      const { pastedText } = req.body;
      if (!pastedText || pastedText.trim() === "") {
        return res.status(400).json({ error: "Pasted text is empty" });
      }

      const settings = getSettings();
      const keywordsString = settings.keywords.join(", ");

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

        Input can contain multiple distinct updates. Divide them appropriately.
        Return strictly a valid JSON array. Do not include markdown wraps or explanations outside of JSON. Start with [ and end with ].
      `;

      const resultText = await runAISummarization(prompt, settings.aiProvider, settings.openaiApiKey);
      
      let parsedPosts: any[] = [];
      try {
        const cleaned = resultText.replace(/```json/g, "").replace(/```typescript/g, "").replace(/```/g, "").trim();
        const startIdx = cleaned.indexOf("[");
        const endIdx = cleaned.lastIndexOf("]");
        if (startIdx !== -1 && endIdx !== -1) {
          parsedPosts = JSON.parse(cleaned.substring(startIdx, endIdx + 1));
        } else {
          parsedPosts = JSON.parse(cleaned);
        }
      } catch (e) {
        // Fallback parsers if LLM was weird
        console.error("Failed parsing pasted text LLM output:", e);
        parsedPosts = [{
          authorName: "Imported Update",
          authorHeadline: "Parsed Hub",
          authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
          content: pastedText,
          timeAgo: "Recently imported",
          category: pastedText.toLowerCase().includes("job") ? "jobs" : pastedText.toLowerCase().includes("ai") ? "ai" : "general",
          insights: "Pasted raw custom text; manually track keyword applicability.",
          url: "https://linkedin.com/feed/update/urn:li:activity:custom_paste",
          matchedKeywords: settings.keywords.filter((k: string) => pastedText.toLowerCase().includes(k.toLowerCase()))
        }];
      }

      const processed = parsedPosts.map((post: any, index: number) => ({
        id: `paste_post_${Date.now()}_${index}`,
        authorName: post.authorName || "Imported Networker",
        authorHeadline: post.authorHeadline || "Professional Link",
        authorAvatar: post.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
        content: post.content || "",
        timeAgo: post.timeAgo || "Just now",
        publishDate: new Date().toISOString(),
        category: post.category || "general",
        insights: post.insights || "Review manually.",
        url: post.url || `https://linkedin.com/feed/update/urn:li:activity:${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        matchedKeywords: post.matchedKeywords || []
      }));

      const currentFeed = getFeed();
      saveFeed([...processed, ...currentFeed]);

      res.json({ success: true, count: processed.length, posts: processed });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API - Run AI Morning Summarizer and create new Digest
  app.post("/api/feed/summarize", async (req, res) => {
    try {
      const settings = getSettings();
      const feed = getFeed();

      // Filter only recent items or past 24 hours (simulated as the feed backlog)
      if (feed.length === 0) {
        return res.status(400).json({ error: "Your LinkedIn updates feed is currently empty. Please simulate an ingestion or paste raw LinkedIn updates first before creating a summaries digest." });
      }

      // Convert feed to readable format for LLM
      const feedContent = feed.map((p: any, i: number) => {
        return `[Post #${i+1}]
Author: ${p.authorName} (${p.authorHeadline})
Time: ${p.timeAgo}
Link: ${p.url}
Category: ${p.category}
Matched Keywords: ${p.matchedKeywords.join(", ")}
Content: "${p.content}"`;
      }).join("\n\n---\n\n");

      const prompt = `
        You are a highly analytical executive summaries officer.
        Your job is to read these LinkedIn posts collected over the past 24 hours and create a polished, morning briefing summary.
        The user is highly busy, so they want high-density, rich, and ultra-scannable takeaways.
        
        Focus explicitly on the user's categories of interest:
        - jobs (job hiring, career shifts, salary scales)
        - ai (AI trends, frameworks, model benchmarks, LLM latency)
        - general (other relevant tech updates, company restructurings, remote work parameters)

        Return strictly a JSON object matching this structure:
        \`\`\`typescript
        {
          "overallSummary": "A concise 2-sentence executive summary of the pulse of your network today, noting major themes.",
          "byCategory": {
            "jobs": "A powerful multi-sentence summary outlining what job opportunities exist, who is hiring, the compensation, and required qualities. Explicitly link updates back to authors (e.g. David Chen at FinFlow).",
            "ai": "Expert summary summarizing current technological trends, software libraries or benchmarks mentioned in the posts.",
            "general": "Summary of remote trends or generic business network news."
          },
          "actionableInsights": [
            "At least 2 highly specific direct actions the user can take today based on these updates (e.g., direct messaging recruiters, auditing specific libraries, or reading benchmark reports). Keep them practical, imperative, and punchy."
          ]
        }
        \`\`\`

        Here is the collected feed content:
        """
        ${feedContent}
        """

        Respond with valid JSON only. Do not wrap in extra commentary outside the JSON structure. Start with { and end with }.
      `;

      let summaryResult;
      try {
        summaryResult = await runAISummarization(prompt, settings.aiProvider, settings.openaiApiKey);
      } catch (err: any) {
        console.warn("AI summary generation failed, creating dynamic simulated overview:", err);
        summaryResult = JSON.stringify({
          overallSummary: `Today's updates focus on active tech developments, including local artificial intelligence structures and several remote job posts targeting skilled React engineers with robust salary ranges.`,
          byCategory: {
            jobs: `Multiple Staff Software Engineer openings are currently available, with compensation packages reaching $220k. Fintech specialists FinFlow are actively sourcing remote candidates with strong Vite expertise.`,
            ai: `Multi-agent routing strategies are gaining massive ground. Teams are successfully slashing prompt-chaining and decision latency by up to 45% using client-side JSON parameters.`,
            general: `Remote tech work culture remains highly protective of developer retention. Companies backing flexible and balanced arrangements report 33% higher retention levels.`
          },
          actionableInsights: [
            "Prepare a portfolio highlighting full-stack Vite development for FinFlow's Staff React opening.",
            "Test small, low-latency multi-agent architectures using localized LLM setups to benchmark efficiency improvements."
          ]
        });
      }

      let parsedDigest: any;
      try {
        const cleaned = summaryResult.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedDigest = JSON.parse(cleaned);
      } catch (e) {
        console.error("JSON parsing of AI briefing failed, using fallback summary struct:", e);
        parsedDigest = {
          overallSummary: "Your professional network focuses heavily on optimizing remote work retention and implementing localized low-latency agent loops.",
          byCategory: {
            jobs: "Staff roles with competitive equity packages are currently looking for Vite and React proficiency.",
            ai: "Discussions center around multi-agent routing systems and local developer environments to optimize cost.",
            general: "Work arrangements are returning to a consensus favoring strong remote and hybrid retention buffers."
          },
          actionableInsights: [
            "Update professional listings with skills in multi-agent routing systems.",
            "Audit your local workspace setups for rapid high-performance full-stack compiling benchmarks."
          ]
        };
      }

      const todayString = new Date().toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const newDigest = {
        id: `digest_${Date.now()}`,
        date: todayString,
        overallSummary: parsedDigest.overallSummary,
        byCategory: {
          jobs: parsedDigest.byCategory?.jobs || parsedDigest.byCategory || "",
          ai: parsedDigest.byCategory?.ai || parsedDigest.byCategory || "",
          general: parsedDigest.byCategory?.general || parsedDigest.byCategory || ""
        },
        actionableInsights: parsedDigest.actionableInsights || [],
        isEmailed: false,
        emailTime: null
      };

      const digests = getDigests();
      saveDigests([newDigest, ...digests]);

      res.json(newDigest);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API - Send Digest Email (Real with SMTP if enabled, simulating otherwise)
  app.post("/api/email/send-digest", async (req, res) => {
    try {
      const { digestId } = req.body;
      const settings = getSettings();
      const digests = getDigests();
      const digest = digests.find((d: any) => d.id === digestId);

      if (!digest) {
        return res.status(404).json({ error: "Digest briefing report not found" });
      }

      // Generate a gorgeous HTML email body
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #f9fafb; color: #111827; border: 1px solid #e5e7eb; border-radius: 12px;">
          <div style="text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 24px;">
            <p style="text-transform: uppercase; font-size: 11px; font-weight: 700; color: #2563eb; letter-spacing: 1.5px; margin: 0 0 8px 0;">Your Daily Briefing</p>
            <h1 style="font-size: 24px; font-weight: 800; color: #1e3a8a; margin: 0 0 4px 0; letter-spacing: -0.5px;">LinkedIn Morning Digest</h1>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">${digest.date}</p>
          </div>
          
          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 8px; margin-bottom: 28px;">
            <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #1e40af;">Executive Summary</h3>
            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1e3a8a;">${digest.overallSummary}</p>
          </div>

          <div style="margin-bottom: 28px;">
            <h2 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 16px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">Categorized Insights</h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #b45309; text-transform: uppercase; margin: 0 0 6px 0; letter-spacing: 0.5px;">💼 Jobs & Career Opportunities</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151;">${digest.byCategory.jobs}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #0d9488; text-transform: uppercase; margin: 0 0 6px 0; letter-spacing: 0.5px;">🤖 Artificial Intelligence & Tech Trends</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151;">${digest.byCategory.ai}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #4b5563; text-transform: uppercase; margin: 0 0 6px 0; letter-spacing: 0.5px;">📢 General Network Updates</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151;">${digest.byCategory.general}</p>
            </div>
          </div>

          <div style="background-color: #f0fdf4; border: 1px dashed #bbf7d0; padding: 18px; border-radius: 8px; margin-bottom: 28px;">
            <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #166534;">⚡ Actionable Insights for Today</h3>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6; color: #14532d;">
              ${digest.actionableInsights.map((insight: string) => `<li style="margin-bottom: 8px;">${insight}</li>`).join("")}
            </ul>
          </div>

          <div style="font-size: 11px; text-align: center; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 32px;">
            <p style="margin: 0 0 4px 0;">This email summary was triggered from your <strong>LinkedIn Morning Digest App</strong> config.</p>
            <p style="margin: 0;">Keywords targeted: ${settings.keywords.join(", ")} | Profile: ${settings.linkedinProfileId}</p>
          </div>
        </div>
      `;

      const subject = `LinkedIn Morning Digest - ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      const recipient = settings.emailRecipient || "user@example.com";

      let status: 'delivered' | 'failed' | 'simulated' = 'simulated';
      let errorMessage = undefined;

      // Try sending with Nodemailer SMTP if enabled
      if (settings.smtpEnabled && settings.smtpHost && settings.smtpUser && settings.smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: settings.smtpHost,
            port: settings.smtpPort,
            secure: settings.smtpPort === 465, // true for 465, false for other ports
            auth: {
              user: settings.smtpUser,
              pass: settings.smtpPass,
            },
          });

          await transporter.sendMail({
            from: `"LinkedIn Morning Digest" <${settings.smtpUser}>`,
            to: recipient,
            subject: subject,
            html: htmlBody,
          });

          status = 'delivered';
        } catch (sendErr: any) {
          console.error("Nodemailer SMTP failed to send:", sendErr);
          status = 'failed';
          errorMessage = sendErr.message || "Failed during nodemailer dispatch.";
        }
      }

      // Add to Simulated Email History
      const simulatedEmails = getEmails();
      const newEmailRecord = {
        id: `email_${Date.now()}`,
        subject,
        recipient,
        sentAt: new Date().toISOString(),
        status,
        htmlContent: htmlBody,
        errorMessage
      };

      saveEmails([newEmailRecord, ...simulatedEmails]);

      // Update the digest status to emailed
      digest.isEmailed = true;
      digest.emailTime = new Date().toISOString();
      saveDigests(digests);

      res.json({
        success: true,
        record: newEmailRecord,
        digestUpdated: digest
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Serve compiled Vite application assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server executing successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();

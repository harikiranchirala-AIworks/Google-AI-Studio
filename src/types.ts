export interface LinkedInPost {
  id: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  content: string;
  timeAgo: string;
  publishDate: string;
  category: 'jobs' | 'ai' | 'general';
  insights: string;
  url: string;
  matchedKeywords: string[];
}

export interface DigestSummary {
  id: string;
  date: string;
  overallSummary: string;
  byCategory: {
    jobs: string;
    ai: string;
    general: string;
  };
  actionableInsights: string[];
  isEmailed: boolean;
  emailTime: string | null;
}

export interface AppSettings {
  linkedinProfileId: string;
  keywords: string[];
  emailRecipient: string;
  openaiApiKey: string;
  geminiApiKey?: string; // Client-side direct key for Standalone Browser Mode
  aiProvider: 'gemini' | 'openai';
  smtpEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  digestFrequency: string; // e.g. "Every Morning"
}

export interface SimulatedEmail {
  id: string;
  subject: string;
  recipient: string;
  sentAt: string;
  htmlContent: string;
  status: 'delivered' | 'failed' | 'simulated';
  errorMessage?: string;
}

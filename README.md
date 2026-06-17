# LinkedIn Morning Intel Digest Hub 📬

An automated full-stack Node & React workspace designed to ingest active LinkedIn timeline feeds, filter targeted keywords, categorize major breakouts using server-side Gemini AI models, and compile clean Morning Digest briefs delivered right using SMTP host mailers.

---

## 🚀 Key Features

* **AI-Powered Categorization**: Automatically groups ingested feeds into **Active Job Openings**, **AI Core Breakthroughs**, or **General Workspace Trends**.
* **Live Clipboard Importer & Simulator**: Easily paste raw timeline updates copied directly from the LinkedIn website, or trigger active 1-click scavenge simulations.
* **SMTP Delivery Relay**: Integrates securely with SMTP relays (e.g. Gmail App Passwords) for physical mail delivery.
* **Clean Inbox Simulator**: Includes a beautifully integrated visual mock client to inspect compiled mail templates, preview raw HTML tables, and debug dispatches in real-time.
* **Focus Keyword Density Analytics**: Live calculations of keyword match share distributions, visualized via interactive progress meters.

---

## 🛠️ Local Quick Start

Follow these simple steps to run this application on your local machine:

### 1. Pre-requisites
Ensure you have [Node.js](https://nodejs.org/) (Version 18 or above) installed.

### 2. Install Dependencies
Clone or download the project archive, enter the root directory, and run:
```bash
npm install
```

### 3. Add Environment Configurations
Create a file named `.env` in the root folder to house your workspace key parameters:
```env
# Google Gemini Workspace Core Key (Server-side exclusive)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```
*(If no `.env` credentials are saved, you can easily input the API keys inside the web panel's Alert & AI Settings menu instead.)*

### 4. Boot Dev Server
Start the development Vite and Node proxy server on local port `3000`:
```bash
npm run dev
```

### 5. Production Compiles
To bundle compiled assets for custom web hosting:
```bash
npm run build
npm start
```

---

## 📬 SMTP Email Setup Guide

To forward morning summaries to your cellular devices:
1. Open the **Alert & AI Settings** page.
2. Toggle the **SMTP Email Delivery** switch to on.
3. If using Gmail:
   * Go to Google Account Settings → Security → 2-Step Verification → **App Passwords**.
   * Generate a unique 16-character string.
   * Input `smtp.gmail.com` as the Host, `465` as Port, and use your newly generated password.
4. Click **Test SMTP Connection** to confirm configuration.

---

## 📁 Repository Structure

```text
├── data/                  # Embedded Local DB (settings.json, feed.json, emails.json)
├── src/
│   ├── components/        # Extracted view elements (Digest, Feed, Insights, Settings, Inbox, Readme)
│   ├── App.tsx            # Main parent layout manager
│   ├── main.tsx           # Entry point
│   └── index.css          # Tailwind CSS global styles
├── server.ts              # Node Express API & Gemini Orchestration endpoint proxy
├── package.json           # Scripts and dependency managers
└── README.md              # Project documentation
```

---

## 📝 License
MIT License. Created to help developers automate and digest their morning feeds efficiently.

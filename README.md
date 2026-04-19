<div align="center">
  <h1>📄 PaperShredder AI</h1>
  <p>An AI-powered academic research assistant that ruthlessly fact-checks, cross-references, and critiques academic papers.</p>
</div>

---

## 🚀 Overview

**PaperShredder AI** is a full-stack web application built for the **AI Hackfest**. It revolutionizes the academic peer-review process by ingesting research papers (PDFs), extracting their core claims, and evaluating their methodology using advanced multimodal AI.

Instead of just summarizing papers, PaperShredder acts as a deeply skeptical peer reviewer. It cross-references claims against known data and delivers a highly critical, narrated "Savage Peer Review" to expose potential methodological flaws or logical fallacies.

## ✨ Key Features

- **Gemini-Powered Deconstruction:** Uses Google's Gemini Multimodal Vision API to parse PDFs, extract the boldest claims, and assign an overall Credibility Score.
- **Contradiction Matrix:** Automatically cross-references extracted claims against established datasets to find scientific contradictions.
- **Savage Peer Review:** Generates a highly critical, hyper-analytical roast of the paper's methodology.
- **Interactive Voice Agent:** Integrates ElevenLabs text-to-speech to narrate the "Savage Peer Review" in a realistic, podcast-style format.
- **Snowflake Data Persistence:** Securely stores user profiles, authentication states, and historical paper analyses using Snowflake REST APIs.
- **Token Economy / Wallet:** Integrates a Solana-inspired token economy where users spend "SHRED" tokens to perform analyses, complete with a rate-limiting system.

## 🛠 Tech Stack

**Frontend:**
- React 19
- React Router v7 (SSR)
- Vite
- TypeScript
- Vanilla CSS Modules (Tailwind-free, highly customized UI)
- Lucide React (Icons)

**Backend / APIs:**
- **Google Gemini API** (`gemini-1.5-flash`) for LLM reasoning and multimodal extraction.
- **ElevenLabs API** for text-to-speech generation.
- **Snowflake SQL API** for robust data persistence and user authentication.
- Node.js (via React Router Server output)

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Accounts for Gemini, ElevenLabs, and Snowflake (for API keys)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/PaperShredder-AI.git
   cd PaperShredder-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   # Snowflake Connection
   SNOWFLAKE_ACCOUNT="your_account_id"
   SNOWFLAKE_USER="your_user"
   SNOWFLAKE_PASSWORD="your_password"
   SNOWFLAKE_DATABASE="RADIO_STATION_DB"
   SNOWFLAKE_SCHEMA="PUBLIC"
   SNOWFLAKE_WAREHOUSE="PAPER_WH"

   # ElevenLabs Integration
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID="your_agent_id"
   VITE_ELEVENLABS_AGENT_ID="your_client_agent_id"
   ELEVENLABS_API_KEY="sk_your_key"

   # Gemini Multimodal
   GEMINI_API_KEY="your_gemini_key"
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🏗 Project Architecture

- `/app/routes/` - Page-level components defining the application's URL structure.
- `/app/blocks/` - Reusable, domain-specific UI components (e.g., `analysis-results`, `home`, `settings`).
- `/app/services/` - Server-side only modules for interacting with external APIs (`gemini.server.ts`, `snowflake.server.ts`, `elevenlabs.server.ts`).
- `/app/hooks/` - Client-side state management and Context providers (`use-auth`, `use-analysis-store`).

## 🤝 Contributing

We follow a strict branch-based development workflow:
1. Create a new branch for your feature (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -m 'feat: add amazing feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request

## 📜 License
This project was created for the AI Hackfest 2026. All rights reserved.

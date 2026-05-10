# OpsIQ

<!-- 
  README WRITING GUIDE — read this before editing:
  A good README answers 4 questions in order:
  1. What is this? (Overview)
  2. How does it work? (Architecture / Tech Stack)
  3. How do I run it? (Setup)
  4. Who made it? (Author)
  Keep it honest. Don't claim features that don't exist.
  Don't hide limitations — mention them briefly and move on.
-->

A bilingual AI chat assistant for oil and gas operations.
Employees can ask questions about internal policies and procedures in Arabic or English and get answers grounded in real documentation.

**Live demo:** [mango-dune-01aeb3c0f.azurestaticapps.net](https://mango-dune-01aeb3c0f.azurestaticapps.net)

---

## What It Does

<!-- 
  This section answers "why does this exist?"
  One short paragraph. No hype. Just the problem and the solution.
-->

Operations teams in industrial environments deal with large volumes of policies, safety procedures, and compliance documents. Finding answers quickly — especially in Arabic — is a real challenge. OpsIQ lets employees ask questions in natural language (Arabic or English) and retrieves answers directly from indexed documentation using the RAG (Retrieval-Augmented Generation) pattern.

---

## Features

<!--
  List what actually works in the current build.
  If something is planned but not built, don't list it here.
  You can add a "Planned" section at the bottom if you want.
-->

- Bilingual interface — full Arabic (RTL) and English (LTR) with animated language toggle
- Auto-detects query language (Arabic, English, or mixed)
- Gulf Arabic dialect normalization before search — improves retrieval accuracy for Arabic speakers
- RAG pipeline — answers are grounded in uploaded documents, not generated from thin air
- PDF upload and indexing — drop a document in, it becomes queryable immediately
- Fallback to mock response if the backend is unreachable — UI never breaks
- Deployed end-to-end on Azure (frontend + backend + search + storage)

---

## Architecture

<!--
  This is the most important section for technical readers (recruiters, engineers).
  Show that you understand how the pieces connect, not just that you used the tools.
  The diagram below uses plain ASCII — no special tools needed to read it.
-->

```
User (browser)
      │
      ▼
React SPA — Azure Static Web Apps
  - LanguageContext manages lang state ("en" | "ar")
  - Detects language, sends POST /api/chat { message, language }
      │
      ▼
FastAPI Backend — Azure App Service
  - language_processor.py  → detects language
  - dialect_mapper.py      → normalizes Gulf Arabic dialect terms
  - diacritic_remover.py   → strips Arabic diacritics
      │
      ├──► Azure AI Search  → retrieves top 3 relevant document chunks
      │
      └──► Azure OpenAI (GPT-4o)
             - chunks injected as context into system prompt
             - returns { answer, language, sources, query_processing }

PDF Upload flow:
  POST /api/upload → PyPDF2 extracts text → chunked (1000 chars, 100 overlap)
                   → Azure AI Search index + raw file → Azure Blob Storage
```

---

## Tech Stack

<!--
  A table is clean and scannable. Include the "why" only when it's genuinely interesting.
  Don't pad this with obvious things.
-->

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Framer Motion, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| LLM | Azure OpenAI (GPT-4o) |
| Search | Azure AI Search |
| Storage | Azure Blob Storage |
| Arabic NLP | pyarabic, langdetect, custom dialect glossary |
| Document processing | PyPDF2 |
| Deployment | Azure Static Web Apps (frontend), Azure App Service (backend) |
| CI/CD | GitHub Actions (two pipelines — one per service) |

---

## Project Structure

<!--
  Show the folder layout and explain what each part does.
  A reader should be able to find any file without searching.
-->

```
opsiq/
├── .github/workflows/
│   ├── azure-static-web-apps-*.yml   # Frontend deploy pipeline
│   └── main_opsiq.yml                # Backend deploy pipeline
├── backend/
│   ├── main.py                       # FastAPI app, route definitions
│   ├── language_processor.py         # Language detection
│   ├── dialect_mapper.py             # Gulf Arabic → MSA normalization
│   ├── diacritic_remover.py          # Arabic text normalization
│   ├── dialect_glossary.json         # Gulf dialect term mappings
│   └── .env                          # Local environment variables (not committed)
├── src/
│   ├── components/                   # React UI components
│   ├── context/
│   │   └── LanguageContext.jsx       # Single source of truth for lang state
│   └── data/
│       ├── translations.js           # All UI strings in English and Arabic
│       └── mockConversation.js       # Preloaded bilingual chat history
├── public/                           # Static assets
├── requirements.txt                  # Python dependencies
└── package.json                      # Node dependencies
```

---

## Running Locally

<!--
  Every README needs this. Write it so someone with no context can follow it.
  List prerequisites first, then steps in order.
-->

### Prerequisites

- Node.js ≥ 20.19
- Python 3.10+
- An Azure subscription with these services provisioned:
  - Azure OpenAI (GPT-4o deployment)
  - Azure AI Search
  - Azure Blob Storage

### Backend

```bash
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file (see Environment Variables section below)
# then fill in your values

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
# From the project root
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Environment Variables

<!--
  Never commit real keys. Always document what's needed so others can set it up.
  An .env.example file in the repo is even better — consider adding one.
-->

Create `backend/.env` with the following:

```env
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com/
AZURE_OPENAI_KEY=<your-key>
AZURE_OPENAI_DEPLOYMENT=gpt-4o

AZURE_SEARCH_ENDPOINT=https://<your-resource>.search.windows.net
AZURE_SEARCH_KEY=<your-key>
AZURE_SEARCH_INDEX=<your-index-name>

AZURE_STORAGE_CONNECTION_STRING=<your-connection-string>
AZURE_STORAGE_CONTAINER=<your-container-name>
```

These same variables must be set in Azure App Service → Configuration → Application settings for the deployed backend.

---

## Deployment

<!--
  This section shows you understand CI/CD, not just local development.
  Keep it short — just enough to explain what triggers what.
-->

Two GitHub Actions pipelines run automatically on push to `main`:

- **Frontend** → builds with Vite and deploys to Azure Static Web Apps
- **Backend** → deploys to Azure App Service, starts with `uvicorn main:app --host 0.0.0.0 --port 8000`

No manual steps needed after merging to `main`.

---

## Known Limitations

<!--
  This section builds trust. Engineers respect honesty.
  Don't bury problems — name them and move on.
-->

- No authentication — the app is currently open to anyone with the URL
- The search index is created at backend startup; if Azure AI Search is unreachable, it logs a warning and continues (answers may degrade)
- Arabic dialect normalization covers Gulf dialect terms defined in `dialect_glossary.json` — other Arabic dialects are not covered

---

## Author

<!--
  Keep this short. Link to where you want people to go next.
-->

**Faisal Al-Khoulany**
Certified Azure AI Engineer Associate (AI-102) .  Azure AI Fundamentals (AI-900) 

[GitHub](https://github.com/xfaisalx) · [LinkedIn](https://linkedin.com/in/YOUR-HANDLE-HERE)

---

<!--
  WHAT MAKES A README GOOD (keep this as a reference for future projects):

  ✓ Honest about what's built vs. what's planned
  ✓ Architecture section shows system thinking, not just a tools list
  ✓ Setup instructions someone else can actually follow
  ✓ Documents env variables without exposing real keys
  ✓ Mentions known limitations — this builds credibility, not doubt

  WHAT MAKES A README BAD:
  ✗ Default boilerplate left in (like the Vite template you had before)
  ✗ Claims features that don't exist or aren't wired up
  ✗ No setup instructions
  ✗ Overly corporate language that doesn't match the actual scope
-->
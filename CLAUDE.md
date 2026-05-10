# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run lint      # ESLint check
npm run preview   # Preview production build locally

# Backend
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000  # Start FastAPI server on port 8000
```

No test suite is configured. Vite requires **Node.js ≥ 20.19**.

## Architecture

**OpsIQ** is a bilingual (English/Arabic) AI chat assistant for oil and gas operations. The frontend is a React SPA; the backend is a FastAPI service that connects to Azure OpenAI, Azure AI Search, and Azure Blob Storage.

### Deployment

Two independent GitHub Actions pipelines on push to `main`:
- **Frontend** → Azure Static Web Apps (`mango-dune-01aeb3c0f.azurestaticapps.net`) via `azure-static-web-apps-mango-dune-01aeb3c0f.yml`
- **Backend** → Azure App Service `OpsIQ` (`opsiq-fsa2esg4ftdfagh5.centralus-01.azurewebsites.net`) via `main_opsiq.yml`, startup command: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Language system — the central invariant

`LanguageContext.jsx` is the single source of truth for language state (`"en"` | `"ar"`). It exposes:
- `lang` — current language code
- `t` — the active translation object (flat key→string map)
- `isRTL` — boolean, true when `lang === "ar"`
- `toggleLang()` — flip between languages

`App.jsx` syncs `document.body.dir` (`"ltr"` / `"rtl"`) on every `isRTL` change, which triggers the global font switch in `index.css` (`body[dir='rtl'] *` → `Noto Naskh Arabic`). The entire page re-mounts via `AnimatePresence` with `key={lang}` on the root motion div, producing the fade transition.

**Rule:** every visible string must come from `t.<key>`. Never hardcode UI text in a component.

### Translation and mock data

`src/data/translations.js` — flat object with `en` and `ar` keys, each containing every string used in the UI. Both locales must stay in sync — adding a key to one requires adding it to the other.

`src/data/mockConversation.js` — bilingual preloaded chat history keyed by `"en"` / `"ar"`. `ChatArea` resets its message list to `mockConversation[lang]` whenever the language changes (tracked via a `prevLang` ref to avoid resetting on initial render).

### Query flow

1. User types in `Hero`'s search bar or clicks a `QueryChip` → `inputValue` state (lifted to `App`) is populated
2. On submit, `App` sets `pendingQuery` and passes it to `ChatArea`
3. `ChatArea` appends the user bubble, sets `isTyping`, clears `pendingQuery`, then POSTs to `/api/chat` with `{ message, language }`
4. On success, the assistant's `data.answer` is appended; on failure, `t.mockResponse` is used as fallback
5. Message IDs for user-submitted messages start at 100 to avoid colliding with mock conversation IDs 1 and 2

### Backend pipeline

`POST /api/chat` flow:
1. `language_processor.py` detects language (Arabic/English/mixed via `langdetect` + regex)
2. If Arabic/mixed: `dialect_mapper.py` normalizes Gulf dialect terms using `dialect_glossary.json`, then `diacritic_remover.py` strips diacritics and normalizes characters
3. Processed query hits Azure AI Search (top 3 chunks)
4. Retrieved chunks are injected as context into the Azure OpenAI system prompt
5. Response includes `{ answer, language, sources, query_processing }`

`POST /api/upload`: PDF → PyPDF2 text extraction → 1000-char chunks (100 overlap) → Azure AI Search index + raw file to Azure Blob Storage.

`ensure_search_index()` runs at startup (wrapped in try/except — failure logs a warning instead of crashing the app).

### Styling conventions

- **CSS custom properties** in `index.css` are the color palette — never use raw hex values in components, always reference `var(--token-name)`
- **Inline styles** are the primary styling mechanism. Tailwind is present but used minimally (e.g. `hidden md:flex` for responsive hiding)
- **RTL layout**: achieved by passing `isRTL` as a prop and switching `borderRadius`, `flexDirection`, `justifyContent`, and `textAlign` values inline
- **Animations**: Framer Motion `motion.*` wrappers with `initial`/`animate`/`exit`

### CORS

Backend allows: `http://localhost:5173`, `https://mango-dune-01aeb3c0f.azurestaticapps.net`, `https://mango-dune-01aeb3c0f.7.azurestaticapps.net`.

### Environment variables (backend)

All read from `backend/.env` (and must be set in Azure App Service → Configuration):
`AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_KEY`, `AZURE_OPENAI_DEPLOYMENT`, `AZURE_SEARCH_ENDPOINT`, `AZURE_SEARCH_KEY`, `AZURE_SEARCH_INDEX`, `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_CONTAINER`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

No test suite or linter is configured. Vite requires **Node.js ≥ 20.19** — the project pins `vite@5` to work around a Node 20.15 constraint on this machine.

## Architecture

This is a **frontend-only prototype** (no backend, no API calls). All data is mock/static.

### Language system — the central invariant

`LanguageContext.jsx` is the single source of truth for language state (`"en"` | `"ar"`). It exposes:
- `lang` — current language code
- `t` — the active translation object (flat key→string map)
- `isRTL` — boolean, true when `lang === "ar"`
- `toggleLang()` — flip between languages

`App.jsx` syncs `document.body.dir` (`"ltr"` / `"rtl"`) on every `isRTL` change, which triggers the global font switch in `index.css` (`body[dir='rtl'] *` → `Noto Naskh Arabic`). The entire page re-mounts via `AnimatePresence` with `key={lang}` on the root motion div, producing the fade transition.

**Rule:** every visible string must come from `t.<key>`. Never hardcode UI text in a component.

### Translation and mock data

`src/data/translations.js` — flat object with `en` and `ar` keys, each containing every string used in the UI (navbar, hero, chips, features, chat, footer, aria labels). Both locales must stay in sync — adding a key to one requires adding it to the other.

`src/data/mockConversation.js` — bilingual preloaded chat history keyed by `"en"` / `"ar"`. `ChatArea` resets its message list to `mockConversation[lang]` whenever the language changes (tracked via a `prevLang` ref to avoid resetting on initial render).

### Query flow

1. User types in `Hero`'s search bar or clicks a `QueryChip` → `inputValue` state (lifted to `App`) is populated
2. On submit, `App` sets `pendingQuery` (a string) and passes it down to `ChatArea`
3. `ChatArea` watches `pendingQuery` via `useEffect`: appends the user bubble immediately, sets `isTyping`, calls `onQueryHandled()` to clear `pendingQuery`, then after 1500ms appends the mock assistant response
4. Message IDs for user-submitted messages start at 100 (module-level `nextId` counter) to avoid colliding with mock conversation IDs 1 and 2

### Styling conventions

- **CSS custom properties** in `index.css` are the color palette — never use raw hex values in components, always reference `var(--token-name)`
- **Inline styles** are the primary styling mechanism (no Tailwind component classes in JSX). Tailwind is present but used minimally (e.g. `hidden md:flex` for responsive hiding)
- **RTL layout**: achieved by passing `isRTL` as a prop and switching `borderRadius`, `flexDirection`, `justifyContent`, and `textAlign` values inline. Logical CSS properties (`ms-auto`) are used in Tailwind classes where needed
- **Animations**: Framer Motion `motion.*` wrappers with `initial`/`animate`/`exit`. CSS `@keyframes` (`pulse-dot`, `typing-bounce`) in `index.css` for the KB status dot and typing indicator dots

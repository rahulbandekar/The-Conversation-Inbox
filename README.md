# Conversation Inbox — Yellow.ai Frontend Engineer Intern Assignment

A triage tool for escalated customer conversations. Built so a CX agent can look at a full queue and know, within seconds, what needs them first.

**Live demo:** https://the-conversation-inbox.vercel.app

**Repo:** https://github.com/rahulbandekar/The-Conversation-Inbox

---

## Overview

Yellow.ai's AI agents resolve most conversations on their own. The ones that escalate to a human — an angry customer, a low CSAT score, a bot stuck looping — land in a generic, noisy queue today. Agents waste time hunting for the conversation that actually needs them, and often find out too late.

This tool answers one question, fast: **"What needs me right now?"** Every decision below — what got built, what got cut — serves that question.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173` (or whatever port Vite reports). The app mocks its entire backend in the browser via MSW — no server, database, or env vars required.

Other scripts:

```bash
npm run build      # type-check + production build
npm run lint        # eslint
npm run preview    # preview the production build locally
```

To verify a clean install works end-to-end: `npm run build` should complete with zero TypeScript errors.

## Product Decisions

The brief is deliberately open — no screens or features specified. Here's the reasoning behind what I built:

**Priority signals over a generic list.** Each conversation row surfaces urgency (priority badge), sentiment (colored dot), and wait time — the three things an agent actually scans for when deciding what to open next. This replaces the need to read every row's full text just to triage.

**Sort by urgency, then wait time, by default.** Critical-priority conversations surface first; within the same priority, longer-waiting customers come first. An agent landing on a busy morning should see the fire before the smoke.

**A persistent detail panel, not a modal or a new page.** Selecting a conversation shouldn't break the agent's flow. The list stays visible on the left while context loads on the right — they can keep scanning while deciding.

**Assign and Resolve as the only two actions.** Triage means _claiming_ and _closing_, not _resolving in place_. Once assigned, an agent is expected to go deal with the conversation elsewhere — this tool's job ends at hand-off.

**Keyboard-first navigation.** The brief calls out "ideally, without their hands leaving the keyboard." Arrow keys move through the list, Enter opens, A assigns, R resolves, Escape deselects — an agent who knows the shortcuts never needs the mouse.

**A write path that can fail, with visible recovery.** Assign/Resolve actions have a simulated 20% failure rate. Each shows a loading spinner, then either a success confirmation or a specific, actionable error message — never a silent failure or a frozen button.

## What I Cut and Why

Cutting features sharply mattered as much as building the right ones.

| Cut                                | Why                                                                                                                                                                                                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Search bar**                     | Agents triaging a queue scan and prioritize — they don't search. Priority signals (badge, sentiment, wait time) do the job a search bar would, without adding a second mental mode ("am I scanning or searching right now?").                                                     |
| **Bulk actions**                   | One conversation handled well beats ten bulk-resolved without being read. Triage is inherently sequential — the brief's own success criteria ("nothing important slipped through") argues against batch operations that make it easy to wave through something that shouldn't be. |
| **Reply / chat input**             | Triage ≠ resolution. This tool's job is to help an agent decide _what_ to act on and _claim_ it — not to be the place they have the actual conversation. Building a chat UI here would dilute the one job this screen does well.                                                  |
| **Real-time sockets**              | Explicitly out of scope per the brief. A manual refetch after each action is sufficient for a triage tool where the agent is the one driving state changes.                                                                                                                       |
| **Auth / backend / multi-tenancy** | Explicitly out of scope per the brief. Fully mocked via MSW.                                                                                                                                                                                                                      |

## Architecture

```
src/
├── components/
│   ├── ConversationList/    # Left panel — scrollable list, one row per conversation
│   ├── ConversationDetail/  # Right panel — selected conversation + actions
│   ├── FilterBar/            # Status filter + sort control
│   └── ui/                   # Badge, SentimentDot, Skeleton, EmptyState, Spinner, AppHeader
├── hooks/
│   ├── useConversations.ts          # Fetches list, derives filtered/sorted view, exposes refetch
│   ├── useConversationActions.ts    # Assign/Resolve with per-action loading/success/error state
│   └── useKeyboardNav.ts            # Global keydown listener → list navigation + action shortcuts
├── mocks/
│   ├── data.ts        # 15 realistic seeded conversations
│   ├── handlers.ts    # MSW: GET list, POST assign, POST resolve (20% random failure, 200–500ms delay)
│   └── browser.ts     # MSW worker setup, started only in dev
└── types/index.ts     # Conversation, Priority, Status, Sentiment, FilterState, ActionState
```

**Data flow:** `App.tsx` owns `filter` and `selectedId` as the only two pieces of cross-cutting state. `useConversations` fetches the full list once and re-derives the filtered/sorted view in a `useMemo` whenever `filter` or the underlying data changes — filtering and sorting never trigger a refetch. Actions (`assign`/`resolve`) call `useConversationActions`, which on success calls back up to `App` to trigger `refetch()`, keeping the list and detail panel in sync without any shared global store.

**Why MSW over a hand-rolled fetch mock:** it intercepts at the network layer, so components call real `fetch()` calls exactly as they would against a real API — no mock-aware branching in app code, and the failure/delay behavior lives in one place (`handlers.ts`).

**State is local, not global.** With one list, one filter, and one selection, there's no case here where Redux/Context would pay for itself — prop-drilling two levels (`App` → `FilterBar`/`ConversationList`/`ConversationDetail`) is simpler to read and trace.

## Keyboard Shortcuts

| Key       | Action                               |
| --------- | ------------------------------------ |
| `↑` / `↓` | Move selection through the list      |
| `Enter`   | Open the selected conversation       |
| `A`       | Assign selected conversation to self |
| `R`       | Resolve selected conversation        |
| `Esc`     | Deselect / clear the detail panel    |

Shortcuts are disabled while focus is inside an `<input>`, `<textarea>`, or `<select>` (e.g. the sort dropdown) so they don't hijack normal typing.

## Known Limitations

- **No search.** Deliberate cut (see above) — but it means there's no fallback if an agent needs to find one specific customer by name or email rather than triage the whole queue.
- **No persisted state.** Filter selection and scroll position reset on page reload; there's no URL/localStorage sync.
- **No pagination or virtualization.** Fine at 15 mock conversations; a queue of hundreds would need a virtualized list.
- **Mock data is in-memory only.** Assign/Resolve actions mutate an in-memory array in the MSW handler — a full page reload resets all conversations to their seeded state.
- **No automated tests.** Given the time budget, manual QA covered loading/empty/error/action states instead of a test suite.
- **No optimistic UI on actions.** Assign/Resolve wait for the (simulated) network round-trip before updating state, rather than updating immediately and rolling back on failure. Chosen for simplicity given the explicit 20%-failure requirement — an optimistic-then-rollback pattern would add complexity without a clear UX win at this scale.
- **MSW runs in development only.** In production, the app falls back to
  importing mock data directly — fetch calls return 404 from Vercel,
  which the catch block handles gracefully. All functionality works
  identically in both environments.

## Time Spent

| Phase                                     | Time                       |
| ----------------------------------------- | -------------------------- |
| Setup (Vite, TS, Tailwind, MSW)           | ~1 hr                      |
| Types, mock data, MSW handlers            | ~1 hr                      |
| Layout, FilterBar, ConversationList       | ~1.5 hrs                   |
| ConversationDetail, actions, error states | ~2 hrs                     |
| Keyboard navigation                       | ~1 hr                      |
| Polish, accessibility, motion             | ~1 hr                      |
| README + deploy + bug fix                 | ~20min - 1 hr              |
| **Total**                                 | **~8.5 hrs (~2 evenings)** |

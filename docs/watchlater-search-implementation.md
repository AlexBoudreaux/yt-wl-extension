# Watch Later Search – Implementation Plan

This plan adds fast, native-feeling search and filters to YouTube Watch Later, integrating with the existing transcript selection/extraction features.

Links:
- PRD: `docs/youtube-search-enhancement-prd.md`
- Current content script: `src/app/content/index.tsx`
- Selection + DOM video parsing: `src/lib/video-selection.ts`, `src/lib/youtube-transcript.ts`

## 0) Current State Summary (what we have)
- Content script already targets `*://www.youtube.com/playlist?list=WL*` and mounts a React UI via `createShadowRootUi`.
- Video discovery: `extractVideoElementsFromDOM()` collects `VideoElement` items (id, title, channel, duration, url, element, index).
- DOM change tracking: `MutationObserver` rescans on playlist content changes.
- Selection system: `VideoSelectionManager` with Cmd/Ctrl+Click toggle, Cmd/Ctrl+A select-all, Escape clear, and visual highlight.
- Transcript flow: bulk extraction with progress/toasts; header pill in the YouTube masthead for actions/status.

Implication: We can layer search/filter UI and logic on top of the existing discovery/observer pipeline without changing transcript features.

## 1) Scope & Non-Goals
- In scope: text search, duration/date/channel filters, auto-loader, fuzzy search option, keyboard shortcuts, progress indicators.
- Out of scope for Phase 1: description scraping, transcript search, multi-select channels, custom duration ranges, virtualization (we will scaffold for later).

## 2) Architecture Additions
- SearchEnhancer (content script module inside `src/app/content/index.tsx`):
  - AutoLoader: sequential scroll and progress reporting.
  - SearchIndex: in-memory Map keyed by `videoId` with searchable fields and computed properties.
  - SearchUI: search input + status row (result count, loading state).
  - FilterUI: duration pills, date dropdown, channel selector, clear buttons.
  - FilterEngine: applies text query + filters to toggle `display: none` on `ytd-playlist-video-renderer` elements.
  - FuzzyMatcher: optionally Fuse.js; fall back to substring search.

Data model (augment `VideoElement` at runtime, no type change required initially):
- searchableText: lowercased `title + " " + channel`.
- durationCategory: `short|medium|long` computed from `duration`.
- uploadAgeText: relative text if available in DOM (e.g., "2 days ago").
- channel (already present); views (optional best-effort).

## 3) UI Placement & UX
- Container: Insert a sticky search+filter bar below the playlist header and above the video list (confirmed). Use YouTube CSS vars (`var(--yt-...)`).
- Status: “Showing X of Y” and a subtle progress while auto-loading.
- Keyboard: `/` focuses search, `Escape` clears.
- Accessibility: proper roles/labels; preserve existing selection shortcuts.

## 4) Phased Delivery

### Phase 1: Foundation (Exact Search + Keyboard)
- Add SearchUI container to the page (sticky; YouTube look-and-feel).
- Build SearchIndex from current `videoElements` and recompute on MutationObserver rescan.
- Implement 150ms debounced substring search against `searchableText`.
- Apply results by toggling `element.style.display` to avoid reflow-heavy changes.
- Show “Showing {visible} of {total} videos”.
- Keyboard: `/` focus, `Escape` clear (integrate with existing global handler).
- Persist query to storage (optional, nice-to-have in P1).

Deliverables:
- Search bar works instantly on initially visible videos.
- No regressions to selection/extraction shortcuts.

### Phase 2: Auto-Loader (Sequential Scroll)
- Implement `autoLoad()` loop: scroll to bottom, wait ~100ms, detect new items, stop when none added.
- Hook into existing MutationObserver; the loader only scrolls, the observer + `scanForVideos()` continues to collect.
- Progress indicator (e.g., “Loading 450 of ~1500…”) and completion message.
- Progressive search: the current query re-applies as new videos appear.
- Abort conditions: user scrolls up for a while, or explicit cancel.

Deliverables:
- Auto-load completes for large playlists without tripping anti-bot heuristics in testing.
- Search remains responsive during loading.

### Phase 3: Visual Filters (Duration/Date/Channel)
- Duration pills: Short (<3m) | Medium (3–12m) | Long (12m+).
- Date dropdown: Any | Today | This Week | This Month | This Year | Older (best-effort from visible relative text).
- Channel selector: top N channels from current index.
- FilterEngine AND-combines: query + duration + date + channel.
- Badges for active filters and “Clear” actions.

Deliverables:
- Filters combine predictably; counts update accurately; no visual jank.

### Phase 4: Fuzzy Search (Chosen: Fuse.js)
- Use Fuse.js with keys ["title", "channel"], threshold ~0.3 (approved).
- Dual-mode: exact substring first for speed; if <5 results, augment/swap with fuzzy results.
- UI indicates fuzzy matches subtly (optional).

Deliverables:
- Typo-tolerant search with bounded latency for ~1.5k videos.

### Phase 5: Polish & Persistence
- Persist query/filter state to extension storage (WL playlist only, across refreshes).
- Nicer “No results” state and error messaging.
- Minor perf tuning: batch style writes via `requestAnimationFrame`, micro-task yielding on large sets.
- QA with different YouTube layouts/selectors and dark/light themes.

## 5) Integration Points (concrete in code)
- `src/app/content/index.tsx`
  - Mount SearchUI and FilterUI alongside the existing toast/provider structure.
  - Extend global keydown handler with `/` and `Escape` behaviors that do not clash with selection keys.
  - Add AutoLoader function and lifecycle (start on Watch Later detection; allow manual start/stop if needed).
  - Reuse `scanForVideos()` + MutationObserver; call `rebuildSearchIndex()` and `applyFilters()` on changes.
- `src/lib/youtube-transcript.ts`
  - Already provides `extractVideoMetadata()`. Optionally add helpers to fetch relative date/views if easily available via selectors in `ytd-video-renderer`.
- `src/lib/storage.ts`
  - Add storage keys for last query and filters if we persist state in Phase 5.

## 6) Matching the PRD
- Auto-load: fast sequential scroll with progress.
- Instant filter: DOM-based display toggling; progressive updates.
- Fuzzy matching: via Fuse.js (pending approval) with dual-mode fallback.
- Visual filters: duration/date/channel; AND logic; clearable UI.
- Keyboard: `/`, `Escape`, `Cmd/Ctrl+K` optional alias.

## 7) Risks & Mitigations
- YouTube DOM changes: use multiple selectors; degrade gracefully to text-only search.
- Anti-bot throttling: conservative scroll cadence; stop if no new items for several cycles.
- Large lists (>2k): plan virtualization later; for now, batch style updates and yield to the main thread.

## 8) Milestones & Acceptance Criteria
- M1 (P1): Exact search UI working on first 100 videos; shortcuts `/`, `Escape`.
- M2 (P2): Auto-load reaches end on a ~1.5k video playlist; search responsive during load.
- M3 (P3): Duration/date/channel filters; accurate counts; AND-combining works.
- M4 (P4): Fuzzy search enabled behind a flag (requires dependency approval).
- M5 (P5): Persisted state; polished UX; cross-layout resilience.

## 9) Open Questions (need decision)
- Approve adding Fuse.js for fuzzy search?
- Exact placement: under playlist header vs. above first video list item. Default: under playlist header.
- Persist filter state between sessions by default?

## 10) Work Breakdown (first passes)
- P1
  - Add SearchUI container + styles, hook into content script mount.
  - Build index from `videoElements`, implement debounced substring filtering.
  - Add `/` focus and `Escape` clear in global keydown without breaking current shortcuts.
- P2
  - Implement `autoLoad()` and progress display; wire to MutationObserver and index rebuilds.
  - Progressive re-apply of active query.
- P3
  - Duration/date/channel UI + filter engine; live counts and clear actions.
- P4 (pending approval)
  - Fuse.js integration and dual-mode search.
- P5
  - Persistence, no-results/edge cases, micro-perf tweaks, QA. 
# Watch Later Search – TODO Checklist

Decisions:
- Fuzzy engine: Fuse.js (approved)
- Placement: below playlist header (confirmed)
- Persistence: Yes, WL-only across refreshes (confirmed)

## Phase 1 – Foundation (Exact Search + Keyboard)
- [ ] Insert SearchUI container under the playlist header (sticky, YouTube CSS vars)
- [ ] Add state: `query`, `visibleCount`, `totalCount`, `isAutoLoading`, `isSearching`
- [ ] Build in-memory index from `videoElements` on `scanForVideos()` (lowercased `searchableText`)
- [ ] Implement 150ms debounced substring search over `title + channel`
- [ ] Apply filter by toggling `element.style.display` for each `VideoElement`
- [ ] Show “Showing {visible} of {total} videos” status
- [ ] Keyboard: `/` focuses search input (without clobbering existing shortcuts)
- [ ] Keyboard: `Escape` clears search and blurs input
- [ ] Accessibility: add labels/aria for input and status
- [ ] Manual test on WL with ~100–200 items

## Phase 2 – Auto-Loader (Sequential Scroll)
- [ ] Implement `autoLoad()` scroll loop (scroll to bottom → wait ~100ms → detect growth → stop on no growth)
- [ ] Hook into existing MutationObserver; reuse `scanForVideos()` to collect new items
- [ ] Progressive search: re-apply active query after rescans
- [ ] Progress UI: “Loading {current} of ~{estimated}…” + completion message
- [ ] Cancel conditions: user scrolls up or presses a stop button (optional for P2)
- [ ] Manual test on large WL (1k–2k videos) for stability and UX

## Phase 3 – Visual Filters (Duration/Date/Channel)
- [ ] Duration pills: Short (<3m), Medium (3–12m), Long (12m+); single-select toggle
- [ ] Compute `durationCategory` from DOM `duration` field for each video
- [ ] Date dropdown: Any, Today, This Week, This Month, This Year, Older (heuristic from relative text if available)
- [ ] Channel selector: top-N channels from current index; single-select
- [ ] Filter engine: AND-combine `query + duration + date + channel`
- [ ] UI: active filter badges, clear per-filter and clear-all
- [ ] Status: live counts after filters applied
- [ ] Manual test combinations for correctness and performance

## Phase 4 – Fuzzy Search (Fuse.js)
- [ ] Add Fuse.js to dependencies
- [ ] Implement `FuzzyMatcher` adapter with keys ["title", "channel"], threshold ~0.3
- [ ] Dual-mode: exact first; if <5 results, augment/swap with Fuse results
- [ ] Optional: subtle UI indicator when fuzzy is active
- [ ] Validate perf on 1–2k videos, ensure <10ms typical query time

## Phase 5 – Polish & Persistence
- [ ] Storage: add keys for last `query`, `duration`, `dateRange`, `channel`
- [ ] Persist WL-only state via extension storage; restore on WL mount
- [ ] “No results” empty state and clear suggestions
- [ ] Batch DOM updates via `requestAnimationFrame` for large sets
- [ ] Light/dark theme QA; multiple layout selectors fallback
- [ ] Final pass: code style, types, and lint/typecheck

## Acceptance Checks
- [ ] P1: Search input filters visible items instantly; `/` and `Escape` work
- [ ] P2: Auto-load completes on a large WL without tripping anti-bot; search stays responsive
- [ ] P3: Filters combine correctly; counts accurate; easy clear controls
- [ ] P4: Typos surface expected results; latency acceptable
- [ ] P5: State persists across refresh; UI polished; no regressions to transcript features 
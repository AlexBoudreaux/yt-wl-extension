# YouTube Watch Later Enhanced - Product Requirements Document v2

## Executive Summary

A Chrome extension that transforms YouTube's Watch Later playlist into an intelligent research tool. Users can bulk-extract transcripts for AI analysis and search their saved videos using smart filtering and semantic search (future phase). Built on a modern extension starter kit for rapid development and future scalability.

## Problem Statement

### Current Pain Points
1. **Transcript Extraction**: Getting video transcripts into AI tools requires multiple manual steps per video
2. **Discovery Friction**: YouTube's Watch Later list only shows 50 videos at a time with basic title-only search
3. **Lost Knowledge**: Saved videos become a black hole - users forget what they've saved and can't find relevant content
4. **Context Switching**: Constantly jumping between YouTube, transcript sites, and AI chat interfaces

### User Impact
- **Time Loss**: 5+ minutes per video to extract transcripts
- **Missed Insights**: Can't find relevant saved videos on topics
- **Cognitive Load**: Managing research across multiple tools and tabs

## Solution Overview

### Phase 1: Transcript Extraction (Week 1)
One-click bulk transcript extraction with smart selection patterns. Users select multiple videos using familiar keyboard shortcuts and copy formatted transcripts directly to clipboard.

### Phase 2: Smart Search (Week 2)
Load all videos at once with instant keyword and fuzzy search across titles, channels, and descriptions.

### Phase 3: Intelligent Tagging (Week 3-4)
AI-assisted tagging system that learns user's mental model and enables semantic search without external dependencies.

## Success Metrics

### Quantitative
- **Efficiency**: <10 seconds to extract transcripts from 5+ videos
- **Performance**: Search returns results in <100ms for 1000+ videos
- **Reliability**: 95%+ transcript fetch success rate
- **Resource Usage**: <50MB memory footprint

### Qualitative
- **User Delight**: Features feel native to YouTube
- **Zero Learning Curve**: Works like existing web patterns
- **Trust**: All data stays local, no external servers

## Technical Architecture

### Foundation: Extension Starter Kit
Using the Extro starter kit with WXT framework for:
- **Hot reloading** during development
- **TypeScript** safety and IntelliSense
- **Chrome Storage API** abstractions
- **Content script** injection system
- **Build pipeline** for production deployment

### Core Technologies
- **Language**: TypeScript with strict mode
- **Framework**: React 19 for UI components
- **Build Tool**: WXT (Web Extension Tools)
- **Storage**: Chrome Storage API + IndexedDB
- **Search**: Fuse.js for fuzzy matching
- **Future**: Local AI embeddings via WebGPU

### Key Principles
- **No Backend**: Everything runs client-side
- **Privacy First**: User data never leaves the browser
- **Progressive Enhancement**: Each feature works independently
- **Native Feel**: Enhance, don't replace YouTube's UI

## User Experience

### Interaction Flow
1. User navigates to YouTube Watch Later playlist
2. Extension automatically enhances the page
3. User selects videos using:
   - **Shift+Click**: Range selection
   - **Cmd/Ctrl+Click**: Individual toggle
   - **Cmd/Ctrl+A**: Select all visible
4. Floating button shows selection count
5. One click to copy transcripts or download as markdown

### Visual Design
- **Subtle Borders**: Selected videos get thin highlight
- **Floating Action Button**: Appears only when videos selected
- **Native Search Bar**: Matches YouTube's design language
- **No Checkboxes**: Clean, distraction-free interface

## Implementation Plan

### Setup Phase (Day 1 Morning)

#### Step 1: Fork and Configure Starter
- Clone Extro starter kit
- Update manifest.json with project details
- Configure WXT for YouTube-specific permissions
- Set up development environment with hot reload

#### Step 2: Strip Unnecessary Components
- Remove authentication system (Supabase)
- Delete unused pages (newtab, devtools, sidepanel)
- Remove analytics (OpenPanel)
- Keep only essential UI components
- Maintain storage utilities for future use

#### Step 3: Configure for YouTube
- Set content script to inject only on youtube.com/playlist?list=WL
- Add clipboard write permissions
- Configure host permissions for YouTube domains
- Set up TypeScript types for YouTube DOM structures

### Phase 1: Transcript Extraction (Day 1-2)

#### Step 4: Content Script Foundation
- Create YouTube-specific content script
- Detect Watch Later page load
- Wait for video list to render
- Set up MutationObserver for dynamic content

#### Step 5: Selection System
- Implement click event handlers on video rows
- Add Shift+Click range selection logic
- Add Cmd/Ctrl+Click toggle selection
- Maintain selection state in React component

#### Step 6: Visual Feedback
- Add selection highlighting via CSS classes
- Ensure compatibility with YouTube's dark/light themes
- Create smooth transitions for selection states
- Test with different viewport sizes

#### Step 7: Transcript Fetching Service
- Reverse-engineer YouTube's internal transcript API
- Create TypeScript interfaces for transcript data
- Implement fetch with proper error handling
- Handle videos without transcripts gracefully

#### Step 8: Data Processing
- Parse YouTube's transcript format
- Merge timestamped segments into clean text
- Format metadata (title, channel, date, description)
- Implement 20k character truncation with notice

#### Step 9: Floating UI Component
- Create React component for action button
- Show selection count
- Position using fixed positioning
- Add "Copy Transcripts" and "Download MD" options

#### Step 10: Output Operations
- Implement clipboard API integration
- Create markdown formatter
- Add success/error toast notifications
- Handle browser clipboard permissions

### Phase 2: Enhanced Search (Day 3-4)

#### Step 11: Pagination Override
- Find and automatically click "Show more" button
- Implement progressive loading with status indicator
- Handle rate limiting and errors
- Cache loaded video metadata

#### Step 12: Search UI Integration
- Create search bar component matching YouTube's style
- Position above video list
- Add clear button and result counter
- Implement debounced input handling

#### Step 13: Search Index
- Extract metadata from video elements
- Build in-memory search index
- Include titles, channels, descriptions
- Add transcript content when cached

#### Step 14: Fuzzy Search
- Integrate Fuse.js library
- Configure similarity thresholds
- Set up weighted field searching
- Handle typos and partial matches

#### Step 15: Results Display
- Filter video list based on search
- Maintain selected videos through searches
- Show "No results" state
- Add "Clear search" option

### Phase 3: Caching & Optimization (Day 5)

#### Step 16: IndexedDB Integration
- Set up database schema for transcripts
- Implement cache invalidation strategy
- Add background sync for updates
- Handle storage quota limits

#### Step 17: Performance Tuning
- Implement virtual scrolling for large lists
- Add request debouncing
- Use Web Workers for heavy processing
- Optimize React re-renders

#### Step 18: Keyboard Shortcuts
- Add global keyboard handlers
- "/" to focus search
- Escape to clear selection/search
- Cmd/Ctrl+C to copy selected transcripts

#### Step 19: Settings & Preferences
- Create popup page for settings
- Add transcript length limit option
- Configure fuzzy search sensitivity
- Save preferences to Chrome storage

#### Step 20: Polish & Testing
- Cross-browser testing (Chrome, Edge, Brave)
- Handle YouTube UI updates gracefully
- Add error recovery mechanisms
- Create user documentation

## Future Roadmap

### Phase 4: Intelligent Tagging (Week 3-4)
- Manual tag creation and management
- AI-powered tag suggestions via Gemini Flash
- Auto-tagging with confidence scores
- Personal taxonomy learning

### Phase 5: Semantic Search (Week 5-6)
- Local embedding generation using WebGPU
- Vector similarity search
- Query expansion and refinement
- Search by example ("Find similar videos")

### Phase 6: Research Sessions (Week 7-8)
- Auto-grouping of related videos
- Batch transcript extraction by topic
- Integration with note-taking apps
- Export to various formats

## Risk Mitigation

### Technical Risks
- **YouTube API Changes**: Use multiple fallback methods for transcript fetching
- **Performance Issues**: Implement progressive loading and virtual scrolling
- **Storage Limits**: Use compression and smart caching strategies

### User Risks
- **Privacy Concerns**: Clearly communicate local-only processing
- **Learning Curve**: Maintain familiar interaction patterns
- **Data Loss**: Implement backup/export functionality

## Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- Component-based architecture
- Comprehensive error handling
- Inline documentation for complex logic

### Testing Strategy
- Unit tests for data processing
- Integration tests for YouTube interaction
- Manual testing on real Watch Later lists
- Performance profiling for large lists

### Deployment
- Automated builds via GitHub Actions
- Version tagging following semver
- Chrome Web Store deployment
- User feedback collection system

## Appendix

### YouTube DOM Structure Reference
```typescript
interface VideoRow {
  element: HTMLElement;
  videoId: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  description?: string;
}
```

### Transcript Format
```typescript
interface TranscriptOutput {
  videoTitle: string;
  channelName: string;
  publishDate: string;
  description: string; // max 1000 chars
  transcript: string; // max 20000 chars
  wasTruncated: boolean;
}
```

### Storage Schema
```typescript
interface StoredVideo {
  id: string;
  metadata: VideoMetadata;
  transcript?: string;
  tags: string[];
  lastUpdated: number;
  embeddings?: Float32Array; // future
}
```
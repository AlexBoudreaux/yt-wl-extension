# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouTube Watch Later Enhanced - A browser extension that transforms YouTube's Watch Later playlist into an intelligent research tool with bulk transcript extraction and smart search capabilities.

## Development Commands

### Essential Commands
```bash
# Development with hot reload
bun dev           # Chrome development server
bun dev:firefox   # Firefox development server

# Type checking (ALWAYS run before commits)
bun typecheck

# Linting and formatting (ALWAYS run before commits)
bun lint         # Check for issues
bun lint:fix     # Fix issues automatically

# Building for production
bun build        # Build for Chrome and Firefox
bun build:chrome # Chrome only
bun build:firefox # Firefox only

# Testing
bun test         # Run all tests using Bun's built-in test runner
```

### Loading the Extension
**Chrome:**
1. Navigate to `chrome://extensions`
2. Enable Developer mode
3. Load unpacked from `build/chrome-mv3`

**Firefox:**
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Load temporary add-on from `build/firefox-mv2/manifest.json`

## Architecture & Key Components

### WXT Extension Structure
The project uses WXT framework with specific entry points:
- `src/app/background/` - Background service worker
- `src/app/content/` - Content scripts injected into YouTube pages
- `src/app/popup/` - Extension popup interface
- `src/app/options/` - Extension settings page
- `src/app/tabs/` - Custom extension pages (ai.tsx, login.tsx, register.tsx)

### Core Implementation Areas
- **Content Script**: Main logic for YouTube Watch Later enhancement (`src/app/content/`)
- **Storage**: Chrome Storage API utilities (`src/lib/storage.ts`)
- **Messaging**: Extension component communication (`src/lib/messaging.ts`)
- **UI Components**: shadcn/ui based components (`src/components/ui/`)

### Key Technologies
- **WXT**: Extension framework with hot reload
- **React 19**: UI components
- **TypeScript**: Full type safety with strict mode
- **Tailwind CSS 4**: Styling with shadcn/ui components
- **Bun**: Package manager and test runner
- **Biome**: Fast linting/formatting (replaces ESLint/Prettier)

## Project Goals & Implementation Status

### Phase 1: Transcript Extraction (Current Focus)
- One-click bulk transcript extraction from YouTube videos
- Selection system with Shift+Click and Ctrl/Cmd+Click
- Copy to clipboard or download as markdown

### Phase 2: Smart Search
- Load all Watch Later videos at once
- Fuzzy search across titles, channels, descriptions
- Cached transcript search

### Phase 3: AI-Assisted Features
- Intelligent tagging system
- Semantic search capabilities
- Local-first approach (no external servers)

## Development Guidelines

### Chrome Extension Best Practices
- **Manifest V3**: Follow strict V3 guidelines, use service workers
- **Permissions**: Request minimal permissions, use `host_permissions` judiciously
- **Message Passing**: Use `@webext-core/messaging` for type-safe communication
- **Storage**: Use `chrome.storage` API via WXT abstractions
- **Security**: Sanitize user inputs, implement CSP compliance

### State Management Pattern
- **Server State**: React Query (@tanstack/react-query) for data fetching
- **UI State**: React Context for global UI state
- **Forms**: React Hook Form with Zod validation
- **Optimistic Updates**: Where appropriate for better UX

### Before Making Changes
1. Check existing patterns in similar components
2. Use WXT's storage/messaging abstractions instead of raw Chrome APIs
3. Follow existing component structure and naming conventions
4. Ensure TypeScript strict mode compliance

### Testing Changes
1. Test in Chrome development mode with hot reload
2. Verify TypeScript types: `bun typecheck`
3. Check linting: `bun lint`
4. Run tests if modifying utility functions: `bun test`

### Key Files to Understand
- `wxt.config.ts` - Extension configuration and permissions
- `src/app/content/main.tsx` - Main content script entry point
- `src/lib/storage.ts` - Storage utilities for extension data
- `src/types/` - TypeScript type definitions

## Code Style & Conventions

### TypeScript Configuration
- **Strict mode** with `noUncheckedIndexedAccess: true`
- **Interfaces** preferred over types for object shapes
- **Chrome types**: Use `@types/chrome` definitions
- **Message passing**: Define strict types between extension components

### Component Structure
```tsx
// src/components/feature/component.tsx
import { memo } from "react";

interface ComponentProps {
  readonly title: string;
}

export const Component = memo<ComponentProps>(({ title }) => {
  return <h1>{title}</h1>;
});

Component.displayName = "Component";
```

### Naming Conventions
- **Directories**: kebab-case (`content-scripts/`, `ui-components/`)
- **Components**: PascalCase for React components and interfaces
- **Functions/Variables**: camelCase
- **Booleans**: Use auxiliary verbs (`isLoading`, `hasPermission`, `canAccess`)
- **Exports**: Named exports preferred over default exports

### Style Guidelines (Enforced by Biome)
- **Formatting**: 2 spaces, 80 char line width, double quotes
- **Semicolons**: Always use semicolons
- **Variables**: Prefer `const` over `let`
- **React**: Functional components with hooks only
- **Imports**: Auto-organized, unused imports removed
- **Commits**: Follow Conventional Commits format

## Important Notes

- **No Backend**: Everything runs client-side for privacy
- **Chrome Storage**: Use the provided storage utilities for persistence
- **YouTube DOM**: Be prepared for YouTube's dynamic DOM updates
- **Permissions**: Already configured for YouTube access, clipboard, and storage
- **Hot Reload**: Works automatically in dev mode - no manual reload needed

## Claude Code Interaction Guidelines

- If you need me to do something out of your range or scope please give me bullet points of what to do at the very end of your last message starting with "YOU NEED TO DO:"
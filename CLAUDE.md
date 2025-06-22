# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (runs on localhost:5173/VIM/)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Linting (ESLint with TypeScript rules)
npm run lint

# Deployment to GitHub Pages  
npm run deploy

# GitLab Pages build (for offline GitLab Pages)
npm run build:gitlab
```

## Architecture Overview

This is a React 19.1 + TypeScript VIM cheatsheet application with **315+ interactive command examples**. The app is built for performance with a **216KB main bundle** and comprehensive offline support for GitLab/GitHub Pages deployment.

### Core Architecture Patterns

**Performance-First Design:**
- **Virtual scrolling** with react-window for large command lists (VirtualCommandList.tsx)
- **Debounced search** (300ms) using lodash.debounce in custom useDebounce hook
- **Advanced code splitting** via Vite manual chunks (react-vendor, lucide-icons, search-utils, virtual-list, vim-data)
- **Data compression** strategy in utils/dataCompression.ts reduces payload size

**Component Structure:**
- `VimCheatsheetEnhanced.tsx` - Main application (800+ lines, replaces original component)
- `VimCommandExampleAnimated.tsx` - Interactive command demonstrations with animated cursor
- `VimHelpViewer.tsx` - Integrated official VIM documentation viewer
- `SearchSuggestions.tsx` - Intelligent fuzzy search with Fuse.js
- Custom hooks: `useDebounce`, `useKeyboardNavigation`, `useSwipeGesture`

**Data Layer:**
- `src/data/vim-commands.ts` - 399 lines of structured command definitions
- `src/data/vim-examples.ts` - 8,583 lines of interactive example states
- `public/vim-help/` - 16 official VIM help files for offline documentation
- `utils/enhancedSearch.ts` - Command synonyms, typo correction, related commands

### Key Features Implementation

**Interactive Examples System:**
Every command has before/after state visualization with animated cursor movement. Examples use `VimCommandExample` interface with `beforeState`/`afterState` properties.

**VIM-Style Navigation:**
- `j/k` for up/down navigation
- `/` to focus search
- `gg` to jump to top, `G` to jump to bottom  
- `?` for keyboard shortcuts help
- `Esc` for modal dismissal

**Favorites System:**
Persistent localStorage-based favorites with category filtering. The favorites filter bug was fixed in VimCheatsheetEnhanced.tsx by ensuring proper state management when switching between "All Categories" and individual categories.

**Fuzzy Search:**
Uses Fuse.js with command synonyms ("delete" finds "cut", "remove") and common mistake detection for improved discoverability.

## Build System

**Vite Configuration:**
- ES2015 target for modern browsers
- Terser minification with console/debugger removal
- Manual code splitting for optimal loading
- Base path support for subpath deployment (`/VIM/`)

**TypeScript:**
- Strict mode enabled with ES2020 target
- No unused locals/parameters enforcement
- Modern module resolution (bundler mode)

## Data Accuracy

All 315 VIM commands have been verified for accuracy. The Y command was specifically corrected from "Copy from cursor to end of line" to "Copy entire line (same as yy)" in both vim-commands.ts and vim-examples.ts.

## Mobile & Accessibility

- Touch-friendly 44px minimum touch targets
- Swipe gestures for mobile navigation  
- Responsive sidebar with MobileSidebar.tsx
- Full keyboard navigation support
- Error boundaries for graceful failure handling

## Deployment Considerations

The application is designed for **offline GitLab Pages** deployment:
- All assets bundled locally (no external CDNs)
- Monaco language workers replaced with offline-compatible blob workers
- VIM help files included in public/ directory
- Service worker ready architecture

## Performance Monitoring

Current performance metrics:
- Main bundle: ~216KB (46% reduction from v2.0)
- Total build: 1.7MB including help files
- Virtual scrolling handles 315+ commands efficiently
- 300ms search debounce for optimal UX
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

# Type checking without emitting files
npx tsc --noEmit

# Deployment to GitHub Pages  
npm run deploy

# GitLab Pages build (for offline GitLab Pages)
npm run build:gitlab
```

## Testing

This project currently has no automated test suite. Interactive testing is done through the development server and manual verification of VIM command accuracy.

## Architecture Overview

This is a React 19.1 + TypeScript VIM cheatsheet application with **315+ interactive command examples** plus **30 comprehensive workflow demos**. The app is built for performance with a **216KB main bundle** and comprehensive offline support for GitLab/GitHub Pages deployment.

### Core Architecture Patterns

**Performance-First Design:**
- **Virtual scrolling** with react-window for large command lists (VirtualCommandList.tsx)
- **Debounced search** (300ms) using lodash.debounce in custom useDebounce hook
- **Advanced code splitting** via Vite manual chunks (react-vendor, lucide-icons, search-utils, virtual-list, vim-data)
- **Data compression** strategy in utils/dataCompression.ts reduces payload size

**Component Structure:**
- `VimCheatsheetEnhanced.tsx` - Main application (800+ lines, replaces original component)
- `VimCommandExampleAnimated.tsx` - Interactive command demonstrations with animated cursor
- `VimDemo.tsx` - Multi-step workflow demo orchestration component
- `VimHelpViewer.tsx` - Integrated official VIM documentation viewer
- `SearchSuggestions.tsx` - Intelligent fuzzy search with Fuse.js
- Custom hooks: `useDebounce`, `useKeyboardNavigation`, `useSwipeGesture`

**Data Layer:**
- `src/data/vim-commands.ts` - 399 lines of structured command definitions
- `src/data/vim-examples.ts` - 8,583 lines of interactive example states
- `src/data/vim-demos.ts` - 30 comprehensive workflow demonstrations (beginner to advanced)
- `public/vim-help/` - 16 official VIM help files for offline documentation
- `utils/enhancedSearch.ts` - Command synonyms, typo correction, related commands

### Key Features Implementation

**Interactive Examples System:**
Every command has before/after state visualization with animated cursor movement. Examples use `VimCommandExample` interface with `beforeState`/`afterState` properties.

**Workflow Demo System:**
Multi-step demonstrations showing real-world VIM usage patterns. `VimDemo` orchestrates sequences of commands with auto-play and manual navigation. Each demo contains metadata (category, difficulty, time-to-master) and step-by-step workflows using the same `VimCommandExampleAnimated` component for consistency.

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

## Demo System Architecture

**Component Relationships:**
- `VimDemo` manages multi-step workflow orchestration with auto-play and manual navigation
- `VimCommandExampleAnimated` renders individual command states with VIM-accurate visualization
- Shared `ExampleState` interface ensures consistency between single commands and demo steps
- Main app (`VimCheatsheetEnhanced`) provides view switching between "Commands" and "Demos"

**Data Structure:**
- Each demo contains metadata (category, difficulty, useCase, timeToMaster) plus array of steps
- Each step has command, description, before/after states, and explanation
- All demo data is declaratively defined in `vim-demos.ts` for easy extension

**Key Implementation Details:**
- Auto-play uses single interval-based state machine with elapsed time tracking
- Three states: 'idle', 'playing', 'completed' - ensures last step remains visible
- Last step displays for full duration, then enters 'completed' state for additional pause
- Reset only happens after `(totalSteps + 1) * stepDuration` total elapsed time
- `VimCommandExampleAnimated` syncs internal state with prop changes for demo progression
- React.memo optimization prevents unnecessary re-renders during step transitions
- Component follows VIM principles with instant state transitions (no animations)

## Development Notes

**Code Quality:**
- Always run `npm run lint` and `npx tsc --noEmit` before committing
- Maintain TypeScript strict mode compliance
- Follow existing component patterns and naming conventions

**Adding New VIM Commands:**
1. Add command definition to `src/data/vim-commands.ts`
2. Add interactive example to `src/data/vim-examples.ts` 
3. Ensure both before/after states are VIM-accurate
4. Test the example renders correctly in the application

**Adding New Workflow Demos:**
1. Define demo structure in `src/data/vim-demos.ts`
2. Create step-by-step `DemoStep` array with realistic scenarios
3. Test auto-play and manual navigation work correctly
4. Verify all steps display for full 3-second duration

## Key Implementation Fixes

**Demo Playback Complete Revamp (v3.6.0):**
- Problem: Last step was being skipped because `setCurrentStep(0)` immediately changed display
- Solution: Complete redesign using interval-based state machine with three states
  - 'playing': Normal step progression based on elapsed time
  - 'completed': Last step remains visible during completion pause
  - 'idle': Demo stopped and reset to beginning
- Implementation: Single interval tracks elapsed time, calculates current step, ensures last step gets full duration plus completion pause before reset
- Result: Every step, especially the last one, displays for complete duration with visual confirmation

**Safe Storage Utilities:**
- `src/utils/safeStorage.ts` provides fallback strategies for restricted environments
- Functions: `safeGetItem`, `safeSetItem`, `safeCopyToClipboard`
- Falls back to in-memory storage when localStorage is blocked
- Critical for enterprise/restricted browser environments

**Dynamic Category Display:**
- Problem: Categories in sidebar stayed fixed when switching between Commands and Demos views
- Solution: Dynamic category switching based on `currentView` state
- Implementation: Categories now show command categories (basicMovement, documentNavigation, etc.) for Commands view and demo categories (developer, writer, general) for Demos view
- Features: Demo filtering by category, context-aware UI elements, proper state reset when switching views
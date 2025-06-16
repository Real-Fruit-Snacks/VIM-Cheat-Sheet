# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm install` - Install dependencies
- `npm run dev` - Start development server at http://localhost:5173/VIM/
- `npm run build` - Build for production (TypeScript compile + Vite build)
- `npm run preview` - Preview production build

### Code Quality
- `npm run lint` - Run ESLint
- `npx tsc --noEmit` - Run TypeScript type checking

### Deployment
- `npm run deploy` - Deploy to GitHub Pages (builds first)
- `npm run build:gitlab` - Build offline GitLab deployment package
- `./create-gitlab-release.sh` - Create complete offline deployment package

## Architecture

### Core Technologies
- **vim.wasm** - Real VIM compiled to WebAssembly, loaded dynamically
- **React 19.1** with TypeScript 5.8
- **Vite** for bundling with cross-origin isolation headers
- **Tailwind CSS** for styling

### Key Components

**VimEditorHybrid** (`src/components/VimEditorHybrid.tsx`)
- Hybrid editor that automatically selects implementation based on browser capabilities
- Uses vim.wasm when SharedArrayBuffer is available
- Falls back to Monaco-vim when SharedArrayBuffer is not available
- Provides consistent API regardless of implementation

**VimEditor** (`src/components/VimEditor.tsx`)
- Full VIM integration component using vim.wasm
- Requires SharedArrayBuffer support
- Manages VIM instance lifecycle and configuration
- Handles focus management and keyboard events
- Exposes imperative API for vimrc application

**MonacoVimEditor** (`src/components/MonacoVimEditor.tsx`)
- Fallback VIM editor using Monaco Editor + monaco-vim
- Works in all browsers without special configuration
- Full Which-Key support with mode detection
- Supports basic vimrc commands (line numbers, word wrap, tab size)
- Mode detection via status bar monitoring
- Slightly reduced VIM feature set compared to vim.wasm

**Which-Key System** (`src/components/WhichKey.tsx`, `src/hooks/useWhichKey.ts`)
- Interactive command hint overlay
- Mode-aware (normal/visual/insert)
- Shows available commands based on key sequences
- Data source: `src/data/key-bindings.ts`

**Keystroke Visualizer** (`src/components/KeystrokeOverlay.tsx`, `src/hooks/useKeystrokeVisualizer.ts`)
- Real-time keystroke display for streaming/teaching
- Configurable position, size, and duration
- Persists settings to localStorage

**Vimrc Editor** (`src/components/VimrcEditorEnhanced.tsx`)
- Live configuration editor with instant preview
- Line-by-line validation and error reporting
- Managed by `src/utils/vimrc-manager.ts`

**Practice Files System** (`src/components/PracticeFilesModal.tsx`, `src/data/practice-files.ts`)
- Pre-loaded code examples for VIM practice
- Multiple file types: JavaScript, Python, prose, config files, CSV, logs
- Each file includes specific editing challenges
- Instant loading into the editor

### State Management
- Local state with React hooks
- Persistence via localStorage for:
  - Vimrc configuration (`vim-vimrc`)
  - Which-Key preference (`vim-which-key-enabled`)
  - Keystroke visualizer settings (`vim-keystroke-config`)

### Build Configuration
- Cross-origin isolation headers configured in `vite.config.ts` and `public/_headers`
- Base path set to `/VIM/` for GitHub Pages
- Service worker (`coi-serviceworker.js`) for SharedArrayBuffer support
- Code splitting configured for vim.wasm, Monaco Editor, and React chunks
- TypeScript strict mode enabled with comprehensive compiler options

### Development Workflow

#### Browser Compatibility Testing
- **Chrome/Edge**: Full vim.wasm support out of the box
- **Firefox**: Enable `dom.postMessage.sharedArrayBuffer.bypassCOOP_COEP.insecure.enabled` in `about:config` for vim.wasm
- **Safari**: Enable "Disable Cross-Origin Restrictions" in Developer menu for vim.wasm
- All browsers automatically fall back to Monaco-vim if SharedArrayBuffer unavailable

#### Key Implementation Details
- **Dynamic Loading**: vim.wasm loaded dynamically via `src/utils/vim-loader.ts`
- **Browser Detection**: Capabilities checked in `src/utils/browser-capabilities.ts`
- **Imperative APIs**: Both editors expose ref-based APIs for programmatic control
- **Mode Detection**: Monaco implementation monitors status bar for VIM mode changes
- **Event Forwarding**: Monaco editor forwards all keyboard events to monaco-vim

#### localStorage Keys
- `vim-vimrc`: User's vimrc configuration
- `vim-which-key-enabled`: Which-Key toggle state
- `vim-keystroke-config`: Keystroke visualizer settings (position, size, duration)

#### Important Files
- `/index.html`: Contains service worker registration and vim-wasm wrapper script
- `/public/coi-serviceworker.js`: Service worker for SharedArrayBuffer support via COOP/COEP headers
- `/public/vim-wasm-wrapper.js`: Conditionally loads vim.wasm based on browser capabilities
- `/public/_headers`: Production COOP/COEP headers for Netlify/GitHub Pages
- `/src/main.tsx`: React app entry point with early browser detection
- `/src/App.tsx`: Main component orchestrating all features

## Critical Architecture Patterns

### Early Browser Detection System
The application implements a sophisticated browser capability detection system that runs **before** React renders:

1. **Detection Phase** (`src/main.tsx`): 
   - `detectBrowserCapabilitiesEarly()` checks WebAssembly, SharedArrayBuffer, and secure context
   - Sets `window.__skipVimWasmLoad` flag to prevent unnecessary loading
   - Creates `BrowserCapabilitiesProvider` context for component access

2. **Loading Coordination** (`public/vim-wasm-wrapper.js`):
   - Exports `window.__vimWasmPromise` for coordinated loading
   - Respects early detection flags to avoid loading 2MB+ vim.wasm unnecessarily
   - Provides proper error handling and timeout management

3. **Component Integration** (`src/components/VimEditorHybrid.tsx`):
   - Uses pre-detected capabilities from context instead of runtime detection
   - Eliminates loading states when using early detection
   - Provides consistent user experience across browser types

### Hybrid Editor Architecture
The application seamlessly switches between two VIM implementations:

**vim.wasm Mode (Full Experience)**:
- Real VIM compiled to WebAssembly 
- Requires SharedArrayBuffer + secure context
- Promise-based loading with 10-second timeout
- Full VIM command compatibility
- Used in Chrome/Edge by default

**Monaco-vim Mode (Universal Fallback)**:
- Monaco Editor with vim-mode extension
- Works in all browsers without special configuration
- Sophisticated key event handling to prevent conflicts
- Mode detection via status bar text parsing
- Operator-pending state tracking for complex VIM operations

### Space Key Handling (Critical Implementation Detail)
The Monaco-vim fallback has sophisticated logic to handle space as both a leader key and regular character:

```typescript
// Only treat space as which-key leader when ALL conditions met:
const shouldHandleAsLeader = 
  mode === 'normal' && 
  currentMode === 'normal' && 
  !recentModeChangeKey && 
  !operatorPendingRef.current &&
  !(lastOperatorRef.current && ['f','F','t','T','r'].includes(lastOperatorRef.current)) &&
  !disableWhichKey;
```

This prevents space from being intercepted in:
- Insert mode (allows typing spaces)
- After motion operators like `f<space>` (find space character)
- During mode transitions (150ms protection window)
- When operators are pending

### Which-Key System Integration
Space serves as the leader key with extensive command mappings:
- ` f` → File operations (find, recent, search)
- ` b` → Buffer operations (list, next, previous, delete)
- ` w` → Window operations (navigation, splits)
- ` g` → Git operations 
- ` t` → Tab operations

The system is mode-aware and automatically resets when leaving normal mode.

### Error Handling & Recovery
Multiple layers ensure graceful degradation:

1. **ErrorBoundary** catches React render errors with user-friendly display
2. **Promise timeouts** prevent infinite loading (vim.wasm, VIM operations)
3. **Automatic fallback** from vim.wasm to Monaco-vim on any failure
4. **Memory cleanup** with proper disposal of observers, intervals, and references
5. **Browser compatibility warnings** with specific instructions for Firefox/Safari

### Performance Optimizations
- **Early detection** prevents loading unnecessary resources (saves 2MB+ for incompatible browsers)
- **Code splitting** separates vim.wasm, Monaco, and React chunks for optimal caching
- **Dynamic imports** ensure vim.wasm only loads when needed
- **localStorage persistence** for user preferences and configuration
- **Service worker** enables SharedArrayBuffer in supported browsers

## Development Notes

### Testing Browser Modes
- Chrome/Edge: Full vim.wasm experience by default
- Firefox: Requires `dom.postMessage.sharedArrayBuffer.bypassCOOP_COEP.insecure.enabled=true` in about:config
- Safari: Requires "Disable Cross-Origin Restrictions" in Developer menu
- All browsers fall back to Monaco-vim gracefully

### Memory Management
Components implement comprehensive cleanup in useEffect return functions:
- Event listeners properly removed with null reference setting
- MutationObserver disposal and disconnect
- Timeout clearing with variable nulling
- VIM instance shutdown with timeout protection

### Common Pitfalls
- **useEffect dependencies**: Many effects intentionally omit dependencies for one-time initialization
- **Mode detection timing**: 150ms buffer prevents race conditions during mode transitions
- **TypeScript any types**: vim.wasm interfaces use `any` due to WebAssembly binding limitations
- **Bundle size warnings**: Monaco editor chunk is necessarily large (~890KB gzipped)

## File Structure Overview

### Core Application Files
- `/src/main.tsx` - Entry point with early browser detection
- `/src/App.tsx` - Main application component
- `/src/components/VimEditorHybrid.tsx` - Smart editor selector
- `/src/components/VimEditor.tsx` - vim.wasm implementation
- `/src/components/MonacoVimEditor.tsx` - Monaco fallback implementation

### Utility Modules
- `/src/utils/early-browser-detection.ts` - Pre-React capability detection
- `/src/utils/browser-capabilities.ts` - Runtime browser checks
- `/src/utils/vim-loader.ts` - Dynamic vim.wasm loading
- `/src/utils/vimrc-manager.ts` - Configuration management

### Feature Components
- `/src/components/WhichKey.tsx` - Command hint system
- `/src/components/KeystrokeOverlay.tsx` - Keystroke visualizer
- `/src/components/VimrcEditorEnhanced.tsx` - Live config editor
- `/src/components/PracticeFilesModal.tsx` - Learning examples

### Data and Configuration
- `/src/data/key-bindings.ts` - Which-key command mappings
- `/src/data/practice-files.ts` - Example files for learning
- `/public/coi-serviceworker.js` - SharedArrayBuffer enabler
- `/public/vim-wasm-wrapper.js` - Conditional vim.wasm loader
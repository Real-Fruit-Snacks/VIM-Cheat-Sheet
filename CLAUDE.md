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
- `/public/sw.js`: Service worker for SharedArrayBuffer support
- `/public/_headers`: Production COOP/COEP headers for Netlify/GitHub Pages
- `/src/main.tsx`: React app entry point
- `/src/App.tsx`: Main component orchestrating all features
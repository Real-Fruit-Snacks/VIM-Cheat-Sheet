# VIM Editor - Architecture & Development Guide

## Project Overview

VIMora is a comprehensive VIM editor that runs in the browser with a sophisticated dual-implementation architecture. The project provides a complete VIM experience using either native vim.wasm or Monaco Editor fallback, with extensive resilience systems, error recovery, and detailed logging.

## Quick Commands

```bash
# Development
npm run dev              # Start development server on localhost:5173/VIM/
npm run build           # Build for production (TypeScript + Vite)
npm run lint            # Run ESLint
npm run preview         # Preview production build

# Deployment
npm run deploy          # Deploy to GitHub Pages
npm run build:gitlab    # Build for GitLab Pages deployment
npm run predeploy       # Alias for build command

# Testing
node test-browser-compatibility.js  # Run comprehensive browser compatibility tests
```

## Architecture Overview

### Core Philosophy: Progressive Enhancement with Resilience

The application follows a "no-fail" philosophy - it must work regardless of browser limitations, network issues, or unexpected errors. This is achieved through:

1. **Dual Editor System**: Native vim.wasm with Monaco fallback
2. **Ultra-Early Browser Detection**: Capabilities detected before any heavy resources load
3. **Comprehensive Error Recovery**: Automated recovery strategies for all failure scenarios
4. **Extensive Logging**: Complete transparency into all operations

### High-Level Architecture

```
VIMora Application
├── Ultra-Early Detection Phase (before React)
│   ├── Browser capability detection
│   ├── Feature flag evaluation
│   └── Implementation selection
├── Editor Loading Phase
│   ├── vim.wasm (preferred) OR Monaco Editor (fallback)
│   ├── Service worker registration
│   └── Resource loading with retries
├── Runtime Phase
│   ├── User interaction tracking
│   ├── Real-time error monitoring
│   ├── Memory/storage management
│   └── Network request interception
└── Recovery Phase (when errors occur)
    ├── Automated recovery strategies
    ├── Fallback implementations
    └── User-facing error handling
```

## Key Components

### 1. Editor System (`src/components/VimEditorHybrid.tsx`)

The core editor component that orchestrates between vim.wasm and Monaco Editor:

- **Primary**: vim.wasm for authentic VIM experience
- **Fallback**: Monaco Editor with monaco-vim for compatibility
- **Decision Point**: Based on SharedArrayBuffer support and other browser capabilities

**Critical Files:**
- `src/utils/vim-loader.ts` - vim.wasm loading logic
- `src/utils/dynamic-editor-loader.ts` - Dynamic editor selection
- `src/utils/monaco-environment-configurator.ts` - Monaco setup

### 2. Browser Compatibility System

**Ultra-Early Detection** (`src/utils/early-browser-detection.ts`):
- Runs before React initialization
- Detects SharedArrayBuffer, COOP/COEP headers, service worker support
- Sets global flags that influence entire application behavior

**Runtime Detection** (`src/utils/browser-capabilities.ts`):
- Continuous monitoring of browser capabilities
- Feature flag evaluation
- Dynamic capability updates

### 3. Resilience & Error Recovery

**Error Recovery System** (`src/utils/errorRecovery.ts`):
- Global error handlers for JavaScript errors, promise rejections
- Memory pressure monitoring
- Network connectivity tracking
- Automated recovery strategies:
  - Network retry with backoff
  - WebAssembly fallback to Monaco
  - Memory cleanup
  - Storage quota management
  - Cache clearing

**Resource Loading** (`src/utils/resourceLoader.ts`):
- Retry logic for script/CSS loading
- CDN fallback support
- Timeout handling
- Progress tracking

### 4. Service Workers

**Offline Support** (`public/offline-service-worker.js`):
- Caching strategies for different resource types
- Network-first for dynamic content
- Cache-first for static assets
- Offline functionality

**CORS Helper** (`public/cors-service-worker.js`):
- Cross-origin request handling
- CORS preflight optimization
- GitLab Pages compatibility

### 5. Comprehensive Logging System

**Unified Logger** (`src/utils/logger.ts`):
- Color-coded console output
- Module-based filtering
- Interactive console commands via `vimLog` global
- Export capabilities for debugging

**Specialized Loggers:**
- `src/utils/networkLogger.ts` - All network requests
- `src/utils/actionTracker.ts` - User interactions
- `src/utils/editorLogger.ts` - Editor-specific operations
- `src/utils/storageLogger.ts` - Storage operations

## Development Patterns

### Error Handling

All async operations should use the error recovery system:

```typescript
import { errorRecovery } from './utils/errorRecovery';

try {
  await riskyOperation();
} catch (error) {
  errorRecovery.reportError(error, {
    component: 'ComponentName',
    action: 'operation-name'
  });
}
```

### Logging

Use the unified logging system:

```typescript
import { log } from './utils/logger';

log.info('ModuleName', 'Operation completed', { data: 'details' });
log.error('ModuleName', 'Operation failed', error, { context: 'additional info' });
```

### Browser Compatibility Checks

Check capabilities before using advanced features:

```typescript
import { useBrowserCapabilities } from './contexts/BrowserCapabilitiesContext';

const capabilities = useBrowserCapabilities();
if (capabilities.supportsSharedArrayBuffer) {
  // Use vim.wasm
} else {
  // Use Monaco fallback
}
```

## Critical Configuration Files

### `public/_headers` - CORS & Security Headers
Critical for GitLab Pages deployment. Sets COOP/COEP headers required for SharedArrayBuffer:

```
/*
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH
```

### `vite.config.ts` - Build & Development Configuration
- Base path: `/VIM/` for GitHub/GitLab Pages
- Proxy configuration for CORS avoidance
- Chunk splitting for optimal loading
- Development server headers

### Service Worker Registration
Service workers are conditionally registered based on:
- Browser compatibility
- Environment (not in development by default)
- User consent/preferences

## Testing & Quality Assurance

### Browser Compatibility Testing
`test-browser-compatibility.js` provides comprehensive testing:
- Normal browser mode
- Private/incognito mode
- Artificially restricted mode (simulates limited browsers)
- Automated screenshots and metrics collection
- Fallback system verification

### Error Scenario Testing
The application includes multiple ways to test error scenarios:
- Memory pressure simulation
- Network failure simulation
- WebAssembly loading failures
- Storage quota exhaustion

## Deployment Considerations

### GitHub Pages
Standard deployment with GitHub Actions via `npm run deploy`.

### GitLab Pages
Requires special handling:
- Use `npm run build:gitlab` 
- Ensure `_headers` file is in the root of the deployed content
- May require pre-built releases for air-gapped environments

### Custom Servers
Ensure server supports:
- Proper MIME types for `.wasm` files
- COOP/COEP headers for SharedArrayBuffer
- Service worker registration

## Debugging & Monitoring

### Console Commands
The application exposes several debugging interfaces:

```javascript
// Logging
vimLog.show()           // View recent logs
vimLog.filter("error")  // Filter logs
vimLog.enableAll()      // Enable all modules

// User Actions
vimDebug.actions()      // Recent user actions
vimDebug.exportActions() // Download action history

// Network
vimNetwork.stats()      // Network statistics
vimNetwork.slow()       // Slow requests

// System Health
resilience.diagnose()   // Full system diagnostic
resilience.health()     // Health check
```

### Performance Monitoring
- Memory usage monitoring with warnings at 70% and errors at 90%
- Network request timing
- Editor render performance
- Resource loading metrics

## Common Issues & Solutions

### CORS Issues
1. Check `_headers` file deployment
2. Verify service worker registration
3. Use proxy configuration in development
4. Check browser console for CORS-specific logs

### vim.wasm Loading Failures
1. Check SharedArrayBuffer availability
2. Verify COOP/COEP headers
3. Monitor error recovery system logs
4. Ensure Monaco fallback activates

### Memory Issues
1. Monitor `resilience.memory()` output
2. Check for memory leaks in user actions
3. Verify garbage collection triggers
4. Review storage usage patterns

## Code Style & Conventions

- TypeScript strict mode enabled
- React 19.1 with hooks
- Tailwind CSS for styling
- ESLint configuration
- Monospace font throughout for editor authenticity
- No comments in code unless explicitly requested
- Prefer editing existing files over creating new ones

## Important Notes

1. **Service Worker Scope**: Service workers are registered at root scope for maximum coverage
2. **Memory Management**: The application actively monitors and manages memory usage
3. **Offline Capability**: Full functionality after initial load, even offline  
4. **Privacy**: All data stays in browser - no external tracking or analytics
5. **Progressive Enhancement**: Works on any modern browser with graceful degradation

This architecture ensures VIMora provides a reliable, authentic VIM experience regardless of environmental constraints while maintaining transparency through comprehensive logging and monitoring systems.
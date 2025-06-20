import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { BrowserCapabilitiesProvider } from './contexts/BrowserCapabilities'
import type { BrowserCapabilities } from './contexts/browser-capabilities-types'
// Resilience system temporarily disabled for build
// import { initializeResilience } from './utils/initializeResilience'
// import { appInfo } from './utils/appInfo'
// import { actionTracker } from './utils/actionTracker'
// import './utils/networkLogger'
// import './utils/storageLogger'

// Define window extension interface
interface WindowWithCapabilities extends Window {
  __browserCapabilities?: BrowserCapabilities;
  __canUseVimWasm?: boolean;
}

// Get capabilities detected in HTML (ultra-early detection)
const browserCapabilities = (window as WindowWithCapabilities).__browserCapabilities as BrowserCapabilities;

// Verify we have capabilities (fallback if somehow missing)
if (!browserCapabilities) {
  console.error('[Main] Browser capabilities not found! This should not happen.');
  // Create minimal fallback
  (window as WindowWithCapabilities).__browserCapabilities = {
    hasWebAssembly: false,
    hasSharedArrayBuffer: false,
    isSecureContext: false,
    hasServiceWorker: false,
    browserName: 'Unknown',
    detectedAt: 'fallback'
  };
}

// Log capabilities usage
console.log('[Main] Using ultra-early detected capabilities:', {
  ...browserCapabilities,
  decision: (window as WindowWithCapabilities).__canUseVimWasm ? 'vim.wasm' : 'monaco'
});

// Debugging tools temporarily disabled for build
// const appInfoData = appInfo.getFullInfo();
// (window as any).vimDebug = {
//   appInfo: appInfoData,
//   actions: () => actionTracker.getRecentActions(),
//   stats: () => actionTracker.getStatistics(),
//   exportActions: () => {
//     const data = actionTracker.exportActions();
//     const blob = new Blob([data], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `vim-actions-${Date.now()}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//     console.log('✅ Actions exported to file');
//   }
// };

// Show logging help message (after app info logs)
// Console help temporarily disabled for build
// setTimeout(() => {
//   console.log('%c📋 VIM Editor v1.5.0 Ready', 'color: #22C55E; font-size: 14px; font-weight: bold');
// }, 100);

// Resilience initialization temporarily disabled for build
// initializeResilience({
//   enableErrorRecovery: true,
//   enableOfflineSupport: true,
//   enableHealthMonitoring: true,
//   enableMemoryManagement: true,
//   enableFeatureFlags: true,
//   gitlabToken: localStorage.getItem('gitlab_token') || undefined,
// }).then(() => {
//   console.log('%c✅ All systems ready!', 'color: #10B981; font-size: 16px; font-weight: bold');
// }).catch(error => {
//   console.error('%c❌ Initialization had issues but app will continue', 'color: #EF4444; font-size: 14px; font-weight: bold');
// });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserCapabilitiesProvider capabilities={browserCapabilities}>
        <App />
      </BrowserCapabilitiesProvider>
    </ErrorBoundary>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { BrowserCapabilitiesProvider } from './contexts/BrowserCapabilities'
import type { BrowserCapabilities } from './contexts/browser-capabilities-types'
import { initializeResilience } from './utils/initializeResilience'
import { appInfo } from './utils/appInfo'
import { actionTracker } from './utils/actionTracker'
import { networkLogger } from './utils/networkLogger'
import { storageLogger } from './utils/storageLogger'

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

// Initialize app info (logs version and environment automatically)
// This happens on import, but we can access it here
const appInfoData = appInfo.getFullInfo();

// Add debugging tools to window
(window as any).vimDebug = {
  appInfo: appInfoData,
  actions: () => actionTracker.getRecentActions(),
  stats: () => actionTracker.getStatistics(),
  exportActions: () => {
    const data = actionTracker.exportActions();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vim-actions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('✅ Actions exported to file');
  }
};

// Show logging help message (after app info logs)
setTimeout(() => {
  console.log(
    '%c📋 VIM Editor Console Commands',
    'color: #22C55E; font-size: 14px; font-weight: bold; padding: 5px',
    '\n\n🔍 Logging (vimLog.):',
    '\n  • show() - View recent logs',
    '\n  • filter("error") - Filter logs', 
    '\n  • modules() - List all modules',
    '\n  • enableAll() / disableAll() - Toggle logging',
    '\n  • setLevel("debug") - Set minimum log level',
    '\n\n🛠️ Debug (vimDebug.):',
    '\n  • appInfo - View app version and environment',
    '\n  • actions() - View recent user actions',
    '\n  • stats() - View action statistics',
    '\n  • exportActions() - Download action history',
    '\n\n🌐 Network (vimNetwork.):',
    '\n  • stats() - Network statistics',
    '\n  • active() - Active requests',
    '\n  • history() - Request history',
    '\n  • slow() - Slow requests (>1s)',
    '\n  • export() - Export network data',
    '\n\n💾 Storage (vimStorage.):',
    '\n  • stats() - Storage statistics',
    '\n  • keys() - List all storage keys',
    '\n  • status() - Check quota usage',
    '\n  • clear() - Clear storage',
    '\n\n🚨 Emergency (resilience.):',
    '\n  • diagnose() - Full diagnostics',
    '\n  • reset() - Emergency reset',
    '\n  • health() - System health',
    '\n  • minimalMode() - Enable minimal mode',
    '\n\n📊 Session Info:',
    `\n  • Session: ${appInfoData.runtime.sessionId}`,
    `\n  • Version: ${appInfoData.app.version}`,
    `\n  • Environment: ${appInfoData.app.environment}`,
    `\n  • Browser: ${appInfoData.runtime.platform}`,
    appInfoData.runtime.previousCrash ? '\n  • ⚠️ Recovered from crash!' : '',
    '\n\n💡 Tip: All commands are available globally in the console'
  );
}, 100);

// Initialize resilience systems before React
initializeResilience({
  enableErrorRecovery: true,
  enableOfflineSupport: true,
  enableHealthMonitoring: true,
  enableMemoryManagement: true,
  enableFeatureFlags: true,
  gitlabToken: localStorage.getItem('gitlab_token') || undefined,
}).then(() => {
  console.log(
    '%c✅ All systems ready!', 
    'color: #10B981; font-size: 16px; font-weight: bold; padding: 10px',
    '\n\nVIM Editor is fully initialized and monitoring for issues.'
  );
}).catch(error => {
  console.error(
    '%c❌ Initialization had issues but app will continue',
    'color: #EF4444; font-size: 14px; font-weight: bold',
    '\n\nError:', error,
    '\n\nThe app will run in degraded mode. Check logs for details.'
  );
  // Continue anyway - app should still work
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserCapabilitiesProvider capabilities={browserCapabilities}>
        <App />
      </BrowserCapabilitiesProvider>
    </ErrorBoundary>
  </StrictMode>,
)

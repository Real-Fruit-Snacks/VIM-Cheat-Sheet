import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { BrowserCapabilitiesProvider } from './contexts/BrowserCapabilities'
import type { BrowserCapabilities } from './contexts/browser-capabilities-types'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserCapabilitiesProvider capabilities={browserCapabilities}>
        <App />
      </BrowserCapabilitiesProvider>
    </ErrorBoundary>
  </StrictMode>,
)

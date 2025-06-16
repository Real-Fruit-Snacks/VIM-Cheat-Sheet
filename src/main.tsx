import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { BrowserCapabilitiesProvider } from './contexts/BrowserCapabilities'
import { detectBrowserCapabilitiesEarly, shouldLoadVimWasm, getBrowserCompatibilityMessage } from './utils/early-browser-detection'

// Perform early browser detection before React renders
const browserCapabilities = detectBrowserCapabilitiesEarly();

// Show console warning if browser has compatibility issues
const compatMessage = getBrowserCompatibilityMessage(browserCapabilities);
if (compatMessage) {
  console.warn(compatMessage);
}

// Conditionally prevent vim.wasm loading by setting a flag
if (!shouldLoadVimWasm(browserCapabilities)) {
  (window as unknown as { __skipVimWasmLoad?: boolean }).__skipVimWasmLoad = true;
  console.log('[Early Detection] Skipping vim.wasm load due to browser incompatibility');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserCapabilitiesProvider capabilities={browserCapabilities}>
        <App />
      </BrowserCapabilitiesProvider>
    </ErrorBoundary>
  </StrictMode>,
)

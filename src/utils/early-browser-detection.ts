import type { BrowserCapabilities } from '../contexts/browser-capabilities-types';

/**
 * Gets browser capabilities that were detected ultra-early in index.html
 * This is now just a helper to access the pre-detected capabilities
 */
export function getBrowserCapabilities(): BrowserCapabilities {
  interface WindowWithCapabilities extends Window {
    __browserCapabilities?: BrowserCapabilities;
  }
  
  const capabilities = (window as WindowWithCapabilities).__browserCapabilities;
  
  if (!capabilities) {
    console.warn('[getBrowserCapabilities] Capabilities not found, using fallback');
    return {
      hasWebAssembly: false,
      hasSharedArrayBuffer: false,
      hasServiceWorker: false,
      isSecureContext: false,
      browserName: 'Unknown',
      detectedAt: 'fallback'
    };
  }
  
  return capabilities;
}

/**
 * Determines if vim.wasm should be loaded based on capabilities
 */
export function shouldLoadVimWasm(capabilities: BrowserCapabilities): boolean {
  return capabilities.hasWebAssembly && 
         capabilities.hasSharedArrayBuffer && 
         capabilities.isSecureContext;
}

/**
 * Gets a user-friendly message about browser compatibility
 */
export function getBrowserCompatibilityMessage(capabilities: BrowserCapabilities): string | null {
  const issues: string[] = [];
  
  if (!capabilities.hasWebAssembly) {
    issues.push('WebAssembly is not supported');
  }
  
  if (!capabilities.hasSharedArrayBuffer) {
    if (capabilities.browserName === 'Firefox') {
      issues.push('SharedArrayBuffer is disabled. Enable it in about:config (dom.postMessage.sharedArrayBuffer.bypassCOOP_COEP.insecure.enabled)');
    } else if (capabilities.browserName === 'Safari') {
      issues.push('SharedArrayBuffer requires "Disable Cross-Origin Restrictions" in Developer menu');
    } else {
      issues.push('SharedArrayBuffer is not available');
    }
  }
  
  if (!capabilities.isSecureContext) {
    issues.push('Page must be served over HTTPS or localhost');
  }
  
  if (issues.length === 0) {
    return null;
  }
  
  return `Browser compatibility issues detected:\n${issues.join('\n')}`;
}
import type { BrowserCapabilities } from '../contexts/browser-capabilities-types';

/**
 * Performs early browser capability detection before React renders
 * This helps prevent loading unnecessary resources and provides better error messages
 */
export function detectBrowserCapabilitiesEarly(): BrowserCapabilities {
  const isSecureContext = window.isSecureContext ?? false;
  
  // Check WebAssembly support
  const hasWebAssembly = typeof WebAssembly !== 'undefined' && 
    typeof WebAssembly.instantiate === 'function';
  
  // Check SharedArrayBuffer support
  const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
  
  // Check Service Worker support
  const hasServiceWorker = 'serviceWorker' in navigator;
  
  // Detect browser name
  const userAgent = navigator.userAgent.toLowerCase();
  let browserName = 'Unknown';
  
  if (userAgent.includes('firefox')) {
    browserName = 'Firefox';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    browserName = 'Safari';
  } else if (userAgent.includes('chrome')) {
    if (userAgent.includes('edg')) {
      browserName = 'Edge';
    } else {
      browserName = 'Chrome';
    }
  }
  
  const capabilities: BrowserCapabilities = {
    hasWebAssembly,
    hasSharedArrayBuffer,
    hasServiceWorker,
    isSecureContext,
    browserName,
    detectedAt: 'early'
  };
  
  // Log capabilities for debugging
  console.log('[Early Detection] Browser capabilities:', capabilities);
  
  // Store in window for emergency access
  (window as unknown as { __browserCapabilities?: BrowserCapabilities }).__browserCapabilities = capabilities;
  
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
/**
 * Detects browser capabilities for VIM editor implementation
 */

export interface BrowserCapabilities {
  hasSharedArrayBuffer: boolean;
  hasWebAssembly: boolean;
  browserName: string;
  requiresWorkaround: boolean;
}

/**
 * Check if SharedArrayBuffer is available and functional
 */
function checkSharedArrayBuffer(): boolean {
  try {
    // Check if SharedArrayBuffer exists
    if (typeof SharedArrayBuffer === 'undefined') {
      return false;
    }
    
    // Try to create a small SharedArrayBuffer to verify it's functional
    const buffer = new SharedArrayBuffer(1);
    return buffer.byteLength === 1;
  } catch {
    return false;
  }
}

/**
 * Detect the browser name for specific workaround instructions
 */
function detectBrowser(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('firefox')) {
    return 'firefox';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari';
  } else if (userAgent.includes('chrome') || userAgent.includes('chromium')) {
    return 'chrome';
  } else if (userAgent.includes('edge')) {
    return 'edge';
  }
  
  return 'unknown';
}

/**
 * Get browser capabilities for VIM editor implementation selection
 */
export function getBrowserCapabilities(): BrowserCapabilities {
  const hasSharedArrayBuffer = checkSharedArrayBuffer();
  const hasWebAssembly = typeof WebAssembly !== 'undefined';
  const browserName = detectBrowser();
  
  // Determine if browser requires workaround based on capabilities
  const requiresWorkaround = hasWebAssembly && !hasSharedArrayBuffer;
  
  return {
    hasSharedArrayBuffer,
    hasWebAssembly,
    browserName,
    requiresWorkaround
  };
}

/**
 * Get browser-specific instructions for enabling SharedArrayBuffer
 */
export function getBrowserInstructions(browserName: string): string {
  switch (browserName) {
    case 'firefox':
      return 'In Firefox, navigate to about:config and set dom.postMessage.sharedArrayBuffer.bypassCOOP_COEP.insecure.enabled to true';
    case 'safari':
      return 'In Safari, enable the Develop menu, then go to Develop > Disable Cross-Origin Restrictions';
    case 'chrome':
    case 'edge':
      return 'Chrome and Edge should support SharedArrayBuffer with proper headers. Try refreshing the page.';
    default:
      return 'Your browser may not support the required features. Please try Chrome, Firefox, or Safari.';
  }
}
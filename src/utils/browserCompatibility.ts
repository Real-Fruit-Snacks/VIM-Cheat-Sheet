// Enhanced browser compatibility detection and fallback system

export interface BrowserCapabilities {
  hasWebAssembly: boolean;
  hasSharedArrayBuffer: boolean;
  isSecureContext: boolean;
  hasServiceWorker: boolean;
  hasWebWorker: boolean;
  hasIndexedDB: boolean;
  hasCrossOriginIsolation: boolean;
  browserName: string;
  browserVersion: string;
  os: string;
  isMobile: boolean;
  supportsModules: boolean;
  supportsCORS: boolean;
  supportsWebGL: boolean;
  maxTouchPoints: number;
}

export interface CompatibilityIssue {
  feature: string;
  required: boolean;
  message: string;
  workaround?: string;
}

export class BrowserCompatibilityChecker {
  private capabilities: BrowserCapabilities;
  private issues: CompatibilityIssue[] = [];

  constructor() {
    this.capabilities = this.detectCapabilities();
    this.checkCompatibilityIssues();
  }

  private detectCapabilities(): BrowserCapabilities {
    const ua = navigator.userAgent;
    const uaLower = ua.toLowerCase();
    
    // Browser detection
    let browserName = 'Unknown';
    let browserVersion = '0';
    
    if (uaLower.includes('firefox')) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || '0';
    } else if (uaLower.includes('safari') && !uaLower.includes('chrome')) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/(\d+)/)?.[1] || '0';
    } else if (uaLower.includes('edg')) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edg\/(\d+)/)?.[1] || '0';
    } else if (uaLower.includes('chrome')) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || '0';
    }
    
    // OS detection
    let os = 'Unknown';
    if (uaLower.includes('win')) os = 'Windows';
    else if (uaLower.includes('mac')) os = 'macOS';
    else if (uaLower.includes('linux')) os = 'Linux';
    else if (uaLower.includes('android')) os = 'Android';
    else if (uaLower.includes('ios') || uaLower.includes('iphone') || uaLower.includes('ipad')) os = 'iOS';
    
    return {
      hasWebAssembly: typeof WebAssembly !== 'undefined' && typeof WebAssembly.instantiate === 'function',
      hasSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
      isSecureContext: window.isSecureContext || false,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasWebWorker: typeof Worker !== 'undefined',
      hasIndexedDB: 'indexedDB' in window,
      hasCrossOriginIsolation: window.crossOriginIsolated || false,
      browserName,
      browserVersion,
      os,
      isMobile: /mobile|tablet|android|ios|iphone|ipad/i.test(uaLower),
      supportsModules: 'noModule' in HTMLScriptElement.prototype,
      supportsCORS: 'XMLHttpRequest' in window && 'withCredentials' in new XMLHttpRequest(),
      supportsWebGL: this.checkWebGLSupport(),
      maxTouchPoints: navigator.maxTouchPoints || 0,
    };
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  private checkCompatibilityIssues() {
    const cap = this.capabilities;
    
    // Critical issues for vim.wasm
    if (!cap.hasWebAssembly) {
      this.issues.push({
        feature: 'WebAssembly',
        required: true,
        message: 'WebAssembly is not supported in your browser',
        workaround: 'VIM will run in emulation mode using Monaco editor'
      });
    }
    
    if (!cap.hasSharedArrayBuffer) {
      this.issues.push({
        feature: 'SharedArrayBuffer',
        required: true,
        message: 'SharedArrayBuffer is not available (required for vim.wasm)',
        workaround: cap.isSecureContext 
          ? 'COOP/COEP headers are being set via service worker'
          : 'Please access the site via HTTPS'
      });
    }
    
    if (!cap.isSecureContext) {
      this.issues.push({
        feature: 'Secure Context',
        required: true,
        message: 'Site must be served over HTTPS or localhost',
        workaround: 'Please use HTTPS URL'
      });
    }
    
    // Non-critical warnings
    if (!cap.hasServiceWorker) {
      this.issues.push({
        feature: 'Service Worker',
        required: false,
        message: 'Service Workers are not supported',
        workaround: 'Some features like offline mode may not work'
      });
    }
    
    if (!cap.supportsCORS) {
      this.issues.push({
        feature: 'CORS',
        required: false,
        message: 'CORS is not fully supported',
        workaround: 'External resource loading may fail'
      });
    }
    
    // Browser-specific issues
    if (cap.browserName === 'Safari' && parseInt(cap.browserVersion) < 15) {
      this.issues.push({
        feature: 'Safari Compatibility',
        required: false,
        message: 'Safari < 15 has limited SharedArrayBuffer support',
        workaround: 'Consider updating Safari or using Chrome/Firefox'
      });
    }
  }

  getCapabilities(): BrowserCapabilities {
    return { ...this.capabilities };
  }

  getIssues(): CompatibilityIssue[] {
    return [...this.issues];
  }

  getCriticalIssues(): CompatibilityIssue[] {
    return this.issues.filter(issue => issue.required);
  }

  canUseVimWasm(): boolean {
    return this.capabilities.hasWebAssembly && 
           this.capabilities.hasSharedArrayBuffer && 
           this.capabilities.isSecureContext;
  }

  needsCOOPCOEP(): boolean {
    return this.capabilities.hasSharedArrayBuffer && 
           !this.capabilities.hasCrossOriginIsolation &&
           this.capabilities.hasServiceWorker;
  }

  // Generate compatibility report
  generateReport(): string {
    const cap = this.capabilities;
    const canUse = this.canUseVimWasm();
    
    return `
Browser Compatibility Report
============================
Browser: ${cap.browserName} ${cap.browserVersion}
OS: ${cap.os}${cap.isMobile ? ' (Mobile)' : ''}
VIM.wasm Support: ${canUse ? 'YES' : 'NO (using fallback)'}

Features:
- WebAssembly: ${cap.hasWebAssembly ? '✓' : '✗'}
- SharedArrayBuffer: ${cap.hasSharedArrayBuffer ? '✓' : '✗'}
- Secure Context: ${cap.isSecureContext ? '✓' : '✗'}
- Cross-Origin Isolation: ${cap.hasCrossOriginIsolation ? '✓' : '✗'}
- Service Worker: ${cap.hasServiceWorker ? '✓' : '✗'}
- Web Worker: ${cap.hasWebWorker ? '✓' : '✗'}
- IndexedDB: ${cap.hasIndexedDB ? '✓' : '✗'}
- CORS Support: ${cap.supportsCORS ? '✓' : '✗'}
- ES Modules: ${cap.supportsModules ? '✓' : '✗'}
- WebGL: ${cap.supportsWebGL ? '✓' : '✗'}

${this.issues.length > 0 ? `
Issues Found:
${this.issues.map(issue => 
  `- ${issue.feature}: ${issue.message}
  ${issue.workaround ? `  Workaround: ${issue.workaround}` : ''}`
).join('\n')}` : 'No compatibility issues detected!'}
    `.trim();
  }
}

// Singleton instance
export const browserCompat = new BrowserCompatibilityChecker();

// Helper functions
export function canUseVimWasm(): boolean {
  return browserCompat.canUseVimWasm();
}

export function getBrowserInfo(): string {
  const cap = browserCompat.getCapabilities();
  return `${cap.browserName} ${cap.browserVersion} on ${cap.os}`;
}

export function hasCompatibilityIssues(): boolean {
  return browserCompat.getCriticalIssues().length > 0;
}

// CORS-safe fetch wrapper
export async function corsFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const corsOptions: RequestInit = {
    ...options,
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      ...options.headers,
    }
  };

  try {
    const response = await fetch(url, corsOptions);
    
    if (!response.ok && response.status === 0) {
      // CORS failure
      throw new Error(`CORS request failed for ${url}`);
    }
    
    return response;
  } catch (error) {
    // Try with no-cors as fallback (limited functionality)
    if (options.mode !== 'no-cors') {
      console.warn(`CORS failed for ${url}, trying no-cors mode`);
      return fetch(url, { ...corsOptions, mode: 'no-cors' });
    }
    throw error;
  }
}

// Preflight check for CORS
export async function checkCORSSupport(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      mode: 'cors',
      headers: {
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
      }
    });
    
    return response.ok || response.status === 204;
  } catch {
    return false;
  }
}
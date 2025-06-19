/**
 * Comprehensive browser compatibility tester
 * Tests browser capabilities for progressive editor degradation
 */

export interface BrowserCompatibilityResult {
  // Overall compatibility scores
  canUseVimWasm: boolean;
  canUseMonaco: boolean;
  canUseBasicEditor: boolean;
  
  // Specific capability tests
  hasWebAssembly: boolean;
  hasSharedArrayBuffer: boolean;
  isSecureContext: boolean;
  hasServiceWorker: boolean;
  canCreateWorkers: boolean;
  canUseDynamicImports: boolean;
  canInjectCSS: boolean;
  canCreateBlobUrls: boolean;
  
  // Restriction detection
  isPrivateMode: boolean;
  hasServiceWorkerActive: boolean;
  hasStrictCSP: boolean;
  
  // Browser info
  browserName: string;
  restrictions: string[];
  
  // Performance info
  testDuration: number;
}

class BrowserCompatibilityTester {
  private startTime: number = 0;
  private restrictions: string[] = [];
  
  async runFullTest(): Promise<BrowserCompatibilityResult> {
    this.startTime = performance.now();
    this.restrictions = [];
    
    console.log('[Compatibility] Starting comprehensive browser test...');
    
    // Basic capabilities
    const hasWebAssembly = this.testWebAssembly();
    const hasSharedArrayBuffer = this.testSharedArrayBuffer();
    const isSecureContext = this.testSecureContext();
    const hasServiceWorker = this.testServiceWorkerSupport();
    
    // Advanced capabilities (async tests)
    const canCreateWorkers = await this.testWebWorkers();
    const canUseDynamicImports = await this.testDynamicImports();
    const canInjectCSS = await this.testCSSInjection();
    const canCreateBlobUrls = await this.testBlobUrls();
    
    // Environment detection
    const isPrivateMode = await this.testPrivateMode();
    const hasServiceWorkerActive = this.testActiveServiceWorker();
    const hasStrictCSP = await this.testContentSecurityPolicy();
    
    // Browser identification
    const browserName = this.detectBrowser();
    
    // Calculate compatibility levels
    const canUseVimWasm = hasWebAssembly && hasSharedArrayBuffer && isSecureContext;
    const canUseMonaco = canCreateWorkers && canUseDynamicImports && canInjectCSS && !hasStrictCSP;
    const canUseBasicEditor = true; // Textarea should always work
    
    const testDuration = performance.now() - this.startTime;
    
    const result: BrowserCompatibilityResult = {
      canUseVimWasm,
      canUseMonaco,
      canUseBasicEditor,
      hasWebAssembly,
      hasSharedArrayBuffer,
      isSecureContext,
      hasServiceWorker,
      canCreateWorkers,
      canUseDynamicImports,
      canInjectCSS,
      canCreateBlobUrls,
      isPrivateMode,
      hasServiceWorkerActive,
      hasStrictCSP,
      browserName,
      restrictions: [...this.restrictions],
      testDuration
    };
    
    console.log('[Compatibility] Test completed in', testDuration.toFixed(2), 'ms');
    console.log('[Compatibility] Results:', result);
    
    return result;
  }
  
  private testWebAssembly(): boolean {
    try {
      return typeof WebAssembly !== 'undefined' && 
             typeof WebAssembly.instantiate === 'function';
    } catch {
      this.restrictions.push('WebAssembly not supported');
      return false;
    }
  }
  
  private testSharedArrayBuffer(): boolean {
    try {
      return typeof SharedArrayBuffer !== 'undefined';
    } catch {
      this.restrictions.push('SharedArrayBuffer not available');
      return false;
    }
  }
  
  private testSecureContext(): boolean {
    const isSecure = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
    if (!isSecure) {
      this.restrictions.push('Not in secure context (HTTPS required)');
    }
    return isSecure;
  }
  
  private testServiceWorkerSupport(): boolean {
    return 'serviceWorker' in navigator;
  }
  
  private async testWebWorkers(): Promise<boolean> {
    try {
      // Test both regular workers and blob workers
      const workerCode = 'self.postMessage("test");';
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      
      const worker = new Worker(workerUrl);
      
      const success = await new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 1000);
        
        worker.onmessage = (e) => {
          clearTimeout(timeout);
          resolve(e.data === 'test');
        };
        
        worker.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
      });
      
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      
      if (!success) {
        this.restrictions.push('Web Workers blocked or not functional');
      }
      
      return success;
    } catch (error) {
      this.restrictions.push('Web Workers not supported or blocked');
      return false;
    }
  }
  
  private async testDynamicImports(): Promise<boolean> {
    try {
      // Test dynamic import with a data URL
      const dataUrl = 'data:text/javascript,export default "test"';
      await import(/* @vite-ignore */ dataUrl);
      return true;
    } catch (error) {
      this.restrictions.push('Dynamic imports blocked by CSP or not supported');
      return false;
    }
  }
  
  private async testCSSInjection(): Promise<boolean> {
    try {
      const testStyle = document.createElement('style');
      testStyle.textContent = '.compat-test { display: none; }';
      testStyle.id = 'compat-test-style';
      
      document.head.appendChild(testStyle);
      
      // Test if the style was actually applied
      const testDiv = document.createElement('div');
      testDiv.className = 'compat-test';
      document.body.appendChild(testDiv);
      
      const computedStyle = window.getComputedStyle(testDiv);
      const success = computedStyle.display === 'none';
      
      // Cleanup
      document.head.removeChild(testStyle);
      document.body.removeChild(testDiv);
      
      if (!success) {
        this.restrictions.push('CSS injection blocked');
      }
      
      return success;
    } catch (error) {
      this.restrictions.push('CSS injection not allowed');
      return false;
    }
  }
  
  private async testBlobUrls(): Promise<boolean> {
    try {
      const blob = new Blob(['test'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      this.restrictions.push('Blob URLs not supported');
      return false;
    }
  }
  
  private async testPrivateMode(): Promise<boolean> {
    try {
      // Test localStorage access (commonly blocked in private mode)
      const testKey = '__compat_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      // Test IndexedDB (also commonly blocked)
      if ('indexedDB' in window) {
        const dbRequest = indexedDB.open('__compat_test__', 1);
        const success = await new Promise<boolean>((resolve) => {
          const timeout = setTimeout(() => resolve(false), 100);
          dbRequest.onsuccess = () => {
            clearTimeout(timeout);
            dbRequest.result.close();
            indexedDB.deleteDatabase('__compat_test__');
            resolve(true);
          };
          dbRequest.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
          };
        });
        
        if (!success) {
          this.restrictions.push('Private/incognito mode detected');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      this.restrictions.push('Private/incognito mode detected');
      return true;
    }
  }
  
  private testActiveServiceWorker(): boolean {
    const hasActive = !!(navigator.serviceWorker?.controller);
    if (hasActive) {
      this.restrictions.push('Service worker active (may interfere with Monaco)');
    }
    return hasActive;
  }
  
  private async testContentSecurityPolicy(): Promise<boolean> {
    try {
      // Test if we can execute inline scripts (CSP test)
      const script = document.createElement('script');
      script.textContent = 'window.__csp_test__ = true;';
      
      document.head.appendChild(script);
      const hasCSP = !(window as any).__csp_test__;
      document.head.removeChild(script);
      
      if (hasCSP) {
        this.restrictions.push('Strict Content Security Policy detected');
      }
      
      // Clean up
      delete (window as any).__csp_test__;
      
      return hasCSP;
    } catch (error) {
      this.restrictions.push('CSP prevents script execution');
      return true;
    }
  }
  
  private detectBrowser(): string {
    const ua = navigator.userAgent.toLowerCase();
    
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('edg')) return 'Edge';
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('opera')) return 'Opera';
    
    return 'Unknown';
  }
}

// Singleton instance for caching results
let cachedResult: BrowserCompatibilityResult | null = null;
let testPromise: Promise<BrowserCompatibilityResult> | null = null;

export async function testBrowserCompatibility(useCache = true): Promise<BrowserCompatibilityResult> {
  if (useCache && cachedResult) {
    return cachedResult;
  }
  
  if (testPromise) {
    return testPromise;
  }
  
  const tester = new BrowserCompatibilityTester();
  testPromise = tester.runFullTest();
  
  try {
    const result = await testPromise;
    if (useCache) {
      cachedResult = result;
    }
    return result;
  } finally {
    testPromise = null;
  }
}

export function getCachedCompatibility(): BrowserCompatibilityResult | null {
  return cachedResult;
}

export function clearCompatibilityCache(): void {
  cachedResult = null;
  testPromise = null;
}
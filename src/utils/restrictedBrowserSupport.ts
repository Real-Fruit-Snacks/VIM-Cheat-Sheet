/**
 * Comprehensive support for restricted browser environments
 * Handles corporate security policies, CSP restrictions, and blocked APIs
 */

// Global flag to track if we're in a restricted environment
let isRestrictedEnvironment = false;

/**
 * Comprehensive environment detection
 * Checks for various restrictions common in corporate browsers
 */
export function detectRestrictedEnvironment(): {
  isRestricted: boolean;
  restrictions: string[];
} {
  const restrictions: string[] = [];
  
  // Test localStorage
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
  } catch {
    restrictions.push('localStorage');
  }
  
  // Test Service Workers
  if (!('serviceWorker' in navigator)) {
    restrictions.push('serviceWorker');
  }
  
  // Test Clipboard API
  if (!navigator.clipboard) {
    restrictions.push('clipboardAPI');
  }
  
  // Test if we're in a sandboxed iframe
  try {
    if (window.self !== window.top) {
      restrictions.push('iframe');
    }
  } catch {
    restrictions.push('iframe');
  }
  
  // Test IndexedDB
  if (!window.indexedDB) {
    restrictions.push('indexedDB');
  }
  
  // Test Web Workers
  if (typeof Worker === 'undefined') {
    restrictions.push('webWorkers');
  }
  
  // Check for strict CSP
  try {
    new Function('return 1')();
  } catch {
    restrictions.push('eval');
  }
  
  isRestrictedEnvironment = restrictions.length > 0;
  
  return {
    isRestricted: isRestrictedEnvironment,
    restrictions
  };
}

/**
 * Safe console logging that won't trigger CSP violations
 */
export const safeConsole = {
  log: (message: string, ...args: any[]) => {
    try {
      console.log(message, ...args);
    } catch {
      // Silently fail if console is restricted
    }
  },
  warn: (message: string, ...args: any[]) => {
    try {
      console.warn(message, ...args);
    } catch {
      // Silently fail if console is restricted
    }
  },
  error: (message: string, ...args: any[]) => {
    try {
      console.error(message, ...args);
    } catch {
      // Silently fail if console is restricted
    }
  }
};

/**
 * Safe Service Worker registration with comprehensive fallbacks
 */
export function safeServiceWorkerRegistration(): Promise<void> {
  return new Promise((resolve) => {
    // Skip if Service Workers are not supported or blocked
    if (!('serviceWorker' in navigator)) {
      safeConsole.log('Service Workers not supported, continuing without offline support');
      resolve();
      return;
    }
    
    try {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/VIM-Cheat-Sheet/sw.js')
          .then((registration) => {
            safeConsole.log('ServiceWorker registered:', registration.scope);
            
            // Set up update checking with error handling
            try {
              setInterval(() => {
                registration.update().catch(() => {
                  // Silently handle update failures
                });
              }, 60 * 60 * 1000);
            } catch {
              // Skip update checking if intervals are restricted
            }
            
            resolve();
          })
          .catch((error) => {
            safeConsole.log('ServiceWorker registration failed, continuing without offline support:', error);
            resolve();
          });
      });
    } catch (error) {
      safeConsole.log('Service Worker setup failed, continuing without offline support:', error);
      resolve();
    }
  });
}

/**
 * Enhanced safe execution wrapper for restricted environments
 */
export function safeExecute<T>(
  operation: () => T,
  fallback: T,
  errorMessage?: string
): T {
  try {
    return operation();
  } catch (error) {
    if (errorMessage) {
      safeConsole.warn(errorMessage, error);
    }
    return fallback;
  }
}

/**
 * Safe DOM manipulation that handles restricted environments
 */
export const safeDom = {
  createElement: (tag: string): HTMLElement | null => {
    return safeExecute(
      () => document.createElement(tag),
      null,
      'DOM createElement blocked'
    );
  },
  
  appendChild: (parent: Element, child: Element): boolean => {
    return safeExecute(
      () => {
        parent.appendChild(child);
        return true;
      },
      false,
      'DOM appendChild blocked'
    );
  },
  
  removeChild: (parent: Element, child: Element): boolean => {
    return safeExecute(
      () => {
        parent.removeChild(child);
        return true;
      },
      false,
      'DOM removeChild blocked'
    );
  }
};

/**
 * Safe event handling for restricted environments
 */
export function safeAddEventListener(
  element: Element | Window,
  event: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
): boolean {
  return safeExecute(
    () => {
      element.addEventListener(event, handler, options);
      return true;
    },
    false,
    `Event listener blocked for ${event}`
  );
}

/**
 * Safe timeout/interval management for restricted environments
 */
export const safeTimers = {
  setTimeout: (callback: () => void, delay: number): number | null => {
    return safeExecute(
      () => window.setTimeout(callback, delay),
      null,
      'setTimeout blocked'
    );
  },
  
  setInterval: (callback: () => void, delay: number): number | null => {
    return safeExecute(
      () => window.setInterval(callback, delay),
      null,
      'setInterval blocked'
    );
  },
  
  clearTimeout: (id: number | null): void => {
    if (id !== null) {
      safeExecute(
        () => window.clearTimeout(id),
        undefined,
        'clearTimeout blocked'
      );
    }
  },
  
  clearInterval: (id: number | null): void => {
    if (id !== null) {
      safeExecute(
        () => window.clearInterval(id),
        undefined,
        'clearInterval blocked'
      );
    }
  }
};

/**
 * Initialize restricted browser support
 * Call this early in app initialization
 */
export function initializeRestrictedBrowserSupport(): void {
  const detection = detectRestrictedEnvironment();
  
  if (detection.isRestricted) {
    safeConsole.log(
      'Restricted browser environment detected. Restrictions:',
      detection.restrictions.join(', ')
    );
    
    // Set up global error handlers to prevent CSP violations
    safeAddEventListener(window, 'error', (event: Event) => {
      // Silently handle errors to prevent CSP violations
      const errorEvent = event as ErrorEvent;
      if (errorEvent.error) {
        safeConsole.warn('Global error handled:', errorEvent.error.message);
      }
      event.preventDefault();
    });
    
    safeAddEventListener(window, 'unhandledrejection', (event: Event) => {
      // Silently handle promise rejections
      const rejectionEvent = event as PromiseRejectionEvent;
      if (rejectionEvent.reason) {
        safeConsole.warn('Unhandled promise rejection:', rejectionEvent.reason);
      }
      event.preventDefault();
    });
  } else {
    safeConsole.log('Standard browser environment detected - all features available');
  }
  
  // Note: Service Worker registration is now handled by external script
  // to avoid CSP violations from inline scripts
  safeConsole.log('Service Worker registration delegated to external script');
}

/**
 * Check if current environment is restricted
 */
export function isInRestrictedEnvironment(): boolean {
  return isRestrictedEnvironment;
}

/**
 * Safe feature detection that won't throw in restricted environments
 */
export const featureDetection = {
  hasLocalStorage: (): boolean => {
    return safeExecute(() => {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    }, false);
  },
  
  hasServiceWorkers: (): boolean => {
    return 'serviceWorker' in navigator;
  },
  
  hasClipboardAPI: (): boolean => {
    return !!(navigator.clipboard && window.isSecureContext);
  },
  
  hasIndexedDB: (): boolean => {
    return !!window.indexedDB;
  },
  
  hasWebWorkers: (): boolean => {
    return typeof Worker !== 'undefined';
  },
  
  hasWebGL: (): boolean => {
    return safeExecute(() => {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    }, false);
  }
};
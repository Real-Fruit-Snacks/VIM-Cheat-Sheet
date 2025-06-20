// Global Error Recovery System
import { log } from './logger';

interface ErrorContext {
  component?: string;
  action?: string;
  url?: string;
  userData?: any;
  timestamp: number;
}

interface RecoveryStrategy {
  name: string;
  condition: (error: Error, context: ErrorContext) => boolean;
  recover: (error: Error, context: ErrorContext) => Promise<boolean>;
}

export class ErrorRecoverySystem {
  private static instance: ErrorRecoverySystem;
  private errorLog: Array<{ error: Error; context: ErrorContext }> = [];
  private recoveryStrategies: RecoveryStrategy[] = [];
  private maxRetries = 3;
  private retryCount = new Map<string, number>();
  private isRecovering = false;

  private constructor() {
    this.setupGlobalHandlers();
    this.registerDefaultStrategies();
  }

  static getInstance(): ErrorRecoverySystem {
    if (!ErrorRecoverySystem.instance) {
      ErrorRecoverySystem.instance = new ErrorRecoverySystem();
    }
    return ErrorRecoverySystem.instance;
  }

  private setupGlobalHandlers() {
    log.info('ErrorRecovery', 'Setting up global error handlers');

    // Global error handler
    window.addEventListener('error', (event) => {
      log.error('ErrorRecovery', 'Global error caught', event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      this.handleError(event.error, {
        component: 'global',
        action: 'runtime',
        url: event.filename,
        timestamp: Date.now()
      });
      event.preventDefault();
    });
    log.debug('ErrorRecovery', 'Global error handler registered');

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      log.error('ErrorRecovery', 'Unhandled promise rejection', new Error(event.reason), {
        reason: event.reason,
        promise: event.promise
      });
      this.handleError(new Error(event.reason), {
        component: 'promise',
        action: 'async',
        timestamp: Date.now()
      });
      event.preventDefault();
    });
    log.debug('ErrorRecovery', 'Promise rejection handler registered');

    // Network error detection
    window.addEventListener('offline', () => {
      log.warn('ErrorRecovery', 'Network connection lost');
      this.handleError(new Error('Network connection lost'), {
        component: 'network',
        action: 'connectivity',
        timestamp: Date.now()
      });
    });

    window.addEventListener('online', () => {
      log.success('ErrorRecovery', 'Network connection restored');
    });
    log.debug('ErrorRecovery', 'Network handlers registered');

    // Memory pressure detection
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedPercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
        
        if (usedPercent > 0.9) {
          log.error('ErrorRecovery', `Critical memory usage: ${(usedPercent * 100).toFixed(1)}%`, undefined, {
            usedMB,
            limitMB,
            percent: usedPercent * 100
          });
          this.handleError(new Error('High memory usage detected'), {
            component: 'system',
            action: 'memory',
            userData: { usage: usedPercent },
            timestamp: Date.now()
          });
        } else if (usedPercent > 0.7) {
          log.warn('ErrorRecovery', `High memory usage: ${(usedPercent * 100).toFixed(1)}%`, {
            usedMB,
            limitMB,
            percent: usedPercent * 100
          });
        }
      }, 30000); // Check every 30 seconds
      log.debug('ErrorRecovery', 'Memory monitoring started');
    } else {
      log.warn('ErrorRecovery', 'Memory monitoring not available in this browser');
    }

    log.success('ErrorRecovery', 'All error handlers initialized');
  }

  private registerDefaultStrategies() {
    // Network error recovery
    this.addRecoveryStrategy({
      name: 'network-retry',
      condition: (error) => {
        return error.message.includes('fetch') || 
               error.message.includes('network') ||
               error.message.includes('CORS');
      },
      recover: async (error, context) => {
        log.info('ErrorRecovery', 'Attempting network error recovery', {
          online: navigator.onLine,
          error: error.message
        });
        
        // Wait for network
        if (!navigator.onLine) {
          log.info('ErrorRecovery', 'Waiting for network connection...');
          await this.waitForNetwork();
          log.success('ErrorRecovery', 'Network connection restored');
        }

        // Clear service worker cache if CORS issue
        if (error.message.includes('CORS')) {
          log.info('ErrorRecovery', 'CORS error detected, clearing service worker cache');
          await this.clearServiceWorkerCache();
          log.success('ErrorRecovery', 'Service worker cache cleared');
        }

        return true;
      }
    });

    // WebAssembly loading error recovery
    this.addRecoveryStrategy({
      name: 'wasm-fallback',
      condition: (error) => {
        return error.message.includes('WebAssembly') ||
               error.message.includes('wasm');
      },
      recover: async () => {
        log.warn('ErrorRecovery', 'WebAssembly failed, switching to Monaco fallback');
        window.__skipVimWasmLoad = true;
        window.__vimWasmLoadError = true;
        
        // Trigger page reload with fallback
        sessionStorage.setItem('vim-force-fallback', 'true');
        log.info('ErrorRecovery', 'Reloading page with Monaco fallback enabled');
        
        setTimeout(() => {
          window.location.reload();
        }, 100);
        
        return true;
      }
    });

    // Monaco loading error recovery
    this.addRecoveryStrategy({
      name: 'monaco-reload',
      condition: (error) => {
        return error.message.includes('monaco') ||
               error.message.includes('editor');
      },
      recover: async () => {
        console.log('Monaco editor failed, attempting reload...');
        
        // Clear module cache
        if ('caches' in window) {
          const names = await caches.keys();
          await Promise.all(names.map(name => caches.delete(name)));
        }
        
        // Force reload
        window.location.reload();
        return true;
      }
    });

    // Memory error recovery
    this.addRecoveryStrategy({
      name: 'memory-cleanup',
      condition: (error) => {
        return error.message.includes('memory') ||
               error.message.includes('Maximum call stack');
      },
      recover: async () => {
        console.log('Memory issue detected, cleaning up...');
        
        // Force garbage collection if available
        if ('gc' in window) {
          (window as any).gc();
        }

        // Clear large data structures
        this.clearMemory();

        // Reload if critical
        if (this.getRetryCount('memory-cleanup') > 2) {
          window.location.reload();
        }

        return true;
      }
    });

    // Storage quota recovery
    this.addRecoveryStrategy({
      name: 'storage-cleanup',
      condition: (error) => {
        return error.message.includes('QuotaExceededError') ||
               error.message.includes('storage');
      },
      recover: async () => {
        console.log('Storage quota exceeded, cleaning up...');
        
        // Clear old data
        await this.clearOldStorage();
        
        return true;
      }
    });

    // Generic fallback recovery
    this.addRecoveryStrategy({
      name: 'generic-reload',
      condition: () => true, // Always matches as last resort
      recover: async (error, context) => {
        const errorKey = `${context.component}-${context.action}`;
        const retries = this.getRetryCount(errorKey);
        
        if (retries < this.maxRetries) {
          console.log(`Generic recovery attempt ${retries + 1}/${this.maxRetries}`);
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
          
          // Try reload
          window.location.reload();
          return true;
        }
        
        // Show fallback UI after max retries
        this.showFallbackUI(error);
        return false;
      }
    });
  }

  async handleError(error: Error, context: ErrorContext): Promise<void> {
    // Prevent recursive recovery
    if (this.isRecovering) {
      log.warn('ErrorRecovery', 'Already recovering, skipping error', {
        error: error.message,
        context
      });
      return;
    }

    this.isRecovering = true;
    
    log.error('ErrorRecovery', `Handling error: ${error.message}`, error, {
      context,
      errorType: error.name,
      stack: error.stack
    });

    // Log error to history
    this.errorLog.push({ error, context });
    if (this.errorLog.length > 100) {
      this.errorLog.shift(); // Keep last 100 errors
    }

    log.info('ErrorRecovery', `Trying ${this.recoveryStrategies.length} recovery strategies`);

    // Try recovery strategies
    let strategyAttempts = 0;
    for (const strategy of this.recoveryStrategies) {
      if (strategy.condition(error, context)) {
        strategyAttempts++;
        log.info('ErrorRecovery', `Attempting recovery with strategy: ${strategy.name}`, {
          strategyNumber: strategyAttempts,
          errorMessage: error.message
        });
        
        try {
          const startTime = performance.now();
          const recovered = await strategy.recover(error, context);
          const duration = performance.now() - startTime;
          
          if (recovered) {
            log.success('ErrorRecovery', `Recovery successful with strategy: ${strategy.name}`, {
              duration: `${duration.toFixed(2)}ms`,
              context
            });
            this.isRecovering = false;
            return;
          } else {
            log.warn('ErrorRecovery', `Strategy ${strategy.name} did not recover the error`, {
              duration: `${duration.toFixed(2)}ms`
            });
          }
        } catch (recoveryError) {
          log.error('ErrorRecovery', `Recovery strategy ${strategy.name} failed`, recoveryError as Error, {
            originalError: error.message
          });
        }
      }
    }

    log.error('ErrorRecovery', 'All recovery strategies failed', undefined, {
      triedStrategies: strategyAttempts,
      error: error.message
    });
    
    this.isRecovering = false;
  }

  addRecoveryStrategy(strategy: RecoveryStrategy) {
    this.recoveryStrategies.push(strategy);
  }

  private async waitForNetwork(): Promise<void> {
    return new Promise((resolve) => {
      if (navigator.onLine) {
        resolve();
        return;
      }

      const handleOnline = () => {
        window.removeEventListener('online', handleOnline);
        resolve();
      };

      window.addEventListener('online', handleOnline);
    });
  }

  private async clearServiceWorkerCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
    }
  }

  private clearMemory() {
    // Clear any large cached data
    this.errorLog = this.errorLog.slice(-10); // Keep only last 10 errors
    this.retryCount.clear();

    // Dispatch event for components to clear their caches
    window.dispatchEvent(new CustomEvent('memory-pressure', {
      detail: { level: 'critical' }
    }));
  }

  private async clearOldStorage() {
    // Clear localStorage items older than 7 days
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            if (parsed.timestamp && (now - parsed.timestamp) > maxAge) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // Skip non-JSON items
        }
      }
    }

    // Clear old IndexedDB data
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      
      if (usage / quota > 0.8) {
        // Clear IndexedDB databases
        const databases = await indexedDB.databases();
        for (const db of databases) {
          if (db.name && db.name.includes('old') || db.name.includes('temp')) {
            indexedDB.deleteDatabase(db.name);
          }
        }
      }
    }
  }

  private getRetryCount(key: string): number {
    const count = this.retryCount.get(key) || 0;
    this.retryCount.set(key, count + 1);
    return count;
  }

  private showFallbackUI(error: Error) {
    document.body.innerHTML = `
      <div style="
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0a0a0a;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h1 style="color: #ff6b6b; margin-bottom: 20px;">Unable to Load VIM Editor</h1>
          <p style="color: #666; margin-bottom: 30px;">
            We encountered an error and couldn't recover automatically.
          </p>
          <div style="
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: left;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          ">
            <p style="color: #999; margin: 0;">Error: ${error.message}</p>
          </div>
          <div>
            <button onclick="window.location.reload()" style="
              background: #22c55e;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              margin-right: 10px;
            ">
              Try Again
            </button>
            <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload()" style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
            ">
              Reset & Reload
            </button>
          </div>
          <p style="color: #666; margin-top: 30px; font-size: 14px;">
            If the problem persists, try using a different browser or 
            <a href="https://github.com/your-repo/issues" style="color: #3b82f6;">report an issue</a>.
          </p>
        </div>
      </div>
    `;
  }

  // Public methods for manual error handling
  reportError(error: Error, context: Partial<ErrorContext> = {}) {
    this.handleError(error, {
      timestamp: Date.now(),
      ...context
    });
  }

  getErrorLog() {
    return [...this.errorLog];
  }

  clearErrorLog() {
    this.errorLog = [];
  }
}

// Export singleton instance
export const errorRecovery = ErrorRecoverySystem.getInstance();

// Error boundary integration utility
export function integrateWithErrorBoundary(errorRecoveryInstance: ErrorRecoverySystem) {
  // This function can be called from React ErrorBoundary components
  // to integrate with the error recovery system
  return {
    reportError: (error: Error, context: Partial<ErrorContext> = {}) => {
      errorRecoveryInstance.reportError(error, {
        component: 'react-boundary',
        action: 'react-render',
        timestamp: Date.now(),
        ...context
      });
    }
  };
}
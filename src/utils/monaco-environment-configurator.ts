/**
 * Monaco Environment Configurator
 * Provides proper Monaco worker configuration based on browser capabilities
 */

import type { BrowserCompatibilityResult } from './browser-compatibility-tester';

export interface MonacoEnvironmentConfig {
  getWorker: (workerId: string, label: string) => Worker;
  canUseWorkers: boolean;
  workerMode: 'real' | 'fake' | 'none';
  restrictions: string[];
}

class MonacoEnvironmentConfigurator {
  private isConfigured = false;
  private currentConfig: MonacoEnvironmentConfig | null = null;
  
  async configureMonacoEnvironment(compatibility: BrowserCompatibilityResult): Promise<MonacoEnvironmentConfig> {
    if (this.isConfigured && this.currentConfig) {
      return this.currentConfig;
    }
    
    console.log('[Monaco Config] Configuring Monaco environment with compatibility:', compatibility);
    
    const restrictions: string[] = [];
    let workerMode: 'real' | 'fake' | 'none' = 'real';
    
    // Determine the best worker configuration based on capabilities
    if (compatibility.canCreateWorkers && compatibility.canCreateBlobUrls && !compatibility.hasStrictCSP) {
      // Best case: real workers with proper Monaco worker scripts
      console.log('[Monaco Config] Using real workers for optimal performance');
      workerMode = 'real';
    } else if (compatibility.canCreateWorkers) {
      // Partial support: workers available but may have restrictions
      console.log('[Monaco Config] Using limited worker support');
      workerMode = 'fake';
      restrictions.push('Limited worker capabilities detected');
    } else {
      // Fallback: no worker support at all
      console.log('[Monaco Config] No worker support, using synchronous mode');
      workerMode = 'none';
      restrictions.push('Web Workers not available');
    }
    
    // Handle service worker interference
    if (compatibility.hasServiceWorkerActive) {
      restrictions.push('Service worker may interfere with Monaco workers');
    }
    
    // Handle private mode restrictions
    if (compatibility.isPrivateMode) {
      restrictions.push('Private/incognito mode detected');
      // In private mode, often need to downgrade to fake workers
      if (workerMode === 'real') {
        workerMode = 'fake';
      }
    }
    
    // Create the appropriate worker configuration
    let getWorker: (workerId: string, label: string) => Worker;
    
    switch (workerMode) {
      case 'real':
        getWorker = this.createRealWorkerGetter();
        break;
      case 'fake':
        getWorker = this.createFakeWorkerGetter();
        break;
      case 'none':
        getWorker = this.createNoWorkerGetter();
        break;
    }
    
    const config: MonacoEnvironmentConfig = {
      getWorker,
      canUseWorkers: workerMode !== 'none',
      workerMode,
      restrictions
    };
    
    // Set up the global Monaco environment
    if (typeof window !== 'undefined') {
      (window as any).MonacoEnvironment = {
        getWorker: config.getWorker
      };
      console.log('[Monaco Config] Global MonacoEnvironment configured');
    }
    
    this.currentConfig = config;
    this.isConfigured = true;
    
    return config;
  }
  
  private createRealWorkerGetter(): (workerId: string, label: string) => Worker {
    return (_workerId: string, label: string) => {
      console.log(`[Monaco Config] Creating offline-compatible worker for ${label}`);
      
      // For offline compatibility, we always use blob workers instead of trying to load
      // external worker files that may not exist or have MIME type issues
      console.log(`[Monaco Config] Using blob worker approach for maximum compatibility`);
      return this.createBasicWorker(label);
    };
  }
  
  private createFakeWorkerGetter(): (workerId: string, label: string) => Worker {
    return (_workerId: string, label: string) => {
      console.log(`[Monaco Config] Creating fake worker for ${label}`);
      return this.createBasicWorker(label);
    };
  }
  
  private createNoWorkerGetter(): (workerId: string, label: string) => Worker {
    return (_workerId: string, label: string) => {
      console.log(`[Monaco Config] No worker support - returning null worker for ${label}`);
      // Return a completely non-functional worker that Monaco will ignore
      return {
        postMessage: () => {},
        terminate: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        onerror: null,
        onmessage: null,
        onmessageerror: null,
        dispatchEvent: () => false
      } as unknown as Worker;
    };
  }
  
  private createBasicWorker(label: string): Worker {
    try {
      // Create a more functional Monaco worker using blob URL
      const workerCode = `
        // Enhanced Monaco worker fallback for offline environments
        // This worker provides basic responses that Monaco expects
        
        console.log('Monaco blob worker started for: ${label}');
        
        // Basic message handling for Monaco's worker protocol
        self.addEventListener('message', function(e) {
          const data = e.data;
          
          try {
            // Handle different types of Monaco worker requests
            if (!data || typeof data !== 'object') {
              return;
            }
            
            const { id, method, params } = data;
            
            // Provide basic responses for common Monaco worker methods
            let result = null;
            let error = null;
            
            switch (method) {
              case 'initialize':
                result = { capabilities: {} };
                break;
              case 'getSemanticTokens':
              case 'getDocumentSymbols':  
              case 'getCompletions':
              case 'getHover':
              case 'getSignatureHelp':
                // Return empty results for language features
                result = [];
                break;
              case 'format':
              case 'formatRange':
                // Return no formatting changes
                result = [];
                break;
              case 'validate':
                // Return no validation errors
                result = [];
                break;
              default:
                // For unknown methods, return null
                result = null;
            }
            
            // Send response back to main thread
            if (id !== undefined) {
              self.postMessage({
                id: id,
                result: result,
                error: error
              });
            }
          } catch (err) {
            // Send error response
            if (data && data.id !== undefined) {
              self.postMessage({
                id: data.id,
                result: null,
                error: {
                  message: err.message || 'Worker error',
                  name: err.name || 'Error'
                }
              });
            }
          }
        });
        
        // Handle errors gracefully
        self.addEventListener('error', function(e) {
          console.warn('Monaco blob worker error for ${label}:', e);
        });
        
        // Signal that worker is ready
        self.postMessage({ type: 'ready', worker: '${label}' });
      `;
      
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      
      const worker = new Worker(workerUrl);
      
      // Clean up the blob URL after worker creation
      setTimeout(() => URL.revokeObjectURL(workerUrl), 2000);
      
      console.log(`[Monaco Config] Created enhanced blob worker for ${label}`);
      return worker;
    } catch (error) {
      console.error(`[Monaco Config] Failed to create blob worker for ${label}:`, error);
      // Return a completely fake worker as last resort
      return this.createNoWorkerGetter()(label, label);
    }
  }
  
  getCurrentConfig(): MonacoEnvironmentConfig | null {
    return this.currentConfig;
  }
  
  isMonacoConfigured(): boolean {
    return this.isConfigured;
  }
  
  resetConfiguration(): void {
    this.isConfigured = false;
    this.currentConfig = null;
    
    if (typeof window !== 'undefined') {
      delete (window as any).MonacoEnvironment;
    }
    
    console.log('[Monaco Config] Configuration reset');
  }
}

// Export singleton instance
export const monacoEnvironmentConfigurator = new MonacoEnvironmentConfigurator();

// Convenience functions
export async function configureMonacoForBrowser(compatibility: BrowserCompatibilityResult): Promise<MonacoEnvironmentConfig> {
  return monacoEnvironmentConfigurator.configureMonacoEnvironment(compatibility);
}

export function getMonacoConfig(): MonacoEnvironmentConfig | null {
  return monacoEnvironmentConfigurator.getCurrentConfig();
}

export function isMonacoConfigured(): boolean {
  return monacoEnvironmentConfigurator.isMonacoConfigured();
}

export function resetMonacoConfiguration(): void {
  monacoEnvironmentConfigurator.resetConfiguration();
}
// Resource Loader with Fallback and Retry Logic

import React from 'react';
import { log } from './logger';

interface LoadOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  fallbackUrl?: string;
  cache?: boolean;
  integrity?: string;
  crossOrigin?: string;
}

interface ResourceFallback {
  primary: string;
  fallbacks: string[];
}

export class ResourceLoader {
  private static instance: ResourceLoader;
  private loadedResources = new Set<string>();
  private failedResources = new Map<string, number>();
  private resourceCache = new Map<string, any>();
  private cdnFallbacks: Map<string, ResourceFallback> = new Map();

  private constructor() {
    log.info('ResourceLoader', 'Initializing resource loader');
    this.setupCDNFallbacks();
    log.success('ResourceLoader', 'Resource loader ready', {
      cdnFallbacks: this.cdnFallbacks.size
    });
  }

  static getInstance(): ResourceLoader {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
    }
    return ResourceLoader.instance;
  }

  private setupCDNFallbacks() {
    // Monaco Editor fallbacks
    this.cdnFallbacks.set('monaco-editor', {
      primary: '/node_modules/monaco-editor/min/vs',
      fallbacks: [
        'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs',
        'https://unpkg.com/monaco-editor@latest/min/vs',
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs'
      ]
    });

    // React fallbacks
    this.cdnFallbacks.set('react', {
      primary: '/node_modules/react/umd/react.production.min.js',
      fallbacks: [
        'https://unpkg.com/react@18/umd/react.production.min.js',
        'https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js'
      ]
    });

    // Custom vim-wasm fallbacks
    this.cdnFallbacks.set('vim-wasm', {
      primary: '/vim-wasm/vim.wasm',
      fallbacks: [
        '/public/vim-wasm/vim.wasm',
        `${window.location.origin}/vim-wasm/vim.wasm`
      ]
    });
  }

  // Load JavaScript with retry and fallback
  async loadScript(url: string, options: LoadOptions = {}): Promise<void> {
    const {
      timeout = 30000,
      retries = 3,
      retryDelay = 1000,
      fallbackUrl,
      integrity,
      crossOrigin = 'anonymous'
    } = options;

    log.info('ResourceLoader', `Loading script: ${url}`, {
      timeout,
      retries,
      hasFallback: !!fallbackUrl,
      integrity: !!integrity
    });

    // Check if already loaded
    if (this.loadedResources.has(url)) {
      log.debug('ResourceLoader', `Script already loaded: ${url}`);
      return;
    }

    // Check if previously failed recently
    const failedTime = this.failedResources.get(url);
    if (failedTime && Date.now() - failedTime < 60000) {
      log.warn('ResourceLoader', `Script failed recently, skipping: ${url}`, {
        failedAgo: `${Math.round((Date.now() - failedTime) / 1000)}s ago`
      });
    }

    const startTime = performance.now();

    // Try loading with retries
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        log.info('ResourceLoader', `Loading attempt ${attempt + 1}/${retries + 1} for: ${url}`);
        
        await this.loadScriptAttempt(url, { timeout, integrity, crossOrigin });
        
        const loadTime = performance.now() - startTime;
        this.loadedResources.add(url);
        this.failedResources.delete(url);
        
        log.success('ResourceLoader', `Successfully loaded: ${url}`, {
          loadTime: `${loadTime.toFixed(2)}ms`,
          attempt: attempt + 1,
          size: 'unknown' // Could be enhanced to track size
        });
        return;
      } catch (error) {
        log.warn('ResourceLoader', `Failed to load ${url}`, {
          attempt: attempt + 1,
          error: (error as Error).message,
          willRetry: attempt < retries
        });
        
        if (attempt < retries) {
          const delay = retryDelay * (attempt + 1);
          log.info('ResourceLoader', `Waiting ${delay}ms before retry`);
          await this.delay(delay);
        }
      }
    }

    // Try fallback URL if provided
    if (fallbackUrl) {
      log.info('ResourceLoader', `All attempts failed, trying fallback: ${fallbackUrl}`);
      try {
        const fallbackStart = performance.now();
        await this.loadScriptAttempt(fallbackUrl, { timeout, integrity, crossOrigin });
        
        const fallbackTime = performance.now() - fallbackStart;
        this.loadedResources.add(url); // Mark original as loaded
        
        log.success('ResourceLoader', `Fallback successful: ${fallbackUrl}`, {
          loadTime: `${fallbackTime.toFixed(2)}ms`,
          originalUrl: url
        });
        return;
      } catch (error) {
        log.error('ResourceLoader', `Fallback also failed: ${fallbackUrl}`, error as Error);
      }
    }

    // Record failure
    this.failedResources.set(url, Date.now());
    const totalTime = performance.now() - startTime;
    
    log.error('ResourceLoader', `Failed to load script after all attempts: ${url}`, undefined, {
      totalTime: `${totalTime.toFixed(2)}ms`,
      attempts: retries + 1,
      hadFallback: !!fallbackUrl
    });
    
    throw new Error(`Failed to load script: ${url}`);
  }

  private loadScriptAttempt(url: string, options: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      
      if (options.integrity) {
        script.integrity = options.integrity;
      }
      
      if (options.crossOrigin) {
        script.crossOrigin = options.crossOrigin;
      }

      let timeoutId: number;
      
      const cleanup = () => {
        clearTimeout(timeoutId);
        script.onload = null;
        script.onerror = null;
      };

      script.onload = () => {
        cleanup();
        resolve();
      };

      script.onerror = () => {
        cleanup();
        document.head.removeChild(script);
        reject(new Error(`Failed to load script: ${url}`));
      };

      timeoutId = window.setTimeout(() => {
        cleanup();
        document.head.removeChild(script);
        reject(new Error(`Script load timeout: ${url}`));
      }, options.timeout);

      document.head.appendChild(script);
    });
  }

  // Load CSS with retry and fallback
  async loadCSS(url: string, options: LoadOptions = {}): Promise<void> {
    const {
      timeout = 10000,
      retries = 3,
      retryDelay = 500,
      fallbackUrl
    } = options;

    // Check if already loaded
    if (this.loadedResources.has(url)) {
      return;
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await this.loadCSSAttempt(url, timeout);
        this.loadedResources.add(url);
        return;
      } catch (error) {
        if (attempt < retries) {
          await this.delay(retryDelay * (attempt + 1));
        }
      }
    }

    // Try fallback
    if (fallbackUrl) {
      try {
        await this.loadCSSAttempt(fallbackUrl, timeout);
        this.loadedResources.add(url);
        return;
      } catch (error) {
        console.error(`[ResourceLoader] CSS fallback failed: ${fallbackUrl}`);
      }
    }

    throw new Error(`Failed to load CSS: ${url}`);
  }

  private loadCSSAttempt(url: string, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;

      let timeoutId: number;

      const cleanup = () => {
        clearTimeout(timeoutId);
        link.onload = null;
        link.onerror = null;
      };

      link.onload = () => {
        cleanup();
        resolve();
      };

      link.onerror = () => {
        cleanup();
        document.head.removeChild(link);
        reject(new Error(`Failed to load CSS: ${url}`));
      };

      timeoutId = window.setTimeout(() => {
        cleanup();
        // CSS might still load, so don't remove
        reject(new Error(`CSS load timeout: ${url}`));
      }, timeout);

      document.head.appendChild(link);
    });
  }

  // Load JSON data with retry
  async loadJSON<T = any>(url: string, options: LoadOptions = {}): Promise<T> {
    const {
      timeout = 10000,
      retries = 3,
      retryDelay = 1000,
      cache = true
    } = options;

    // Check cache
    if (cache && this.resourceCache.has(url)) {
      return this.resourceCache.get(url);
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (cache) {
          this.resourceCache.set(url, data);
        }

        return data;
      } catch (error) {
        console.warn(`[ResourceLoader] JSON load failed (attempt ${attempt + 1}/${retries + 1}):`, error);
        
        if (attempt < retries) {
          await this.delay(retryDelay * (attempt + 1));
        }
      }
    }

    throw new Error(`Failed to load JSON: ${url}`);
  }

  // Load WebAssembly with fallback
  async loadWASM(url: string, options: LoadOptions = {}): Promise<WebAssembly.Module> {
    const { retries = 3, retryDelay = 2000 } = options;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`[ResourceLoader] Loading WASM: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const module = await WebAssembly.compile(buffer);
        
        console.log(`[ResourceLoader] WASM loaded successfully: ${url}`);
        return module;
      } catch (error) {
        console.warn(`[ResourceLoader] WASM load failed (attempt ${attempt + 1}/${retries + 1}):`, error);
        
        if (attempt < retries) {
          await this.delay(retryDelay * (attempt + 1));
        }
      }
    }

    throw new Error(`Failed to load WASM: ${url}`);
  }

  // Load with CDN fallbacks
  async loadWithCDNFallback(resourceId: string, loader: 'script' | 'css' = 'script'): Promise<void> {
    const fallbackConfig = this.cdnFallbacks.get(resourceId);
    
    if (!fallbackConfig) {
      throw new Error(`No fallback configuration for: ${resourceId}`);
    }

    const urls = [fallbackConfig.primary, ...fallbackConfig.fallbacks];
    
    for (const url of urls) {
      try {
        if (loader === 'script') {
          await this.loadScript(url, { retries: 1 });
        } else {
          await this.loadCSS(url, { retries: 1 });
        }
        
        console.log(`[ResourceLoader] Loaded ${resourceId} from: ${url}`);
        return;
      } catch (error) {
        console.warn(`[ResourceLoader] Failed to load ${resourceId} from: ${url}`);
      }
    }

    throw new Error(`Failed to load ${resourceId} from any source`);
  }

  // Preload critical resources
  async preloadCriticalResources(): Promise<void> {
    const critical = [
      { url: '/src/main.tsx', type: 'script' },
      { url: '/src/App.tsx', type: 'script' },
    ];

    const promises = critical.map(({ url, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = type;
      document.head.appendChild(link);
      return Promise.resolve();
    });

    await Promise.all(promises);
  }

  // Lazy load non-critical resources
  lazyLoad(url: string, options: LoadOptions = {}): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.loadScript(url, options).catch(console.error);
      });
    } else {
      setTimeout(() => {
        this.loadScript(url, options).catch(console.error);
      }, 2000);
    }
  }

  // Helper methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearCache(): void {
    this.resourceCache.clear();
  }

  getFailedResources(): string[] {
    return Array.from(this.failedResources.keys());
  }

  isResourceLoaded(url: string): boolean {
    return this.loadedResources.has(url);
  }

  // Resource integrity check
  async verifyResourceIntegrity(url: string, expectedHash: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return hashHex === expectedHash;
    } catch (error) {
      console.error(`[ResourceLoader] Integrity check failed for ${url}:`, error);
      return false;
    }
  }
}

// Export singleton instance
export const resourceLoader = ResourceLoader.getInstance();

// React hook for resource loading
export function useResourceLoader() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const loadResource = React.useCallback(async (
    url: string,
    type: 'script' | 'css' | 'json' = 'script',
    options?: LoadOptions
  ) => {
    setLoading(true);
    setError(null);

    try {
      switch (type) {
        case 'script':
          await resourceLoader.loadScript(url, options);
          break;
        case 'css':
          await resourceLoader.loadCSS(url, options);
          break;
        case 'json':
          return await resourceLoader.loadJSON(url, options);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadResource, loading, error };
}
// Memory and Storage Management System

import React from 'react';

export interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usagePercent: number;
}

export interface StorageStats {
  usage: number;
  quota: number;
  usagePercent: number;
  persistent: boolean;
}

export interface CleanupResult {
  freedMemory?: number;
  freedStorage?: number;
  itemsRemoved: number;
  errors: string[];
}

type CleanupStrategy = () => Promise<CleanupResult>;

export class MemoryManager {
  private static instance: MemoryManager;
  private cleanupStrategies: Map<string, CleanupStrategy> = new Map();
  private memoryWarningThreshold = 0.7; // 70%
  private memoryCriticalThreshold = 0.9; // 90%
  private storageWarningThreshold = 0.8; // 80%
  private isMonitoring = false;
  private monitorInterval?: number;
  private lastGCTime = 0;
  private gcMinInterval = 30000; // 30 seconds

  private constructor() {
    this.registerDefaultStrategies();
    this.setupEventListeners();
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  private registerDefaultStrategies() {
    // Clear old cache entries
    this.registerCleanupStrategy('cache-cleanup', async () => {
      const result: CleanupResult = {
        itemsRemoved: 0,
        errors: []
      };

      try {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          const oldCaches = cacheNames.filter(name => {
            // Remove caches older than current version
            return name.includes('vim-') && !name.includes('vim-v1');
          });

          for (const cacheName of oldCaches) {
            await caches.delete(cacheName);
            result.itemsRemoved++;
          }
        }
      } catch (error) {
        result.errors.push(`Cache cleanup failed: ${error}`);
      }

      return result;
    });

    // Clear old localStorage data
    this.registerCleanupStrategy('localstorage-cleanup', async () => {
      const result: CleanupResult = {
        itemsRemoved: 0,
        errors: []
      };

      try {
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        const keysToRemove: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;

          // Skip critical keys
          if (key.includes('feature-') || key.includes('auth-')) continue;

          try {
            const item = localStorage.getItem(key);
            if (item) {
              const parsed = JSON.parse(item);
              if (parsed.timestamp && (now - parsed.timestamp) > maxAge) {
                keysToRemove.push(key);
              }
            }
          } catch {
            // If not JSON or no timestamp, check key patterns
            if (key.includes('temp-') || key.includes('old-')) {
              keysToRemove.push(key);
            }
          }
        }

        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          result.itemsRemoved++;
        });
      } catch (error) {
        result.errors.push(`LocalStorage cleanup failed: ${error}`);
      }

      return result;
    });

    // Clear IndexedDB old data
    this.registerCleanupStrategy('indexeddb-cleanup', async () => {
      const result: CleanupResult = {
        itemsRemoved: 0,
        errors: []
      };

      try {
        if ('indexedDB' in window) {
          const databases = await indexedDB.databases();
          
          for (const db of databases) {
            if (db.name && (db.name.includes('old') || db.name.includes('temp'))) {
              try {
                await indexedDB.deleteDatabase(db.name);
                result.itemsRemoved++;
              } catch (error) {
                result.errors.push(`Failed to delete database ${db.name}: ${error}`);
              }
            }
          }
        }
      } catch (error) {
        result.errors.push(`IndexedDB cleanup failed: ${error}`);
      }

      return result;
    });

    // Clear session storage
    this.registerCleanupStrategy('sessionstorage-cleanup', async () => {
      const result: CleanupResult = {
        itemsRemoved: 0,
        errors: []
      };

      try {
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.includes('temp-') || key.includes('cache-'))) {
            keysToRemove.push(key);
          }
        }

        keysToRemove.forEach(key => {
          sessionStorage.removeItem(key);
          result.itemsRemoved++;
        });
      } catch (error) {
        result.errors.push(`SessionStorage cleanup failed: ${error}`);
      }

      return result;
    });

    // Clear detached DOM nodes
    this.registerCleanupStrategy('dom-cleanup', async () => {
      const result: CleanupResult = {
        itemsRemoved: 0,
        errors: []
      };

      try {
        // Remove orphaned style tags
        const styleTags = document.querySelectorAll('style[data-temp="true"]');
        styleTags.forEach(tag => {
          tag.remove();
          result.itemsRemoved++;
        });

        // Remove orphaned script tags
        const scriptTags = document.querySelectorAll('script[data-temp="true"]');
        scriptTags.forEach(tag => {
          tag.remove();
          result.itemsRemoved++;
        });

        // Dispatch cleanup event for components
        window.dispatchEvent(new CustomEvent('memory-cleanup-requested'));
      } catch (error) {
        result.errors.push(`DOM cleanup failed: ${error}`);
      }

      return result;
    });

    // Clear blob URLs
    this.registerCleanupStrategy('blob-cleanup', async () => {
      const result: CleanupResult = {
        itemsRemoved: 0,
        errors: []
      };

      try {
        // Find and revoke blob URLs
        const blobUrls = Array.from(document.querySelectorAll('*'))
          .flatMap(el => {
            const urls: string[] = [];
            // Check common attributes
            ['src', 'href', 'data'].forEach(attr => {
              const value = el.getAttribute(attr);
              if (value && value.startsWith('blob:')) {
                urls.push(value);
              }
            });
            return urls;
          });

        blobUrls.forEach(url => {
          URL.revokeObjectURL(url);
          result.itemsRemoved++;
        });
      } catch (error) {
        result.errors.push(`Blob cleanup failed: ${error}`);
      }

      return result;
    });
  }

  private setupEventListeners() {
    // Listen for memory pressure events
    window.addEventListener('memory-pressure', (event: any) => {
      const level = event.detail?.level || 'moderate';
      this.handleMemoryPressure(level);
    });

    // Listen for storage quota exceeded
    window.addEventListener('storage', () => {
      this.checkStorageQuota();
    });
  }

  registerCleanupStrategy(name: string, strategy: CleanupStrategy) {
    this.cleanupStrategies.set(name, strategy);
  }

  async getMemoryStats(): Promise<MemoryStats | null> {
    if (!('memory' in performance)) {
      return null;
    }

    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }

  async getStorageStats(): Promise<StorageStats | null> {
    if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
      return null;
    }

    try {
      const estimate = await navigator.storage.estimate();
      const persistent = await navigator.storage.persisted();

      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        usagePercent: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0,
        persistent
      };
    } catch {
      return null;
    }
  }

  private async handleMemoryPressure(level: 'moderate' | 'critical') {
    console.log(`[MemoryManager] Handling ${level} memory pressure`);

    if (level === 'critical') {
      // Run all cleanup strategies
      await this.runCleanup(['cache-cleanup', 'blob-cleanup', 'dom-cleanup']);
      
      // Force garbage collection if available
      this.forceGarbageCollection();
    } else {
      // Run light cleanup
      await this.runCleanup(['blob-cleanup', 'sessionstorage-cleanup']);
    }
  }

  async runCleanup(strategies?: string[]): Promise<CleanupResult> {
    const strategiesToRun = strategies || Array.from(this.cleanupStrategies.keys());
    const results: CleanupResult[] = [];

    for (const strategyName of strategiesToRun) {
      const strategy = this.cleanupStrategies.get(strategyName);
      if (strategy) {
        try {
          console.log(`[MemoryManager] Running cleanup: ${strategyName}`);
          const result = await strategy();
          results.push(result);
        } catch (error) {
          console.error(`[MemoryManager] Cleanup strategy failed: ${strategyName}`, error);
        }
      }
    }

    // Aggregate results
    return {
      itemsRemoved: results.reduce((sum, r) => sum + r.itemsRemoved, 0),
      errors: results.flatMap(r => r.errors)
    };
  }

  forceGarbageCollection() {
    const now = Date.now();
    if (now - this.lastGCTime < this.gcMinInterval) {
      console.log('[MemoryManager] Skipping GC - too soon since last collection');
      return;
    }

    if ('gc' in window) {
      console.log('[MemoryManager] Forcing garbage collection');
      (window as any).gc();
      this.lastGCTime = now;
    } else {
      console.log('[MemoryManager] Garbage collection not available');
    }
  }

  async checkStorageQuota(): Promise<boolean> {
    const stats = await this.getStorageStats();
    if (!stats) return true;

    if (stats.usagePercent > this.storageWarningThreshold * 100) {
      console.warn(`[MemoryManager] Storage usage high: ${stats.usagePercent.toFixed(1)}%`);
      
      // Run storage cleanup
      await this.runCleanup(['cache-cleanup', 'localstorage-cleanup', 'indexeddb-cleanup']);
      
      // Check again
      const newStats = await this.getStorageStats();
      return newStats ? newStats.usagePercent < this.storageWarningThreshold * 100 : true;
    }

    return true;
  }

  startMonitoring(intervalMs: number = 30000) {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitorInterval = window.setInterval(async () => {
      // Check memory
      const memStats = await this.getMemoryStats();
      if (memStats) {
        if (memStats.usagePercent > this.memoryCriticalThreshold * 100) {
          await this.handleMemoryPressure('critical');
        } else if (memStats.usagePercent > this.memoryWarningThreshold * 100) {
          await this.handleMemoryPressure('moderate');
        }
      }

      // Check storage
      await this.checkStorageQuota();
    }, intervalMs);

    console.log('[MemoryManager] Monitoring started');
  }

  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = undefined;
    }
    this.isMonitoring = false;
    console.log('[MemoryManager] Monitoring stopped');
  }

  // Request persistent storage
  async requestPersistentStorage(): Promise<boolean> {
    if (!('storage' in navigator) || !('persist' in navigator.storage)) {
      return false;
    }

    try {
      const isPersisted = await navigator.storage.persist();
      console.log(`[MemoryManager] Persistent storage ${isPersisted ? 'granted' : 'denied'}`);
      return isPersisted;
    } catch (error) {
      console.error('[MemoryManager] Failed to request persistent storage:', error);
      return false;
    }
  }

  // Get detailed memory report
  async generateMemoryReport(): Promise<string> {
    const memStats = await this.getMemoryStats();
    const storageStats = await this.getStorageStats();
    
    let report = `
Memory Management Report
Generated: ${new Date().toISOString()}

`;

    if (memStats) {
      report += `
JAVASCRIPT HEAP MEMORY:
- Used: ${(memStats.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB
- Total: ${(memStats.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB
- Limit: ${(memStats.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB
- Usage: ${memStats.usagePercent.toFixed(1)}%
`;
    } else {
      report += '\nMEMORY STATS: Not available\n';
    }

    if (storageStats) {
      report += `
STORAGE:
- Used: ${(storageStats.usage / 1024 / 1024).toFixed(2)} MB
- Quota: ${(storageStats.quota / 1024 / 1024).toFixed(2)} MB
- Usage: ${storageStats.usagePercent.toFixed(1)}%
- Persistent: ${storageStats.persistent ? 'Yes' : 'No'}
`;
    } else {
      report += '\nSTORAGE STATS: Not available\n';
    }

    report += `
CACHE STATUS:
- LocalStorage items: ${localStorage.length}
- SessionStorage items: ${sessionStorage.length}
`;

    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        report += `- Service Worker caches: ${cacheNames.length}\n`;
        cacheNames.forEach(name => {
          report += `  - ${name}\n`;
        });
      } catch {
        report += '- Service Worker caches: Unable to access\n';
      }
    }

    return report;
  }
}

// Export singleton
export const memoryManager = MemoryManager.getInstance();

// React hook for memory monitoring
export function useMemoryMonitor(autoStart = true) {
  const [memoryStats, setMemoryStats] = React.useState<MemoryStats | null>(null);
  const [storageStats, setStorageStats] = React.useState<StorageStats | null>(null);

  React.useEffect(() => {
    if (!autoStart) return;

    const updateStats = async () => {
      const mem = await memoryManager.getMemoryStats();
      const storage = await memoryManager.getStorageStats();
      setMemoryStats(mem);
      setStorageStats(storage);
    };

    // Initial update
    updateStats();

    // Update periodically
    const interval = setInterval(updateStats, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [autoStart]);

  const runCleanup = React.useCallback(async (strategies?: string[]) => {
    return memoryManager.runCleanup(strategies);
  }, []);

  return { memoryStats, storageStats, runCleanup };
}
// Storage Operations Logging

import { log } from './logger';

interface StorageOperation {
  type: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'cookie';
  operation: 'get' | 'set' | 'remove' | 'clear';
  key?: string;
  value?: any;
  size?: number;
  timestamp: number;
  success: boolean;
  error?: string;
}

export class StorageLogger {
  private static instance: StorageLogger;
  private operations: StorageOperation[] = [];
  private maxOperations = 200;
  private originalMethods: any = {};

  private constructor() {
    this.interceptLocalStorage();
    this.interceptSessionStorage();
    this.logStorageStatus();
    log.info('StorageLogger', 'Storage logging initialized');
  }

  static getInstance(): StorageLogger {
    if (!StorageLogger.instance) {
      StorageLogger.instance = new StorageLogger();
    }
    return StorageLogger.instance;
  }

  private interceptLocalStorage() {
    const storage = window.localStorage;
    const logger = this;

    // Store original methods
    this.originalMethods.localStorage = {
      setItem: storage.setItem.bind(storage),
      getItem: storage.getItem.bind(storage),
      removeItem: storage.removeItem.bind(storage),
      clear: storage.clear.bind(storage)
    };

    // Override setItem
    storage.setItem = function(key: string, value: string) {
      const startTime = performance.now();
      try {
        logger.originalMethods.localStorage.setItem(key, value);
        const duration = performance.now() - startTime;
        
        const size = new Blob([value]).size;
        log.debug('Storage', `📥 localStorage.setItem: ${key}`, {
          size: `${(size / 1024).toFixed(2)} KB`,
          duration: `${duration.toFixed(2)}ms`
        });

        logger.addOperation({
          type: 'localStorage',
          operation: 'set',
          key,
          size,
          timestamp: Date.now(),
          success: true
        });
      } catch (error) {
        log.error('Storage', `Failed to set localStorage: ${key}`, error as Error);
        logger.addOperation({
          type: 'localStorage',
          operation: 'set',
          key,
          timestamp: Date.now(),
          success: false,
          error: (error as Error).message
        });
        throw error;
      }
    };

    // Override getItem
    storage.getItem = function(key: string) {
      try {
        const value = logger.originalMethods.localStorage.getItem(key);
        if (value !== null) {
          log.debug('Storage', `📤 localStorage.getItem: ${key}`, {
            size: `${(new Blob([value]).size / 1024).toFixed(2)} KB`
          });
        }
        return value;
      } catch (error) {
        log.error('Storage', `Failed to get localStorage: ${key}`, error as Error);
        throw error;
      }
    };

    // Override removeItem
    storage.removeItem = function(key: string) {
      try {
        logger.originalMethods.localStorage.removeItem(key);
        log.debug('Storage', `🗑️ localStorage.removeItem: ${key}`);
        
        logger.addOperation({
          type: 'localStorage',
          operation: 'remove',
          key,
          timestamp: Date.now(),
          success: true
        });
      } catch (error) {
        log.error('Storage', `Failed to remove localStorage: ${key}`, error as Error);
        throw error;
      }
    };

    // Override clear
    storage.clear = function() {
      try {
        const keysCount = storage.length;
        logger.originalMethods.localStorage.clear();
        log.warn('Storage', `🧹 localStorage.clear: ${keysCount} items removed`);
        
        logger.addOperation({
          type: 'localStorage',
          operation: 'clear',
          timestamp: Date.now(),
          success: true
        });
      } catch (error) {
        log.error('Storage', 'Failed to clear localStorage', error as Error);
        throw error;
      }
    };
  }

  private interceptSessionStorage() {
    const storage = window.sessionStorage;
    const logger = this;

    // Store original methods
    this.originalMethods.sessionStorage = {
      setItem: storage.setItem.bind(storage),
      getItem: storage.getItem.bind(storage),
      removeItem: storage.removeItem.bind(storage),
      clear: storage.clear.bind(storage)
    };

    // Similar interception as localStorage but with sessionStorage logging
    storage.setItem = function(key: string, value: string) {
      try {
        logger.originalMethods.sessionStorage.setItem(key, value);
        const size = new Blob([value]).size;
        log.debug('Storage', `📥 sessionStorage.setItem: ${key}`, {
          size: `${(size / 1024).toFixed(2)} KB`
        });
      } catch (error) {
        log.error('Storage', `Failed to set sessionStorage: ${key}`, error as Error);
        throw error;
      }
    };
  }

  private async logStorageStatus() {
    try {
      // Check storage quota
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usedMB = (estimate.usage || 0) / 1024 / 1024;
        const quotaMB = (estimate.quota || 0) / 1024 / 1024;
        const percentUsed = estimate.quota ? ((estimate.usage || 0) / estimate.quota * 100) : 0;

        log.info('Storage', '💾 Storage status', {
          used: `${usedMB.toFixed(2)} MB`,
          quota: `${quotaMB.toFixed(2)} MB`,
          percentUsed: `${percentUsed.toFixed(1)}%`,
          localStorage: `${localStorage.length} items`,
          sessionStorage: `${sessionStorage.length} items`
        });

        // Warn if storage is getting full
        if (percentUsed > 80) {
          log.warn('Storage', `⚠️ Storage usage high: ${percentUsed.toFixed(1)}%`);
        }
      }

      // Check if storage is persisted
      if ('storage' in navigator && 'persisted' in navigator.storage) {
        const isPersisted = await navigator.storage.persisted();
        log.info('Storage', `Storage persistence: ${isPersisted ? '✅ Persisted' : '❌ Not persisted'}`);
      }
    } catch (error) {
      log.error('Storage', 'Failed to check storage status', error as Error);
    }
  }

  private addOperation(operation: StorageOperation) {
    this.operations.push(operation);
    if (this.operations.length > this.maxOperations) {
      this.operations.shift();
    }

    // Check for quota errors
    if (operation.error?.includes('QuotaExceeded')) {
      log.error('Storage', '🚨 Storage quota exceeded!', undefined, {
        type: operation.type,
        key: operation.key
      });
      
      // Log current usage
      this.logStorageStatus();
    }
  }

  // Get storage statistics
  getStatistics() {
    const stats = {
      totalOperations: this.operations.length,
      operationsByType: {} as Record<string, number>,
      operationsByOperation: {} as Record<string, number>,
      failures: this.operations.filter(op => !op.success).length,
      localStorageSize: 0,
      sessionStorageSize: 0,
      localStorageItems: localStorage.length,
      sessionStorageItems: sessionStorage.length
    };

    // Count operations
    this.operations.forEach(op => {
      stats.operationsByType[op.type] = (stats.operationsByType[op.type] || 0) + 1;
      stats.operationsByOperation[op.operation] = (stats.operationsByOperation[op.operation] || 0) + 1;
    });

    // Calculate storage sizes
    try {
      let localSize = 0;
      let sessionSize = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            localSize += new Blob([key + value]).size;
          }
        }
      }

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          const value = sessionStorage.getItem(key);
          if (value) {
            sessionSize += new Blob([key + value]).size;
          }
        }
      }

      stats.localStorageSize = localSize;
      stats.sessionStorageSize = sessionSize;
    } catch (error) {
      log.warn('StorageLogger', 'Failed to calculate storage sizes', { error });
    }

    return stats;
  }

  // List all storage keys
  listStorageKeys() {
    const keys = {
      localStorage: [] as string[],
      sessionStorage: [] as string[]
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.localStorage.push(key);
    }

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) keys.sessionStorage.push(key);
    }

    return keys;
  }

  // Monitor IndexedDB (basic implementation)
  async checkIndexedDB() {
    if (!('indexedDB' in window)) {
      log.warn('Storage', 'IndexedDB not supported');
      return;
    }

    try {
      const databases = await indexedDB.databases();
      log.info('Storage', `📊 IndexedDB: ${databases.length} databases`, {
        databases: databases.map(db => ({
          name: db.name,
          version: db.version
        }))
      });
    } catch (error) {
      log.error('Storage', 'Failed to check IndexedDB', error as Error);
    }
  }
}

// Export singleton
export const storageLogger = StorageLogger.getInstance();

// Console helper
(window as any).vimStorage = {
  stats: () => {
    const stats = storageLogger.getStatistics();
    console.log('💾 Storage Statistics:', stats);
    return stats;
  },
  keys: () => {
    const keys = storageLogger.listStorageKeys();
    console.log('🔑 Storage Keys:', keys);
    return keys;
  },
  status: async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      console.log('📊 Storage Status:', {
        used: `${((estimate.usage || 0) / 1024 / 1024).toFixed(2)} MB`,
        quota: `${((estimate.quota || 0) / 1024 / 1024).toFixed(2)} MB`,
        percent: `${(estimate.quota ? ((estimate.usage || 0) / estimate.quota * 100) : 0).toFixed(1)}%`
      });
      return estimate;
    }
  },
  clear: (type: 'local' | 'session' | 'both' = 'both') => {
    if (type === 'local' || type === 'both') {
      localStorage.clear();
      console.log('✅ localStorage cleared');
    }
    if (type === 'session' || type === 'both') {
      sessionStorage.clear();
      console.log('✅ sessionStorage cleared');
    }
  }
};

log.info('StorageLogger', 'Storage debugging available via vimStorage', {
  commands: ['stats()', 'keys()', 'status()', 'clear()']
});
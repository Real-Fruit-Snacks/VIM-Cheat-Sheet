// Network Request Logging

import { log } from './logger';
import { track } from './actionTracker';

interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status?: number;
  statusText?: string;
  size?: number;
  error?: string;
  cached?: boolean;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
}

export class NetworkLogger {
  private static instance: NetworkLogger;
  private requests: Map<string, NetworkRequest> = new Map();
  private requestHistory: NetworkRequest[] = [];
  private maxHistory = 200;
  private originalFetch?: typeof fetch;

  private constructor() {
    this.interceptFetch();
    this.interceptXHR();
    log.info('NetworkLogger', 'Network logging initialized');
  }

  static getInstance(): NetworkLogger {
    if (!NetworkLogger.instance) {
      NetworkLogger.instance = new NetworkLogger();
    }
    return NetworkLogger.instance;
  }

  private interceptFetch() {
    if (this.originalFetch) return;
    
    this.originalFetch = window.fetch;
    const logger = this;

    window.fetch = async function(...args) {
      const [input, init] = args;
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method || 'GET';
      const requestId = logger.generateId();

      // Start tracking
      const request: NetworkRequest = {
        id: requestId,
        url,
        method,
        startTime: performance.now(),
        requestHeaders: init?.headers as any
      };

      logger.requests.set(requestId, request);
      
      log.info('Network', `🌐 ${method} ${url}`, {
        headers: init?.headers,
        mode: init?.mode,
        credentials: init?.credentials
      });

      try {
        const response = await logger.originalFetch!(...args);
        const endTime = performance.now();
        const duration = endTime - request.startTime;

        // Update request info
        request.endTime = endTime;
        request.duration = duration;
        request.status = response.status;
        request.statusText = response.statusText;
        request.cached = response.headers.get('x-cache') === 'HIT';
        request.responseHeaders = Object.fromEntries(response.headers.entries());

        // Try to get response size
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          request.size = parseInt(contentLength);
        }

        // Log based on status
        const logLevel = response.ok ? 'success' : response.status >= 500 ? 'error' : 'warn';
        log[logLevel]('Network', `${response.ok ? '✅' : '❌'} ${method} ${url}`, {
          status: response.status,
          duration: `${duration.toFixed(2)}ms`,
          size: request.size ? `${(request.size / 1024).toFixed(2)} KB` : 'unknown',
          cached: request.cached,
          statusText: response.statusText
        });

        // Track in action tracker
        if (!response.ok) {
          track.error('network-request', new Error(`HTTP ${response.status}`), {
            url,
            status: response.status
          });
        }

        logger.addToHistory(request);
        logger.requests.delete(requestId);

        return response;
      } catch (error) {
        const endTime = performance.now();
        request.endTime = endTime;
        request.duration = endTime - request.startTime;
        request.error = (error as Error).message;

        log.error('Network', `❌ ${method} ${url} failed`, error as Error, {
          duration: `${request.duration.toFixed(2)}ms`,
          message: (error as Error).message
        });

        track.error('network-request', error as Error, { url, method });

        logger.addToHistory(request);
        logger.requests.delete(requestId);

        throw error;
      }
    };
  }

  private interceptXHR() {
    const logger = this;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
      (this as any)._requestId = logger.generateId();
      (this as any)._method = method;
      (this as any)._url = url.toString();
      return originalOpen.apply(this, [method, url, ...args] as any);
    };

    XMLHttpRequest.prototype.send = function(body?: any) {
      const xhr = this as any;
      const requestId = xhr._requestId;
      const method = xhr._method;
      const url = xhr._url;

      const request: NetworkRequest = {
        id: requestId,
        url,
        method,
        startTime: performance.now()
      };

      logger.requests.set(requestId, request);
      
      log.info('Network', `🌐 XHR ${method} ${url}`);

      xhr.addEventListener('load', function() {
        const endTime = performance.now();
        request.endTime = endTime;
        request.duration = endTime - request.startTime;
        request.status = xhr.status;
        request.statusText = xhr.statusText;

        const logLevel = xhr.status >= 200 && xhr.status < 300 ? 'success' : 
                        xhr.status >= 500 ? 'error' : 'warn';
        
        log[logLevel]('Network', `${xhr.status < 300 ? '✅' : '❌'} XHR ${method} ${url}`, {
          status: xhr.status,
          duration: `${request.duration.toFixed(2)}ms`
        });

        logger.addToHistory(request);
        logger.requests.delete(requestId);
      });

      xhr.addEventListener('error', function() {
        const endTime = performance.now();
        request.endTime = endTime;
        request.duration = endTime - request.startTime;
        request.error = 'Network error';

        log.error('Network', `❌ XHR ${method} ${url} failed`, undefined, {
          duration: `${request.duration.toFixed(2)}ms`
        });

        logger.addToHistory(request);
        logger.requests.delete(requestId);
      });

      return originalSend.apply(this, [body]);
    };
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private addToHistory(request: NetworkRequest) {
    this.requestHistory.push(request);
    if (this.requestHistory.length > this.maxHistory) {
      this.requestHistory.shift();
    }

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('network-request', { detail: request }));
  }

  // Get network statistics
  getStatistics() {
    const stats = {
      totalRequests: this.requestHistory.length,
      successfulRequests: this.requestHistory.filter(r => r.status && r.status < 400).length,
      failedRequests: this.requestHistory.filter(r => r.error || (r.status && r.status >= 400)).length,
      cachedRequests: this.requestHistory.filter(r => r.cached).length,
      averageDuration: 0,
      totalDataTransferred: 0,
      requestsByStatus: {} as Record<number, number>,
      requestsByMethod: {} as Record<string, number>,
      slowestRequests: [] as NetworkRequest[]
    };

    let totalDuration = 0;
    let durationCount = 0;

    this.requestHistory.forEach(req => {
      // Duration stats
      if (req.duration) {
        totalDuration += req.duration;
        durationCount++;
      }

      // Data transfer
      if (req.size) {
        stats.totalDataTransferred += req.size;
      }

      // Status codes
      if (req.status) {
        stats.requestsByStatus[req.status] = (stats.requestsByStatus[req.status] || 0) + 1;
      }

      // Methods
      stats.requestsByMethod[req.method] = (stats.requestsByMethod[req.method] || 0) + 1;
    });

    if (durationCount > 0) {
      stats.averageDuration = totalDuration / durationCount;
    }

    // Find slowest requests
    stats.slowestRequests = this.requestHistory
      .filter(r => r.duration)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 5);

    return stats;
  }

  // Get active requests
  getActiveRequests(): NetworkRequest[] {
    return Array.from(this.requests.values());
  }

  // Get request history
  getHistory(filter?: { method?: string; status?: number; minDuration?: number }): NetworkRequest[] {
    let history = [...this.requestHistory];

    if (filter) {
      if (filter.method) {
        history = history.filter(r => r.method === filter.method);
      }
      if (filter.status !== undefined) {
        history = history.filter(r => r.status === filter.status);
      }
      if (filter.minDuration !== undefined) {
        history = history.filter(r => r.duration && r.duration >= filter.minDuration);
      }
    }

    return history;
  }

  // Clear history
  clearHistory() {
    this.requestHistory = [];
    log.info('NetworkLogger', 'Network history cleared');
  }

  // Export network data
  exportNetworkData(): string {
    return JSON.stringify({
      history: this.requestHistory,
      statistics: this.getStatistics(),
      activeRequests: this.getActiveRequests(),
      exportTime: new Date().toISOString()
    }, null, 2);
  }
}

// Export singleton
export const networkLogger = NetworkLogger.getInstance();

// Console helper
(window as any).vimNetwork = {
  stats: () => {
    const stats = networkLogger.getStatistics();
    console.log('📊 Network Statistics:', stats);
    return stats;
  },
  active: () => networkLogger.getActiveRequests(),
  history: (filter?: any) => networkLogger.getHistory(filter),
  slow: () => {
    const slow = networkLogger.getHistory({ minDuration: 1000 });
    console.table(slow.map(r => ({
      url: r.url,
      method: r.method,
      duration: `${r.duration?.toFixed(2)}ms`,
      status: r.status
    })));
    return slow;
  },
  export: () => {
    const data = networkLogger.exportNetworkData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vim-network-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('✅ Network data exported');
  }
};

// Log console helper
log.info('NetworkLogger', 'Network debugging available via vimNetwork', {
  commands: ['stats()', 'active()', 'history()', 'slow()', 'export()']
});
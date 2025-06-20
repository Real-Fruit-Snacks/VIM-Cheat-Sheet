// Health Check and Self-Diagnostic System

import React from 'react';

export interface HealthCheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
  duration?: number;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  checks: HealthCheckResult[];
  timestamp: number;
  recommendations: string[];
}

type HealthCheckFunction = () => Promise<HealthCheckResult>;

export class HealthCheckSystem {
  private static instance: HealthCheckSystem;
  private checks: Map<string, HealthCheckFunction> = new Map();
  private lastHealthStatus: SystemHealth | null = null;
  private healthHistory: SystemHealth[] = [];
  private isMonitoring = false;
  private monitoringInterval: number | null = null;

  private constructor() {
    this.registerDefaultChecks();
  }

  static getInstance(): HealthCheckSystem {
    if (!HealthCheckSystem.instance) {
      HealthCheckSystem.instance = new HealthCheckSystem();
    }
    return HealthCheckSystem.instance;
  }

  private registerDefaultChecks() {
    // Browser compatibility check
    this.registerCheck('browser-compatibility', async () => {
      const start = performance.now();
      
      const required = {
        webAssembly: typeof WebAssembly !== 'undefined',
        sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator,
        secureContext: window.isSecureContext,
        webGL: this.checkWebGL(),
      };

      const allPassed = Object.values(required).every(v => v === true);
      const failedFeatures = Object.entries(required)
        .filter(([_, v]) => !v)
        .map(([k]) => k);

      return {
        name: 'Browser Compatibility',
        status: allPassed ? 'pass' : failedFeatures.length > 2 ? 'fail' : 'warning',
        message: allPassed ? 'All required features supported' : `Missing: ${failedFeatures.join(', ')}`,
        details: required,
        duration: performance.now() - start
      };
    });

    // Memory usage check
    this.registerCheck('memory-usage', async () => {
      const start = performance.now();
      
      if (!('memory' in performance)) {
        return {
          name: 'Memory Usage',
          status: 'warning',
          message: 'Memory monitoring not available',
          duration: performance.now() - start
        };
      }

      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

      let status: 'pass' | 'warning' | 'fail' = 'pass';
      if (usagePercent > 90) status = 'fail';
      else if (usagePercent > 70) status = 'warning';

      return {
        name: 'Memory Usage',
        status,
        message: `${usedMB}MB / ${limitMB}MB (${usagePercent.toFixed(1)}%)`,
        details: {
          usedMB,
          limitMB,
          usagePercent
        },
        duration: performance.now() - start
      };
    });

    // Network connectivity check
    this.registerCheck('network-connectivity', async () => {
      const start = performance.now();
      
      const online = navigator.onLine;
      let latency = -1;

      if (online) {
        try {
          const pingStart = performance.now();
          await fetch('/favicon-simple.svg', { method: 'HEAD', cache: 'no-cache' });
          latency = performance.now() - pingStart;
        } catch {
          // Ignore fetch errors for now
        }
      }

      return {
        name: 'Network Connectivity',
        status: online ? 'pass' : 'fail',
        message: online ? `Online (${latency > 0 ? `${latency.toFixed(0)}ms` : 'checking...'})` : 'Offline',
        details: {
          online,
          latency,
          type: (navigator as any).connection?.effectiveType || 'unknown'
        },
        duration: performance.now() - start
      };
    });

    // Storage availability check
    this.registerCheck('storage-availability', async () => {
      const start = performance.now();
      
      let storageEstimate = { usage: 0, quota: 0 };
      let storageAvailable = true;
      let persistentStorage = false;

      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          storageEstimate = await navigator.storage.estimate();
          
          if ('persist' in navigator.storage) {
            persistentStorage = await navigator.storage.persisted();
          }
        }
      } catch {
        storageAvailable = false;
      }

      const usagePercent = storageEstimate.quota ? 
        (storageEstimate.usage! / storageEstimate.quota) * 100 : 0;

      let status: 'pass' | 'warning' | 'fail' = 'pass';
      if (!storageAvailable) status = 'fail';
      else if (usagePercent > 80) status = 'warning';

      return {
        name: 'Storage Availability',
        status,
        message: storageAvailable ? 
          `${Math.round(storageEstimate.usage! / 1024 / 1024)}MB used (${usagePercent.toFixed(1)}%)` :
          'Storage API not available',
        details: {
          available: storageAvailable,
          persistent: persistentStorage,
          usageMB: Math.round(storageEstimate.usage! / 1024 / 1024),
          quotaMB: Math.round(storageEstimate.quota! / 1024 / 1024),
          usagePercent
        },
        duration: performance.now() - start
      };
    });

    // Service Worker check
    this.registerCheck('service-workers', async () => {
      const start = performance.now();
      
      if (!('serviceWorker' in navigator)) {
        return {
          name: 'Service Workers',
          status: 'fail',
          message: 'Service Workers not supported',
          duration: performance.now() - start
        };
      }

      const registrations = await navigator.serviceWorker.getRegistrations();
      const activeWorkers = registrations.filter(reg => reg.active);

      return {
        name: 'Service Workers',
        status: activeWorkers.length > 0 ? 'pass' : 'warning',
        message: `${activeWorkers.length} active worker(s)`,
        details: {
          registrations: registrations.length,
          active: activeWorkers.length,
          workers: registrations.map(reg => ({
            scope: reg.scope,
            state: reg.active?.state || 'none'
          }))
        },
        duration: performance.now() - start
      };
    });

    // WebAssembly check
    this.registerCheck('webassembly-support', async () => {
      const start = performance.now();
      
      const hasWasm = typeof WebAssembly !== 'undefined';
      let wasmLoadable = false;
      let vimWasmStatus = 'not-checked';

      if (hasWasm) {
        try {
          // Test basic WASM compilation
          const bytes = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
          await WebAssembly.compile(bytes);
          wasmLoadable = true;

          // Check vim.wasm specific
          if (window.__canUseVimWasm) {
            vimWasmStatus = 'enabled';
          } else if (window.__skipVimWasmLoad) {
            vimWasmStatus = 'disabled';
          }
        } catch {
          wasmLoadable = false;
        }
      }

      return {
        name: 'WebAssembly Support',
        status: hasWasm && wasmLoadable ? 'pass' : 'fail',
        message: hasWasm ? 
          (wasmLoadable ? `Supported (vim.wasm: ${vimWasmStatus})` : 'Compilation failed') : 
          'Not supported',
        details: {
          hasWasm,
          wasmLoadable,
          vimWasmStatus
        },
        duration: performance.now() - start
      };
    });

    // Performance metrics check
    this.registerCheck('performance-metrics', async () => {
      const start = performance.now();
      
      const metrics: any = {};
      
      // Get navigation timing
      if (performance.timing) {
        const timing = performance.timing;
        metrics.pageLoad = timing.loadEventEnd - timing.navigationStart;
        metrics.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      }

      // Get resource timing
      const resources = performance.getEntriesByType('resource');
      metrics.totalResources = resources.length;
      metrics.slowResources = resources.filter((r: any) => r.duration > 1000).length;

      // Get paint timing
      const paints = performance.getEntriesByType('paint');
      paints.forEach((paint: any) => {
        metrics[paint.name] = Math.round(paint.startTime);
      });

      let status: 'pass' | 'warning' | 'fail' = 'pass';
      if (metrics.pageLoad > 10000) status = 'fail';
      else if (metrics.pageLoad > 5000) status = 'warning';

      return {
        name: 'Performance Metrics',
        status,
        message: `Page load: ${metrics.pageLoad || 'N/A'}ms`,
        details: metrics,
        duration: performance.now() - start
      };
    });

    // Critical resources check
    this.registerCheck('critical-resources', async () => {
      const start = performance.now();
      
      const criticalResources = [
        { name: 'Main App', check: () => !!window.React },
        { name: 'Editor Loaded', check: () => !!(window as any).monaco || !!window.__vimWasmLoaded },
        { name: 'Service Worker', check: () => !!navigator.serviceWorker?.controller },
      ];

      const results = criticalResources.map(resource => ({
        ...resource,
        loaded: resource.check()
      }));

      const allLoaded = results.every(r => r.loaded);
      const loadedCount = results.filter(r => r.loaded).length;

      return {
        name: 'Critical Resources',
        status: allLoaded ? 'pass' : loadedCount === 0 ? 'fail' : 'warning',
        message: `${loadedCount}/${results.length} resources loaded`,
        details: results,
        duration: performance.now() - start
      };
    });
  }

  private checkWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  registerCheck(name: string, check: HealthCheckFunction) {
    this.checks.set(name, check);
  }

  async runAllChecks(): Promise<SystemHealth> {
    const results: HealthCheckResult[] = [];
    
    for (const [name, check] of this.checks) {
      try {
        const result = await check();
        results.push(result);
      } catch (error) {
        results.push({
          name,
          status: 'fail',
          message: `Check failed: ${error}`,
          details: { error: String(error) }
        });
      }
    }

    const failedChecks = results.filter(r => r.status === 'fail').length;
    const warningChecks = results.filter(r => r.status === 'warning').length;

    let overall: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (failedChecks > 2 || (failedChecks > 0 && results.length < 5)) {
      overall = 'critical';
    } else if (failedChecks > 0 || warningChecks > 2) {
      overall = 'degraded';
    }

    const recommendations = this.generateRecommendations(results);

    const health: SystemHealth = {
      overall,
      checks: results,
      timestamp: Date.now(),
      recommendations
    };

    this.lastHealthStatus = health;
    this.healthHistory.push(health);
    if (this.healthHistory.length > 100) {
      this.healthHistory.shift();
    }

    return health;
  }

  private generateRecommendations(results: HealthCheckResult[]): string[] {
    const recommendations: string[] = [];

    results.forEach(result => {
      if (result.status === 'fail') {
        switch (result.name) {
          case 'Browser Compatibility':
            recommendations.push('Consider using Chrome, Firefox, or Edge for best compatibility');
            break;
          case 'Memory Usage':
            recommendations.push('Close unused tabs or restart the browser to free memory');
            break;
          case 'Network Connectivity':
            recommendations.push('Check your internet connection');
            break;
          case 'Storage Availability':
            recommendations.push('Clear browser cache and unused data');
            break;
          case 'WebAssembly Support':
            recommendations.push('Update your browser or use Monaco editor fallback');
            break;
        }
      } else if (result.status === 'warning') {
        switch (result.name) {
          case 'Memory Usage':
            if (result.details?.usagePercent > 70) {
              recommendations.push('Memory usage is high, consider saving your work');
            }
            break;
          case 'Storage Availability':
            if (result.details?.usagePercent > 80) {
              recommendations.push('Storage is nearly full, consider clearing old data');
            }
            break;
        }
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  startMonitoring(intervalMs: number = 60000) {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = window.setInterval(async () => {
      const health = await this.runAllChecks();
      
      // Notify if health degrades
      if (this.lastHealthStatus && health.overall !== this.lastHealthStatus.overall) {
        window.dispatchEvent(new CustomEvent('health-status-changed', {
          detail: { 
            previous: this.lastHealthStatus.overall, 
            current: health.overall,
            health 
          }
        }));
      }

      // Log critical issues
      if (health.overall === 'critical') {
        console.error('[HealthCheck] System health is critical:', health);
      }
    }, intervalMs);

    // Run initial check
    this.runAllChecks();
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
  }

  getLastHealth(): SystemHealth | null {
    return this.lastHealthStatus;
  }

  getHealthHistory(): SystemHealth[] {
    return [...this.healthHistory];
  }

  // Generate diagnostic report
  async generateDiagnosticReport(): Promise<string> {
    const health = await this.runAllChecks();
    const browserInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      doNotTrack: navigator.doNotTrack,
    };

    const report = `
VIM Editor Diagnostic Report
Generated: ${new Date().toISOString()}

SYSTEM HEALTH: ${health.overall.toUpperCase()}

HEALTH CHECKS:
${health.checks.map(check => 
  `- ${check.name}: ${check.status.toUpperCase()} - ${check.message}`
).join('\n')}

BROWSER INFORMATION:
${Object.entries(browserInfo).map(([key, value]) => 
  `- ${key}: ${value}`
).join('\n')}

RECOMMENDATIONS:
${health.recommendations.length > 0 ? 
  health.recommendations.map(r => `- ${r}`).join('\n') : 
  '- No issues detected'}

DETAILED CHECK RESULTS:
${JSON.stringify(health.checks, null, 2)}
`;

    return report;
  }
}

// Export singleton
export const healthCheck = HealthCheckSystem.getInstance();

// React hook for health monitoring
export function useHealthCheck(autoStart = true, interval = 60000) {
  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (autoStart) {
      // Initial check
      healthCheck.runAllChecks().then(setHealth).finally(() => setLoading(false));

      // Start monitoring
      healthCheck.startMonitoring(interval);

      // Listen for health changes
      const handleHealthChange = (event: any) => {
        setHealth(event.detail.health);
      };

      window.addEventListener('health-status-changed', handleHealthChange);

      return () => {
        window.removeEventListener('health-status-changed', handleHealthChange);
      };
    }
  }, [autoStart, interval]);

  const runCheck = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await healthCheck.runAllChecks();
      setHealth(result);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { health, loading, runCheck };
}
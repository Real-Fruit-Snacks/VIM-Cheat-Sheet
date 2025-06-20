// Initialize all resilience systems

import React from 'react';
import { log } from './logger';
import { errorRecovery } from './errorRecovery';
import { resourceLoader } from './resourceLoader';
import { healthCheck } from './healthCheck';
import { featureFlags } from './featureFlags';
import { memoryManager } from './memoryManager';
import { serviceWorkerManager } from './serviceWorkerManager';
import { browserCompat } from './browserCompatibility';

export interface ResilienceConfig {
  enableErrorRecovery?: boolean;
  enableOfflineSupport?: boolean;
  enableHealthMonitoring?: boolean;
  enableMemoryManagement?: boolean;
  enableFeatureFlags?: boolean;
  healthCheckInterval?: number;
  memoryCheckInterval?: number;
  remoteConfigUrl?: string;
  gitlabToken?: string;
}

export class ResilienceSystem {
  private initialized = false;
  private config: ResilienceConfig;

  constructor(config: ResilienceConfig = {}) {
    this.config = {
      enableErrorRecovery: true,
      enableOfflineSupport: true,
      enableHealthMonitoring: true,
      enableMemoryManagement: true,
      enableFeatureFlags: true,
      healthCheckInterval: 60000, // 1 minute
      memoryCheckInterval: 30000, // 30 seconds
      ...config
    };
  }

  async initialize() {
    if (this.initialized) {
      log.warn('Resilience', 'Already initialized');
      return;
    }

    log.info('Resilience', '🚀 Starting resilience system initialization...', {
      config: this.config,
      timestamp: new Date().toISOString()
    });
    const startTime = performance.now();

    try {
      // 1. Check browser compatibility first
      log.info('Resilience', '1️⃣ Checking browser compatibility...');
      const compatReport = browserCompat.generateReport();
      const canUseVimWasm = browserCompat.canUseVimWasm();
      
      log[canUseVimWasm ? 'success' : 'warn'](
        'Resilience', 
        `Browser compatibility: ${canUseVimWasm ? 'Full support ✅' : 'Fallback mode ⚠️'}`,
        {
          capabilities: browserCompat.getCapabilities(),
          issues: browserCompat.getIssues()
        }
      );

      // 2. Initialize feature flags
      if (this.config.enableFeatureFlags) {
        log.info('Resilience', '2️⃣ Setting up feature flags...');
        
        // Apply browser-specific flags
        if (!canUseVimWasm) {
          log.warn('Resilience', 'Browser incompatible with vim.wasm, enabling fallback');
          featureFlags.setOverride('vim-wasm', false, 'Browser incompatible');
          featureFlags.setOverride('monaco-fallback', true, 'Browser requires fallback');
        }

        // Set up remote config if provided
        if (this.config.remoteConfigUrl) {
          log.info('Resilience', 'Setting up remote feature flag sync', {
            url: this.config.remoteConfigUrl
          });
          featureFlags.syncWithRemote(this.config.remoteConfigUrl);
          featureFlags.startRemoteSync();
        }
        
        log.success('Resilience', 'Feature flags configured', {
          totalFlags: featureFlags.getAllFlags().length,
          overrides: featureFlags.getOverrides().length
        });
      }

      // 3. Initialize error recovery
      if (this.config.enableErrorRecovery && featureFlags.isEnabled('auto-recovery')) {
        log.info('Resilience', '3️⃣ Error recovery system activating...');
        log.success('Resilience', 'Error recovery active and monitoring');
      }

      // 4. Set up service workers
      if (this.config.enableOfflineSupport && featureFlags.isEnabled('service-workers')) {
        log.info('Resilience', '4️⃣ Registering service workers...');
        
        // Register offline service worker
        if ('serviceWorker' in navigator) {
          try {
            const offlineReg = await navigator.serviceWorker.register('/offline-service-worker.js', {
              scope: '/'
            });
            log.success('Resilience', 'Offline service worker registered', {
              scope: offlineReg.scope,
              state: offlineReg.active?.state || 'installing'
            });
          } catch (error) {
            log.error('Resilience', 'Offline SW registration failed', error as Error);
          }
        } else {
          log.warn('Resilience', 'Service workers not supported in this browser');
        }

        // Initialize authenticated service worker manager
        await serviceWorkerManager.initialize(this.config.gitlabToken);
      } else {
        log.info('Resilience', 'Service workers disabled or not supported');
      }

      // 5. Preload critical resources
      if (featureFlags.isEnabled('prefetch-resources')) {
        log.info('Resilience', '5️⃣ Preloading critical resources...');
        resourceLoader.preloadCriticalResources()
          .then(() => log.success('Resilience', 'Critical resources preloaded'))
          .catch(err => log.error('Resilience', 'Failed to preload resources', err));
      }

      // 6. Start health monitoring
      if (this.config.enableHealthMonitoring) {
        log.info('Resilience', '6️⃣ Starting health monitoring...', {
          interval: `${this.config.healthCheckInterval}ms`
        });
        healthCheck.startMonitoring(this.config.healthCheckInterval);
        
        // Listen for health degradation
        window.addEventListener('health-status-changed', (event: any) => {
          const { current, previous } = event.detail;
          
          log[current === 'critical' ? 'error' : 'warn'](
            'Resilience',
            `Health status changed: ${previous} → ${current}`,
            event.detail
          );
          
          if (current === 'critical' && previous !== 'critical') {
            log.error('Resilience', '🚨 System health is CRITICAL!');
            
            // Enable minimal mode if health is critical
            if (featureFlags.isEnabled('auto-recovery')) {
              log.warn('Resilience', 'Enabling minimal mode due to critical health');
              featureFlags.enableMinimalMode();
            }
          }
        });
        
        log.success('Resilience', 'Health monitoring active');
      }

      // 7. Start memory management
      if (this.config.enableMemoryManagement) {
        log.info('Resilience', '7️⃣ Starting memory management...', {
          interval: `${this.config.memoryCheckInterval}ms`
        });
        memoryManager.startMonitoring(this.config.memoryCheckInterval);
        
        // Request persistent storage
        memoryManager.requestPersistentStorage()
          .then(granted => {
            log[granted ? 'success' : 'warn'](
              'Resilience',
              `Persistent storage ${granted ? 'granted ✅' : 'denied ❌'}`
            );
          })
          .catch(err => log.error('Resilience', 'Failed to request persistent storage', err));
        
        log.success('Resilience', 'Memory management active');
      }

      // 8. Set up emergency controls
      log.info('Resilience', '8️⃣ Setting up emergency controls...');
      this.setupEmergencyControls();
      log.success('Resilience', 'Emergency controls ready (Ctrl+Shift+E/M)');

      // 9. Run initial health check
      log.info('Resilience', '9️⃣ Running initial system health check...');
      const health = await healthCheck.runAllChecks();
      
      log[health.overall === 'healthy' ? 'success' : health.overall === 'degraded' ? 'warn' : 'error'](
        'Resilience',
        `Initial health status: ${health.overall.toUpperCase()}`,
        {
          checks: health.checks.length,
          passed: health.checks.filter(c => c.status === 'pass').length,
          failed: health.checks.filter(c => c.status === 'fail').length,
          warnings: health.checks.filter(c => c.status === 'warning').length
        }
      );

      this.initialized = true;
      const initTime = performance.now() - startTime;
      
      log.success('Resilience', `✨ Initialization complete in ${initTime.toFixed(2)}ms`, {
        health: health.overall,
        browserSupport: canUseVimWasm,
        features: {
          errorRecovery: this.config.enableErrorRecovery,
          offlineSupport: this.config.enableOfflineSupport,
          healthMonitoring: this.config.enableHealthMonitoring,
          memoryManagement: this.config.enableMemoryManagement,
          featureFlags: this.config.enableFeatureFlags
        }
      });

      // Dispatch ready event
      window.dispatchEvent(new CustomEvent('resilience-ready', {
        detail: {
          health: health.overall,
          browserSupport: canUseVimWasm,
          initTime
        }
      }));

    } catch (error) {
      const errorTime = performance.now() - startTime;
      log.error('Resilience', `Initialization failed after ${errorTime.toFixed(2)}ms`, error as Error);
      
      // Fallback to minimal mode
      log.warn('Resilience', 'Falling back to minimal mode');
      featureFlags.enableMinimalMode();
      
      throw error;
    }
  }

  private setupEmergencyControls() {
    // Keyboard shortcuts for emergency actions
    document.addEventListener('keydown', (event) => {
      // Ctrl+Shift+R+E = Reset Everything
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        const lastPress = (window as any).__lastEmergencyPress || 0;
        const now = Date.now();
        
        if (now - lastPress < 500) { // Double press within 500ms
          console.warn('[Resilience] Emergency reset triggered!');
          this.emergencyReset();
        }
        
        (window as any).__lastEmergencyPress = now;
      }
      
      // Ctrl+Shift+M = Minimal Mode
      if (event.ctrlKey && event.shiftKey && event.key === 'M') {
        console.warn('[Resilience] Minimal mode triggered!');
        featureFlags.enableMinimalMode();
      }
    });

    // Console commands
    (window as any).resilience = {
      reset: () => this.emergencyReset(),
      minimalMode: () => featureFlags.enableMinimalMode(),
      health: () => healthCheck.generateDiagnosticReport().then(console.log),
      memory: () => memoryManager.generateMemoryReport().then(console.log),
      flags: () => console.log(featureFlags.generateReport()),
      cleanup: () => memoryManager.runCleanup(),
      diagnose: () => this.runFullDiagnostics()
    };

    console.log('[Resilience] Emergency controls available via console.resilience');
  }

  private async emergencyReset() {
    console.log('[Resilience] Performing emergency reset...');
    
    // 1. Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // 2. Clear all caches
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
    }
    
    // 3. Unregister service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
    }
    
    // 4. Reset feature flags
    featureFlags.resetToDefaults();
    
    // 5. Reload
    window.location.reload();
  }

  async runFullDiagnostics() {
    console.log('[Resilience] Running full diagnostics...');
    
    const results: any = {
      timestamp: new Date().toISOString(),
      browser: browserCompat.generateReport(),
      health: await healthCheck.generateDiagnosticReport(),
      memory: await memoryManager.generateMemoryReport(),
      flags: featureFlags.generateReport(),
      errors: errorRecovery.getErrorLog()
    };

    // Create downloadable report
    const blob = new Blob([JSON.stringify(results, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vim-diagnostics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('[Resilience] Diagnostics complete - report downloaded');
    return results;
  }

  // Public API
  isHealthy(): boolean {
    const health = healthCheck.getLastHealth();
    return health ? health.overall !== 'critical' : true;
  }

  getStatus() {
    return {
      initialized: this.initialized,
      health: healthCheck.getLastHealth()?.overall || 'unknown',
      browserSupport: browserCompat.canUseVimWasm(),
      offlineReady: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller,
      errors: errorRecovery.getErrorLog().length
    };
  }
}

// Auto-initialize on import
let resilienceInstance: ResilienceSystem | null = null;

export async function initializeResilience(config?: ResilienceConfig) {
  if (!resilienceInstance) {
    resilienceInstance = new ResilienceSystem(config);
    await resilienceInstance.initialize();
  }
  return resilienceInstance;
}

// React hook for resilience status
export function useResilience() {
  const [status, setStatus] = React.useState(() => 
    resilienceInstance?.getStatus() || {
      initialized: false,
      health: 'unknown',
      browserSupport: false,
      offlineReady: false,
      errors: 0
    }
  );

  React.useEffect(() => {
    if (!resilienceInstance) return;

    const updateStatus = () => {
      setStatus(resilienceInstance!.getStatus());
    };

    // Update on health changes
    window.addEventListener('health-status-changed', updateStatus);
    window.addEventListener('resilience-ready', updateStatus);

    // Update periodically
    const interval = setInterval(updateStatus, 10000);

    return () => {
      window.removeEventListener('health-status-changed', updateStatus);
      window.removeEventListener('resilience-ready', updateStatus);
      clearInterval(interval);
    };
  }, []);

  return status;
}
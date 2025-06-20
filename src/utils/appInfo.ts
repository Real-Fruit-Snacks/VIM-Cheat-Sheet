// Application Information and Environment Detection

import { log } from './logger';

export interface AppInfo {
  version: string;
  buildTime: string;
  gitCommit: string;
  environment: 'development' | 'production' | 'staging';
  buildNumber: string;
  branch: string;
}

export interface RuntimeInfo {
  startTime: number;
  sessionId: string;
  previousCrash: boolean;
  lastCrashTime?: number;
  crashCount: number;
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  screen: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  memory?: {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
}

export class AppInfoManager {
  private static instance: AppInfoManager;
  private appInfo: AppInfo;
  private runtimeInfo: RuntimeInfo;

  private constructor() {
    this.appInfo = this.detectAppInfo();
    this.runtimeInfo = this.detectRuntimeInfo();
    this.checkPreviousCrash();
    this.logStartupInfo();
    this.markSessionStart();
  }

  static getInstance(): AppInfoManager {
    if (!AppInfoManager.instance) {
      AppInfoManager.instance = new AppInfoManager();
    }
    return AppInfoManager.instance;
  }

  private detectAppInfo(): AppInfo {
    // These would normally be injected during build
    return {
      version: import.meta.env.VITE_APP_VERSION || '1.0.0-dev',
      buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
      gitCommit: import.meta.env.VITE_GIT_COMMIT || 'unknown',
      environment: (import.meta.env.MODE || 'development') as any,
      buildNumber: import.meta.env.VITE_BUILD_NUMBER || 'local',
      branch: import.meta.env.VITE_GIT_BRANCH || 'unknown'
    };
  }

  private detectRuntimeInfo(): RuntimeInfo {
    const nav = navigator as any;
    
    return {
      startTime: Date.now(),
      sessionId: this.generateSessionId(),
      previousCrash: false, // Will be updated
      crashCount: 0, // Will be updated
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        devicePixelRatio: window.devicePixelRatio || 1
      },
      memory: {
        deviceMemory: nav.deviceMemory,
        hardwareConcurrency: nav.hardwareConcurrency
      },
      connection: nav.connection ? {
        effectiveType: nav.connection.effectiveType,
        downlink: nav.connection.downlink,
        rtt: nav.connection.rtt,
        saveData: nav.connection.saveData
      } : undefined
    };
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private checkPreviousCrash() {
    try {
      const lastSession = localStorage.getItem('vim-last-session');
      const crashCount = parseInt(localStorage.getItem('vim-crash-count') || '0');
      
      if (lastSession) {
        const session = JSON.parse(lastSession);
        const timeSinceLastSession = Date.now() - session.time;
        
        // If last session wasn't properly closed (no end time) and was recent
        if (!session.endTime && timeSinceLastSession < 30000) { // 30 seconds
          this.runtimeInfo.previousCrash = true;
          this.runtimeInfo.lastCrashTime = session.time;
          this.runtimeInfo.crashCount = crashCount + 1;
          
          localStorage.setItem('vim-crash-count', String(crashCount + 1));
          
          log.error('AppInfo', '💥 Previous session crashed!', undefined, {
            lastSessionTime: new Date(session.time).toLocaleString(),
            timeSincecrash: `${Math.round(timeSinceLastSession / 1000)}s ago`,
            totalCrashes: crashCount + 1,
            sessionId: session.id
          });
        } else {
          this.runtimeInfo.crashCount = crashCount;
        }
      }
    } catch (error) {
      log.warn('AppInfo', 'Failed to check previous crash', { error });
    }
  }

  private markSessionStart() {
    try {
      localStorage.setItem('vim-last-session', JSON.stringify({
        id: this.runtimeInfo.sessionId,
        time: this.runtimeInfo.startTime,
        version: this.appInfo.version
      }));
      
      // Set up cleanup on proper exit
      window.addEventListener('beforeunload', () => {
        this.markSessionEnd();
      });
    } catch (error) {
      log.warn('AppInfo', 'Failed to mark session start', { error });
    }
  }

  private markSessionEnd() {
    try {
      const session = JSON.parse(localStorage.getItem('vim-last-session') || '{}');
      session.endTime = Date.now();
      session.duration = Date.now() - this.runtimeInfo.startTime;
      localStorage.setItem('vim-last-session', JSON.stringify(session));
    } catch {
      // Ignore errors during cleanup
    }
  }

  private logStartupInfo() {
    const info = this.getFullInfo();
    
    // Log banner with version
    console.log(
      `%c🚀 VIM Editor v${info.app.version}`,
      'color: #22C55E; font-size: 20px; font-weight: bold; padding: 10px',
      `\n\nBuild: ${info.app.buildTime}`,
      `\nCommit: ${info.app.gitCommit}`,
      `\nEnvironment: ${info.app.environment}`,
      `\nSession: ${info.runtime.sessionId}`
    );

    // Log detailed info
    log.info('AppInfo', 'Application started', {
      app: info.app,
      runtime: {
        sessionId: info.runtime.sessionId,
        userAgent: info.runtime.userAgent,
        platform: info.runtime.platform,
        language: info.runtime.language,
        timezone: info.runtime.timezone,
        screen: info.runtime.screen,
        memory: info.runtime.memory,
        connection: info.runtime.connection
      }
    });

    // Log crash recovery if applicable
    if (info.runtime.previousCrash) {
      log.warn('AppInfo', '🔄 Recovering from previous crash', {
        crashCount: info.runtime.crashCount,
        lastCrashTime: info.runtime.lastCrashTime
      });
    }

    // Log performance entry
    this.logPerformanceMetrics();
  }

  private logPerformanceMetrics() {
    // Wait for page load
    if (document.readyState === 'complete') {
      this.logPageLoadMetrics();
    } else {
      window.addEventListener('load', () => this.logPageLoadMetrics());
    }
  }

  private logPageLoadMetrics() {
    if (!('performance' in window)) return;

    const perf = performance as any;
    const timing = perf.timing;
    const navigation = perf.navigation;

    if (timing) {
      const metrics = {
        // Navigation type
        navigationType: ['navigate', 'reload', 'back_forward', 'prerender'][navigation.type] || 'unknown',
        
        // Key timings
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        domProcessing: timing.domComplete - timing.domLoading,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        
        // First paint metrics
        firstPaint: 0,
        firstContentfulPaint: 0
      };

      // Get paint metrics
      const paintEntries = perf.getEntriesByType('paint');
      paintEntries.forEach((entry: any) => {
        if (entry.name === 'first-paint') {
          metrics.firstPaint = Math.round(entry.startTime);
        } else if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = Math.round(entry.startTime);
        }
      });

      log.info('AppInfo', '📊 Page load performance', metrics);

      // Log warnings for slow metrics
      if (metrics.loadComplete > 3000) {
        log.warn('AppInfo', 'Slow page load detected', {
          loadTime: `${metrics.loadComplete}ms`,
          threshold: '3000ms'
        });
      }
    }
  }

  getAppInfo(): AppInfo {
    return { ...this.appInfo };
  }

  getRuntimeInfo(): RuntimeInfo {
    return { ...this.runtimeInfo };
  }

  getFullInfo() {
    return {
      app: this.getAppInfo(),
      runtime: this.getRuntimeInfo()
    };
  }

  // Reset crash counter (call after successful operation)
  resetCrashCount() {
    try {
      localStorage.setItem('vim-crash-count', '0');
      this.runtimeInfo.crashCount = 0;
      log.info('AppInfo', 'Crash counter reset');
    } catch {
      // Ignore
    }
  }

  // Get session duration
  getSessionDuration(): number {
    return Date.now() - this.runtimeInfo.startTime;
  }

  // Log custom metrics
  logMetric(name: string, value: number, unit: string = 'ms') {
    log.info('AppInfo', `📈 Metric: ${name}`, {
      value,
      unit,
      sessionTime: this.getSessionDuration()
    });
  }
}

// Export singleton
export const appInfo = AppInfoManager.getInstance();
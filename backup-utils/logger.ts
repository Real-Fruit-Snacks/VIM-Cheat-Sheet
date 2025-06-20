// Unified Logging System with detailed console output

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  module: string;
  message: string;
  details?: any;
  error?: Error;
}

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private enabledModules: Set<string> = new Set();
  private minLevel: LogLevel = 'info';
  
  // Console styling
  private styles = {
    debug: 'color: #6B7280; font-weight: normal',
    info: 'color: #3B82F6; font-weight: normal',
    warn: 'color: #F59E0B; font-weight: bold',
    error: 'color: #EF4444; font-weight: bold',
    success: 'color: #10B981; font-weight: bold',
  };

  private prefixStyles = {
    debug: 'color: #6B7280; background: #F3F4F6; padding: 2px 6px; border-radius: 3px; font-weight: bold',
    info: 'color: #3B82F6; background: #EFF6FF; padding: 2px 6px; border-radius: 3px; font-weight: bold',
    warn: 'color: #F59E0B; background: #FFFBEB; padding: 2px 6px; border-radius: 3px; font-weight: bold',
    error: 'color: #EF4444; background: #FEF2F2; padding: 2px 6px; border-radius: 3px; font-weight: bold',
    success: 'color: #10B981; background: #F0FDF4; padding: 2px 6px; border-radius: 3px; font-weight: bold',
  };

  private icons = {
    debug: '🔍',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    success: '✅',
  };

  private constructor() {
    this.setupFromLocalStorage();
    this.enableAllModules(); // Enable all by default
    
    // Add console helper
    (window as any).vimLog = {
      enable: (module: string) => this.enableModule(module),
      disable: (module: string) => this.disableModule(module),
      enableAll: () => this.enableAllModules(),
      disableAll: () => this.disableAllModules(),
      setLevel: (level: LogLevel) => this.setMinLevel(level),
      show: () => this.showLogs(),
      clear: () => this.clearLogs(),
      filter: (filter: string) => this.filterLogs(filter),
      modules: () => this.listModules(),
    };

    console.log(
      '%c🚀 VIM Logger Ready',
      'color: #22C55E; font-size: 16px; font-weight: bold; padding: 10px',
      '\n\nAvailable commands:',
      '\n  vimLog.enable("module")   - Enable specific module',
      '\n  vimLog.disable("module")  - Disable specific module', 
      '\n  vimLog.enableAll()        - Enable all modules',
      '\n  vimLog.disableAll()       - Disable all modules',
      '\n  vimLog.setLevel("info")   - Set minimum log level',
      '\n  vimLog.show()             - Show recent logs',
      '\n  vimLog.filter("error")    - Filter logs',
      '\n  vimLog.modules()          - List all modules'
    );
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private setupFromLocalStorage() {
    try {
      const config = localStorage.getItem('vim-logger-config');
      if (config) {
        const { enabledModules, minLevel } = JSON.parse(config);
        this.enabledModules = new Set(enabledModules || []);
        this.minLevel = minLevel || 'info';
      }
    } catch {
      // Ignore errors
    }
  }

  private saveConfig() {
    try {
      localStorage.setItem('vim-logger-config', JSON.stringify({
        enabledModules: Array.from(this.enabledModules),
        minLevel: this.minLevel,
      }));
    } catch {
      // Ignore errors
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'success'];
    const currentIndex = levels.indexOf(this.minLevel);
    const messageIndex = levels.indexOf(level);
    return messageIndex >= currentIndex;
  }

  log(module: string, level: LogLevel, message: string, details?: any, error?: Error) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      module,
      message,
      details,
      error,
    };

    // Store log
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    if (this.enabledModules.has(module) && this.shouldLog(level)) {
      const time = new Date().toLocaleTimeString();
      const prefix = `%c${this.icons[level]} [${module}]%c`;
      const prefixStyle = this.prefixStyles[level];
      const messageStyle = this.styles[level];

      // Build console arguments
      const consoleArgs: any[] = [
        `${prefix} ${message}`,
        prefixStyle,
        messageStyle,
      ];

      // Add details if present
      if (details !== undefined) {
        consoleArgs[0] += '\n📋 Details:';
        consoleArgs.push(details);
      }

      // Add error stack if present
      if (error) {
        consoleArgs[0] += '\n🔥 Error:';
        consoleArgs.push(error);
      }

      // Log to console
      switch (level) {
        case 'error':
          console.error(...consoleArgs);
          break;
        case 'warn':
          console.warn(...consoleArgs);
          break;
        default:
          console.log(...consoleArgs);
      }
    }

    // Dispatch event for UI components
    window.dispatchEvent(new CustomEvent('vim-log', { detail: entry }));
  }

  // Convenience methods
  debug(module: string, message: string, details?: any) {
    this.log(module, 'debug', message, details);
  }

  info(module: string, message: string, details?: any) {
    this.log(module, 'info', message, details);
  }

  warn(module: string, message: string, details?: any) {
    this.log(module, 'warn', message, details);
  }

  error(module: string, message: string, error?: Error, details?: any) {
    this.log(module, 'error', message, details, error);
  }

  success(module: string, message: string, details?: any) {
    this.log(module, 'success', message, details);
  }

  // Module management
  enableModule(module: string) {
    this.enabledModules.add(module);
    this.saveConfig();
    console.log(`✅ Enabled logging for: ${module}`);
  }

  disableModule(module: string) {
    this.enabledModules.delete(module);
    this.saveConfig();
    console.log(`🔇 Disabled logging for: ${module}`);
  }

  enableAllModules() {
    // Get all unique modules from logs
    const modules = new Set(this.logs.map(log => log.module));
    // Add common modules
    ['ErrorRecovery', 'ServiceWorker', 'ResourceLoader', 'CORS', 'HealthCheck', 
     'FeatureFlags', 'MemoryManager', 'Resilience', 'VimWasm', 'Monaco',
     'GitLab', 'Browser', 'Storage', 'Network'].forEach(m => modules.add(m));
    
    modules.forEach(module => this.enabledModules.add(module));
    this.saveConfig();
    console.log('✅ Enabled all logging modules');
  }

  disableAllModules() {
    this.enabledModules.clear();
    this.saveConfig();
    console.log('🔇 Disabled all logging modules');
  }

  setMinLevel(level: LogLevel) {
    this.minLevel = level;
    this.saveConfig();
    console.log(`📊 Set minimum log level to: ${level}`);
  }

  // Log viewing
  showLogs(count: number = 50) {
    const recent = this.logs.slice(-count);
    console.group(`📜 Recent Logs (${recent.length})`);
    recent.forEach(log => {
      const time = new Date(log.timestamp).toLocaleTimeString();
      console.log(
        `%c${time} [${log.module}] ${log.level.toUpperCase()}: ${log.message}`,
        this.styles[log.level],
        log.details || ''
      );
    });
    console.groupEnd();
  }

  filterLogs(filter: string) {
    const filtered = this.logs.filter(log => 
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      log.module.toLowerCase().includes(filter.toLowerCase()) ||
      log.level.includes(filter.toLowerCase())
    );
    
    console.group(`🔍 Filtered Logs (${filtered.length} matches for "${filter}")`);
    filtered.forEach(log => {
      const time = new Date(log.timestamp).toLocaleTimeString();
      console.log(
        `%c${time} [${log.module}] ${log.level.toUpperCase()}: ${log.message}`,
        this.styles[log.level],
        log.details || ''
      );
    });
    console.groupEnd();
  }

  clearLogs() {
    this.logs = [];
    console.log('🧹 Logs cleared');
  }

  listModules() {
    const modules = new Set(this.logs.map(log => log.module));
    console.group('📦 Available Modules');
    Array.from(modules).sort().forEach(module => {
      const isEnabled = this.enabledModules.has(module);
      console.log(`${isEnabled ? '✅' : '❌'} ${module}`);
    });
    console.groupEnd();
  }

  // Export logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Get recent logs for UI
  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }
}

// Export singleton
export const logger = Logger.getInstance();

// Convenience functions
export const log = {
  debug: (module: string, message: string, details?: any) => 
    logger.debug(module, message, details),
  info: (module: string, message: string, details?: any) => 
    logger.info(module, message, details),
  warn: (module: string, message: string, details?: any) => 
    logger.warn(module, message, details),
  error: (module: string, message: string, error?: Error, details?: any) => 
    logger.error(module, message, error, details),
  success: (module: string, message: string, details?: any) => 
    logger.success(module, message, details),
};

// React hook for logs
export function useLogger(module: string) {
  return {
    debug: (message: string, details?: any) => logger.debug(module, message, details),
    info: (message: string, details?: any) => logger.info(module, message, details),
    warn: (message: string, details?: any) => logger.warn(module, message, details),
    error: (message: string, error?: Error, details?: any) => 
      logger.error(module, message, error, details),
    success: (message: string, details?: any) => logger.success(module, message, details),
  };
}

// React hook for watching logs
export function useLogs(filter?: { module?: string; level?: LogLevel }) {
  const [logs, setLogs] = React.useState<LogEntry[]>([]);

  React.useEffect(() => {
    const updateLogs = () => {
      let filteredLogs = logger.getRecentLogs(100);
      
      if (filter?.module) {
        filteredLogs = filteredLogs.filter(log => log.module === filter.module);
      }
      
      if (filter?.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filter.level);
      }
      
      setLogs(filteredLogs);
    };

    // Initial update
    updateLogs();

    // Listen for new logs
    const handleLog = () => updateLogs();
    window.addEventListener('vim-log', handleLog);

    return () => window.removeEventListener('vim-log', handleLog);
  }, [filter?.module, filter?.level]);

  return logs;
}
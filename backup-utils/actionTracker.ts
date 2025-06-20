// User Action Tracking for Debugging

import { log } from './logger';
import { appInfo } from './appInfo';

export type ActionCategory = 'file' | 'edit' | 'navigation' | 'command' | 'settings' | 'ui' | 'error';

export interface UserAction {
  id: string;
  timestamp: number;
  category: ActionCategory;
  action: string;
  details?: any;
  duration?: number;
  result?: 'success' | 'failure' | 'cancelled';
  error?: string;
}

export class ActionTracker {
  private static instance: ActionTracker;
  private actions: UserAction[] = [];
  private maxActions = 500;
  private activeActions: Map<string, { start: number; action: UserAction }> = new Map();
  private performanceObserver?: PerformanceObserver;

  private constructor() {
    this.setupPerformanceObserver();
    this.setupEventListeners();
    log.info('ActionTracker', 'User action tracking initialized');
  }

  static getInstance(): ActionTracker {
    if (!ActionTracker.instance) {
      ActionTracker.instance = new ActionTracker();
    }
    return ActionTracker.instance;
  }

  // Track a simple action
  track(category: ActionCategory, action: string, details?: any) {
    const userAction: UserAction = {
      id: this.generateId(),
      timestamp: Date.now(),
      category,
      action,
      details,
      result: 'success'
    };

    this.addAction(userAction);
    
    log.info('UserAction', `${category}: ${action}`, details);
  }

  // Start tracking an async action
  startAction(category: ActionCategory, action: string, details?: any): string {
    const id = this.generateId();
    const userAction: UserAction = {
      id,
      timestamp: Date.now(),
      category,
      action,
      details
    };

    this.activeActions.set(id, {
      start: performance.now(),
      action: userAction
    });

    log.info('UserAction', `▶️ Started: ${category}/${action}`, details);
    
    return id;
  }

  // Complete an async action
  endAction(id: string, result: 'success' | 'failure' | 'cancelled' = 'success', details?: any) {
    const active = this.activeActions.get(id);
    if (!active) {
      log.warn('ActionTracker', `No active action found: ${id}`);
      return;
    }

    const duration = performance.now() - active.start;
    const action = {
      ...active.action,
      duration,
      result,
      details: { ...active.action.details, ...details }
    };

    this.activeActions.delete(id);
    this.addAction(action);

    const icon = result === 'success' ? '✅' : result === 'failure' ? '❌' : '🚫';
    log[result === 'success' ? 'success' : 'error'](
      'UserAction',
      `${icon} Completed: ${action.category}/${action.action}`,
      {
        duration: `${duration.toFixed(2)}ms`,
        result,
        ...details
      }
    );

    // Log performance warning if action was slow
    if (duration > 1000) {
      log.warn('UserAction', `Slow action detected: ${action.action}`, {
        duration: `${duration.toFixed(2)}ms`,
        threshold: '1000ms'
      });
    }
  }

  // Track an error during an action
  trackError(category: ActionCategory, action: string, error: Error, details?: any) {
    const userAction: UserAction = {
      id: this.generateId(),
      timestamp: Date.now(),
      category,
      action,
      details,
      result: 'failure',
      error: error.message
    };

    this.addAction(userAction);
    
    log.error('UserAction', `Failed: ${category}/${action}`, error, details);
  }

  private addAction(action: UserAction) {
    this.actions.push(action);
    
    // Keep only recent actions
    if (this.actions.length > this.maxActions) {
      this.actions = this.actions.slice(-this.maxActions);
    }

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('user-action', { detail: action }));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            log.info('Performance', `📊 ${entry.name}`, {
              duration: `${entry.duration.toFixed(2)}ms`,
              start: entry.startTime.toFixed(2)
            });
          }
        }
      });

      this.performanceObserver.observe({ entryTypes: ['measure'] });
    } catch (error) {
      log.warn('ActionTracker', 'Failed to setup performance observer', { error });
    }
  }

  private setupEventListeners() {
    // Track navigation
    let lastPath = window.location.pathname;
    const checkNavigation = () => {
      if (window.location.pathname !== lastPath) {
        this.track('navigation', 'route-change', {
          from: lastPath,
          to: window.location.pathname
        });
        lastPath = window.location.pathname;
      }
    };

    // Check for navigation changes
    window.addEventListener('popstate', checkNavigation);
    
    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        this.track('ui', 'button-click', {
          text: button?.textContent?.trim().substring(0, 50),
          id: button?.id,
          className: button?.className
        });
      }
      
      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        this.track('navigation', 'link-click', {
          href: (link as HTMLAnchorElement)?.href,
          text: link?.textContent?.trim().substring(0, 50)
        });
      }
    });

    // Track keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        const keys = [];
        if (event.ctrlKey) keys.push('Ctrl');
        if (event.metaKey) keys.push('Cmd');
        if (event.altKey) keys.push('Alt');
        if (event.shiftKey) keys.push('Shift');
        keys.push(event.key);
        
        this.track('command', 'keyboard-shortcut', {
          shortcut: keys.join('+'),
          key: event.key,
          code: event.code
        });
      }
    });

    // Track window focus/blur
    window.addEventListener('focus', () => {
      this.track('ui', 'window-focus');
    });

    window.addEventListener('blur', () => {
      this.track('ui', 'window-blur');
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      this.track('ui', 'visibility-change', {
        hidden: document.hidden,
        visibilityState: document.visibilityState
      });
    });
  }

  // Get recent actions
  getRecentActions(count: number = 50): UserAction[] {
    return this.actions.slice(-count);
  }

  // Get actions by category
  getActionsByCategory(category: ActionCategory): UserAction[] {
    return this.actions.filter(a => a.category === category);
  }

  // Get action statistics
  getStatistics() {
    const stats: Record<ActionCategory, { count: number; avgDuration?: number }> = {
      file: { count: 0 },
      edit: { count: 0 },
      navigation: { count: 0 },
      command: { count: 0 },
      settings: { count: 0 },
      ui: { count: 0 },
      error: { count: 0 }
    };

    const durations: Record<ActionCategory, number[]> = {
      file: [],
      edit: [],
      navigation: [],
      command: [],
      settings: [],
      ui: [],
      error: []
    };

    this.actions.forEach(action => {
      stats[action.category].count++;
      if (action.duration) {
        durations[action.category].push(action.duration);
      }
    });

    // Calculate average durations
    Object.keys(stats).forEach((category) => {
      const cat = category as ActionCategory;
      const durList = durations[cat];
      if (durList.length > 0) {
        stats[cat].avgDuration = durList.reduce((a, b) => a + b, 0) / durList.length;
      }
    });

    return {
      totalActions: this.actions.length,
      sessionDuration: appInfo.getSessionDuration(),
      categories: stats,
      failureRate: this.actions.filter(a => a.result === 'failure').length / this.actions.length
    };
  }

  // Export actions for debugging
  exportActions(): string {
    return JSON.stringify({
      sessionInfo: appInfo.getFullInfo(),
      actions: this.actions,
      statistics: this.getStatistics(),
      exportTime: new Date().toISOString()
    }, null, 2);
  }

  // Clear action history
  clearActions() {
    this.actions = [];
    this.activeActions.clear();
    log.info('ActionTracker', 'Action history cleared');
  }

  // Performance measurement helpers
  startMeasure(name: string) {
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string) {
    try {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    } catch (error) {
      log.warn('ActionTracker', `Failed to measure: ${name}`, { error });
    }
  }
}

// Export singleton
export const actionTracker = ActionTracker.getInstance();

// Convenience functions
export const track = {
  file: {
    open: (filename: string, size?: number) => 
      actionTracker.track('file', 'open', { filename, size }),
    save: (filename: string, size?: number) => 
      actionTracker.track('file', 'save', { filename, size }),
    close: (filename: string) => 
      actionTracker.track('file', 'close', { filename }),
    create: (filename: string) => 
      actionTracker.track('file', 'create', { filename }),
    delete: (filename: string) => 
      actionTracker.track('file', 'delete', { filename }),
  },
  edit: {
    change: (lines: number, chars: number) => 
      actionTracker.track('edit', 'text-change', { lines, chars }),
    undo: () => actionTracker.track('edit', 'undo'),
    redo: () => actionTracker.track('edit', 'redo'),
    cut: () => actionTracker.track('edit', 'cut'),
    copy: () => actionTracker.track('edit', 'copy'),
    paste: () => actionTracker.track('edit', 'paste'),
    find: (query: string) => actionTracker.track('edit', 'find', { query }),
    replace: (find: string, replace: string) => 
      actionTracker.track('edit', 'replace', { find, replace }),
  },
  command: {
    vim: (command: string) => 
      actionTracker.track('command', 'vim-command', { command }),
    palette: (command: string) => 
      actionTracker.track('command', 'command-palette', { command }),
  },
  error: (action: string, error: Error, details?: any) => 
    actionTracker.trackError('error', action, error, details),
};

// React hook
export function useActionTracking() {
  const startAction = React.useCallback((
    category: ActionCategory,
    action: string,
    details?: any
  ): (() => void) => {
    const id = actionTracker.startAction(category, action, details);
    return () => actionTracker.endAction(id);
  }, []);

  return {
    track: actionTracker.track.bind(actionTracker),
    trackError: actionTracker.trackError.bind(actionTracker),
    startAction,
    measure: {
      start: actionTracker.startMeasure.bind(actionTracker),
      end: actionTracker.endMeasure.bind(actionTracker),
    }
  };
}
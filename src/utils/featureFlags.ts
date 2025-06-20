// Feature Flags System for Emergency Control

import React from 'react';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  defaultValue: boolean;
  category: 'core' | 'experimental' | 'performance' | 'ui' | 'integration';
  dependencies?: string[];
  metadata?: Record<string, any>;
}

export interface FeatureFlagOverride {
  flagId: string;
  enabled: boolean;
  reason: string;
  timestamp: number;
  expiresAt?: number;
}

export class FeatureFlagSystem {
  private static instance: FeatureFlagSystem;
  private flags: Map<string, FeatureFlag> = new Map();
  private overrides: Map<string, FeatureFlagOverride> = new Map();
  private listeners: Map<string, Set<(enabled: boolean) => void>> = new Map();
  private remoteConfigUrl?: string;
  private syncInterval?: number;

  private constructor() {
    this.registerDefaultFlags();
    this.loadLocalOverrides();
    this.checkUrlOverrides();
  }

  static getInstance(): FeatureFlagSystem {
    if (!FeatureFlagSystem.instance) {
      FeatureFlagSystem.instance = new FeatureFlagSystem();
    }
    return FeatureFlagSystem.instance;
  }

  private registerDefaultFlags() {
    // Core features
    this.registerFlag({
      id: 'vim-wasm',
      name: 'VIM WebAssembly',
      description: 'Enable vim.wasm for full VIM experience',
      enabled: true,
      defaultValue: true,
      category: 'core'
    });

    this.registerFlag({
      id: 'monaco-fallback',
      name: 'Monaco Editor Fallback',
      description: 'Use Monaco editor when vim.wasm is unavailable',
      enabled: true,
      defaultValue: true,
      category: 'core'
    });

    this.registerFlag({
      id: 'service-workers',
      name: 'Service Workers',
      description: 'Enable service workers for offline support and CORS handling',
      enabled: true,
      defaultValue: true,
      category: 'core'
    });

    // Performance features
    this.registerFlag({
      id: 'lazy-loading',
      name: 'Lazy Loading',
      description: 'Enable lazy loading of non-critical resources',
      enabled: true,
      defaultValue: true,
      category: 'performance'
    });

    this.registerFlag({
      id: 'resource-caching',
      name: 'Resource Caching',
      description: 'Enable aggressive resource caching',
      enabled: true,
      defaultValue: true,
      category: 'performance'
    });

    this.registerFlag({
      id: 'prefetch-resources',
      name: 'Prefetch Resources',
      description: 'Prefetch resources for better performance',
      enabled: true,
      defaultValue: true,
      category: 'performance',
      dependencies: ['resource-caching']
    });

    // Integration features
    this.registerFlag({
      id: 'gitlab-integration',
      name: 'GitLab Integration',
      description: 'Enable GitLab API integration',
      enabled: true,
      defaultValue: true,
      category: 'integration'
    });

    this.registerFlag({
      id: 'github-integration',
      name: 'GitHub Integration',
      description: 'Enable GitHub API integration',
      enabled: true,
      defaultValue: true,
      category: 'integration'
    });

    // UI features
    this.registerFlag({
      id: 'dark-mode',
      name: 'Dark Mode',
      description: 'Enable dark mode theme',
      enabled: true,
      defaultValue: true,
      category: 'ui'
    });

    this.registerFlag({
      id: 'ai-assistance',
      name: 'AI Assistance',
      description: 'Enable AI-powered code suggestions',
      enabled: false,
      defaultValue: false,
      category: 'experimental'
    });

    // Experimental features
    this.registerFlag({
      id: 'webgpu-renderer',
      name: 'WebGPU Renderer',
      description: 'Use WebGPU for rendering (experimental)',
      enabled: false,
      defaultValue: false,
      category: 'experimental'
    });

    this.registerFlag({
      id: 'collaborative-editing',
      name: 'Collaborative Editing',
      description: 'Enable real-time collaborative editing',
      enabled: false,
      defaultValue: false,
      category: 'experimental'
    });

    // Error recovery features
    this.registerFlag({
      id: 'auto-recovery',
      name: 'Automatic Error Recovery',
      description: 'Automatically attempt to recover from errors',
      enabled: true,
      defaultValue: true,
      category: 'core'
    });

    this.registerFlag({
      id: 'error-reporting',
      name: 'Error Reporting',
      description: 'Send anonymous error reports for improvement',
      enabled: false,
      defaultValue: false,
      category: 'core'
    });
  }

  registerFlag(flag: FeatureFlag) {
    this.flags.set(flag.id, flag);
  }

  isEnabled(flagId: string): boolean {
    const flag = this.flags.get(flagId);
    if (!flag) {
      console.warn(`[FeatureFlags] Unknown flag: ${flagId}`);
      return false;
    }

    // Check for override
    const override = this.overrides.get(flagId);
    if (override) {
      // Check if override has expired
      if (override.expiresAt && Date.now() > override.expiresAt) {
        this.overrides.delete(flagId);
        this.saveLocalOverrides();
      } else {
        return override.enabled;
      }
    }

    // Check dependencies
    if (flag.dependencies) {
      const dependenciesMet = flag.dependencies.every(dep => this.isEnabled(dep));
      if (!dependenciesMet) {
        return false;
      }
    }

    return flag.enabled;
  }

  setOverride(flagId: string, enabled: boolean, reason: string, expiresInMs?: number) {
    if (!this.flags.has(flagId)) {
      throw new Error(`Unknown feature flag: ${flagId}`);
    }

    const override: FeatureFlagOverride = {
      flagId,
      enabled,
      reason,
      timestamp: Date.now(),
      expiresAt: expiresInMs ? Date.now() + expiresInMs : undefined
    };

    this.overrides.set(flagId, override);
    this.saveLocalOverrides();
    this.notifyListeners(flagId, enabled);

    console.log(`[FeatureFlags] Override set for ${flagId}: ${enabled} (${reason})`);
  }

  removeOverride(flagId: string) {
    this.overrides.delete(flagId);
    this.saveLocalOverrides();
    
    const flag = this.flags.get(flagId);
    if (flag) {
      this.notifyListeners(flagId, flag.enabled);
    }
  }

  // Emergency kill switches
  disableAllExperimental() {
    const experimentalFlags = Array.from(this.flags.values())
      .filter(flag => flag.category === 'experimental');
    
    experimentalFlags.forEach(flag => {
      this.setOverride(flag.id, false, 'Emergency: All experimental features disabled');
    });
  }

  enableMinimalMode() {
    // Disable all non-essential features
    const essentialFlags = ['monaco-fallback', 'auto-recovery'];
    
    Array.from(this.flags.keys()).forEach(flagId => {
      if (!essentialFlags.includes(flagId)) {
        this.setOverride(flagId, false, 'Emergency: Minimal mode enabled');
      }
    });
  }

  resetToDefaults() {
    this.overrides.clear();
    this.saveLocalOverrides();
    
    // Reset all flags to default values
    this.flags.forEach(flag => {
      flag.enabled = flag.defaultValue;
      this.notifyListeners(flag.id, flag.enabled);
    });
  }

  // Persistence
  private loadLocalOverrides() {
    try {
      const stored = localStorage.getItem('vim-feature-overrides');
      if (stored) {
        const overrides: FeatureFlagOverride[] = JSON.parse(stored);
        overrides.forEach(override => {
          // Skip expired overrides
          if (!override.expiresAt || Date.now() < override.expiresAt) {
            this.overrides.set(override.flagId, override);
          }
        });
      }
    } catch (error) {
      console.error('[FeatureFlags] Failed to load overrides:', error);
    }
  }

  private saveLocalOverrides() {
    try {
      const overrides = Array.from(this.overrides.values());
      localStorage.setItem('vim-feature-overrides', JSON.stringify(overrides));
    } catch (error) {
      console.error('[FeatureFlags] Failed to save overrides:', error);
    }
  }

  // URL-based overrides (for debugging)
  private checkUrlOverrides() {
    const params = new URLSearchParams(window.location.search);
    
    params.forEach((value, key) => {
      if (key.startsWith('ff_')) {
        const flagId = key.substring(3);
        const enabled = value === 'true' || value === '1';
        
        if (this.flags.has(flagId)) {
          this.setOverride(flagId, enabled, 'URL parameter override', 3600000); // 1 hour
        }
      }
    });

    // Special URL parameters
    if (params.has('minimal')) {
      this.enableMinimalMode();
    }
    
    if (params.has('reset-flags')) {
      this.resetToDefaults();
    }
  }

  // Remote configuration
  async syncWithRemote(url: string) {
    this.remoteConfigUrl = url;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const remoteConfig = await response.json();
      
      if (remoteConfig.overrides) {
        remoteConfig.overrides.forEach((override: any) => {
          if (this.flags.has(override.flagId)) {
            this.setOverride(
              override.flagId,
              override.enabled,
              `Remote config: ${override.reason || 'No reason provided'}`,
              override.expiresInMs
            );
          }
        });
      }

      console.log('[FeatureFlags] Synced with remote config');
    } catch (error) {
      console.error('[FeatureFlags] Failed to sync with remote:', error);
    }
  }

  startRemoteSync(intervalMs: number = 300000) { // 5 minutes default
    if (!this.remoteConfigUrl) {
      console.warn('[FeatureFlags] No remote config URL set');
      return;
    }

    // Initial sync
    this.syncWithRemote(this.remoteConfigUrl);

    // Set up interval
    this.syncInterval = window.setInterval(() => {
      this.syncWithRemote(this.remoteConfigUrl!);
    }, intervalMs);
  }

  stopRemoteSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
  }

  // Event listeners
  onChange(flagId: string, callback: (enabled: boolean) => void) {
    if (!this.listeners.has(flagId)) {
      this.listeners.set(flagId, new Set());
    }
    this.listeners.get(flagId)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(flagId)?.delete(callback);
    };
  }

  private notifyListeners(flagId: string, enabled: boolean) {
    this.listeners.get(flagId)?.forEach(callback => {
      try {
        callback(enabled);
      } catch (error) {
        console.error(`[FeatureFlags] Listener error for ${flagId}:`, error);
      }
    });
  }

  // Debugging and diagnostics
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  getOverrides(): FeatureFlagOverride[] {
    return Array.from(this.overrides.values());
  }

  exportConfig(): string {
    const config = {
      flags: this.getAllFlags(),
      overrides: this.getOverrides(),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(config, null, 2);
  }

  generateReport(): string {
    const flags = this.getAllFlags();
    const overrides = this.getOverrides();
    
    return `
Feature Flags Report
Generated: ${new Date().toISOString()}

ENABLED FEATURES:
${flags.filter(f => this.isEnabled(f.id)).map(f => `- ${f.name} (${f.id})`).join('\n')}

DISABLED FEATURES:
${flags.filter(f => !this.isEnabled(f.id)).map(f => `- ${f.name} (${f.id})`).join('\n')}

ACTIVE OVERRIDES:
${overrides.map(o => 
  `- ${o.flagId}: ${o.enabled ? 'ENABLED' : 'DISABLED'} (${o.reason})`
).join('\n') || '- None'}

CATEGORIES:
${['core', 'experimental', 'performance', 'ui', 'integration'].map(cat => {
  const catFlags = flags.filter(f => f.category === cat);
  const enabled = catFlags.filter(f => this.isEnabled(f.id)).length;
  return `- ${cat}: ${enabled}/${catFlags.length} enabled`;
}).join('\n')}
`;
  }
}

// Export singleton
export const featureFlags = FeatureFlagSystem.getInstance();

// React hook for feature flags
export function useFeatureFlag(flagId: string): boolean {
  const [enabled, setEnabled] = React.useState(() => featureFlags.isEnabled(flagId));

  React.useEffect(() => {
    const unsubscribe = featureFlags.onChange(flagId, setEnabled);
    return unsubscribe;
  }, [flagId]);

  return enabled;
}

// Utility for checking feature flags in components
export function shouldRenderFeature(flagId: string): boolean {
  return featureFlags.isEnabled(flagId);
}

// Feature flag wrapper utility
export function createFeatureFlagWrapper(flagId: string) {
  return {
    isEnabled: () => featureFlags.isEnabled(flagId),
    shouldRender: () => shouldRenderFeature(flagId),
    withFallback: (primaryValue: any, fallbackValue: any) => {
      return shouldRenderFeature(flagId) ? primaryValue : fallbackValue;
    }
  };
}
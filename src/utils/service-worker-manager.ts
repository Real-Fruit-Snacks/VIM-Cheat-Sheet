/**
 * Service Worker Manager
 * Handles conditional service worker registration and cleanup for different editor modes
 */

export type EditorMode = 'vim-wasm' | 'monaco' | 'basic';

interface ServiceWorkerState {
  isRegistered: boolean;
  mode: EditorMode | null;
  registration?: ServiceWorkerRegistration;
  needsReload: boolean;
}

class ServiceWorkerManager {
  private state: ServiceWorkerState = {
    isRegistered: false,
    mode: null,
    needsReload: false,
  };

  async ensureCorrectServiceWorkerForMode(targetMode: EditorMode): Promise<void> {
    console.log(`[SW Manager] Ensuring service worker for mode: ${targetMode}`);
    
    if (!('serviceWorker' in navigator)) {
      console.log('[SW Manager] Service workers not supported');
      return;
    }
    
    const currentRegistration = await navigator.serviceWorker.getRegistration();
    const hasActiveWorker = !!navigator.serviceWorker.controller;
    
    // Update our state with current reality
    this.state.isRegistered = !!currentRegistration;
    this.state.registration = currentRegistration;
    
    console.log('[SW Manager] Current state:', {
      hasRegistration: !!currentRegistration,
      hasActiveWorker,
      targetMode,
      currentMode: this.state.mode
    });
    
    switch (targetMode) {
      case 'vim-wasm':
        await this.ensureVimWasmServiceWorker();
        break;
      case 'monaco':
      case 'basic':
        await this.ensureNoServiceWorkerInterference();
        break;
    }
  }
  
  private async ensureVimWasmServiceWorker(): Promise<void> {
    if (this.state.isRegistered && this.state.mode === 'vim-wasm') {
      console.log('[SW Manager] Service worker already configured for vim.wasm');
      return;
    }
    
    try {
      const registration = await navigator.serviceWorker.register('/VIM/coi-serviceworker.js', {
        scope: '/VIM/'
      });
      
      console.log('[SW Manager] Service worker registered for vim.wasm:', registration.scope);
      
      this.state = {
        isRegistered: true,
        mode: 'vim-wasm',
        registration,
        needsReload: false
      };
      
      // Wait for service worker to become active if it's installing
      if (registration.installing) {
        await this.waitForServiceWorkerActivation(registration);
      }
      
      // If there's no controller yet, we need to reload to get the SW to take control
      if (!navigator.serviceWorker.controller) {
        console.log('[SW Manager] Service worker installed but not controlling. Page reload required.');
        this.state.needsReload = true;
      }
      
    } catch (error) {
      console.error('[SW Manager] Failed to register service worker:', error);
      throw new Error(`Service worker registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private async ensureNoServiceWorkerInterference(): Promise<void> {
    const currentRegistration = await navigator.serviceWorker.getRegistration();
    
    if (!currentRegistration) {
      console.log('[SW Manager] No service worker to clean up');
      this.state.mode = 'monaco';
      return;
    }
    
    console.log('[SW Manager] Service worker detected, attempting cleanup for Monaco mode...');
    
    try {
      // First, try to send a message to the service worker to stop interfering
      if (navigator.serviceWorker.controller) {
        console.log('[SW Manager] Sending bypass message to service worker');
        navigator.serviceWorker.controller.postMessage({
          type: 'bypassForMonaco',
          timestamp: Date.now()
        });
        
        // Give the service worker time to process the message
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // For the most reliable solution, unregister the service worker entirely
      console.log('[SW Manager] Unregistering service worker for Monaco compatibility');
      await currentRegistration.unregister();
      
      this.state = {
        isRegistered: false,
        mode: 'monaco',
        needsReload: true
      };
      
      console.log('[SW Manager] Service worker unregistered. Page reload recommended for clean state.');
      
    } catch (error) {
      console.error('[SW Manager] Failed to clean up service worker:', error);
      
      // If we can't unregister, at least try to minimize interference
      this.state = {
        isRegistered: true,
        mode: 'monaco',
        registration: currentRegistration,
        needsReload: true
      };
      
      console.warn('[SW Manager] Could not fully clean up service worker. Monaco may have issues.');
    }
  }
  
  private async waitForServiceWorkerActivation(registration: ServiceWorkerRegistration): Promise<void> {
    return new Promise((resolve) => {
      if (registration.active) {
        resolve();
        return;
      }
      
      const worker = registration.installing || registration.waiting;
      if (!worker) {
        resolve();
        return;
      }
      
      const timeout = setTimeout(() => {
        console.warn('[SW Manager] Service worker activation timeout');
        resolve();
      }, 10000);
      
      worker.addEventListener('statechange', () => {
        if (worker.state === 'activated') {
          clearTimeout(timeout);
          resolve();
        }
      });
    });
  }
  
  getState(): ServiceWorkerState {
    return { ...this.state };
  }
  
  needsPageReload(): boolean {
    return this.state.needsReload;
  }
  
  async performReloadIfNeeded(): Promise<void> {
    if (this.state.needsReload) {
      console.log('[SW Manager] Performing page reload for service worker state change');
      
      // Store the intended mode in sessionStorage so we can restore it after reload
      try {
        sessionStorage.setItem('vim_editor_mode', this.state.mode || 'monaco');
        sessionStorage.setItem('vim_sw_reload_time', Date.now().toString());
      } catch (e) {
        // Ignore storage errors
      }
      
      // Small delay to ensure console logs are visible
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }
  
  getStoredModeAfterReload(): EditorMode | null {
    try {
      const storedMode = sessionStorage.getItem('vim_editor_mode') as EditorMode | null;
      const reloadTime = sessionStorage.getItem('vim_sw_reload_time');
      
      // Only use stored mode if reload was recent (within last 30 seconds)
      if (storedMode && reloadTime) {
        const timeDiff = Date.now() - parseInt(reloadTime, 10);
        if (timeDiff < 30000) {
          // Clean up storage
          sessionStorage.removeItem('vim_editor_mode');
          sessionStorage.removeItem('vim_sw_reload_time');
          return storedMode;
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
    
    return null;
  }
}

// Export singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// Convenience function for setting up service worker for a specific mode
export async function setupServiceWorkerForMode(mode: EditorMode): Promise<void> {
  return serviceWorkerManager.ensureCorrectServiceWorkerForMode(mode);
}

// Check if we need to reload after service worker changes
export function needsReloadForServiceWorker(): boolean {
  return serviceWorkerManager.needsPageReload();
}

// Perform reload if needed
export async function reloadForServiceWorkerIfNeeded(): Promise<void> {
  return serviceWorkerManager.performReloadIfNeeded();
}

// Get mode that was stored before a reload
export function getStoredModeAfterReload(): EditorMode | null {
  return serviceWorkerManager.getStoredModeAfterReload();
}
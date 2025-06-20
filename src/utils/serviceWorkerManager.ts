// Service Worker Manager for handling both COI and GitLab authentication

import { log } from './logger';

export class ServiceWorkerManager {
  private coiWorker: ServiceWorkerRegistration | null = null;
  private gitlabWorker: ServiceWorkerRegistration | null = null;

  async initialize(gitlabToken?: string) {
    log.info('ServiceWorker', 'Initializing service worker manager', {
      hasToken: !!gitlabToken,
      serviceWorkerSupported: 'serviceWorker' in navigator
    });

    if (!('serviceWorker' in navigator)) {
      log.error('ServiceWorker', 'Service Workers not supported in this browser');
      return;
    }

    try {
      // Register COI service worker for SharedArrayBuffer support
      if (!this.coiWorker) {
        log.info('ServiceWorker', 'Registering COI service worker...');
        const startTime = performance.now();
        
        this.coiWorker = await navigator.serviceWorker.register('/coi-serviceworker.js', {
          scope: '/'
        });
        
        const regTime = performance.now() - startTime;
        log.success('ServiceWorker', 'COI Service Worker registered', {
          scope: this.coiWorker.scope,
          state: this.coiWorker.active?.state || 'installing',
          registrationTime: `${regTime.toFixed(2)}ms`
        });

        // Log state changes
        this.coiWorker.addEventListener('updatefound', () => {
          log.info('ServiceWorker', 'COI worker update found');
        });
      } else {
        log.debug('ServiceWorker', 'COI worker already registered');
      }

      // Register GitLab auth service worker if we have a token
      if (gitlabToken && !this.gitlabWorker) {
        log.info('ServiceWorker', 'Registering GitLab auth service worker...');
        const startTime = performance.now();
        
        this.gitlabWorker = await navigator.serviceWorker.register('/gitlab-auth-worker.js', {
          scope: '/'
        });
        
        const regTime = performance.now() - startTime;
        log.success('ServiceWorker', 'GitLab Auth Service Worker registered', {
          scope: this.gitlabWorker.scope,
          state: this.gitlabWorker.active?.state || 'installing',
          registrationTime: `${regTime.toFixed(2)}ms`
        });
        
        // Wait for the worker to be ready and send the token
        log.debug('ServiceWorker', 'Waiting for service worker to be ready...');
        await navigator.serviceWorker.ready;
        
        if (navigator.serviceWorker.controller) {
          log.info('ServiceWorker', 'Sending GitLab token to service worker');
          navigator.serviceWorker.controller.postMessage({
            type: 'SET_GITLAB_TOKEN',
            token: gitlabToken
          });
        } else {
          log.warn('ServiceWorker', 'No service worker controller available for token');
        }
      } else if (!gitlabToken) {
        log.info('ServiceWorker', 'Skipping GitLab worker - no token provided');
      }

      // Listen for authentication failures
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'GITLAB_AUTH_FAILED') {
          log.error('ServiceWorker', 'GitLab authentication failed', undefined, {
            message: event.data.message,
            source: event.source
          });
          
          // Dispatch custom event
          window.dispatchEvent(new CustomEvent('gitlab-auth-failed', {
            detail: { message: event.data.message }
          }));
        } else if (event.data) {
          log.debug('ServiceWorker', 'Received message from service worker', {
            type: event.data.type
          });
        }
      });

      log.success('ServiceWorker', 'Service worker manager initialized successfully', {
        coiWorker: !!this.coiWorker,
        gitlabWorker: !!this.gitlabWorker
      });
      
    } catch (error) {
      log.error('ServiceWorker', 'Service Worker registration failed', error as Error, {
        coiWorkerStatus: this.coiWorker?.active?.state || 'not registered',
        gitlabWorkerStatus: this.gitlabWorker?.active?.state || 'not registered'
      });
    }
  }

  updateGitLabToken(token: string) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SET_GITLAB_TOKEN',
        token: token
      });
    }
  }

  async unregister() {
    if (this.coiWorker) {
      await this.coiWorker.unregister();
      this.coiWorker = null;
    }
    if (this.gitlabWorker) {
      await this.gitlabWorker.unregister();
      this.gitlabWorker = null;
    }
  }
}

// Singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

// Helper function to fetch from GitLab with authentication
export async function fetchFromGitLab(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('gitlab_token');
  
  if (!token) {
    throw new Error('GitLab token not found. Please authenticate first.');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('X-Gitlab-Token', token);

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('gitlab-auth-failed', {
      detail: { message: 'GitLab authentication failed' }
    }));
    throw new Error('GitLab authentication failed');
  }

  return response;
}
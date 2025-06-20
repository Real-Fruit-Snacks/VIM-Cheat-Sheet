// CORS Helper utilities for handling cross-origin requests
import { log } from './logger';

interface CORSOptions {
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  fallbackToProxy?: boolean;
}

interface ProxyConfig {
  url: string;
  enabled: boolean;
}

export class CORSHelper {
  private static proxyConfig: ProxyConfig = {
    url: '/cors-proxy/',
    enabled: false
  };

  // Configure proxy settings
  static setProxyConfig(config: Partial<ProxyConfig>) {
    CORSHelper.proxyConfig = { ...CORSHelper.proxyConfig, ...config };
  }

  // Enhanced fetch with CORS handling
  static async fetch(url: string, options: RequestInit & CORSOptions = {}): Promise<Response> {
    const {
      credentials = 'include',
      timeout = 30000,
      retries = 1,
      fallbackToProxy = true,
      ...fetchOptions
    } = options;

    log.info('CORS', `Fetching: ${url}`, {
      method: fetchOptions.method || 'GET',
      credentials,
      timeout,
      retries,
      mode: 'cors'
    });

    // Add default CORS headers
    const headers = new Headers(fetchOptions.headers);
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json, text/plain, */*');
    }

    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers,
      credentials,
      mode: 'cors' as RequestMode,
    };

    // Attempt fetch with timeout
    const attemptFetch = async (targetUrl: string, attempt: number = 1): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      log.debug('CORS', `Attempt ${attempt}/${retries} for: ${targetUrl}`, {
        isProxy: targetUrl.includes(CORSHelper.proxyConfig.url)
      });

      try {
        const startTime = performance.now();
        const response = await fetch(targetUrl, {
          ...requestOptions,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const duration = performance.now() - startTime;

        // Check for CORS errors (status 0 usually indicates CORS failure)
        if (response.status === 0 || response.type === 'opaque') {
          log.error('CORS', 'Request blocked by CORS policy', undefined, {
            url: targetUrl,
            responseType: response.type,
            status: response.status
          });
          throw new Error('CORS request blocked');
        }

        log.success('CORS', `Request successful: ${targetUrl}`, {
          status: response.status,
          duration: `${duration.toFixed(2)}ms`,
          type: response.type,
          headers: Object.fromEntries(response.headers.entries())
        });

        return response;
      } catch (error: any) {
        clearTimeout(timeoutId);

        // Handle specific error types
        if (error.name === 'AbortError') {
          log.error('CORS', `Request timeout after ${timeout}ms`, error, {
            url: targetUrl,
            attempt
          });
          throw new Error(`Request timeout after ${timeout}ms`);
        }

        log.warn('CORS', `Request failed: ${error.message}`, {
          url: targetUrl,
          attempt,
          errorName: error.name,
          willRetry: attempt < retries
        });

        // Retry logic
        if (attempt < retries) {
          const retryDelay = 1000 * attempt;
          log.info('CORS', `Retrying after ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return attemptFetch(targetUrl, attempt + 1);
        }

        // Try proxy fallback
        if (fallbackToProxy && CORSHelper.proxyConfig.enabled && !targetUrl.includes(CORSHelper.proxyConfig.url)) {
          log.warn('CORS', 'Direct request failed, attempting proxy fallback', {
            originalUrl: url,
            proxyUrl: CORSHelper.proxyConfig.url
          });
          const proxyUrl = `${CORSHelper.proxyConfig.url}${encodeURIComponent(url)}`;
          return attemptFetch(proxyUrl, 1);
        }

        log.error('CORS', 'All attempts failed', error, {
          url,
          attempts: attempt,
          proxyEnabled: CORSHelper.proxyConfig.enabled
        });

        throw error;
      }
    };

    return attemptFetch(url);
  }

  // Preflight check
  static async checkCORS(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'OPTIONS',
        mode: 'cors',
        headers: {
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type',
        }
      });

      return response.ok || response.status === 204;
    } catch {
      return false;
    }
  }

  // JSON fetch helper
  static async fetchJSON<T = any>(url: string, options?: CORSOptions): Promise<T> {
    const response = await CORSHelper.fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // GitLab-specific fetch
  static async fetchGitLab(endpoint: string, token?: string, options?: CORSOptions): Promise<Response> {
    const headers: Record<string, string> = {
      ...options?.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-Gitlab-Token'] = token;
    }

    // Use proxy in development
    const baseUrl = import.meta.env.DEV 
      ? '/api/v4' 
      : 'https://gitlab.com/api/v4';

    return CORSHelper.fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  }

  // Batch CORS requests
  static async fetchBatch(urls: string[], options?: CORSOptions): Promise<Response[]> {
    const promises = urls.map(url => 
      CORSHelper.fetch(url, options).catch(err => {
        console.error(`Batch fetch failed for ${url}:`, err);
        return null;
      })
    );

    const results = await Promise.all(promises);
    return results.filter((r): r is Response => r !== null);
  }

  // Create a CORS-safe URL
  static createCORSUrl(url: string, useProxy: boolean = false): string {
    if (useProxy && CORSHelper.proxyConfig.enabled) {
      return `${CORSHelper.proxyConfig.url}${encodeURIComponent(url)}`;
    }
    return url;
  }

  // Handle CORS errors gracefully
  static handleCORSError(error: any, url: string): Error {
    if (error.message.includes('CORS')) {
      return new Error(
        `CORS blocked request to ${url}. ` +
        `Please ensure the server allows cross-origin requests or use a proxy.`
      );
    }

    if (error.message.includes('timeout')) {
      return new Error(`Request to ${url} timed out.`);
    }

    return error;
  }
}

// Export convenience functions
export const corsFetch = CORSHelper.fetch.bind(CORSHelper);
export const corsJSON = CORSHelper.fetchJSON.bind(CORSHelper);
export const checkCORS = CORSHelper.checkCORS.bind(CORSHelper);
export const fetchGitLab = CORSHelper.fetchGitLab.bind(CORSHelper);

// CORS error utility functions
export function isCORSError(error: Error): boolean {
  return error.message.includes('CORS') || 
         error.message.includes('cross-origin') ||
         error.message.includes('preflight') ||
         error.name === 'NetworkError';
}

export function getCORSErrorMessage(error: Error): string {
  if (isCORSError(error)) {
    return `CORS Error: ${error.message}. Please check your browser console for more details.`;
  }
  return error.message;
}
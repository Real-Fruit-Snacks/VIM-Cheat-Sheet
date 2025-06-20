// Offline Service Worker with comprehensive caching strategy

const CACHE_VERSION = 'vim-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Service Worker Logging Helper
const swLog = {
  info: (message, data) => {
    console.log(`%c[Offline SW] ℹ️ ${message}`, 'color: #3B82F6; font-weight: bold', data || '');
  },
  success: (message, data) => {
    console.log(`%c[Offline SW] ✅ ${message}`, 'color: #10B981; font-weight: bold', data || '');
  },
  warn: (message, data) => {
    console.warn(`%c[Offline SW] ⚠️ ${message}`, 'color: #F59E0B; font-weight: bold', data || '');
  },
  error: (message, data) => {
    console.error(`%c[Offline SW] ❌ ${message}`, 'color: #EF4444; font-weight: bold', data || '');
  }
};

// Resources that must be cached for offline use
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/favicon-simple.svg',
  '/favicon-detailed.svg',
];

// Resources to prefetch for better performance
const PREFETCH_RESOURCES = [
  '/vim-wasm/vim.wasm',
  '/vim-wasm/vim.js',
  '/vim-wasm/vim.data',
  '/coi-serviceworker.js',
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  CACHE_ONLY: 'cache-only',
  NETWORK_ONLY: 'network-only',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  swLog.info('Installing service worker...', { version: CACHE_VERSION });
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        swLog.info(`Caching ${CRITICAL_RESOURCES.length} critical resources`, {
          cache: STATIC_CACHE,
          resources: CRITICAL_RESOURCES
        });
        
        return cache.addAll(CRITICAL_RESOURCES)
          .then(() => {
            swLog.success('Critical resources cached successfully');
          })
          .catch(err => {
            swLog.error('Failed to cache critical resources', err);
            throw err;
          });
      })
      .then(() => {
        // Prefetch additional resources in background
        swLog.info(`Starting prefetch of ${PREFETCH_RESOURCES.length} additional resources`);
        
        return caches.open(STATIC_CACHE).then(cache => {
          let successCount = 0;
          let failCount = 0;
          
          PREFETCH_RESOURCES.forEach(url => {
            cache.add(url)
              .then(() => {
                successCount++;
                swLog.success(`Prefetched: ${url}`);
              })
              .catch(err => {
                failCount++;
                swLog.warn(`Failed to prefetch ${url}`, err.message);
              });
          });
          
          // Log summary after a delay
          setTimeout(() => {
            swLog.info('Prefetch summary', {
              total: PREFETCH_RESOURCES.length,
              success: successCount,
              failed: failCount
            });
          }, 5000);
        });
      })
      .then(() => {
        swLog.success('Installation complete, activating immediately');
        return self.skipWaiting();
      })
      .catch(err => {
        swLog.error('Installation failed', err);
        throw err;
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  swLog.info('Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        swLog.info(`Found ${cacheNames.length} caches`, { caches: cacheNames });
        
        const oldCaches = cacheNames.filter(name => 
          name.startsWith('vim-') && !name.startsWith(CACHE_VERSION)
        );
        
        if (oldCaches.length === 0) {
          swLog.info('No old caches to delete');
          return [];
        }
        
        swLog.info(`Deleting ${oldCaches.length} old caches`, { oldCaches });
        
        return Promise.all(
          oldCaches.map(name => {
            return caches.delete(name)
              .then(() => {
                swLog.success(`Deleted old cache: ${name}`);
              })
              .catch(err => {
                swLog.error(`Failed to delete cache: ${name}`, err);
              });
          })
        );
      })
      .then(() => {
        swLog.info('Taking control of all clients');
        return self.clients.claim();
      })
      .then(() => {
        swLog.success('Service worker activated and controlling all clients');
      })
      .catch(err => {
        swLog.error('Activation failed', err);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    swLog.info(`Skipping non-GET request: ${request.method} ${url.pathname}`);
    return;
  }

  // Determine cache strategy based on resource type
  let strategy = CACHE_STRATEGIES.NETWORK_FIRST;
  let resourceType = 'unknown';
  
  if (url.pathname.match(/\.(js|css|wasm|data)$/)) {
    // Static assets - cache first
    strategy = CACHE_STRATEGIES.CACHE_FIRST;
    resourceType = 'static-asset';
  } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
    // Images - cache first
    strategy = CACHE_STRATEGIES.CACHE_FIRST;
    resourceType = 'image';
  } else if (url.pathname.includes('/api/')) {
    // API calls - network first with cache fallback
    strategy = CACHE_STRATEGIES.NETWORK_FIRST;
    resourceType = 'api';
  } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    // HTML - stale while revalidate
    strategy = CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
    resourceType = 'html';
  }

  // Log fetch details
  const isOnline = navigator.onLine;
  swLog.info(`Fetch: ${request.method} ${url.pathname}`, {
    strategy,
    resourceType,
    online: isOnline,
    mode: request.mode,
    cache: request.cache
  });

  event.respondWith(
    handleRequest(request, strategy)
      .then(response => {
        swLog.success(`Response delivered: ${url.pathname}`, {
          status: response.status,
          fromCache: response.headers.get('x-cache') === 'HIT'
        });
        return response;
      })
      .catch(err => {
        swLog.error(`Failed to handle request: ${url.pathname}`, err);
        return offlineResponse(request);
      })
  );
});

// Request handling with different strategies
async function handleRequest(request, strategy) {
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return cacheOnly(request);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return networkOnly(request);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request);
    
    default:
      return networkFirst(request);
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetchAndCache(request, STATIC_CACHE).catch(() => {});
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return offlineResponse(request);
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const response = await fetchWithTimeout(request, 5000);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return offlineResponse(request);
  }
}

// Cache-only strategy
async function cacheOnly(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || offlineResponse(request);
}

// Network-only strategy
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return offlineResponse(request);
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Fetch with timeout
async function fetchWithTimeout(request, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(request, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Fetch and cache helper
async function fetchAndCache(request, cacheName) {
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
}

// Generate offline response
function offlineResponse(request) {
  const url = new URL(request.url);
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VIM - Offline</title>
        <style>
          body {
            margin: 0;
            background: #0a0a0a;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          .container {
            padding: 20px;
          }
          h1 {
            color: #22c55e;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            margin-bottom: 30px;
          }
          button {
            background: #22c55e;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
          }
          button:hover {
            background: #16a34a;
          }
          .status {
            margin-top: 20px;
            color: #999;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>VIM Editor - Offline Mode</h1>
          <p>You're currently offline. Some features may be limited.</p>
          <button onclick="window.location.reload()">Try Again</button>
          <div class="status" id="status">Checking connection...</div>
        </div>
        <script>
          function updateStatus() {
            const status = document.getElementById('status');
            if (navigator.onLine) {
              status.textContent = 'Connection restored! Reloading...';
              setTimeout(() => window.location.reload(), 1000);
            } else {
              status.textContent = 'Still offline. Cached content is available.';
            }
          }
          
          window.addEventListener('online', updateStatus);
          window.addEventListener('offline', updateStatus);
          setInterval(updateStatus, 5000);
          updateStatus();
        </script>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 200
    });
  }

  // Return error for other requests
  return new Response('Offline - Resource not cached', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(names => {
      Promise.all(names.map(name => caches.delete(name)));
    });
    event.ports[0].postMessage({ success: true });
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    caches.open(DYNAMIC_CACHE).then(cache => {
      cache.addAll(urls);
    });
    event.ports[0].postMessage({ success: true });
  }
});

// Background sync for deferred actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-vim-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Sync any pending data when connection is restored
  console.log('[Offline SW] Syncing data...');
  // Implementation depends on your data sync needs
}
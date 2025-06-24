// Service Worker for VIM Cheatsheet v4.0.0
// Provides comprehensive offline support for GitLab Pages deployment

const CACHE_NAME = 'vim-cheatsheet-v4.0.0';
const OFFLINE_URL = '/VIM-Cheat-Sheet/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/VIM-Cheat-Sheet/',
  '/VIM-Cheat-Sheet/index.html',
  '/VIM-Cheat-Sheet/offline.html',
  '/VIM-Cheat-Sheet/favicon.ico',
  '/VIM-Cheat-Sheet/favicon-simple.svg',
  '/VIM-Cheat-Sheet/favicon-detailed.svg',
  '/VIM-Cheat-Sheet/loading.css'
];

// VIM help files to cache
const HELP_FILES = [
  'change.txt', 'cmdline.txt', 'editing.txt', 'fold.txt',
  'index.txt', 'insert.txt', 'map.txt', 'motion.txt',
  'options.txt', 'pattern.txt', 'repeat.txt', 'scroll.txt',
  'undo.txt', 'various.txt', 'visual.txt', 'windows.txt'
].map(file => `/VIM-Cheat-Sheet/vim-help/${file}`);

// Install event - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        // Cache all assets including help files
        return cache.addAll([...STATIC_ASSETS, ...HELP_FILES]);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Old caches cleaned up');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Parse the URL
  const url = new URL(event.request.url);
  
  // Skip external requests
  if (!url.pathname.startsWith('/VIM-Cheat-Sheet/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }

        // Try network for non-cached resources
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  // Cache JS, CSS, and font files
                  if (url.pathname.match(/\.(js|css|woff2?)$/)) {
                    cache.put(event.request, responseToCache);
                  }
                });
            }
            
            return networkResponse;
          })
          .catch(() => {
            // Network failed, return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, return a 404
            return new Response('Not found', {
              status: 404,
              statusText: 'Not found'
            });
          });
      })
  );
});

// Message event - handle cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([...STATIC_ASSETS, ...HELP_FILES]);
        })
    );
  }
});
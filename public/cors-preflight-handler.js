// CORS Preflight Handler Service Worker
// Handles OPTIONS requests and adds necessary CORS headers

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Configuration for CORS handling
const CORS_CONFIG = {
  allowedOrigins: [
    self.location.origin,
    'https://gitlab.com',
    'https://*.gitlab.io',
    'http://localhost:*',
    'http://127.0.0.1:*'
  ],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization', 
    'X-Requested-With',
    'X-Gitlab-Token',
    'Range',
    'Accept',
    'Accept-Encoding',
    'If-Modified-Since',
    'Cache-Control',
    'Origin'
  ],
  exposedHeaders: [
    'Content-Length',
    'Content-Range',
    'X-Gitlab-Token',
    'Date',
    'ETag'
  ],
  maxAge: 86400, // 24 hours
  credentials: true
};

// Check if origin is allowed
function isOriginAllowed(origin) {
  if (!origin) return false;
  
  return CORS_CONFIG.allowedOrigins.some(allowed => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace(/\*/g, '.*');
      return new RegExp(`^${pattern}$`).test(origin);
    }
    return allowed === origin;
  });
}

// Add CORS headers to response
function addCORSHeaders(response, request) {
  const origin = request.headers.get('Origin');
  const headers = new Headers(response.headers);
  
  if (isOriginAllowed(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
  } else {
    headers.set('Access-Control-Allow-Origin', '*');
  }
  
  headers.set('Access-Control-Allow-Methods', CORS_CONFIG.allowedMethods.join(', '));
  headers.set('Access-Control-Allow-Headers', CORS_CONFIG.allowedHeaders.join(', '));
  headers.set('Access-Control-Expose-Headers', CORS_CONFIG.exposedHeaders.join(', '));
  headers.set('Access-Control-Max-Age', CORS_CONFIG.maxAge.toString());
  headers.set('Vary', 'Origin');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// Handle preflight requests
function handlePreflight(request) {
  const origin = request.headers.get('Origin');
  const requestMethod = request.headers.get('Access-Control-Request-Method');
  const requestHeaders = request.headers.get('Access-Control-Request-Headers');
  
  // Validate preflight
  const isMethodAllowed = !requestMethod || CORS_CONFIG.allowedMethods.includes(requestMethod);
  const areHeadersAllowed = !requestHeaders || requestHeaders
    .split(',')
    .map(h => h.trim().toLowerCase())
    .every(header => CORS_CONFIG.allowedHeaders.map(h => h.toLowerCase()).includes(header));
  
  if (!isMethodAllowed || !areHeadersAllowed) {
    return new Response('CORS preflight check failed', { status: 403 });
  }
  
  // Build preflight response
  const headers = new Headers();
  
  if (isOriginAllowed(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
  } else {
    headers.set('Access-Control-Allow-Origin', '*');
  }
  
  headers.set('Access-Control-Allow-Methods', CORS_CONFIG.allowedMethods.join(', '));
  headers.set('Access-Control-Allow-Headers', CORS_CONFIG.allowedHeaders.join(', '));
  headers.set('Access-Control-Max-Age', CORS_CONFIG.maxAge.toString());
  headers.set('Vary', 'Origin');
  
  return new Response(null, {
    status: 204,
    headers
  });
}

// Main fetch handler
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    event.respondWith(handlePreflight(request));
    return;
  }
  
  // For other requests, add CORS headers to the response
  event.respondWith(
    fetch(request)
      .then(response => addCORSHeaders(response, request))
      .catch(error => {
        console.error('Fetch error:', error);
        
        // Return CORS-enabled error response
        const errorResponse = new Response(
          JSON.stringify({ error: 'Request failed', message: error.message }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        return addCORSHeaders(errorResponse, request);
      })
  );
});

// Message handler for dynamic configuration
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'UPDATE_CORS_CONFIG') {
    const { config } = event.data;
    
    if (config.allowedOrigins) {
      CORS_CONFIG.allowedOrigins = config.allowedOrigins;
    }
    if (config.allowedMethods) {
      CORS_CONFIG.allowedMethods = config.allowedMethods;
    }
    if (config.allowedHeaders) {
      CORS_CONFIG.allowedHeaders = config.allowedHeaders;
    }
    
    event.ports[0].postMessage({ success: true });
  }
});
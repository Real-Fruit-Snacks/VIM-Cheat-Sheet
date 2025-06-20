// GitLab Authentication Service Worker
// Handles authenticated requests to private GitLab Pages

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// Store GitLab token from the main thread
let gitlabToken = null;

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SET_GITLAB_TOKEN') {
    gitlabToken = event.data.token;
  }
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Only intercept GitLab Pages requests
  if (url.hostname.includes('gitlab.io') || url.pathname.includes('/gitlab-pages/')) {
    event.respondWith(handleGitLabRequest(event.request));
  }
});

async function handleGitLabRequest(request) {
  try {
    // Clone the request to add authentication headers
    const modifiedRequest = new Request(request, {
      headers: new Headers({
        ...Object.fromEntries(request.headers.entries()),
        'Authorization': gitlabToken ? `Bearer ${gitlabToken}` : '',
        'X-Gitlab-Token': gitlabToken || '',
      }),
      credentials: 'include',
    });

    const response = await fetch(modifiedRequest);
    
    // If we get a 401, the token might be invalid
    if (response.status === 401) {
      // Notify the main thread about authentication failure
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'GITLAB_AUTH_FAILED',
            message: 'GitLab authentication failed. Please check your token.',
          });
        });
      });
    }

    // Clone response and add CORS headers if needed
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers({
        ...Object.fromEntries(response.headers.entries()),
        'Access-Control-Allow-Origin': self.location.origin,
        'Access-Control-Allow-Credentials': 'true',
      }),
    });

    return modifiedResponse;
  } catch (error) {
    console.error('GitLab request failed:', error);
    return new Response('GitLab request failed', { status: 500 });
  }
}

// Helper function to register both service workers
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'INIT_DUAL_WORKERS') {
    // This worker handles GitLab auth
    // The COI worker handles SharedArrayBuffer requirements
    event.ports[0].postMessage({ status: 'ready' });
  }
});
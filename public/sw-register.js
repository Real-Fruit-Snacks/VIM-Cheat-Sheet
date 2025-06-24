/**
 * Safe Service Worker registration for restricted environments
 * Separate file to avoid CSP violations from inline scripts
 */

(function() {
  'use strict';
  
  // Safe console wrapper to avoid CSP violations
  function safeLog(level, message, data) {
    try {
      if (console && console[level]) {
        if (data) {
          console[level](message, data);
        } else {
          console[level](message);
        }
      }
    } catch (e) {
      // Silently fail if console is restricted
    }
  }
  
  // Check if Service Workers are supported and allowed
  if (!('serviceWorker' in navigator)) {
    safeLog('log', 'Service Workers not supported, continuing without offline support');
    return;
  }
  
  // Safe event listener addition
  function safeAddEventListener(target, event, handler) {
    try {
      target.addEventListener(event, handler);
      return true;
    } catch (e) {
      safeLog('warn', 'Event listener blocked:', e);
      return false;
    }
  }
  
  // Safe interval setup
  function safeSetInterval(callback, delay) {
    try {
      return setInterval(callback, delay);
    } catch (e) {
      safeLog('warn', 'setInterval blocked:', e);
      return null;
    }
  }
  
  // Main registration function
  function registerServiceWorker() {
    navigator.serviceWorker.register('/VIM-Cheat-Sheet/sw.js')
      .then(function(registration) {
        safeLog('log', 'ServiceWorker registered:', registration.scope);
        
        // Set up update checking with error handling
        var updateInterval = safeSetInterval(function() {
          if (registration && registration.update) {
            registration.update().catch(function() {
              // Silently handle update failures
            });
          }
        }, 60 * 60 * 1000); // Check every hour
        
        // Clean up interval if page is unloaded
        safeAddEventListener(window, 'beforeunload', function() {
          if (updateInterval) {
            try {
              clearInterval(updateInterval);
            } catch (e) {
              // Silently handle cleanup failures
            }
          }
        });
      })
      .catch(function(error) {
        safeLog('log', 'ServiceWorker registration failed, continuing without offline support:', error);
      });
  }
  
  // Wait for page load, with fallback for restricted environments
  if (document.readyState === 'loading') {
    var loadHandler = function() {
      registerServiceWorker();
    };
    
    if (!safeAddEventListener(document, 'DOMContentLoaded', loadHandler)) {
      // Fallback if event listeners are blocked
      setTimeout(registerServiceWorker, 100);
    }
  } else {
    // Page already loaded
    registerServiceWorker();
  }
})();
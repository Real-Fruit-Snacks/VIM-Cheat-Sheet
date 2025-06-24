/**
 * Safe storage utilities that work in restrictive corporate environments
 * Falls back to in-memory storage when localStorage is blocked
 * Enhanced for maximum compatibility with restricted browsers
 */

import { safeConsole, safeExecute } from './restrictedBrowserSupport'

// In-memory fallback storage with enhanced error handling
const memoryStorage = new Map<string, string>()

// Track storage availability to avoid repeated checks
let storageAvailable: boolean | null = null

/**
 * Comprehensive storage availability check
 */
function checkStorageAvailability(): boolean {
  if (storageAvailable !== null) {
    return storageAvailable
  }
  
  storageAvailable = safeExecute(() => {
    // Test multiple storage operations to ensure full availability
    const testKey = '__storage_test__' + Date.now()
    const testValue = 'test_value'
    
    // Test write
    localStorage.setItem(testKey, testValue)
    
    // Test read
    const retrieved = localStorage.getItem(testKey)
    if (retrieved !== testValue) {
      throw new Error('Storage read/write mismatch')
    }
    
    // Test delete
    localStorage.removeItem(testKey)
    
    // Verify deletion
    const afterDelete = localStorage.getItem(testKey)
    if (afterDelete !== null) {
      throw new Error('Storage deletion failed')
    }
    
    return true
  }, false)
  
  if (!storageAvailable) {
    safeConsole.warn('localStorage not available, using memory fallback')
  }
  
  return storageAvailable
}

/**
 * Safely get an item from localStorage with enhanced fallback handling
 */
export function safeGetItem(key: string): string | null {
  if (!key || typeof key !== 'string') {
    safeConsole.warn('Invalid storage key provided:', key)
    return null
  }
  
  if (checkStorageAvailability()) {
    return safeExecute(
      () => localStorage.getItem(key),
      memoryStorage.get(key) ?? null,
      `localStorage.getItem failed for key: ${key}`
    )
  }
  
  return memoryStorage.get(key) ?? null
}

/**
 * Safely set an item in localStorage with enhanced fallback handling
 */
export function safeSetItem(key: string, value: string): boolean {
  if (!key || typeof key !== 'string') {
    safeConsole.warn('Invalid storage key provided:', key)
    return false
  }
  
  if (value === null || value === undefined) {
    safeConsole.warn('Invalid storage value provided:', value)
    return false
  }
  
  // Convert value to string to ensure compatibility
  const stringValue = String(value)
  
  if (checkStorageAvailability()) {
    const success = safeExecute(
      () => {
        localStorage.setItem(key, stringValue)
        return true
      },
      false,
      `localStorage.setItem failed for key: ${key}`
    )
    
    if (success) {
      // Also store in memory as backup
      memoryStorage.set(key, stringValue)
      return true
    }
  }
  
  // Fallback to memory storage
  memoryStorage.set(key, stringValue)
  return false // Indicate that persistent storage failed
}

/**
 * Safely remove an item from storage
 */
export function safeRemoveItem(key: string): void {
  if (!key || typeof key !== 'string') {
    safeConsole.warn('Invalid storage key provided:', key)
    return
  }
  
  if (checkStorageAvailability()) {
    safeExecute(
      () => localStorage.removeItem(key),
      undefined,
      `localStorage.removeItem failed for key: ${key}`
    )
  }
  
  // Always remove from memory storage
  memoryStorage.delete(key)
}

/**
 * Get all keys from storage (localStorage + memory fallback)
 */
export function safeGetAllKeys(): string[] {
  const keys = new Set<string>()
  
  // Get keys from localStorage if available
  if (checkStorageAvailability()) {
    safeExecute(() => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) keys.add(key)
      }
    }, undefined)
  }
  
  // Add keys from memory storage
  for (const key of memoryStorage.keys()) {
    keys.add(key)
  }
  
  return Array.from(keys)
}

/**
 * Clear all storage (localStorage + memory)
 */
export function safeClearStorage(): void {
  if (checkStorageAvailability()) {
    safeExecute(
      () => localStorage.clear(),
      undefined,
      'localStorage.clear failed'
    )
  }
  
  memoryStorage.clear()
}

/**
 * Check if localStorage is available (legacy compatibility)
 */
export function isLocalStorageAvailable(): boolean {
  return checkStorageAvailability()
}

/**
 * Get storage statistics for debugging
 */
export function getStorageStats(): {
  localStorageAvailable: boolean
  memoryStorageSize: number
  totalKeys: number
} {
  return {
    localStorageAvailable: checkStorageAvailability(),
    memoryStorageSize: memoryStorage.size,
    totalKeys: safeGetAllKeys().length
  }
}

/**
 * Enhanced safe clipboard copy with comprehensive fallbacks for restricted environments
 */
export async function safeCopyToClipboard(text: string): Promise<{ 
  success: boolean; 
  method?: string; 
  fallbackUI?: boolean;
  userActionRequired?: boolean;
}> {
  if (!text || typeof text !== 'string') {
    safeConsole.warn('Invalid text provided for clipboard copy:', text)
    return { success: false }
  }

  // Method 1: Modern Clipboard API (most secure contexts)
  if (navigator.clipboard && window.isSecureContext) {
    const clipboardResult = await safeExecute(async () => {
      await navigator.clipboard.writeText(text)
      return { success: true, method: 'clipboard-api' }
    }, null)
    
    if (clipboardResult) {
      return clipboardResult
    }
  }

  // Method 2: Legacy execCommand with enhanced DOM manipulation safety
  const legacyResult = safeExecute(() => {
    // Create temporary element with enhanced security measures
    const textarea = document.createElement('textarea')
    
    // Prevent CSP violations and ensure invisibility
    textarea.value = text
    textarea.style.cssText = `
      position: fixed !important;
      left: -9999px !important;
      top: -9999px !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      background: transparent !important;
      opacity: 0 !important;
      pointer-events: none !important;
      z-index: -1000 !important;
    `
    
    // Additional attributes for maximum compatibility
    textarea.setAttribute('readonly', '')
    textarea.setAttribute('aria-hidden', 'true')
    textarea.setAttribute('tabindex', '-1')
    
    // Safe DOM manipulation
    const appendSuccess = safeExecute(() => {
      document.body.appendChild(textarea)
      return true
    }, false)
    
    if (!appendSuccess) {
      throw new Error('Could not append textarea to DOM')
    }

    let copySuccess = false
    try {
      // Multiple selection methods for maximum compatibility
      textarea.focus()
      textarea.select()
      
      // Fallback selection methods
      if (textarea.setSelectionRange) {
        textarea.setSelectionRange(0, text.length)
      }
      
      // Try execCommand
      copySuccess = document.execCommand('copy')
      
    } catch (selectError) {
      safeConsole.warn('Text selection failed:', selectError)
    }
    
    // Always cleanup, even if copy failed
    safeExecute(() => {
      document.body.removeChild(textarea)
    }, undefined)
    
    return {
      success: copySuccess,
      method: 'exec-command',
      fallbackUI: true
    }
  }, null)

  if (legacyResult && legacyResult.success) {
    return legacyResult
  }

  // Method 3: Manual copy instruction (when all automated methods fail)
  safeConsole.warn('All automated copy methods failed, user action required')
  
  // Try to focus a contenteditable element as last resort
  const manualResult = safeExecute(() => {
    const div = document.createElement('div')
    div.contentEditable = 'true'
    div.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #ccc;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      font-family: monospace;
      font-size: 12px;
      max-width: 300px;
      word-break: break-all;
    `
    div.textContent = text
    
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `
    
    overlay.appendChild(div)
    document.body.appendChild(overlay)
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      safeExecute(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay)
        }
      }, undefined)
    }, 5000)
    
    return {
      success: false,
      method: 'manual-instruction',
      fallbackUI: true,
      userActionRequired: true
    }
  }, {
    success: false,
    method: 'all-failed',
    fallbackUI: true,
    userActionRequired: true
  })

  return manualResult
}
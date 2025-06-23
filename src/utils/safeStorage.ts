/**
 * Safe storage utilities that work in restrictive corporate environments
 * Falls back to in-memory storage when localStorage is blocked
 */

// In-memory fallback storage
const memoryStorage = new Map<string, string>()

/**
 * Safely get an item from localStorage with fallback to memory
 */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn('localStorage access blocked, using memory fallback:', error)
    return memoryStorage.get(key) ?? null
  }
}

/**
 * Safely set an item in localStorage with fallback to memory
 */
export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.warn('localStorage access blocked, using memory fallback:', error)
    memoryStorage.set(key, value)
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Safe clipboard copy with fallback UI
 */
export async function safeCopyToClipboard(text: string): Promise<{ success: boolean; fallbackUI?: boolean }> {
  // First try the modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return { success: true }
    } catch (error) {
      console.warn('Clipboard API failed:', error)
    }
  }

  // Fallback: Create a temporary textarea
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-999999px'
  textarea.style.top = '-999999px'
  document.body.appendChild(textarea)
  
  try {
    textarea.select()
    const success = document.execCommand('copy')
    return { success, fallbackUI: true }
  } catch (error) {
    console.error('All copy methods failed:', error)
    return { success: false, fallbackUI: true }
  } finally {
    document.body.removeChild(textarea)
  }
}
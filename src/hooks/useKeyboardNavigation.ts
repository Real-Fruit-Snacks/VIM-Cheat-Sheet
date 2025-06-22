import { useEffect, useRef, useCallback } from 'react'

interface KeyboardNavigationOptions {
  onNavigateUp?: () => void
  onNavigateDown?: () => void
  onFocusSearch?: () => void
  onScrollToTop?: () => void
  onScrollToBottom?: () => void
  onToggleHelp?: () => void
  onEscape?: () => void
  onEnter?: () => void
  isEnabled?: boolean
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  const {
    onNavigateUp,
    onNavigateDown,
    onFocusSearch,
    onScrollToTop,
    onScrollToBottom,
    onToggleHelp,
    onEscape,
    onEnter,
    isEnabled = true
  } = options

  const isComposing = useRef(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isEnabled || isComposing.current) return

    // Don't interfere with input fields unless it's a special key
    const target = e.target as HTMLElement
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.contentEditable === 'true'

    // Allow Escape from input fields
    if (isInputField && e.key !== 'Escape') {
      return
    }

    let handled = true

    switch (e.key) {
      case 'j':
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          onNavigateDown?.()
        }
        break

      case 'k':
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          onNavigateUp?.()
        }
        break

      case '/':
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault()
          onFocusSearch?.()
        }
        break

      case 'g':
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          if (e.shiftKey) {
            // Shift+G - go to bottom
            onScrollToBottom?.()
          } else {
            // Double 'g' detection
            if (window.__lastGPress && Date.now() - window.__lastGPress < 300) {
              onScrollToTop?.()
              window.__lastGPress = 0
            } else {
              window.__lastGPress = Date.now()
              handled = false
            }
          }
        }
        break

      case 'G':
        if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
          onScrollToBottom?.()
        }
        break

      case '?':
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault()
          onToggleHelp?.()
        }
        break

      case 'Escape':
        onEscape?.()
        // Blur any focused input
        if (isInputField) {
          target.blur()
        }
        break

      case 'Enter':
        if (!isInputField) {
          onEnter?.()
        } else {
          handled = false
        }
        break

      default:
        handled = false
    }

    if (handled) {
      e.preventDefault()
    }
  }, [isEnabled, onNavigateUp, onNavigateDown, onFocusSearch, onScrollToTop, onScrollToBottom, onToggleHelp, onEscape, onEnter])

  // Handle composition events for IME
  useEffect(() => {
    const handleCompositionStart = () => {
      isComposing.current = true
    }

    const handleCompositionEnd = () => {
      isComposing.current = false
    }

    document.addEventListener('compositionstart', handleCompositionStart)
    document.addEventListener('compositionend', handleCompositionEnd)

    return () => {
      document.removeEventListener('compositionstart', handleCompositionStart)
      document.removeEventListener('compositionend', handleCompositionEnd)
    }
  }, [])

  useEffect(() => {
    if (!isEnabled) return

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, isEnabled])
}

// Global type augmentation for the double-g detection
declare global {
  interface Window {
    __lastGPress?: number
  }
}
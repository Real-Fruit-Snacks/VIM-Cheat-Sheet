import { useState, useEffect, useCallback, useRef } from 'react'
import { getAvailableKeys, getSubKeys, hasAvailableKeys, keyBindings, type KeyBinding } from '../data/key-bindings'

interface UseWhichKeyOptions {
  timeout?: number
  enabled?: boolean
  mode?: string
}

interface UseWhichKeyReturn {
  isVisible: boolean
  keySequence: string
  availableKeys: KeyBinding[]
  handleKeyPress: (key: string) => boolean
  handleKeySelect: (key: string) => void
  close: () => void
  reset: () => void
}

export function useWhichKey(options: UseWhichKeyOptions = {}): UseWhichKeyReturn {
  const {
    timeout = 800, // ms to wait before showing which-key
    enabled = true,
    mode = 'normal'
  } = options

  const [isVisible, setIsVisible] = useState(false)
  const [keySequence, setKeySequence] = useState('')
  const [availableKeys, setAvailableKeys] = useState<KeyBinding[]>([])
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastKeyTimeRef = useRef<number>(0)
  const sequenceRef = useRef<string>('')  // Add a ref to track sequence

  /** Clear pending timeout helper */
  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  /** Reset which-key state */
  const reset = useCallback(() => {
    clearCurrentTimeout()
    setIsVisible(false)
    setKeySequence('')
    setAvailableKeys([])
    sequenceRef.current = ''
  }, [clearCurrentTimeout])

  /** Close which-key popup */
  const close = useCallback(() => {
    setIsVisible(false)
    // Brief delay before full reset
    setTimeout(reset, 100)
  }, [reset])

  /** Update available keys based on current sequence */
  const updateAvailableKeys = useCallback((sequence: string) => {
    if (!sequence) {
      setAvailableKeys([])
      return
    }

    let keys: KeyBinding[] = []

    if (sequence.length === 1) {
      // Check for prefix key
      keys = getAvailableKeys(sequence, mode)
    } else if (sequence.length === 2) {
      // Get sub-key options
      const prefix = sequence[0]
      const key = sequence[1]
      keys = getSubKeys(prefix, key, mode)
    }

    setAvailableKeys(keys)
  }, [mode])

  /** Handle key selection from which-key popup */
  const handleKeySelect = useCallback((key: string) => {
    const newSequence = keySequence + key
    
    // Check if sequence is complete or continues
    const hasMoreKeys = hasAvailableKeys(newSequence, mode)
    
    if (hasMoreKeys) {
      // Continue sequence building
      setKeySequence(newSequence)
      updateAvailableKeys(newSequence)
    } else {
      // Execute complete command
      const keys = availableKeys.find(k => k.key === key)
      if (keys && keys.command) {
        // TODO: Execute command via vim.wasm
      }
      reset()
    }
  }, [keySequence, availableKeys, mode, reset, updateAvailableKeys])

  /** Handle key press from main application */
  const handleKeyPress = useCallback((key: string): boolean => {
    if (!enabled) return false
    
    // Always check current mode - don't process in insert mode
    if (mode !== 'normal') return false

    const now = Date.now()
    const timeSinceLastKey = now - lastKeyTimeRef.current
    lastKeyTimeRef.current = now

    // Reset on timeout
    if (timeSinceLastKey > 2000) {
      reset()
    }

    const currentSequence = sequenceRef.current + key

    // Check for potential completions
    if (sequenceRef.current === '' && !hasAvailableKeys(key, mode)) {
      return false
    }

    // Update key sequence
    setKeySequence(currentSequence)
    sequenceRef.current = currentSequence
    updateAvailableKeys(currentSequence)

    // Clear pending timeout
    clearCurrentTimeout()

    // Check for command completion
    const possibleKeys = currentSequence.length === 1 
      ? getAvailableKeys(currentSequence, mode)
      : getSubKeys(currentSequence.slice(0, -1), currentSequence.slice(-1), mode)

    // Detect complete commands (yy, dd, etc.)
    const isCompleteCommand = keyBindings[currentSequence[0]]?.some((binding: KeyBinding) => 
      binding.command === currentSequence
    ) || false

    if (isCompleteCommand) {
      // Reset on complete command
      reset()
      return true // Indicate processing
    }

    // Schedule which-key popup
    timeoutRef.current = setTimeout(() => {
      const keys = possibleKeys

      if (keys.length > 0) {
        setAvailableKeys(keys)
        setIsVisible(true)
      } else {
        reset()
      }
    }, timeout)

    // Indicate key handled
    return true
  }, [enabled, mode, timeout, clearCurrentTimeout, reset, updateAvailableKeys])

  /** Cleanup timeouts on unmount */
  useEffect(() => {
    return () => {
      clearCurrentTimeout()
    }
  }, [clearCurrentTimeout])

  /** Hide popup when sequence resets */
  useEffect(() => {
    if (!keySequence) {
      setIsVisible(false)
    }
  }, [keySequence])

  /** Reset which-key when mode changes away from normal */
  useEffect(() => {
    if (mode !== 'normal' && (isVisible || keySequence)) {
      reset()
    }
  }, [mode, isVisible, keySequence])

  return {
    isVisible,
    keySequence,
    availableKeys,
    handleKeyPress,
    handleKeySelect,
    close,
    reset
  }
}
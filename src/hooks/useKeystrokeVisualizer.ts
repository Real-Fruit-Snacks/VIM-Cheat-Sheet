import { useState, useCallback, useRef, useEffect } from 'react'

export interface Keystroke {
  id: string
  key: string
  modifiers: string[]
  timestamp: number
  fadeOutAt: number
}

export interface KeystrokeVisualizerConfig {
  position: 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right'
  fontSize: 'xs' | 'small' | 'medium' | 'large' | 'xl'
  maxKeystrokes: number
  fadeOutDelay: number
  enabled: boolean
}

const DEFAULT_CONFIG: KeystrokeVisualizerConfig = {
  position: 'bottom-center',
  fontSize: 'medium',
  maxKeystrokes: 5,
  fadeOutDelay: 2000,
  enabled: false
}

export function useKeystrokeVisualizer() {
  const [keystrokes, setKeystrokes] = useState<Keystroke[]>([])
  const [config, setConfig] = useState<KeystrokeVisualizerConfig>(() => {
    // Load config from localStorage
    const saved = localStorage.getItem('vim-keystroke-visualizer-config')
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) }
      } catch (e) {
        console.error('Failed to parse saved keystroke visualizer config:', e)
      }
    }
    return DEFAULT_CONFIG
  })
  
  const cleanupTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Save config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vim-keystroke-visualizer-config', JSON.stringify(config))
  }, [config])

  // Cleanup old keystrokes periodically
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now()
      setKeystrokes(prev => prev.filter(k => k.fadeOutAt > now))
    }

    // Run cleanup every 100ms
    cleanupTimerRef.current = setInterval(cleanup, 100)

    return () => {
      if (cleanupTimerRef.current) {
        clearInterval(cleanupTimerRef.current)
      }
    }
  }, [])

  const addKeystroke = useCallback((event: KeyboardEvent) => {
    if (!config.enabled) return

    // CRITICAL: Do NOT call any methods that might affect focus
    // Do NOT call preventDefault() or stopPropagation()
    // This must be completely passive

    // Format the key
    let key = event.key
    const modifiers: string[] = []

    // Collect modifiers
    if (event.ctrlKey) modifiers.push('Ctrl')
    if (event.altKey) modifiers.push('Alt')
    if (event.shiftKey && key.length > 1) modifiers.push('Shift') // Only show Shift for special keys
    if (event.metaKey) modifiers.push('Cmd')

    // Format special keys
    const keyMap: Record<string, string> = {
      ' ': 'Space',
      'Enter': '↵',
      'Tab': '⇥',
      'Escape': 'Esc',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'Backspace': '⌫',
      'Delete': 'Del',
      'Home': 'Home',
      'End': 'End',
      'PageUp': 'PgUp',
      'PageDown': 'PgDn',
      'Control': 'Ctrl',
      'Alt': 'Alt',
      'Shift': 'Shift',
      'Meta': 'Cmd',
      'CapsLock': 'Caps',
      'F1': 'F1',
      'F2': 'F2',
      'F3': 'F3',
      'F4': 'F4',
      'F5': 'F5',
      'F6': 'F6',
      'F7': 'F7',
      'F8': 'F8',
      'F9': 'F9',
      'F10': 'F10',
      'F11': 'F11',
      'F12': 'F12'
    }

    // Don't show modifier keys by themselves
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
      return
    }

    key = keyMap[key] || key

    // Create the keystroke
    const keystroke: Keystroke = {
      id: `${Date.now()}-${Math.random()}`,
      key,
      modifiers,
      timestamp: Date.now(),
      fadeOutAt: Date.now() + config.fadeOutDelay
    }

    // Use requestAnimationFrame to avoid blocking the event loop
    // This ensures VIM processes the keystroke before we update state
    requestAnimationFrame(() => {
      setKeystrokes(prev => {
        const updated = [...prev, keystroke]
        // Keep only the most recent keystrokes
        return updated.slice(-config.maxKeystrokes)
      })
    })
  }, [config.enabled, config.fadeOutDelay, config.maxKeystrokes])

  const updateConfig = useCallback((updates: Partial<KeystrokeVisualizerConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  const clearKeystrokes = useCallback(() => {
    setKeystrokes([])
  }, [])

  return {
    keystrokes,
    config,
    addKeystroke,
    updateConfig,
    clearKeystrokes
  }
}
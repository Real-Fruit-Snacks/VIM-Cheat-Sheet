import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { getWorkerScriptPath } from '../utils/vim-loader'
import WhichKey from './WhichKey'
import { useWhichKey } from '../hooks/useWhichKey'
import { VimrcManager } from '../utils/vimrc-manager'
import type { VimrcApplyResult } from '../utils/vimrc-manager'

declare global {
  interface Window {
    VimWasm?: any
  }
}

/** Props for VIM editor component */
interface VimEditorProps {
  /** Initial vimrc configuration content */
  vimrcContent?: string
  /** Disable which-key helper system */
  disableWhichKey?: boolean
  /** Callback for keystroke visualization */
  onKeyPress?: (event: KeyboardEvent) => void
  /** Indicates if modal dialogs are open (affects focus management) */
  hasModalOpen?: boolean
}

/** VIM editor imperative handle interface */
export interface VimEditorRef {
  /** Apply vimrc configuration to running VIM instance */
  applyVimrc: (content: string, testMode?: boolean) => Promise<VimrcApplyResult>
  /** Revert vimrc changes (currently requires page reload) */
  revertVimrc: () => Promise<void>
  /** Check if VIM instance is ready for commands */
  isVimReady: () => boolean
  /** Load content into VIM editor */
  loadFile: (content: string, filename?: string) => Promise<void>
}

const VimEditor = forwardRef<VimEditorRef, VimEditorProps>(({ vimrcContent, disableWhichKey = false, onKeyPress, hasModalOpen = false }, ref) => {
  const vimRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const vimrcManagerRef = useRef<VimrcManager | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMode, setCurrentMode] = useState('normal')
  const currentModeRef = useRef('normal')
  const initStartedRef = useRef(false)
  
  /** Maintain latest onKeyPress callback reference */
  const onKeyPressRef = useRef(onKeyPress)
  useEffect(() => {
    onKeyPressRef.current = onKeyPress
  }, [onKeyPress])

  /** Initialize which-key system for command discovery */
  const whichKey = useWhichKey({
    timeout: 200,
    enabled: !disableWhichKey && currentMode === 'normal',
    mode: currentMode
  })
  
  /** Expose VIM instance control methods to parent component */
  useImperativeHandle(ref, () => ({
    applyVimrc: async (content: string, testMode: boolean = false) => {
      if (!vimrcManagerRef.current) {
        throw new Error('VimrcManager not initialized')
      }
      return await vimrcManagerRef.current.applyVimrc(content, testMode)
    },
    revertVimrc: async () => {
      if (!vimrcManagerRef.current) {
        throw new Error('VimrcManager not initialized')
      }
      return await vimrcManagerRef.current.revertSettings()
    },
    isVimReady: () => {
      return vimRef.current && 
             vimRef.current.isRunning && 
             vimRef.current.isRunning() &&
             vimRef.current.input &&
             vimRef.current.cmdline
    },
    loadFile: async (content: string, filename?: string) => {
      // Wait for VIM to be fully ready with proper retry logic
      const waitForVimReady = async (maxAttempts = 30, delayMs = 200) => {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          // Log what we're checking
          if (attempt === 0 || attempt % 5 === 0) {
            console.log(`🔍 Checking VIM ready (attempt ${attempt + 1}/${maxAttempts}):`, {
              hasVimRef: !!vimRef.current,
              hasIsRunning: vimRef.current ? !!vimRef.current.isRunning : false,
              isRunning: vimRef.current && vimRef.current.isRunning ? vimRef.current.isRunning() : false,
              hasInput: vimRef.current ? !!vimRef.current.input : false,
              hasCmdline: vimRef.current ? !!vimRef.current.cmdline : false,
              inputType: vimRef.current && vimRef.current.input ? typeof vimRef.current.input : 'none',
              cmdlineType: vimRef.current && vimRef.current.cmdline ? typeof vimRef.current.cmdline : 'none'
            })
          }
          
          if (vimRef.current && 
              vimRef.current.isRunning && 
              vimRef.current.isRunning()) {
            // Check if methods exist
            if (vimRef.current.input && vimRef.current.cmdline) {
              // VIM methods exist and are functions, consider it ready
              console.log(`✅ VIM ready after ${attempt + 1} attempts`)
              return true
            }
          }
          
          if (attempt < maxAttempts - 1) {
            await new Promise(resolve => setTimeout(resolve, delayMs))
          }
        }
        
        // Log final state before giving up
        console.error('❌ VIM failed to become ready. Final state:', {
          hasVimRef: !!vimRef.current,
          vimRef: vimRef.current
        })
        return false
      }

      const isReady = await waitForVimReady()
      if (!isReady) {
        throw new Error('VIM failed to become ready after waiting. Please refresh the page and try again.')
      }
      
      try {
        
        // Clear current buffer
        await vimRef.current.cmdline('enew!')
        
        // Set filename if provided
        if (filename) {
          await vimRef.current.cmdline(`file ${filename}`)
        }
        
        // Clear the buffer completely
        await vimRef.current.cmdline('normal! ggdG')
        
        // Split content into lines
        const lines = content.split('\n')
        
        if (lines.length === 0) {
          return // Empty content, nothing to insert
        }
        
        // Insert the first line
        if (lines[0]) {
          await vimRef.current.cmdline('normal! i')
          // Insert character by character to avoid escaping issues
          for (const char of lines[0]) {
            await vimRef.current.input(char)
          }
          await vimRef.current.input('<Esc>')
        }
        
        // Insert remaining lines
        for (let i = 1; i < lines.length; i++) {
          await vimRef.current.cmdline('normal! o')
          // Insert character by character for each line
          for (const char of lines[i]) {
            await vimRef.current.input(char)
          }
          await vimRef.current.input('<Esc>')
        }
        
        // Move cursor to beginning
        await vimRef.current.cmdline('normal! gg')
        
        // Clear modified flag
        await vimRef.current.cmdline('set nomodified')
        
        console.log('✅ File loaded successfully:', filename || 'Untitled')
        
      } catch (error) {
        console.error('❌ Failed to load file:', error)
        
        // Provide more specific error information
        if (error instanceof Error) {
          if (error.message.includes('input is not a function')) {
            throw new Error('VIM input method unavailable - please wait for VIM to fully initialize')
          } else if (error.message.includes('cmdline')) {
            throw new Error('VIM command interface unavailable - please restart the editor')
          }
        }
        
        throw new Error(`Failed to load file: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }))

  useEffect(() => {
    const initializeVim = async () => {
      if (!containerRef.current || initStartedRef.current) return
      
      initStartedRef.current = true

      try {
        setIsLoading(true)
        setError(null)

        /** Verify browser WebAssembly compatibility */
        if (!window.SharedArrayBuffer) {
          throw new Error('Your browser does not support SharedArrayBuffer. Please use Chrome, Firefox, or Safari with the required flags enabled.')
        }

        // Wait for VimWasm module to load
        let attempts = 0;
        while (!(window as any).VimWasm && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }

        const VimWasm = (window as any).VimWasm
        if (!VimWasm) {
          throw new Error('VimWasm not loaded. The vim-wasm module may not have loaded correctly.')
        }

        // Initialize DOM container
        containerRef.current.innerHTML = ''

        /** Create canvas for VIM rendering */
        const canvas = document.createElement('canvas')
        canvas.style.position = 'absolute'
        canvas.style.top = '0'
        canvas.style.left = '0'
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        // Optimize canvas for pixel-perfect rendering
        canvas.style.imageRendering = 'pixelated'
        containerRef.current.appendChild(canvas)

        /** Create hidden input for keyboard event capture */
        const input = document.createElement('input')
        input.style.position = 'absolute'
        input.style.left = '0'
        input.style.top = '0'
        input.style.width = '1px'
        input.style.height = '1px'
        input.style.color = 'transparent'
        input.style.backgroundColor = 'transparent'
        input.style.border = 'none'
        input.style.outline = 'none'
        input.style.zIndex = '-1'
        input.style.pointerEvents = 'none'
        input.setAttribute('autocomplete', 'off')
        input.setAttribute('autofocus', 'true')
        containerRef.current.appendChild(input)
        
        /** Implement intelligent focus management */
        input.addEventListener('blur', () => {
          // Only manage focus when VIM is active
          if (vimRef.current?.isRunning && vimRef.current.isRunning()) {
            // Allow time for legitimate focus changes
            setTimeout(() => {
              const activeEl = document.activeElement
              
              /** Check for legitimate form inputs */
              const isLegitimateInput = activeEl && (
                activeEl.tagName === 'INPUT' ||
                activeEl.tagName === 'TEXTAREA' ||
                activeEl.tagName === 'SELECT' ||
                (activeEl as HTMLElement).contentEditable === 'true' ||
                activeEl.getAttribute('role') === 'textbox'
              )
              
              // Respect modal and dialog focus
              const hasModal = hasModalOpen || 
                              document.querySelector('[role="dialog"]') ||
                              document.querySelector('.fixed.inset-0') ||
                              document.querySelector('[data-modal]')
              
              if (!isLegitimateInput && !hasModal && document.activeElement !== input) {
                input.focus()
              }
            }, 0)
          }
        })

        /** Reference to VIM input element */
        const vimInputRef = input
        
        /** Keyboard event handler for VIM and which-key integration */
        const handleKeyDown = (event: KeyboardEvent) => {
          // Preserve active element reference
          const activeElementBefore = document.activeElement
          
          // Forward to keystroke visualizer
          if (onKeyPressRef.current) {
            onKeyPressRef.current(event)
          }
          
          /** Restore VIM input focus if lost during processing */
          if (activeElementBefore === vimInputRef && document.activeElement !== vimInputRef) {
            const currentActiveEl = document.activeElement
            
            // Respect legitimate form element focus
            const isLegitimateInput = currentActiveEl && (
              currentActiveEl.tagName === 'INPUT' ||
              currentActiveEl.tagName === 'TEXTAREA' ||
              currentActiveEl.tagName === 'SELECT' ||
              (currentActiveEl as HTMLElement).contentEditable === 'true' ||
              currentActiveEl.getAttribute('role') === 'textbox'
            )
            
            if (!isLegitimateInput) {
              vimInputRef.focus()
            }
          }
          
          // Skip already handled events
          if (event.defaultPrevented) {
            return
          }
          
          /** VIM mode change detection logic */
          const key = event.key
          const ctrl = event.ctrlKey
          
          // Mode detection affects which-key visibility
          if (currentModeRef.current === 'normal') {
            // Standard insert mode triggers
            if (['i', 'I', 'a', 'A', 'o', 'O', 's', 'S', 'C'].includes(key) && !ctrl) {
              setCurrentMode('insert')
              currentModeRef.current = 'insert'
              return
            }
            /** Special handling for 'c' operator - wait for motion or double 'c' */
            if (key === 'c' && !ctrl && whichKey.keySequence === '') {
              // Wait for motion or second 'c'
            } else if (key === 'c' && !ctrl && whichKey.keySequence === 'c') {
              // Change entire line with 'cc'
              setCurrentMode('insert')
              currentModeRef.current = 'insert'
              whichKey.reset()
              return
            }
            // Handle 'gi' - go to last insert position
            if (key === 'i' && whichKey.keySequence === 'g') {
              setCurrentMode('insert')
              currentModeRef.current = 'insert'
              whichKey.reset()
              return
            }
            // Visual mode triggers
            if (['v', 'V'].includes(key) && !ctrl) {
              setCurrentMode('visual')
              currentModeRef.current = 'visual'
              return
            }
            // Visual block mode
            if (key === 'v' && ctrl) {
              setCurrentMode('visual-block')
              currentModeRef.current = 'visual-block'
              return
            }
            // Command mode
            if (key === ':' && !ctrl) {
              setCurrentMode('command')
              currentModeRef.current = 'command'
              return
            }
            // Replace mode
            if (key === 'R' && !ctrl) {
              setCurrentMode('replace')
              currentModeRef.current = 'replace'
              return
            }
          } else {
            // Return to normal mode
            if (key === 'Escape' || (key === '[' && ctrl)) {
              setCurrentMode('normal')
              currentModeRef.current = 'normal'
              return
            }
            // Let VIM handle non-normal mode keys
            if (currentModeRef.current !== 'normal') {
              return
            }
          }
          
          // Which-key only operates in normal mode
          if (currentModeRef.current !== 'normal') return
          
          /** Handle Ctrl-w window management prefix */
          if (event.ctrlKey && event.key === 'w') {
            const handled = whichKey.handleKeyPress('Ctrl-w')
            if (handled) {
              // Prevent browser window close
              event.preventDefault()
              event.stopPropagation()
            }
            return
          }
          
          // Skip modifier key combinations
          if (event.ctrlKey || event.altKey || event.metaKey) return
          
          /** Space key acts as leader prefix */
          if (event.key === ' ') {
            const handled = whichKey.handleKeyPress(' ')
            if (handled) {
              // Prevent space as it's our leader key
              event.preventDefault()
              event.stopPropagation()
            }
            return
          }
          
          // Handle Tab key in sequences
          if (event.key === 'Tab') {
            const handled = whichKey.handleKeyPress('Tab')
            if (handled && whichKey.keySequence) {
              // Prevent Tab only during sequences
              event.preventDefault()
              event.stopPropagation()
            }
            return
          }
          
          /** Handle VIM prefix keys that start sequences */
          const prefixKeys = ['g', 'z', '[', ']', 'c', 'd', 'y', 'v', '"', "'", 'm', 'r', 't', 'T', 'f', 'F', '@', 'q', '`', '>', '<', '=', ':']
          if (prefixKeys.includes(event.key)) {
            const handled = whichKey.handleKeyPress(event.key)
            if (handled) {
              // Let VIM handle naturally, which-key observes
              return
            }
            return
          }
          
          // Handle numeric prefixes and counts
          if (/^[0-9]$/.test(event.key)) {
            const handled = whichKey.handleKeyPress(event.key)
            if (handled && whichKey.keySequence) {
              // Prevent only during sequences
              event.preventDefault()
              event.stopPropagation()
            }
            return
          }
        }

        /** Add capture-phase keyboard listener for which-key and visualizer integration */
        document.addEventListener('keydown', handleKeyDown, true)
        
        // Attach handler reference for cleanup
        const inputElement = input as any
        inputElement._whichKeyHandler = handleKeyDown

        const vim = new VimWasm({
          canvas,
          input,
          workerScriptPath: getWorkerScriptPath(),
        })

        /** Configure VIM font settings */
        vim.onVimInit = () => {
          // Configure monospace font
          const fontFamily = '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", "Courier New", monospace'
          const fontSize = 16 // Fixed font size for better readability
          
          // Apply font to VIM screen
          if (vim.screen && vim.screen.setFont) {
            vim.screen.setFont(fontFamily, fontSize)
          }
          
          // Ensure proper initial scaling
          setTimeout(() => {
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect()
              vim.resize(rect.width, rect.height)
            }
          }, 100)
        }

        /** Configure clipboard integration with error handling */
        vim.readClipboard = async () => {
          /** VIM clipboard read operation */
          
          // Verify clipboard API availability
          if (!navigator.clipboard) {
            console.error('Clipboard API not available')
            throw new Error('Clipboard API not supported')
          }
          
          try {
            // Check clipboard permissions
            await navigator.permissions.query({ name: 'clipboard-read' as PermissionName })
            
            const text = await navigator.clipboard.readText()
            // Return clipboard content
            return text
          } catch (err) {
            console.error('Failed to read clipboard:', err)
            
            // Log specific error types
            if (err instanceof DOMException) {
              if (err.name === 'NotAllowedError') {
                console.error('Clipboard access denied. User must grant permission.')
              } else if (err.name === 'NotFoundError') {
                console.error('No text found in clipboard.')
              }
            }
            
            throw err
          }
        }

        vim.onWriteClipboard = async (text: string) => {
          /** VIM clipboard write operation */
          
          // Verify clipboard API availability
          if (!navigator.clipboard) {
            console.error('Clipboard API not available for writing')
            return
          }
          
          try {
            await navigator.clipboard.writeText(text)
            // Clipboard write successful
          } catch (err) {
            console.error('Failed to write clipboard:', err)
            
            if (err instanceof DOMException && err.name === 'NotAllowedError') {
              console.error('Clipboard write access denied.')
            }
          }
        }

        await vim.start({
          clipboard: true, // Enable clipboard integration
          cmdArgs: [], // Start with empty session
        })

        vimRef.current = vim
        
        // Wait a bit for VIM to fully initialize after start
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Set initial focus to VIM input
        setTimeout(() => {
          input.focus()
        }, 100)
        
        // Setup vimrc management
        vimrcManagerRef.current = new VimrcManager(vim)
        
        /** Apply initial vimrc configuration if provided */
        if (vimrcContent) {
          /** Process and execute vimrc commands line by line */
          const applyVimrc = async () => {
            try {
              const lines = vimrcContent.split('\n')
              const results = { success: 0, failed: 0, skipped: 0 }
              
              for (const line of lines) {
                const trimmedLine = line.trim()
                
                // Skip empty lines and comments
                if (!trimmedLine || trimmedLine.startsWith('"')) {
                  results.skipped++
                  continue
                }
                
                try {
                  await vim.cmdline(trimmedLine)
                  results.success++
                } catch (err) {
                  results.failed++
                  console.warn('Failed to execute vimrc line:', trimmedLine, err)
                }
              }
              
              // Errors logged per line, parent handles feedback
            } catch (err) {
              console.error('Failed to apply vimrc:', err)
            }
          }
          
          /** Wait for VIM initialization before applying commands */
          let attempts = 0
          const checkInterval = setInterval(async () => {
            attempts++
            
            if (vim && vim.isRunning && vim.isRunning()) {
              clearInterval(checkInterval)
              // Extra delay for VIM internal state
              setTimeout(applyVimrc, 100)
            } else if (attempts > 20) { // 2 second timeout
              clearInterval(checkInterval)
              console.error('Timeout waiting for vim to initialize for vimrc application')
            }
          }, 100)
        }
        
        // Set initial canvas dimensions
        const rect = containerRef.current.getBoundingClientRect()
        vim.resize(Math.floor(rect.width), Math.floor(rect.height))
        
        /** Setup intelligent resize handling */
        let resizeInProgress = false
        
        const handleResize = () => {
          if (!vim || !vim.isRunning || !vim.isRunning() || resizeInProgress) {
            return
          }
          
          if (!containerRef.current) {
            return
          }
          
          const newRect = containerRef.current.getBoundingClientRect()
          const width = Math.floor(newRect.width)
          const height = Math.floor(newRect.height)
          
          if (width <= 0 || height <= 0) {
            return
          }
          
          resizeInProgress = true
          
          // Clear pending resize timeout
          clearTimeout((vim as any)._resizeTimeout)
          
          ;(vim as any)._resizeTimeout = setTimeout(() => {
            try {
              const canvas = containerRef.current?.querySelector('canvas')
              if (!canvas) {
                resizeInProgress = false
                return
              }
              
              /** VIM-WASM manages its own rendering, rely on internal redraw */
              
              // Execute resize operation
              vim.resize(width, height)
              
              // Restore font configuration
              const fontFamily = '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", "Courier New", monospace'
              const fontSize = 16
              if (vim.screen && vim.screen.setFont) {
                vim.screen.setFont(fontFamily, fontSize)
              }
              
              /** Multi-strategy screen refresh approach */
              const refreshScreen = async () => {
                try {
                  await vim.cmdline('redraw!')
                } catch (e) {
                  console.log('Redraw failed, trying alternative methods')
                }
                
                setTimeout(() => {
                  try {
                    // Ctrl+L refresh
                    vim.input('<C-l>')
                  } catch (e) {
                    // Ignore
                  }
                  
                  setTimeout(() => {
                    try {
                      vim.input('<Esc>')
                      setTimeout(() => {
                        vim.cmdline('redraw!')
                      }, 50)
                    } catch (e) {
                      // Ignore
                    }
                  }, 100)
                }, 100)
                
                resizeInProgress = false
              }
              
              setTimeout(refreshScreen, 100)
              
            } catch (err) {
              console.error('Error during resize:', err)
              resizeInProgress = false
            }
          }, 300) // Debounce for stability
        }
        
        /** Setup dual resize detection (ResizeObserver + window events) */
        const resizeObserver = new ResizeObserver(handleResize)
        
        // Add window resize fallback
        const windowResizeHandler = () => handleResize()
        window.addEventListener('resize', windowResizeHandler)
        
        if (containerRef.current) {
          resizeObserver.observe(containerRef.current)
        }
        
        // Store references for cleanup
        ;(vim as any)._resizeObserver = resizeObserver
        ;(vim as any)._windowResizeHandler = windowResizeHandler
        
        /** Periodic focus guardian to maintain VIM input focus */
        const focusGuardian = setInterval(() => {
          if (vim && vim.isRunning && vim.isRunning() && containerRef.current) {
            const activeEl = document.activeElement
            
            /** Check for legitimate form inputs */
            const isLegitimateInput = activeEl && (
              activeEl.tagName === 'INPUT' ||
              activeEl.tagName === 'TEXTAREA' ||
              activeEl.tagName === 'SELECT' ||
              (activeEl as HTMLElement).contentEditable === 'true' ||
              activeEl.getAttribute('role') === 'textbox'
            )
            
            // Respect modal and dialog focus
            const hasModal = hasModalOpen || 
                            document.querySelector('[role="dialog"]') ||
                            document.querySelector('.fixed.inset-0') ||
                            document.querySelector('[data-modal]')
            
            // Restore focus only when appropriate
            if (!isLegitimateInput && !hasModal && document.activeElement !== input) {
              input.focus()
            }
          }
        }, 2000) // 2-second intervals
        
        ;(vim as any)._focusGuardian = focusGuardian
        
        setIsLoading(false)

      } catch (err) {
        console.error('Failed to initialize vim:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize vim')
        setIsLoading(false)
      }
    }

    initializeVim()

    return () => {
      if (vimRef.current) {
        try {
          if ((vimRef.current as any)._resizeObserver) {
            ;(vimRef.current as any)._resizeObserver.disconnect()
          }
          
          // Clear resize timeout
          if ((vimRef.current as any)._resizeTimeout) {
            clearTimeout((vimRef.current as any)._resizeTimeout)
          }
          
          // Remove window handler
          if ((vimRef.current as any)._windowResizeHandler) {
            window.removeEventListener('resize', (vimRef.current as any)._windowResizeHandler)
          }
          
          // Clear focus timer
          if ((vimRef.current as any)._focusGuardian) {
            clearInterval((vimRef.current as any)._focusGuardian)
          }
          
          // Clean VIM shutdown
          vimRef.current.cmdline('qa!')
        } catch (e) {
          // Ignore cleanup errors
        }
        vimRef.current = null
      }
      if (containerRef.current) {
        // Remove which-key handler
        const input = containerRef.current.querySelector('input')
        if (input && (input as any)._whichKeyHandler) {
          document.removeEventListener('keydown', (input as any)._whichKeyHandler, true)
        }
        
        containerRef.current.innerHTML = ''
      }
      initStartedRef.current = false
    }
  }, [])
  useEffect(() => {
    if (currentMode !== 'normal') {
      whichKey.reset()
    }
  }, [currentMode, whichKey])

  return (
    <div className="h-full bg-gray-950 overflow-hidden">
      <div className="h-full relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading VIM...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 p-8">
            <div className="text-center max-w-2xl">
              <h3 className="text-red-400 text-xl font-semibold mb-4">Unable to load VIM</h3>
              <p className="text-gray-300 mb-6">{error}</p>
              
              <div className="bg-gray-800 rounded-lg p-6 text-left">
                <h4 className="text-yellow-400 font-semibold mb-3">Browser Compatibility Requirements:</h4>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-green-400 font-semibold mb-1">✅ Chrome/Edge (Recommended)</p>
                    <p className="text-gray-400">Works out of the box - no configuration needed</p>
                  </div>
                  
                  <div>
                    <p className="text-yellow-400 font-semibold mb-1">⚠️ Firefox</p>
                    <p className="text-gray-400 mb-2">Requires security headers. For local development:</p>
                    <ol className="list-decimal list-inside text-gray-400 ml-4 space-y-1">
                      <li>The development server has been configured with the required headers</li>
                      <li>Restart the dev server: <code className="bg-gray-700 px-2 py-1 rounded">npm run dev</code></li>
                      <li>Hard refresh the page: <code className="bg-gray-700 px-2 py-1 rounded">Ctrl+Shift+R</code></li>
                    </ol>
                  </div>
                  
                  <div>
                    <p className="text-blue-400 font-semibold mb-1">🔧 Safari</p>
                    <p className="text-gray-400">Enable "Disable Cross-Origin Restrictions" in Developer menu</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-900 rounded">
                  <p className="text-gray-300 text-xs">
                    <strong>Note:</strong> vim.wasm requires SharedArrayBuffer and Atomics APIs for performance. 
                    These require specific security headers (COOP/COEP) to be enabled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div 
          ref={containerRef} 
          className="w-full h-full relative"
          style={{ isolation: 'isolate' }}
        />
      </div>

      {!disableWhichKey && (
        <WhichKey
          isVisible={whichKey.isVisible}
          keySequence={whichKey.keySequence}
          availableKeys={whichKey.availableKeys}
          onKeySelect={whichKey.handleKeySelect}
          onClose={whichKey.close}
        />
      )}
    </div>
  )
})

VimEditor.displayName = 'VimEditor'

export default VimEditor
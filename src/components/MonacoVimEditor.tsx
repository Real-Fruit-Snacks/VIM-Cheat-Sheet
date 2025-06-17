import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as monaco from 'monaco-editor';
import { initVimMode } from 'monaco-vim';
import type { VimrcApplyResult } from '../utils/vimrc-manager';
import type { VimEditorRef } from './VimEditor';
import WhichKey from './WhichKey';
import { useWhichKey } from '../hooks/useWhichKey';

// Configure Monaco environment to suppress web worker warnings in private mode
if (typeof window !== 'undefined' && !window.MonacoEnvironment) {
  window.MonacoEnvironment = {
    getWorker: function() {
      // Return a fake worker that does nothing to suppress warnings
      // Monaco will fall back to synchronous mode automatically
      return {
        postMessage: () => {},
        terminate: () => {}
      } as unknown as Worker;
    }
  };
}

interface MonacoVimEditorProps {
  vimrcContent?: string;
  disableWhichKey?: boolean;
  onKeyPress?: (event: KeyboardEvent) => void;
  hasModalOpen?: boolean;
  onModeChange?: (mode: string) => void;
}

/**
 * Monaco-based VIM editor component - fallback when SharedArrayBuffer is not available
 */
const MonacoVimEditor = forwardRef<VimEditorRef, MonacoVimEditorProps>(
  ({ vimrcContent, onKeyPress, hasModalOpen, onModeChange, disableWhichKey = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const vimModeRef = useRef<ReturnType<typeof initVimMode> | null>(null);
    const statusNodeRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [currentMode, setCurrentMode] = useState('normal');
    const currentModeRef = useRef('normal');
    const lastOperatorRef = useRef<string | null>(null);
    const operatorPendingRef = useRef(false);
    
    // Keep a ref to the latest onKeyPress callback
    const onKeyPressRef = useRef(onKeyPress);
    useEffect(() => {
      onKeyPressRef.current = onKeyPress;
    }, [onKeyPress]);
    
    // Update mode ref when state changes
    useEffect(() => {
      currentModeRef.current = currentMode;
    }, [currentMode]);
    
    // Initialize which-key system
    const whichKey = useWhichKey({
      timeout: 200,  // Near-instant Which-Key appearance
      enabled: !disableWhichKey && currentMode === 'normal',
      mode: currentMode,
      onExecuteCommand: (command: string) => {
        // Execute the command in Monaco-vim
        if (vimModeRef.current && editorRef.current) {
          try {
            // Monaco-vim doesn't have a direct command execution API
            // So we simulate keypresses by dispatching keyboard events
            const editor = editorRef.current;
            for (const char of command) {
              editor.trigger('which-key', 'type', { text: char });
            }
          } catch (e) {
            console.error('[MonacoVim] Failed to execute command:', command, e);
          }
        }
      }
    });
    
    useImperativeHandle(ref, () => ({
      applyVimrc: async (content: string): Promise<VimrcApplyResult> => {
        // Monaco-vim doesn't support full vimrc, but we can apply some basic settings
        const allLines = content.split('\n');
        const result: VimrcApplyResult = {
          results: [],
          totalLines: allLines.length,
          successCount: 0,
          failedCount: 0,
          skippedCount: 0
        };
        
        allLines.forEach((line, index) => {
          const lineNumber = index + 1;
          const trimmedLine = line.trim();
          
          // Skip empty lines and comments
          if (!trimmedLine || trimmedLine.startsWith('"')) {
            result.skippedCount++;
            return;
          }
          try {
            // Extract common vimrc commands and apply what we can
            if (trimmedLine.includes('set number')) {
              editorRef.current?.updateOptions({ lineNumbers: 'on' });
              result.results.push({ line: trimmedLine, lineNumber, success: true });
              result.successCount++;
            } else if (trimmedLine.includes('set nonumber')) {
              editorRef.current?.updateOptions({ lineNumbers: 'off' });
              result.results.push({ line: trimmedLine, lineNumber, success: true });
              result.successCount++;
            } else if (trimmedLine.includes('set wrap')) {
              editorRef.current?.updateOptions({ wordWrap: 'on' });
              result.results.push({ line: trimmedLine, lineNumber, success: true });
              result.successCount++;
            } else if (trimmedLine.includes('set nowrap')) {
              editorRef.current?.updateOptions({ wordWrap: 'off' });
              result.results.push({ line: trimmedLine, lineNumber, success: true });
              result.successCount++;
            } else if (trimmedLine.includes('set tabstop=')) {
              const match = trimmedLine.match(/set tabstop=(\d+)/);
              if (match) {
                editorRef.current?.getModel()?.updateOptions({ tabSize: parseInt(match[1]) });
                result.results.push({ line: trimmedLine, lineNumber, success: true });
                result.successCount++;
              } else {
                result.results.push({ 
                  line: trimmedLine, 
                  lineNumber,
                  success: false, 
                  error: 'Invalid tabstop value' 
                });
                result.failedCount++;
              }
            } else {
              // Command not supported in Monaco-vim
              result.results.push({ 
                line: trimmedLine, 
                lineNumber,
                success: false, 
                error: 'Command not supported in Monaco VIM mode' 
              });
              result.failedCount++;
            }
          } catch (error) {
            result.results.push({ 
              line: trimmedLine, 
              lineNumber,
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
            result.failedCount++;
          }
        });
        
        return result;
      },
      
      revertVimrc: async () => {
        // Reset to default options
        editorRef.current?.updateOptions({
          lineNumbers: 'on',
          wordWrap: 'off'
        });
      },
      
      isVimReady: () => isReady,
      
      loadFile: async (content: string, filename?: string) => {
        if (!editorRef.current) {
          throw new Error('Monaco editor is not ready');
        }
        
        try {
          // Set the content
          editorRef.current.setValue(content);
          
          // Move cursor to beginning
          editorRef.current.setPosition({ lineNumber: 1, column: 1 });
          
          // Clear selection
          editorRef.current.setSelection({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1
          });
          
          // Update the model's URI if filename is provided
          if (filename) {
            const model = editorRef.current.getModel();
            if (model) {
              // Determine language from file extension
              const ext = filename.split('.').pop()?.toLowerCase();
              let language = 'plaintext';
              
              const languageMap: Record<string, string> = {
                'js': 'javascript',
                'jsx': 'javascript',
                'ts': 'typescript', 
                'tsx': 'typescript',
                'py': 'python',
                'rb': 'ruby',
                'go': 'go',
                'rs': 'rust',
                'cpp': 'cpp',
                'c': 'c',
                'h': 'c',
                'hpp': 'cpp',
                'java': 'java',
                'cs': 'csharp',
                'php': 'php',
                'html': 'html',
                'css': 'css',
                'scss': 'scss',
                'sass': 'sass',
                'less': 'less',
                'json': 'json',
                'xml': 'xml',
                'yaml': 'yaml',
                'yml': 'yaml',
                'md': 'markdown',
                'sh': 'shell',
                'bash': 'shell',
                'zsh': 'shell',
                'conf': 'ini',
                'ini': 'ini',
                'toml': 'toml',
                'sql': 'sql',
                'csv': 'plaintext',
                'txt': 'plaintext'
              };
              
              if (ext && languageMap[ext]) {
                language = languageMap[ext];
              }
              
              monaco.editor.setModelLanguage(model, language);
            }
          }
        } catch (error) {
          console.error('Failed to load file:', error);
          throw new Error(`Failed to load file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }));
    
    // Initialize Monaco Editor
    useEffect(() => {
      if (!containerRef.current) return;
      
      // Configure Monaco Editor
      monaco.editor.defineTheme('vim-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1a1b26',
          'editor.foreground': '#a9b1d6',
          'editorCursor.foreground': '#7aa2f7',
          'editor.lineHighlightBackground': '#24283b',
          'editorLineNumber.foreground': '#3b4261',
          'editor.selectionBackground': '#364a82',
          'editor.inactiveSelectionBackground': '#2a2e3f'
        }
      });
      
      // Set container style to ensure proper layout
      containerRef.current.style.position = 'relative';
      containerRef.current.style.overflow = 'hidden';
      
      // Create editor instance
      const editor = monaco.editor.create(containerRef.current, {
        value: '# Welcome to VIM (Monaco Mode)\n# SharedArrayBuffer is not available, using Monaco-vim fallback\n# Most VIM commands work, but some advanced features may be limited\n\n',
        language: 'markdown',
        theme: 'vim-dark',
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        lineNumbers: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        cursorStyle: 'block',
        cursorBlinking: 'solid',
        // Add padding at the bottom to prevent content from going under status bar
        padding: {
          bottom: 28
        }
      });
      
      editorRef.current = editor;
      
      // Create status bar element
      const statusNode = document.createElement('div');
      statusNode.className = 'monaco-vim-status-bar';
      statusNode.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #24283b;
        color: #a9b1d6;
        padding: 4px 8px;
        font-family: Menlo, Monaco, "Courier New", monospace;
        font-size: 12px;
        border-top: 1px solid #3b4261;
        height: 28px;
        box-sizing: border-box;
        z-index: 1;
      `;
      containerRef.current.appendChild(statusNode);
      statusNodeRef.current = statusNode;
      
      // Track mode changes
      const checkMode = () => {
        const statusText = statusNode.textContent || '';
        let detectedMode = 'normal';
        
        // Detect mode from status bar text (case-insensitive and flexible)
        const statusLower = statusText.toLowerCase();
        if (statusLower.includes('insert')) {
          detectedMode = 'insert';
        } else if (statusLower.includes('visual line')) {
          detectedMode = 'visual';
        } else if (statusLower.includes('visual block')) {
          detectedMode = 'visual-block';
        } else if (statusLower.includes('visual')) {
          detectedMode = 'visual';
        } else if (statusLower.includes('replace')) {
          detectedMode = 'replace';
        } else if (statusText.startsWith(':')) {
          detectedMode = 'command';
        }
        
        if (detectedMode !== currentMode) {
          setCurrentMode(detectedMode);
          currentModeRef.current = detectedMode;
          onModeChange?.(detectedMode);
          // Reset which-key immediately when leaving normal mode
          if (detectedMode !== 'normal') {
            whichKey.reset();
          }
        }
        
        return detectedMode;
      };
      
      // Track recent mode-changing keys
      let recentModeChangeKey = false;
      let modeChangeTimeout: NodeJS.Timeout | null = null;
      
      // Track operators that expect a motion or character
      const operators = ['d', 'c', 'y', 'g', 'z', '>', '<', '='];
      const motionExpectingOperators = ['f', 'F', 't', 'T', 'r'];
      
      // Initialize VIM mode AFTER setting up our key handler
      const vimMode = initVimMode(editor, statusNode);
      vimModeRef.current = vimMode;
      
      // Track mode changes and forward keystrokes
      editor.onKeyDown((e: monaco.IKeyboardEvent) => {
        const browserEvent = e.browserEvent;
        
        // Forward to keystroke visualizer
        if (onKeyPressRef.current && browserEvent.key) {
          try {
            const event = new KeyboardEvent('keydown', {
              key: browserEvent.key,
              code: browserEvent.code || '',
              shiftKey: browserEvent.shiftKey || false,
              ctrlKey: browserEvent.ctrlKey || false,
              altKey: browserEvent.altKey || false,
              metaKey: browserEvent.metaKey || false,
              bubbles: true,
              cancelable: true
            });
            onKeyPressRef.current(event);
          } catch (error) {
            console.error('[MonacoVimEditor] Failed to forward keystroke:', error);
          }
        }
        
        // Detect mode-changing keys for better tracking
        // Note: 'c' is handled specially as it's also an operator that needs Which-Key
        const modeChangeKeys = ['i', 'a', 'I', 'A', 'o', 'O', 's', 'S', 'C', 'v', 'V'];
        if (modeChangeKeys.includes(browserEvent.key) && !browserEvent.ctrlKey && !browserEvent.altKey) {
          recentModeChangeKey = true;
          if (modeChangeTimeout) clearTimeout(modeChangeTimeout);
          modeChangeTimeout = setTimeout(() => {
            recentModeChangeKey = false;
          }, 150);
        }
        
        // Check current mode
        const mode = checkMode();
        
        // Handle which-key triggers in normal mode
        if (mode === 'normal' && currentMode === 'normal' && !disableWhichKey && !recentModeChangeKey) {
          // Skip if we're in the middle of an operator sequence
          if (operatorPendingRef.current) {
            // Additional check: ensure we're not after character-expecting operators
            const charExpectingOperators = ['f', 'F', 't', 'T', 'r'];
            if (lastOperatorRef.current && charExpectingOperators.includes(lastOperatorRef.current) && browserEvent.key === ' ') {
              // Let monaco-vim handle the space after these operators
              return;
            }
          }
          
          // Handle space as leader key
          if (browserEvent.key === ' ' && !operatorPendingRef.current) {
            const handled = whichKey.handleKeyPress(' ');
            if (handled) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
          }
          
          // Handle VIM prefix keys that start sequences
          const prefixKeys = ['g', 'z', '[', ']', 'c', 'd', 'y', 'v', '"', "'", 'm', 'r', 't', 'T', 'f', 'F', '@', 'q', '`', '>', '<', '=', ':'];
          if (prefixKeys.includes(browserEvent.key) && !browserEvent.ctrlKey && !browserEvent.altKey && !browserEvent.metaKey) {
            // Special case: 'c' is handled in the operator tracking section
            if (browserEvent.key === 'c') {
              whichKey.handleKeyPress(browserEvent.key);
              // 'c' is already prevented in operator tracking
              return;
            }
            
            const handled = whichKey.handleKeyPress(browserEvent.key);
            if (handled) {
              // Don't prevent default - let monaco-vim handle the key
              // Which-Key will show the popup but vim will still process the key
              return;
            }
          }
        }
        
        // Track operators that expect a motion
        if (mode === 'normal' && !browserEvent.ctrlKey && !browserEvent.altKey) {
          if (operators.includes(browserEvent.key)) {
            // Special handling for 'c' operator - prevent immediate mode change
            if (browserEvent.key === 'c') {
              // For 'c' operator, we need to wait for Which-Key or motion
              operatorPendingRef.current = true;
              lastOperatorRef.current = browserEvent.key;
              
              // Prevent Monaco-vim from immediately switching to insert mode
              e.preventDefault();
              e.stopPropagation();
              
              // Let Which-Key handle it, then send the key if needed
              setTimeout(() => {
                if (!whichKey.isVisible && operatorPendingRef.current && lastOperatorRef.current === 'c') {
                  // Which-Key didn't show, send 'c' to editor
                  editorRef.current?.trigger('which-key', 'type', { text: 'c' });
                }
              }, 250); // Slightly longer than Which-Key timeout
              return;
            }
            
            // Check for double operator (dd, yy, cc)
            if (lastOperatorRef.current === browserEvent.key) {
              // Double operator executes immediately
              operatorPendingRef.current = false;
              lastOperatorRef.current = null;
              
              // For 'cc', send both keys to change entire line
              if (browserEvent.key === 'c') {
                // Send both 'c' keys
                editorRef.current?.trigger('which-key', 'type', { text: 'cc' });
              }
            } else {
              operatorPendingRef.current = true;
              lastOperatorRef.current = browserEvent.key;
            }
          } else if (motionExpectingOperators.includes(browserEvent.key)) {
            operatorPendingRef.current = true;
            lastOperatorRef.current = browserEvent.key;
          } else if (operatorPendingRef.current && browserEvent.key !== 'Escape') {
            // Clear operator pending after motion/operation
            setTimeout(() => {
              operatorPendingRef.current = false;
              lastOperatorRef.current = null;
            }, 50);
          }
        }
        
        // Clear operator pending on Escape
        if (browserEvent.key === 'Escape') {
          operatorPendingRef.current = false;
          lastOperatorRef.current = null;
        }
        
        // Handle other which-key sequences ONLY in normal mode
        if (mode === 'normal' && whichKey.keySequence && browserEvent.key !== ' ') {
          const handled = whichKey.handleKeyPress(browserEvent.key);
          if (handled) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
        
        // IMPORTANT: Do NOT preventDefault for any other keys
        // Let Monaco-vim handle all normal typing
      });
      
      editor.onDidChangeCursorPosition(() => {
        checkMode();
        // Clear operator pending on cursor movement (indicates operation completed)
        if (operatorPendingRef.current) {
          setTimeout(() => {
            operatorPendingRef.current = false;
            lastOperatorRef.current = null;
          }, 50);
        }
      });
      
      // Monitor status bar for mode changes
      const observer = new MutationObserver(() => {
        checkMode();
      });
      
      observer.observe(statusNode, {
        childList: true,
        characterData: true,
        subtree: true
      });
      
      // Initial mode check
      setTimeout(checkMode, 100);
      
      setIsReady(true);
      
      // Apply initial vimrc if provided
      if (vimrcContent) {
        // Apply basic settings from vimrc
        // Note: Monaco-vim has limited vimrc support
      }
      
      return () => {
        // Cleanup MutationObserver
        if (observer) {
          observer.disconnect();
        }
        
        // Cleanup vim mode and null reference
        if (vimModeRef.current) {
          try {
            vimModeRef.current.dispose();
          } catch (error) {
            // Ignore disposal errors - these can occur during rapid mount/unmount
            console.debug('[MonacoVim] Vim mode disposal error (safe to ignore):', error);
          }
          vimModeRef.current = null;
        }
        
        // Cleanup Monaco editor and null reference
        if (editorRef.current) {
          try {
            editorRef.current.dispose();
          } catch (error) {
            // Ignore disposal errors - these can occur during rapid mount/unmount
            console.debug('[MonacoVim] Editor disposal error (safe to ignore):', error);
          }
          editorRef.current = null;
        }
        
        // Clear timeout and null reference
        if (modeChangeTimeout) {
          clearTimeout(modeChangeTimeout);
          modeChangeTimeout = null;
        }
        
        // Clear operator state
        operatorPendingRef.current = false;
        lastOperatorRef.current = null;
        
        // Remove status node from DOM
        if (statusNodeRef.current && statusNodeRef.current.parentNode) {
          statusNodeRef.current.parentNode.removeChild(statusNodeRef.current);
          statusNodeRef.current = null;
        }
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // Note: Dependencies intentionally omitted for one-time initialization
    
    // Handle focus management
    useEffect(() => {
      if (!hasModalOpen && editorRef.current) {
        // Small delay to ensure modal animations complete
        setTimeout(() => {
          editorRef.current?.focus();
        }, 100);
      }
    }, [hasModalOpen]);
    
    // Reset which-key when mode changes
    useEffect(() => {
      if (currentMode !== 'normal') {
        whichKey.reset();
      }
    }, [currentMode]);
    
    return (
      <div className="relative w-full h-full flex flex-col">
        <div 
          ref={containerRef} 
          className="flex-1 w-full relative"
          style={{ minHeight: 0, paddingBottom: '28px' }}
        />
        
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
    );
  }
);

MonacoVimEditor.displayName = 'MonacoVimEditor';

export default MonacoVimEditor;
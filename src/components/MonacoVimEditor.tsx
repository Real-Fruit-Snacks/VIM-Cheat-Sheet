import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as monaco from 'monaco-editor';
import { initVimMode } from 'monaco-vim';
import type { VimrcApplyResult } from '../utils/vimrc-manager';
import type { VimEditorRef } from './VimEditor';
import WhichKey from './WhichKey';
import { useWhichKey } from '../hooks/useWhichKey';

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
    const keyEventHandledRef = useRef(false);
    const lastOperatorRef = useRef<string | null>(null);
    const operatorPendingRef = useRef(false);
    
    // Keep a ref to the latest onKeyPress callback
    const onKeyPressRef = useRef(onKeyPress);
    useEffect(() => {
      onKeyPressRef.current = onKeyPress;
    }, [onKeyPress]);
    
    // Initialize which-key system
    const whichKey = useWhichKey({
      timeout: 200,
      enabled: !disableWhichKey && currentMode === 'normal',
      mode: currentMode
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
      
      // Initialize VIM mode
      const vimMode = initVimMode(editor, statusNode);
      vimModeRef.current = vimMode;
      
      // Track mode changes
      const checkMode = () => {
        const statusText = statusNode.textContent || '';
        let detectedMode = 'normal';
        
        // Detect mode from status bar text
        if (statusText.includes('-- INSERT --') || statusText.includes('-- (insert) --')) {
          detectedMode = 'insert';
        } else if (statusText.includes('-- VISUAL --') || statusText.includes('-- (visual) --')) {
          detectedMode = 'visual';
        } else if (statusText.includes('-- VISUAL LINE --')) {
          detectedMode = 'visual';
        } else if (statusText.includes('-- VISUAL BLOCK --')) {
          detectedMode = 'visual-block';
        } else if (statusText.includes('-- REPLACE --')) {
          detectedMode = 'replace';
        } else if (statusText.startsWith(':')) {
          detectedMode = 'command';
        }
        
        if (detectedMode !== currentMode) {
          setCurrentMode(detectedMode);
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
      
      // Set up event listeners for keypress tracking and which-key
      const handleKeyDown = (e: monaco.IKeyboardEvent) => {
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
        
        // Detect mode-changing keys
        const modeChangeKeys = ['i', 'a', 'I', 'A', 'o', 'O', 's', 'S', 'c', 'C', 'v', 'V'];
        if (modeChangeKeys.includes(browserEvent.key) && !browserEvent.ctrlKey && !browserEvent.altKey) {
          recentModeChangeKey = true;
          operatorPendingRef.current = false; // Clear operator pending on mode change
          if (modeChangeTimeout) clearTimeout(modeChangeTimeout);
          modeChangeTimeout = setTimeout(() => {
            recentModeChangeKey = false;
          }, 150); // Increased timeout for better reliability
        }
        
        // Check current mode
        const mode = checkMode();
        
        // Debug: log all key presses temporarily
        if (browserEvent.key === ' ' || ['i', 'a', 'Escape'].includes(browserEvent.key)) {
          console.log('[MonacoVim Debug] Key pressed:', browserEvent.key, {
            mode,
            currentMode,
            statusText: statusNodeRef.current?.textContent?.trim(),
            recentModeChangeKey
          });
        }
        
        // Track operators that expect a motion
        const operators = ['d', 'c', 'y', 'g', 'z', '>', '<', '='];
        const motionExpectingOperators = ['f', 'F', 't', 'T', 'r'];
        
        // Handle operator-pending mode
        if (mode === 'normal' && !browserEvent.ctrlKey && !browserEvent.altKey) {
          if (operators.includes(browserEvent.key)) {
            // Check for double operator (dd, yy, cc)
            if (lastOperatorRef.current === browserEvent.key) {
              // Double operator executes immediately
              operatorPendingRef.current = false;
              lastOperatorRef.current = null;
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
        
        // Only process which-key in normal mode and not in special states
        if (mode !== 'normal' || disableWhichKey || recentModeChangeKey || operatorPendingRef.current) {
          keyEventHandledRef.current = false;
          return;
        }
        
        // Handle which-key sequences
        let handled = false;
        
        // Handle Ctrl-w window management prefix
        if (browserEvent.ctrlKey && browserEvent.key === 'w') {
          handled = whichKey.handleKeyPress('Ctrl-w');
          if (handled) {
            e.preventDefault();
            e.stopPropagation();
          }
          keyEventHandledRef.current = handled;
          return;
        }
        
        // Skip other modifier combinations
        if (browserEvent.ctrlKey || browserEvent.altKey || browserEvent.metaKey) {
          keyEventHandledRef.current = false;
          return;
        }
        
        // Space as leader key - only process in specific conditions
        if (browserEvent.key === ' ') {
          // Very conservative check: only process space as leader if:
          // 1. Mode is definitely normal
          // 2. No recent mode changes
          // 3. No operators pending
          // 4. Not after character-expecting operators
          // 5. Which-key is enabled and ready
          
          const charExpectingOperators = ['f', 'F', 't', 'T', 'r'];
          
          // Check if we're definitely in normal mode and should handle space
          const shouldHandleAsLeader = 
            mode === 'normal' && 
            currentMode === 'normal' && 
            !recentModeChangeKey && 
            !operatorPendingRef.current &&
            !(lastOperatorRef.current && charExpectingOperators.includes(lastOperatorRef.current)) &&
            !disableWhichKey;
            
          console.log('[MonacoVim Debug] Space key:', {
            shouldHandleAsLeader,
            mode,
            currentMode,
            recentModeChangeKey,
            operatorPending: operatorPendingRef.current,
            lastOperator: lastOperatorRef.current
          });
          
          if (shouldHandleAsLeader) {
            handled = whichKey.handleKeyPress(' ');
            if (handled) {
              e.preventDefault();
              e.stopPropagation();
            }
            keyEventHandledRef.current = handled;
          } else {
            // Let monaco-vim handle it normally
            keyEventHandledRef.current = false;
          }
          return;
        }
        
        // Tab key in sequences
        if (browserEvent.key === 'Tab') {
          handled = whichKey.handleKeyPress('Tab');
          if (handled && whichKey.keySequence) {
            e.preventDefault();
            e.stopPropagation();
          }
          keyEventHandledRef.current = handled;
          return;
        }
        
        // VIM prefix keys (but be careful with operators)
        const prefixKeys = ['g', 'z', '[', ']', '"', "'", 'm', '@', 'q', '`'];
        // These can be both operators and prefix keys, so check context
        const contextualPrefixKeys = ['c', 'd', 'y', 'v', 'r', 't', 'T', 'f', 'F', '>', '<', '='];
        
        if (prefixKeys.includes(browserEvent.key) || 
            (contextualPrefixKeys.includes(browserEvent.key) && !operatorPendingRef.current)) {
          handled = whichKey.handleKeyPress(browserEvent.key);
          keyEventHandledRef.current = handled;
          return;
        }
        
        // Numeric prefixes
        if (/^[0-9]$/.test(browserEvent.key)) {
          handled = whichKey.handleKeyPress(browserEvent.key);
          if (handled && whichKey.keySequence) {
            e.preventDefault();
            e.stopPropagation();
          }
          keyEventHandledRef.current = handled;
          return;
        }
        
        // Other keys when in a sequence
        if (whichKey.keySequence) {
          handled = whichKey.handleKeyPress(browserEvent.key);
          keyEventHandledRef.current = handled;
        }
      };
      
      editor.onKeyDown(handleKeyDown);
      
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
        observer.disconnect();
        vimModeRef.current?.dispose();
        editor.dispose();
        if (modeChangeTimeout) clearTimeout(modeChangeTimeout);
      };
    }, []);
    
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
    }, [currentMode, whichKey]);
    
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
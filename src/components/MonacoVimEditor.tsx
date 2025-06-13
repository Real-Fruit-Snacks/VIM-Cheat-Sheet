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
      
      isVimReady: () => isReady
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
      
      // Create editor instance
      const editor = monaco.editor.create(containerRef.current, {
        value: '# Welcome to VIM.io (Monaco Mode)\n# SharedArrayBuffer is not available, using Monaco-vim fallback\n# Most VIM commands work, but some advanced features may be limited\n\n',
        language: 'markdown',
        theme: 'vim-dark',
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        lineNumbers: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        cursorStyle: 'block',
        cursorBlinking: 'solid'
      });
      
      editorRef.current = editor;
      
      // Create status bar element
      const statusNode = document.createElement('div');
      statusNode.className = 'monaco-vim-status-bar';
      statusNode.style.cssText = `
        background-color: #24283b;
        color: #a9b1d6;
        padding: 4px 8px;
        font-family: Menlo, Monaco, "Courier New", monospace;
        font-size: 12px;
        border-top: 1px solid #3b4261;
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
        }
        
        return detectedMode;
      };
      
      // Set up event listeners for keypress tracking and which-key
      const handleKeyDown = (e: monaco.IKeyboardEvent) => {
        const browserEvent = e.browserEvent;
        
        // Forward to keystroke visualizer
        if (onKeyPress) {
          const event = new KeyboardEvent('keydown', {
            key: browserEvent.key,
            code: browserEvent.code,
            shiftKey: browserEvent.shiftKey,
            ctrlKey: browserEvent.ctrlKey,
            altKey: browserEvent.altKey,
            metaKey: browserEvent.metaKey
          });
          onKeyPress(event);
        }
        
        // Check current mode
        const mode = checkMode();
        
        // Only process which-key in normal mode
        if (mode !== 'normal' || disableWhichKey) {
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
        
        // Space as leader key
        if (browserEvent.key === ' ') {
          handled = whichKey.handleKeyPress(' ');
          if (handled) {
            e.preventDefault();
            e.stopPropagation();
          }
          keyEventHandledRef.current = handled;
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
        
        // VIM prefix keys
        const prefixKeys = ['g', 'z', '[', ']', 'c', 'd', 'y', 'v', '"', "'", 'm', 'r', 't', 'T', 'f', 'F', '@', 'q', '`', '>', '<', '='];
        if (prefixKeys.includes(browserEvent.key)) {
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
      editor.onDidChangeCursorPosition(checkMode);
      
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
          className="flex-1 w-full"
          style={{ minHeight: 0 }}
        />
        <div className="absolute top-2 right-2 bg-yellow-900/80 text-yellow-200 px-2 py-1 rounded text-xs">
          Monaco VIM Mode (Fallback)
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
    );
  }
);

MonacoVimEditor.displayName = 'MonacoVimEditor';

export default MonacoVimEditor;
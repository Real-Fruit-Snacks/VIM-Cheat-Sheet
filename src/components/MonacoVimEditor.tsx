import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as monaco from 'monaco-editor';
import { initVimMode } from 'monaco-vim';
import type { VimrcApplyResult } from '../utils/vimrc-manager';
import type { VimEditorRef } from './VimEditor';

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
  ({ vimrcContent, onKeyPress, hasModalOpen, onModeChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const vimModeRef = useRef<ReturnType<typeof initVimMode> | null>(null);
    const statusNodeRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    
    useImperativeHandle(ref, () => ({
      applyVimrc: async (content: string): Promise<VimrcApplyResult> => {
        // Monaco-vim doesn't support full vimrc, but we can apply some basic settings
        const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('"'));
        const result: VimrcApplyResult = {
          results: [],
          successCount: 0,
          failedCount: 0
        };
        
        for (const line of lines) {
          try {
            // Extract common vimrc commands and apply what we can
            if (line.includes('set number')) {
              editorRef.current?.updateOptions({ lineNumbers: 'on' });
              result.results.push({ line, success: true });
              result.successCount++;
            } else if (line.includes('set nonumber')) {
              editorRef.current?.updateOptions({ lineNumbers: 'off' });
              result.results.push({ line, success: true });
              result.successCount++;
            } else if (line.includes('set wrap')) {
              editorRef.current?.updateOptions({ wordWrap: 'on' });
              result.results.push({ line, success: true });
              result.successCount++;
            } else if (line.includes('set nowrap')) {
              editorRef.current?.updateOptions({ wordWrap: 'off' });
              result.results.push({ line, success: true });
              result.successCount++;
            } else if (line.includes('set tabstop=')) {
              const match = line.match(/set tabstop=(\d+)/);
              if (match) {
                editorRef.current?.getModel()?.updateOptions({ tabSize: parseInt(match[1]) });
                result.results.push({ line, success: true });
                result.successCount++;
              }
            } else {
              // Command not supported in Monaco-vim
              result.results.push({ 
                line, 
                success: false, 
                error: 'Command not supported in Monaco VIM mode' 
              });
              result.failedCount++;
            }
          } catch (error) {
            result.results.push({ 
              line, 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
            result.failedCount++;
          }
        }
        
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
        const mode = vimMode.mode || 'normal';
        onModeChange?.(mode);
      };
      
      // Set up event listeners for keypress tracking
      const handleKeyDown = (e: monaco.IKeyboardEvent) => {
        if (onKeyPress) {
          const event = new KeyboardEvent('keydown', {
            key: e.browserEvent.key,
            code: e.browserEvent.code,
            shiftKey: e.browserEvent.shiftKey,
            ctrlKey: e.browserEvent.ctrlKey,
            altKey: e.browserEvent.altKey,
            metaKey: e.browserEvent.metaKey
          });
          onKeyPress(event);
        }
        checkMode();
      };
      
      editor.onKeyDown(handleKeyDown);
      editor.onDidChangeCursorPosition(checkMode);
      
      setIsReady(true);
      
      // Apply initial vimrc if provided
      if (vimrcContent) {
        // Apply basic settings from vimrc
        // Note: Monaco-vim has limited vimrc support
      }
      
      return () => {
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
      </div>
    );
  }
);

MonacoVimEditor.displayName = 'MonacoVimEditor';

export default MonacoVimEditor;
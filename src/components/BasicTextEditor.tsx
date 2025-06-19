/**
 * Basic Text Editor
 * Ultra-simple fallback editor for restrictive environments
 * Works in any browser without external dependencies
 */

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import type { VimEditorRef } from './VimEditor';

interface BasicTextEditorProps {
  vimrcContent?: string;
  disableWhichKey?: boolean;
  onKeyPress?: (event: KeyboardEvent) => void;
  hasModalOpen?: boolean;
}

const BasicTextEditor = forwardRef<VimEditorRef, BasicTextEditorProps>(
  ({ onKeyPress, hasModalOpen }, ref) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [content, setContent] = useState(`# Welcome to Basic Text Editor

This is a simple text editor fallback for restrictive browser environments.

While this doesn't provide the full VIM experience, it includes:
- Basic text editing
- File loading and saving
- Keyboard shortcuts
- Responsive design

Basic keyboard shortcuts:
- Ctrl+A: Select all
- Ctrl+Z: Undo
- Ctrl+Y: Redo (in some browsers)
- Ctrl+F: Find (browser default)

You can edit this text freely. This editor works in any browser
without requiring special permissions or modern web features.
`);
    const [isReady, setIsReady] = useState(false);

    // Expose editor interface
    useImperativeHandle(ref, () => ({
      applyVimrc: async () => {
        console.log('[BasicEditor] Vimrc not supported in basic mode');
        return {
          results: [],
          totalLines: 0,
          successCount: 0,
          failedCount: 0,
          skippedCount: 0
        };
      },
      
      revertVimrc: async () => {
        console.log('[BasicEditor] Vimrc revert not needed in basic mode');
      },
      
      isVimReady: () => isReady,
      
      loadFile: async (fileContent: string, filename?: string) => {
        if (!textAreaRef.current) {
          throw new Error('Basic editor not ready');
        }
        
        setContent(fileContent);
        
        // Focus the textarea after loading
        setTimeout(() => {
          textAreaRef.current?.focus();
          // Move cursor to beginning
          textAreaRef.current?.setSelectionRange(0, 0);
        }, 10);
        
        console.log('[BasicEditor] File loaded:', filename || 'untitled');
      },
      
      getText: () => {
        return textAreaRef.current?.value || '';
      },
      
      setText: (text: string) => {
        setContent(text);
      },
      
      focus: () => {
        textAreaRef.current?.focus();
      },
      
      blur: () => {
        textAreaRef.current?.blur();
      }
    }));

    // Initialize editor
    useEffect(() => {
      if (textAreaRef.current) {
        setIsReady(true);
        console.log('[BasicEditor] Basic text editor ready');
      }
    }, []);

    // Handle keyboard events
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        // Call the onKeyPress callback if provided
        if (onKeyPress) {
          onKeyPress(event);
        }
        
        // Add some basic shortcuts
        if (event.ctrlKey || event.metaKey) {
          switch (event.key.toLowerCase()) {
            case 's':
              event.preventDefault();
              console.log('[BasicEditor] Save shortcut triggered (Ctrl+S)');
              // You could emit a save event here
              break;
            case 'o':
              event.preventDefault();
              console.log('[BasicEditor] Open shortcut triggered (Ctrl+O)');
              // You could emit an open event here
              break;
          }
        }
      };

      const textarea = textAreaRef.current;
      if (textarea) {
        textarea.addEventListener('keydown', handleKeyDown);
        return () => {
          textarea.removeEventListener('keydown', handleKeyDown);
        };
      }
    }, [onKeyPress]);

    // Handle focus management
    useEffect(() => {
      if (!hasModalOpen && textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, [hasModalOpen]);

    // Handle content changes
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(event.target.value);
    };

    return (
      <div className="h-full bg-gray-950 overflow-hidden relative">
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 bg-yellow-900 text-yellow-100 px-4 py-2 text-sm z-10">
          <div className="flex items-center justify-between">
            <span>
              ⚠️ <strong>Basic Mode:</strong> Using simple text editor due to browser restrictions
            </span>
            <span className="text-xs opacity-75">
              Basic editing • No VIM features
            </span>
          </div>
        </div>
        
        {/* Main editor area */}
        <div className="h-full pt-12">
          <textarea
            ref={textAreaRef}
            value={content}
            onChange={handleChange}
            className="w-full h-full bg-gray-950 text-gray-100 font-mono text-sm leading-relaxed resize-none border-none outline-none p-4"
            style={{
              fontFamily: 'Menlo, Monaco, "Courier New", monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              tabSize: 2,
            }}
            placeholder="Enter your text here..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            wrap="soft"
          />
        </div>
        
        {/* Footer with helpful info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 text-gray-400 px-4 py-1 text-xs z-10">
          <div className="flex items-center justify-between">
            <span>
              Lines: {content.split('\n').length} | 
              Characters: {content.length}
            </span>
            <span>
              Basic Text Editor • No special features required
            </span>
          </div>
        </div>
      </div>
    );
  }
);

BasicTextEditor.displayName = 'BasicTextEditor';

export default BasicTextEditor;
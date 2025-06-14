import { useState, useEffect, useCallback } from 'react'
import { X, Save, RotateCcw, FileText } from 'lucide-react'

interface VimrcEditorEnhancedProps {
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => Promise<void>
  initialContent?: string
}

const DEFAULT_VIMRC = `" VIM Configuration File
" Personal vimrc for VIM web application
" Changes apply immediately without reload

" Note: vim-wasm has browser environment limitations
" Some advanced vim features may not be available

" Basic Settings
set number              " Show line numbers
set relativenumber      " Show relative line numbers
set cursorline          " Highlight current line
set showcmd             " Show command in bottom bar
set wildmenu            " Visual autocomplete for command menu
set showmatch           " Highlight matching [{()}]
set incsearch           " Search as characters are entered
set hlsearch            " Highlight matches
set ignorecase          " Case insensitive search
set smartcase           " Case sensitive when uppercase present

" Indentation
set tabstop=4           " Number of visual spaces per TAB
set softtabstop=4       " Number of spaces in tab when editing
set shiftwidth=4        " Number of spaces for indentation
set expandtab           " Use spaces instead of tabs
set autoindent          " Auto indent new lines
set smartindent         " Smart indentation

" Visual Settings
set wrap                " Wrap long lines
set linebreak           " Break lines at word boundaries
set scrolloff=5         " Keep 5 lines above/below cursor
set sidescrolloff=5     " Keep 5 columns left/right of cursor

" Key Mappings
" Example: Map jj to Escape in insert mode
" inoremap jj <Esc>

" Leader key mappings (Space is the leader key in VIM)
" Example: Save file with Space + w
" nnoremap <leader>w :w<CR>

" Your custom settings below:
`

export default function VimrcEditorEnhanced({ 
  isOpen, 
  onClose, 
  onSave, 
  initialContent 
}: VimrcEditorEnhancedProps) {
  const [content, setContent] = useState(initialContent || DEFAULT_VIMRC)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialContent !== undefined) {
      setContent(initialContent)
      setHasChanges(false)
    }
  }, [initialContent])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(content)
      setHasChanges(false)
      onClose()
    } catch (err) {
      // Parent component handles error display
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Reset to default vimrc? This will discard all your changes.')) {
      setContent(DEFAULT_VIMRC)
      setHasChanges(true)
    }
  }

  const handleChange = (newContent: string) => {
    setContent(newContent)
    setHasChanges(true)
  }

  /** Handle global keyboard shortcuts */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Save with Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      if (hasChanges) {
        handleSave()
      }
    }
    // Close with Escape
    else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }, [hasChanges, handleSave, onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" data-modal="vimrc-editor">
      <div className="w-full max-w-6xl h-[90vh] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col">
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-gray-100">Edit .vimrc</h2>
            {hasChanges && (
              <span className="text-xs text-yellow-400 bg-yellow-900 px-2 py-1 rounded">
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded transition-colors"
              title="Reset to default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`px-4 py-2 rounded transition-colors flex items-center space-x-2 ${
                hasChanges && !isSaving
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-full bg-gray-950 text-gray-100 font-mono text-sm p-4 rounded border border-gray-700 focus:border-green-500 focus:outline-none resize-none custom-scrollbar"
            spellCheck={false}
            placeholder="Enter your vimrc configuration here..."
          />
        </div>

        <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div>
              <kbd className="bg-gray-700 px-1 rounded">Ctrl+S</kbd> to save • 
              <kbd className="bg-gray-700 px-1 rounded ml-2">Esc</kbd> to close
            </div>
            <div>
              {content.split('\n').length} lines
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
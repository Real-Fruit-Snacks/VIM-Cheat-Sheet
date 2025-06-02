import { useState, useEffect, useCallback } from 'react'
import { X, Save, RotateCcw, FileText } from 'lucide-react'

interface VimrcEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => void
  initialContent?: string
}

const DEFAULT_VIMRC = `" VIM.io Configuration File
" This is your personal vimrc for the VIM.io web application
" Changes will be applied on the next page reload or vim restart

" IMPORTANT: vim-wasm limitations
" - Not all vim features are supported in the browser environment
" - Some commands may not work as expected
" - Complex vim script functions might not be available

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

" Leader key mappings (Space is the leader key in VIM.io)
" Example: Save file with Space + w
" nnoremap <leader>w :w<CR>

" Note: Complex mappings might not work in vim-wasm

" Custom commands
" Example: Create a command to insert current date
" command! Date put =strftime('%Y-%m-%d')

" Your custom settings below:
`

export default function VimrcEditor({ isOpen, onClose, onSave, initialContent }: VimrcEditorProps) {
  const [content, setContent] = useState(initialContent || DEFAULT_VIMRC)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (initialContent !== undefined) {
      setContent(initialContent)
      setHasChanges(false)
    }
  }, [initialContent])

  const handleSave = () => {
    onSave(content)
    setHasChanges(false)
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

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      if (hasChanges) {
        handleSave()
      }
    }
    // Escape to close
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-4xl h-[80vh] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col">
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
              disabled={!hasChanges}
              className={`px-3 py-1 rounded transition-colors flex items-center space-x-1 ${
                hasChanges
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
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
            <div className="flex items-center space-x-4">
              <div>
                <kbd className="bg-gray-700 px-1 rounded">Ctrl+S</kbd> to save • 
                <kbd className="bg-gray-700 px-1 rounded ml-2">Esc</kbd> to close
              </div>
              <div className="text-yellow-400">
                ⚠️ Changes apply on next reload
              </div>
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
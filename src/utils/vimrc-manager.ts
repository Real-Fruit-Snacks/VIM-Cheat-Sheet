/** VimRC Manager - Handles vimrc application and validation */

export interface VimrcResult {
  line: string
  lineNumber: number
  success: boolean
  error?: string
}

export interface VimrcApplyResult {
  results: VimrcResult[]
  totalLines: number
  successCount: number
  failedCount: number
  skippedCount: number
}

export class VimrcManager {
  private vimInstance: any
  
  constructor(vimInstance: any) {
    this.vimInstance = vimInstance
  }
  
  
  /** Apply vimrc content to the current vim instance */
  async applyVimrc(content: string, testMode: boolean = false): Promise<VimrcApplyResult> {
    if (!this.vimInstance || !this.vimInstance.isRunning || !this.vimInstance.isRunning()) {
      throw new Error('Vim instance is not running')
    }
    
    const lines = content.split('\n')
    const results: VimrcResult[] = []
    let successCount = 0
    let failedCount = 0
    let skippedCount = 0
    
    // Save settings in test mode
    if (testMode) {
      await this.saveCurrentSettings()
    }
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('"')) {
        skippedCount++
        continue
      }
      
      let commandSucceeded = true
      let errorMessage = ''
      
      // Execute command via vim-wasm
      try {
        await this.vimInstance.cmdline(trimmedLine)
      } catch (err: any) {
        commandSucceeded = false
        errorMessage = err.message || err.toString() || 'Unknown error'
      }
      
      if (commandSucceeded) {
        results.push({
          line: trimmedLine,
          lineNumber: i + 1,
          success: true
        })
        successCount++
      } else {
        results.push({
          line: trimmedLine,
          lineNumber: i + 1,
          success: false,
          error: errorMessage
        })
        failedCount++
      }
    }
    
    return {
      results,
      totalLines: lines.length,
      successCount,
      failedCount,
      skippedCount
    }
  }
  
  /** Save current vim settings for potential revert */
  private async saveCurrentSettings() {
    // Common settings that may change
    const settingsToSave = [
      'number', 'relativenumber', 'wrap', 'cursorline',
      'ignorecase', 'smartcase', 'hlsearch', 'incsearch',
      'tabstop', 'shiftwidth', 'expandtab', 'autoindent',
      'scrolloff', 'sidescrolloff'
    ]
    
    for (const setting of settingsToSave) {
      try {
        // TODO: Extract setting values when vim-wasm API available
      } catch (err) {
        console.warn(`Failed to save setting ${setting}:`, err)
      }
    }
  }
  
  /** Revert to saved settings (for test mode) */
  async revertSettings() {
    // TODO: Proper restoration when vim-wasm API available
    if (confirm('Revert changes by reloading the page?')) {
      window.location.reload()
    }
  }
  
  /** Validation delegated to vim-wasm */
  validateVimrc(_content: string): { valid: boolean; errors: string[] } {
    return {
      valid: true,
      errors: []
    }
  }
  
  /** Get commonly used vimrc commands for autocomplete */
  getCommonCommands(): string[] {
    return [
      'set number',
      'set relativenumber', 
      'set nonumber',
      'set norelativenumber',
      'set wrap',
      'set nowrap',
      'set cursorline',
      'set nocursorline',
      'set ignorecase',
      'set smartcase',
      'set hlsearch',
      'set nohlsearch',
      'set incsearch',
      'set noincsearch',
      'set tabstop=4',
      'set shiftwidth=4',
      'set expandtab',
      'set noexpandtab',
      'set autoindent',
      'set smartindent',
      'set scrolloff=5',
      'set showcmd',
      'set showmatch',
      'set wildmenu',
      'set ruler',
      'set laststatus=2',
      'set encoding=utf-8',
      'set fileencoding=utf-8',
      'set backspace=indent,eol,start',
      'syntax on',
      'syntax off',
      'filetype on',
      'filetype plugin on',
      'filetype indent on',
      'nnoremap <leader>w :w<CR>',
      'nnoremap <leader>q :q<CR>',
      'inoremap jj <Esc>',
      'inoremap kk <Esc>',
      'nnoremap <leader>/ :nohl<CR>',
      'nnoremap <C-h> <C-w>h',
      'nnoremap <C-j> <C-w>j',
      'nnoremap <C-k> <C-w>k',
      'nnoremap <C-l> <C-w>l',
    ]
  }
}
/** Utility for loading and initializing vim.wasm module */

export async function loadVimWasm() {
  /** Verify browser WebAssembly compatibility */
  if (!window.SharedArrayBuffer) {
    throw new Error('Your browser does not support SharedArrayBuffer. Please use Chrome, Firefox, or Safari with the required flags enabled.')
  }

  try {
    // Handle development module loading
    const baseUrl = import.meta.env.BASE_URL
    
    // Import vim.wasm ES module
    const vimWasmModule = await import(/* @vite-ignore */ `${baseUrl}vim-wasm/vimwasm.js`)
    
    // Extract VimWasm constructor
    const VimWasm = vimWasmModule.VimWasm || vimWasmModule.default
    
    if (!VimWasm) {
      throw new Error('VimWasm not found in module exports')
    }
    
    // Set global reference for compatibility
    (window as any).VimWasm = VimWasm
    
    return VimWasm
  } catch (error) {
    console.error('Failed to load vim.wasm module:', error)
    
    // Fallback to global window reference
    if ((window as any).VimWasm) {
      return (window as any).VimWasm
    }
    
    throw new Error(`Failed to load vim.wasm: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function getWorkerScriptPath() {
  return `${import.meta.env.BASE_URL}vim-wasm/vim.js`
}
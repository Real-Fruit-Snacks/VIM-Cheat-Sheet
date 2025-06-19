// This wrapper loads vim-wasm (only called if browser is compatible)
window.__vimWasmPromise = (async () => {
  try {
    // Double-check we should be loading (defensive programming)
    if (window.__skipVimWasmLoad) {
      console.warn('[vim-wasm-wrapper] Unexpected state: wrapper loaded but skip flag is set');
      throw new Error('vim.wasm loading skipped');
    }
    
    // Verify capabilities one more time
    const capabilities = window.__browserCapabilities;
    if (!capabilities || !capabilities.hasWebAssembly || !capabilities.hasSharedArrayBuffer || !capabilities.isSecureContext) {
      console.error('[vim-wasm-wrapper] Critical: wrapper loaded but browser incompatible', capabilities);
      throw new Error('Browser incompatible with vim.wasm');
    }
    
    console.log('[vim-wasm-wrapper] Browser verified, loading vim.wasm...');
    
    // Dynamically import vim-wasm
    const { VimWasm } = await import('./vim-wasm/vimwasm.js');
    
    // Make VimWasm available globally
    window.VimWasm = VimWasm;
    console.log('[vim-wasm-wrapper] vim.wasm loaded successfully');
    
    return VimWasm;
    
  } catch (error) {
    console.error('[vim-wasm-wrapper] Failed to load vim.wasm:', error);
    // Set a flag to indicate load failure
    window.__vimWasmLoadError = error;
    throw error;
  }
})();
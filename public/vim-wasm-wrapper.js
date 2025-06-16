// This wrapper conditionally loads vim-wasm based on early browser detection
window.__vimWasmPromise = (async () => {
  try {
    // Check if early detection flagged to skip vim.wasm loading
    if (window.__skipVimWasmLoad) {
      console.log('[vim-wasm-wrapper] Skipping vim.wasm load as requested by early detection');
      throw new Error('vim.wasm loading skipped due to browser incompatibility');
    }
    
    // Check if browser has necessary capabilities
    const capabilities = window.__browserCapabilities;
    if (capabilities && (!capabilities.hasWebAssembly || !capabilities.hasSharedArrayBuffer)) {
      console.warn('[vim-wasm-wrapper] Browser lacks required capabilities for vim.wasm');
      throw new Error('Browser lacks required capabilities for vim.wasm');
    }
    
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
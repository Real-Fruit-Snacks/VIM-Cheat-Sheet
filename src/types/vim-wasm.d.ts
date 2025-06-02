/**
 * Type declarations for the vim-wasm library
 * @see https://github.com/rhysd/vim.wasm
 */

/**
 * Module declaration for the vim-wasm JavaScript interface
 * This module provides the WebAssembly-compiled Vim editor
 */
declare module '/vim-wasm/vimwasm.js' {
  /**
   * Main VimWasm class for creating Vim instances in the browser
   * Provides methods to initialize, configure, and control Vim
   */
  export const VimWasm: any;
  
  /**
   * Version string of the Vim build included in vim-wasm
   * Format: "VIM - Vi IMproved X.X"
   */
  export const VIM_VERSION: string;
}

/**
 * Alternative module declaration for different import paths
 * Some bundlers may resolve the vim-wasm module with a wildcard prefix
 */
declare module '*/vim-wasm/vimwasm.js' {
  export const VimWasm: any;
  export const VIM_VERSION: string;
}

/**
 * Global type augmentation for vim-wasm
 * VimWasm may be attached to the window object for global access
 */
declare global {
  interface Window {
    /**
     * VimWasm constructor available globally when loaded via script tag
     * Used as a fallback when ES module imports are not available
     */
    VimWasm?: any;
  }
}
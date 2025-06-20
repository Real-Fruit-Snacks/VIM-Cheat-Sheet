/// <reference types="vite/client" />

// Global window extensions for VIM editor
declare global {
  interface Window {
    __browserCapabilities?: any;
    __canUseVimWasm?: boolean;
    __skipVimWasmLoad?: boolean;
    __vimWasmLoadError?: boolean | Error;
    __vimWasmLoaded?: boolean;
    VimWasm?: any;
    monaco?: any;
  }
}

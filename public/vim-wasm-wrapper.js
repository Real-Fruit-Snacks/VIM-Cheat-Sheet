// This wrapper loads vim-wasm as an ES module and makes it available globally
import { VimWasm } from './vim-wasm/vimwasm.js';

// Make VimWasm available globally
window.VimWasm = VimWasm;
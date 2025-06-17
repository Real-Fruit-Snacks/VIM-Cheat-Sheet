import type { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { VimEditorRef } from '../components/VimEditor';

// Define the common props interface for both editors
export interface VimEditorHybridProps {
  vimrcContent?: string;
  disableWhichKey?: boolean;
  onKeyPress?: (event: KeyboardEvent) => void;
  hasModalOpen?: boolean;
}

export interface MonacoVimEditorProps extends VimEditorHybridProps {
  onModeChange?: (mode: string) => void;
}

export type EditorProps = VimEditorHybridProps | MonacoVimEditorProps;

export type EditorComponent = ForwardRefExoticComponent<EditorProps & RefAttributes<VimEditorRef>>;

/**
 * Dynamically loads the VIM editor component without loading Monaco
 */
export async function loadVimEditor(): Promise<EditorComponent> {
  const module = await import('../components/VimEditor');
  return module.default;
}

/**
 * Dynamically loads the Monaco VIM editor component
 */
export async function loadMonacoVimEditor(): Promise<EditorComponent> {
  const module = await import('../components/MonacoVimEditor');
  return module.default;
}

/**
 * Determines which editor to load based on browser capabilities
 */
export function getEditorLoader(useVimWasm: boolean): () => Promise<EditorComponent> {
  if (useVimWasm) {
    console.log('[Dynamic Loader] Loading vim.wasm editor');
    return loadVimEditor;
  } else {
    console.log('[Dynamic Loader] Loading Monaco-vim fallback editor');
    return loadMonacoVimEditor;
  }
}
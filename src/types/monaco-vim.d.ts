declare module 'monaco-vim' {
  import * as monaco from 'monaco-editor';

  export interface VimMode {
    dispose: () => void;
    mode?: string;
  }

  export function initVimMode(
    editor: monaco.editor.IStandaloneCodeEditor,
    statusNode?: HTMLElement
  ): VimMode;
}
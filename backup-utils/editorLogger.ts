// Editor-specific logging for VIM and Monaco operations

import { log } from './logger';
import { track } from './actionTracker';

export interface EditorState {
  type: 'vim' | 'monaco';
  mode?: string; // vim mode: normal, insert, visual, etc.
  fileName?: string;
  fileSize?: number;
  cursorPosition?: { line: number; column: number };
  selection?: { start: { line: number; column: number }; end: { line: number; column: number } };
  isDirty?: boolean;
  language?: string;
}

export class EditorLogger {
  private static instance: EditorLogger;
  private currentState: EditorState = { type: 'monaco' };
  private commandHistory: Array<{ command: string; timestamp: number; mode?: string }> = [];
  private maxCommandHistory = 100;

  private constructor() {
    log.info('EditorLogger', 'Editor logging initialized');
  }

  static getInstance(): EditorLogger {
    if (!EditorLogger.instance) {
      EditorLogger.instance = new EditorLogger();
    }
    return EditorLogger.instance;
  }

  // Set editor type
  setEditorType(type: 'vim' | 'monaco') {
    log.info('EditorLogger', `Editor type set to: ${type}`);
    this.currentState.type = type;
    track.settings('editor-type-change', { type });
  }

  // Log VIM initialization
  logVimInit(success: boolean, details?: any) {
    if (success) {
      log.success('VimEditor', '🎉 vim.wasm initialized successfully', details);
      track.ui('vim-init', { success: true, ...details });
    } else {
      log.error('VimEditor', '❌ vim.wasm initialization failed', undefined, details);
      track.error('vim-init', new Error('VIM init failed'), details);
    }
  }

  // Log Monaco initialization
  logMonacoInit(success: boolean, details?: any) {
    if (success) {
      log.success('MonacoEditor', '🎉 Monaco editor initialized', details);
      track.ui('monaco-init', { success: true, ...details });
    } else {
      log.error('MonacoEditor', '❌ Monaco initialization failed', undefined, details);
      track.error('monaco-init', new Error('Monaco init failed'), details);
    }
  }

  // Log file operations
  logFileOpen(fileName: string, size: number, content?: string) {
    const startTime = performance.now();
    
    log.info('EditorLogger', `📂 Opening file: ${fileName}`, {
      size: `${(size / 1024).toFixed(2)} KB`,
      lines: content ? content.split('\n').length : 'unknown'
    });

    this.currentState.fileName = fileName;
    this.currentState.fileSize = size;
    
    track.file.open(fileName, size);
    
    return () => {
      const duration = performance.now() - startTime;
      log.success('EditorLogger', `✅ File opened: ${fileName}`, {
        duration: `${duration.toFixed(2)}ms`
      });
    };
  }

  logFileSave(fileName: string, size: number, details?: any) {
    log.info('EditorLogger', `💾 Saving file: ${fileName}`, {
      size: `${(size / 1024).toFixed(2)} KB`,
      ...details
    });
    
    track.file.save(fileName, size);
  }

  logFileClose(fileName: string) {
    log.info('EditorLogger', `📁 Closing file: ${fileName}`);
    track.file.close(fileName);
  }

  // Log VIM specific operations
  logVimCommand(command: string, mode: string, details?: any) {
    log.info('VimEditor', `⌨️ VIM command: ${command}`, {
      mode,
      ...details
    });

    this.commandHistory.push({
      command,
      mode,
      timestamp: Date.now()
    });

    if (this.commandHistory.length > this.maxCommandHistory) {
      this.commandHistory.shift();
    }

    track.command.vim(command);
  }

  logVimModeChange(fromMode: string, toMode: string) {
    log.info('VimEditor', `🔄 Mode change: ${fromMode} → ${toMode}`);
    this.currentState.mode = toMode;
    
    track.ui('vim-mode-change', { from: fromMode, to: toMode });
  }

  logVimError(error: string, command?: string) {
    log.error('VimEditor', `VIM error: ${error}`, undefined, {
      command,
      mode: this.currentState.mode
    });
    
    track.error('vim-error', new Error(error), { command });
  }

  // Log Monaco specific operations  
  logMonacoCommand(command: string, details?: any) {
    log.info('MonacoEditor', `⌨️ Monaco command: ${command}`, details);
    track.command.palette(command);
  }

  logMonacoLanguageChange(oldLang: string, newLang: string) {
    log.info('MonacoEditor', `🔤 Language change: ${oldLang} → ${newLang}`);
    this.currentState.language = newLang;
    
    track.ui('language-change', { from: oldLang, to: newLang });
  }

  logMonacoThemeChange(theme: string) {
    log.info('MonacoEditor', `🎨 Theme changed to: ${theme}`);
    track.settings('theme-change', { theme });
  }

  // Log editor state changes
  logCursorMove(line: number, column: number, details?: any) {
    // Only log significant moves
    const lastPos = this.currentState.cursorPosition;
    if (!lastPos || Math.abs(lastPos.line - line) > 10 || Date.now() % 10 === 0) {
      log.debug('EditorLogger', `Cursor: ${line}:${column}`, details);
      this.currentState.cursorPosition = { line, column };
    }
  }

  logSelection(start: { line: number; column: number }, end: { line: number; column: number }) {
    const lines = Math.abs(end.line - start.line) + 1;
    const chars = Math.abs(end.column - start.column);
    
    log.info('EditorLogger', `📝 Selection: ${lines} lines`, {
      start: `${start.line}:${start.column}`,
      end: `${end.line}:${end.column}`,
      chars
    });
    
    this.currentState.selection = { start, end };
    track.edit('selection', { lines, chars });
  }

  // Log performance metrics
  logRenderTime(duration: number, details?: any) {
    if (duration > 100) {
      log.warn('EditorLogger', `⚠️ Slow render: ${duration.toFixed(2)}ms`, details);
    } else {
      log.debug('EditorLogger', `Render time: ${duration.toFixed(2)}ms`, details);
    }
  }

  logSyntaxHighlighting(language: string, duration: number, lineCount: number) {
    log.info('EditorLogger', `🎨 Syntax highlighting: ${language}`, {
      duration: `${duration.toFixed(2)}ms`,
      lines: lineCount,
      msPerLine: (duration / lineCount).toFixed(2)
    });
  }

  // Log editor warnings/issues
  logMemoryWarning(usage: number) {
    log.warn('EditorLogger', `⚠️ High editor memory usage: ${usage.toFixed(1)}%`);
  }

  logLargeFileWarning(fileName: string, size: number) {
    log.warn('EditorLogger', `⚠️ Large file opened: ${fileName}`, {
      size: `${(size / 1024 / 1024).toFixed(2)} MB`,
      warning: 'Performance may be impacted'
    });
  }

  // Get editor statistics
  getStatistics() {
    return {
      editorType: this.currentState.type,
      currentFile: this.currentState.fileName,
      recentCommands: this.commandHistory.slice(-10),
      commandCount: this.commandHistory.length,
      currentMode: this.currentState.mode,
      ...this.currentState
    };
  }

  // Export command history
  exportCommandHistory(): string {
    return JSON.stringify({
      editor: this.currentState.type,
      commands: this.commandHistory,
      exportTime: new Date().toISOString()
    }, null, 2);
  }

  // Clear command history
  clearHistory() {
    this.commandHistory = [];
    log.info('EditorLogger', 'Command history cleared');
  }
}

// Export singleton
export const editorLogger = EditorLogger.getInstance();

// VIM-specific logging helpers
export const vimLog = {
  init: (success: boolean, details?: any) => 
    editorLogger.logVimInit(success, details),
  command: (cmd: string, mode: string = 'normal') => 
    editorLogger.logVimCommand(cmd, mode),
  modeChange: (from: string, to: string) => 
    editorLogger.logVimModeChange(from, to),
  error: (error: string, command?: string) => 
    editorLogger.logVimError(error, command),
};

// Monaco-specific logging helpers
export const monacoLog = {
  init: (success: boolean, details?: any) => 
    editorLogger.logMonacoInit(success, details),
  command: (cmd: string, details?: any) => 
    editorLogger.logMonacoCommand(cmd, details),
  languageChange: (oldLang: string, newLang: string) => 
    editorLogger.logMonacoLanguageChange(oldLang, newLang),
  themeChange: (theme: string) => 
    editorLogger.logMonacoThemeChange(theme),
};

// React hook
export function useEditorLogging() {
  return {
    logFileOpen: editorLogger.logFileOpen.bind(editorLogger),
    logFileSave: editorLogger.logFileSave.bind(editorLogger),
    logFileClose: editorLogger.logFileClose.bind(editorLogger),
    logCursorMove: editorLogger.logCursorMove.bind(editorLogger),
    logSelection: editorLogger.logSelection.bind(editorLogger),
    vim: vimLog,
    monaco: monacoLog,
  };
}
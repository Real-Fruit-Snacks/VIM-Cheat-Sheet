/**
 * VIM Command Parser - Recognizes and analyzes VIM command patterns
 * This is the foundation for both enhanced keystroke visualization and Vim Golf validation
 */

export interface VimCommand {
  id: string;
  sequence: string;
  type: 'operator' | 'motion' | 'text-object' | 'compound' | 'insert' | 'visual' | 'command';
  operator?: string;
  motion?: string;
  textObject?: string;
  count?: number;
  description: string;
  efficiency: 'optimal' | 'good' | 'inefficient';
  alternatives?: string[];
}

export interface CommandPattern {
  pattern: RegExp;
  type: VimCommand['type'];
  description: string;
  efficiency: VimCommand['efficiency'];
  alternatives?: string[];
}

/**
 * Common VIM command patterns for recognition
 */
const COMMAND_PATTERNS: CommandPattern[] = [
  // Text objects with operators
  { 
    pattern: /^([cdyvx])([ai])([w\(\)\[\]{}'"<>btsp])$/, 
    type: 'compound', 
    description: 'Operator with text object',
    efficiency: 'optimal',
    alternatives: []
  },
  
  // Word operations
  { 
    pattern: /^([cdyvx])(\d*)([wWeE])$/, 
    type: 'compound', 
    description: 'Operator with word motion',
    efficiency: 'good',
    alternatives: ['Consider text objects (ciw vs cw)']
  },
  
  // Line operations
  { 
    pattern: /^([cdyvx])([cdyvx])$/, 
    type: 'compound', 
    description: 'Line operation (doubled operator)',
    efficiency: 'optimal'
  },
  
  // Counted operations
  { 
    pattern: /^(\d+)([cdyvxhjklwbefnNGg])$/, 
    type: 'compound', 
    description: 'Counted motion or operation',
    efficiency: 'good'
  },
  
  // Search operations
  { 
    pattern: /^([/?])(.+)$/, 
    type: 'command', 
    description: 'Search command',
    efficiency: 'optimal'
  },
  
  // Insert mode entries
  { 
    pattern: /^([iIaAoOsScC])$/, 
    type: 'insert', 
    description: 'Enter insert mode',
    efficiency: 'optimal'
  },
  
  // Visual mode entries
  { 
    pattern: /^([vV])$/, 
    type: 'visual', 
    description: 'Enter visual mode',
    efficiency: 'optimal'
  },
  
  // Navigation
  { 
    pattern: /^([hjklwbefnN\$0\^GgHML])$/, 
    type: 'motion', 
    description: 'Basic movement',
    efficiency: 'good'
  },
  
  // Operators
  { 
    pattern: /^([cdyv])$/, 
    type: 'operator', 
    description: 'Operator (needs motion)',
    efficiency: 'good'
  }
];

/**
 * Efficiency analysis for common inefficient patterns
 */
const INEFFICIENCY_PATTERNS = [
  {
    pattern: /^([hjkl])+$/,
    suggestion: 'Use word motions (w, b, e) or text objects instead of repeated hjkl',
    efficiency: 'inefficient' as const
  },
  {
    pattern: /^(x)+$/,
    suggestion: 'Use dw, daw, or other motions instead of repeated x',
    efficiency: 'inefficient' as const
  },
  {
    pattern: /^(dd)+$/,
    suggestion: 'Use visual mode (V) and d, or counted delete (3dd)',
    efficiency: 'inefficient' as const
  }
];

/**
 * Command alternatives for better efficiency
 */
const ALTERNATIVES_MAP: Record<string, string[]> = {
  'cw': ['ciw - change inner word (more precise)'],
  'dw': ['daw - delete a word (including whitespace)', 'diw - delete inner word'],
  'yw': ['yaw - yank a word (including whitespace)', 'yiw - yank inner word'],
  'x': ['daw - delete word', 'diw - delete inner word', 'dd - delete line'],
  'hjkl': ['w - word forward', 'b - word backward', 'f{char} - find character', '/{pattern} - search']
};

export class VimCommandParser {
  private keystrokeBuffer: string[] = [];
  private commandHistory: VimCommand[] = [];
  private currentMode: 'normal' | 'insert' | 'visual' | 'command' = 'normal';

  /**
   * Add a keystroke to the buffer and try to parse commands
   */
  addKeystroke(key: string, modifiers: string[] = []): VimCommand | null {
    // Format the keystroke
    const formattedKey = this.formatKeystroke(key, modifiers);
    
    // Handle mode changes
    this.updateMode(formattedKey);
    
    // Only parse commands in normal mode
    if (this.currentMode !== 'normal') {
      this.keystrokeBuffer = [];
      return null;
    }
    
    this.keystrokeBuffer.push(formattedKey);
    
    // Try to parse a command from the buffer
    const command = this.parseCommand();
    
    if (command) {
      this.commandHistory.push(command);
      this.keystrokeBuffer = [];
      return command;
    }
    
    // Clear buffer if it gets too long (probably not a valid command)
    if (this.keystrokeBuffer.length > 10) {
      this.keystrokeBuffer = [];
    }
    
    return null;
  }

  /**
   * Parse the current keystroke buffer into a VIM command
   */
  private parseCommand(): VimCommand | null {
    const sequence = this.keystrokeBuffer.join('');
    
    // Try each pattern
    for (const pattern of COMMAND_PATTERNS) {
      const match = sequence.match(pattern.pattern);
      if (match) {
        return this.createCommand(sequence, match, pattern);
      }
    }
    
    // Check for inefficient patterns
    for (const ineffPattern of INEFFICIENCY_PATTERNS) {
      if (sequence.match(ineffPattern.pattern)) {
        return {
          id: `${Date.now()}-${Math.random()}`,
          sequence,
          type: 'compound',
          description: 'Inefficient pattern detected',
          efficiency: ineffPattern.efficiency,
          alternatives: [ineffPattern.suggestion]
        };
      }
    }
    
    return null;
  }

  /**
   * Create a VimCommand object from a pattern match
   */
  private createCommand(sequence: string, match: RegExpMatchArray, pattern: CommandPattern): VimCommand {
    const [, operator, count, motion] = match;
    
    return {
      id: `${Date.now()}-${Math.random()}`,
      sequence,
      type: pattern.type,
      operator,
      motion,
      count: count ? parseInt(count) : undefined,
      description: pattern.description,
      efficiency: pattern.efficiency,
      alternatives: ALTERNATIVES_MAP[sequence] || pattern.alternatives || []
    };
  }

  /**
   * Update the current VIM mode based on keystrokes
   */
  private updateMode(key: string): void {
    switch (this.currentMode) {
      case 'normal':
        if (['i', 'I', 'a', 'A', 'o', 'O', 's', 'S', 'C'].includes(key)) {
          this.currentMode = 'insert';
        } else if (['v', 'V'].includes(key)) {
          this.currentMode = 'visual';
        } else if (key === ':') {
          this.currentMode = 'command';
        }
        break;
        
      case 'insert':
      case 'visual':
      case 'command':
        if (key === 'Esc' || key === 'Escape') {
          this.currentMode = 'normal';
        }
        break;
    }
  }

  /**
   * Format keystroke with modifiers
   */
  private formatKeystroke(key: string, modifiers: string[]): string {
    if (modifiers.length === 0) return key;
    
    // Handle Ctrl combinations
    if (modifiers.includes('Ctrl')) {
      return `<C-${key.toLowerCase()}>`;
    }
    
    // Handle other modifiers
    const modPrefix = modifiers.join('-');
    return `<${modPrefix}-${key}>`;
  }

  /**
   * Get the current mode
   */
  getCurrentMode(): string {
    return this.currentMode;
  }

  /**
   * Get command history
   */
  getCommandHistory(): VimCommand[] {
    return [...this.commandHistory];
  }

  /**
   * Clear the keystroke buffer
   */
  clearBuffer(): void {
    this.keystrokeBuffer = [];
  }

  /**
   * Reset the parser state
   */
  reset(): void {
    this.keystrokeBuffer = [];
    this.commandHistory = [];
    this.currentMode = 'normal';
  }

  /**
   * Get efficiency analysis for recent commands
   */
  getEfficiencyAnalysis(): {
    score: number;
    suggestions: string[];
    patterns: string[];
  } {
    const recentCommands = this.commandHistory.slice(-10);
    
    let totalScore = 0;
    const suggestions: string[] = [];
    const patterns: string[] = [];
    
    recentCommands.forEach(cmd => {
      switch (cmd.efficiency) {
        case 'optimal': totalScore += 3; break;
        case 'good': totalScore += 2; break;
        case 'inefficient': totalScore += 0; break;
      }
      
      if (cmd.alternatives && cmd.alternatives.length > 0) {
        suggestions.push(...cmd.alternatives);
      }
      
      patterns.push(cmd.sequence);
    });
    
    const score = recentCommands.length > 0 ? Math.round((totalScore / (recentCommands.length * 3)) * 100) : 100;
    
    return {
      score,
      suggestions: [...new Set(suggestions)],
      patterns: [...new Set(patterns)]
    };
  }
}

// Export a singleton instance for global use
export const vimCommandParser = new VimCommandParser();
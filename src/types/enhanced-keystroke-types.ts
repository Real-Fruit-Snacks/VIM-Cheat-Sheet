/**
 * Enhanced types for the improved keystroke visualizer system
 * Extends the existing keystroke system with VIM command analysis
 */

import type { Keystroke } from '../hooks/useKeystrokeVisualizer';
import type { VimCommand } from '../utils/vim-command-parser';

/**
 * Enhanced keystroke with VIM command analysis
 */
export interface EnhancedKeystroke extends Keystroke {
  /** Current VIM mode when keystroke was captured */
  vimMode: 'normal' | 'insert' | 'visual' | 'command';
  
  /** Command group this keystroke belongs to (e.g., 'ciw', 'd3w') */
  commandGroup?: string;
  
  /** Type of keystroke in VIM context */
  commandType?: 'operator' | 'motion' | 'text-object' | 'count' | 'modifier' | 'standalone';
  
  /** Efficiency rating of this keystroke/command */
  efficiency?: 'optimal' | 'good' | 'inefficient';
  
  /** Alternative command suggestions */
  suggestion?: string;
  
  /** Whether this keystroke completes a command */
  isCommandComplete?: boolean;
  
  /** Index within a command sequence (0-based) */
  sequenceIndex?: number;
}

/**
 * A sequence of keystrokes that form a complete VIM command
 */
export interface KeystrokeSequence {
  /** Unique identifier */
  id: string;
  
  /** All keystrokes in this sequence */
  keystrokes: EnhancedKeystroke[];
  
  /** The parsed VIM command */
  command: VimCommand;
  
  /** When the sequence started */
  startTime: number;
  
  /** When the sequence completed */
  endTime: number;
  
  /** VIM mode during this sequence */
  mode: string;
  
  /** Whether this sequence should be highlighted */
  isHighlighted?: boolean;
  
  /** Visual grouping information */
  displayGroup?: {
    color: string;
    label: string;
    icon?: string;
  };
}

/**
 * Configuration for enhanced keystroke visualizer
 */
export interface EnhancedKeystrokeConfig {
  /** Enable command grouping visualization */
  showCommandGroups: boolean;
  
  /** Enable mode indicators */
  showModeIndicators: boolean;
  
  /** Enable efficiency hints */
  showEfficiencyHints: boolean;
  
  /** Enable alternative suggestions */
  showSuggestions: boolean;
  
  /** Auto-hide suggestions after this many seconds */
  suggestionAutoHideDelay: number;
  
  /** Color scheme for mode indicators */
  modeColors: {
    normal: string;
    insert: string;
    visual: string;
    command: string;
  };
  
  /** Color scheme for efficiency indicators */
  efficiencyColors: {
    optimal: string;
    good: string;
    inefficient: string;
  };
  
  /** Animation settings */
  animations: {
    groupFormation: boolean;
    modeTransition: boolean;
    efficiencyPulse: boolean;
  };
}

/**
 * Default enhanced configuration
 */
export const DEFAULT_ENHANCED_CONFIG: EnhancedKeystrokeConfig = {
  showCommandGroups: true,
  showModeIndicators: true,
  showEfficiencyHints: true,
  showSuggestions: false, // Off by default to avoid overwhelming beginners
  suggestionAutoHideDelay: 5000,
  modeColors: {
    normal: '#3b82f6', // blue
    insert: '#10b981', // green
    visual: '#8b5cf6', // purple
    command: '#f59e0b'  // orange
  },
  efficiencyColors: {
    optimal: '#10b981',   // green
    good: '#3b82f6',      // blue
    inefficient: '#ef4444' // red
  },
  animations: {
    groupFormation: true,
    modeTransition: true,
    efficiencyPulse: true
  }
};

/**
 * Efficiency analysis for a session
 */
export interface EfficiencyAnalysis {
  /** Overall efficiency score (0-100) */
  score: number;
  
  /** Number of optimal commands */
  optimalCount: number;
  
  /** Number of good commands */
  goodCount: number;
  
  /** Number of inefficient commands */
  inefficientCount: number;
  
  /** Total commands analyzed */
  totalCommands: number;
  
  /** Improvement suggestions */
  suggestions: string[];
  
  /** Most common command patterns */
  commonPatterns: Array<{
    pattern: string;
    count: number;
    efficiency: 'optimal' | 'good' | 'inefficient';
  }>;
  
  /** Timestamp of analysis */
  timestamp: number;
}

/**
 * Learning insight for educational features
 */
export interface LearningInsight {
  /** Type of insight */
  type: 'efficiency' | 'pattern' | 'alternative' | 'mode' | 'tip';
  
  /** Insight message */
  message: string;
  
  /** Commands or patterns this relates to */
  relatedCommands: string[];
  
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
  
  /** Whether user has seen this insight */
  seen: boolean;
  
  /** When this insight was generated */
  timestamp: number;
}

/**
 * Enhanced visualizer state
 */
export interface EnhancedVisualizerState {
  /** Current keystroke sequences */
  sequences: KeystrokeSequence[];
  
  /** Current VIM mode */
  currentMode: 'normal' | 'insert' | 'visual' | 'command';
  
  /** Pending keystrokes (not yet forming a complete command) */
  pendingKeystrokes: EnhancedKeystroke[];
  
  /** Recent efficiency analysis */
  efficiency: EfficiencyAnalysis | null;
  
  /** Available learning insights */
  insights: LearningInsight[];
  
  /** Whether to show educational overlay */
  showEducationalOverlay: boolean;
}
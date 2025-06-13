/**
 * Enhanced Keystroke Visualizer Hook
 * Extends the existing keystroke system with VIM command analysis and educational features
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useKeystrokeVisualizer } from './useKeystrokeVisualizer';
import { vimCommandParser, type VimCommand } from '../utils/vim-command-parser';
import type {
  EnhancedKeystroke,
  KeystrokeSequence,
  EnhancedKeystrokeConfig,
  EfficiencyAnalysis,
  LearningInsight,
  EnhancedVisualizerState
} from '../types/enhanced-keystroke-types';
import { DEFAULT_ENHANCED_CONFIG } from '../types/enhanced-keystroke-types';

/**
 * Enhanced keystroke visualizer with VIM command analysis
 */
export function useEnhancedKeystrokeVisualizer() {
  // Use the existing keystroke visualizer as foundation
  const baseVisualizer = useKeystrokeVisualizer();
  
  // Enhanced state
  const [enhancedConfig, setEnhancedConfig] = useState<EnhancedKeystrokeConfig>(() => {
    const saved = localStorage.getItem('vim-io-enhanced-keystroke-config');
    if (saved) {
      try {
        return { ...DEFAULT_ENHANCED_CONFIG, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse enhanced keystroke config:', e);
      }
    }
    return DEFAULT_ENHANCED_CONFIG;
  });
  
  const [sequences, setSequences] = useState<KeystrokeSequence[]>([]);
  const [currentMode, setCurrentMode] = useState<'normal' | 'insert' | 'visual' | 'command'>('normal');
  const [pendingKeystrokes, setPendingKeystrokes] = useState<EnhancedKeystroke[]>([]);
  const [efficiency, setEfficiency] = useState<EfficiencyAnalysis | null>(null);
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [showEducationalOverlay, setShowEducationalOverlay] = useState(false);
  
  const sequenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save enhanced config when it changes
  useEffect(() => {
    localStorage.setItem('vim-io-enhanced-keystroke-config', JSON.stringify(enhancedConfig));
  }, [enhancedConfig]);

  // Clean up old sequences periodically
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      setSequences(prev => prev.filter(seq => seq.endTime > now - 10000)); // Keep for 10 seconds
    };

    const interval = setInterval(cleanup, 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Enhanced keystroke handler that analyzes VIM commands
   */
  const addEnhancedKeystroke = useCallback((event: KeyboardEvent) => {
    // Call the base visualizer first
    baseVisualizer.addKeystroke(event);
    
    if (!enhancedConfig.showCommandGroups && !enhancedConfig.showModeIndicators) {
      return; // Skip enhanced analysis if features are disabled
    }

    const key = event.key;
    const modifiers: string[] = [];
    
    if (event.ctrlKey) modifiers.push('Ctrl');
    if (event.altKey) modifiers.push('Alt');
    if (event.shiftKey && key.length > 1) modifiers.push('Shift');
    if (event.metaKey) modifiers.push('Cmd');

    // Don't process modifier keys by themselves
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
      return;
    }

    // Try to parse a VIM command
    const command = vimCommandParser.addKeystroke(key, modifiers);
    const mode = vimCommandParser.getCurrentMode() as typeof currentMode;
    
    // Update current mode
    setCurrentMode(mode);

    // Create enhanced keystroke
    const enhancedKeystroke: EnhancedKeystroke = {
      id: `${Date.now()}-${Math.random()}`,
      key,
      modifiers,
      timestamp: Date.now(),
      fadeOutAt: Date.now() + baseVisualizer.config.fadeOutDelay,
      vimMode: mode,
      sequenceIndex: pendingKeystrokes.length
    };

    if (command) {
      // Complete command found - create sequence
      const sequenceKeystrokes = [...pendingKeystrokes, enhancedKeystroke].map((ks, index) => ({
        ...ks,
        commandGroup: command.sequence,
        commandType: getCommandType(ks.key, index, command),
        efficiency: command.efficiency,
        suggestion: command.alternatives?.[0],
        isCommandComplete: index === pendingKeystrokes.length,
        sequenceIndex: index
      }));

      const sequence: KeystrokeSequence = {
        id: command.id,
        keystrokes: sequenceKeystrokes,
        command,
        startTime: sequenceKeystrokes[0]?.timestamp || Date.now(),
        endTime: Date.now(),
        mode,
        displayGroup: getDisplayGroup(command)
      };

      setSequences(prev => [...prev, sequence]);
      setPendingKeystrokes([]);
      
      // Generate learning insights
      if (enhancedConfig.showSuggestions || enhancedConfig.showEfficiencyHints) {
        generateInsights(command);
      }
      
      // Schedule efficiency analysis
      scheduleEfficiencyAnalysis();
      
    } else {
      // Add to pending keystrokes
      setPendingKeystrokes(prev => [...prev, enhancedKeystroke]);
      
      // Clear pending keystrokes after timeout
      if (sequenceTimeoutRef.current) {
        clearTimeout(sequenceTimeoutRef.current);
      }
      
      sequenceTimeoutRef.current = setTimeout(() => {
        setPendingKeystrokes([]);
      }, 2000);
    }
  }, [baseVisualizer, enhancedConfig, pendingKeystrokes]);

  /**
   * Determine the type of a keystroke within a command
   */
  const getCommandType = (key: string, index: number, command: VimCommand): EnhancedKeystroke['commandType'] => {
    if (command.type === 'compound') {
      if (index === 0) return 'operator';
      if (/^\d+$/.test(key)) return 'count';
      return 'motion';
    }
    
    switch (command.type) {
      case 'operator': return 'operator';
      case 'motion': return 'motion';
      case 'text-object': return 'text-object';
      default: return 'standalone';
    }
  };

  /**
   * Get display group styling for a command
   */
  const getDisplayGroup = (command: VimCommand) => {
    const colors = enhancedConfig.efficiencyColors;
    
    return {
      color: colors[command.efficiency],
      label: command.type,
      icon: getCommandIcon(command.type)
    };
  };

  /**
   * Get icon for command type
   */
  const getCommandIcon = (type: VimCommand['type']): string => {
    switch (type) {
      case 'operator': return '✂️';
      case 'motion': return '➡️';
      case 'text-object': return '🎯';
      case 'compound': return '⚡';
      case 'insert': return '✏️';
      case 'visual': return '👁️';
      case 'command': return '💻';
      default: return '';
    }
  };

  /**
   * Generate learning insights based on command usage
   */
  const generateInsights = useCallback((command: VimCommand) => {
    const newInsights: LearningInsight[] = [];

    // Efficiency insights
    if (command.efficiency === 'inefficient' && enhancedConfig.showEfficiencyHints) {
      newInsights.push({
        type: 'efficiency',
        message: `Try to avoid repetitive ${command.sequence}. ${command.alternatives?.[0] || 'Consider using motions or text objects.'}`,
        relatedCommands: [command.sequence],
        priority: 'high',
        seen: false,
        timestamp: Date.now()
      });
    }

    // Alternative suggestions
    if (command.alternatives && command.alternatives.length > 0 && enhancedConfig.showSuggestions) {
      newInsights.push({
        type: 'alternative',
        message: `For ${command.sequence}: ${command.alternatives[0]}`,
        relatedCommands: [command.sequence],
        priority: 'medium',
        seen: false,
        timestamp: Date.now()
      });
    }

    // Add insights to state
    setInsights(prev => {
      const filtered = prev.filter(insight => !newInsights.some(ni => ni.message === insight.message));
      return [...filtered, ...newInsights].slice(-5); // Keep only 5 most recent
    });
  }, [enhancedConfig]);

  /**
   * Schedule efficiency analysis after a delay
   */
  const scheduleEfficiencyAnalysis = useCallback(() => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    analysisTimeoutRef.current = setTimeout(() => {
      const analysis = vimCommandParser.getEfficiencyAnalysis();
      const commandHistory = vimCommandParser.getCommandHistory();
      
      const efficiencyAnalysis: EfficiencyAnalysis = {
        score: analysis.score,
        optimalCount: commandHistory.filter(cmd => cmd.efficiency === 'optimal').length,
        goodCount: commandHistory.filter(cmd => cmd.efficiency === 'good').length,
        inefficientCount: commandHistory.filter(cmd => cmd.efficiency === 'inefficient').length,
        totalCommands: commandHistory.length,
        suggestions: analysis.suggestions,
        commonPatterns: getCommonPatterns(commandHistory),
        timestamp: Date.now()
      };
      
      setEfficiency(efficiencyAnalysis);
    }, 1000);
  }, []);

  /**
   * Get common command patterns from history
   */
  const getCommonPatterns = (history: VimCommand[]) => {
    const patternCounts = new Map<string, { count: number; efficiency: VimCommand['efficiency'] }>();
    
    history.forEach(cmd => {
      const existing = patternCounts.get(cmd.sequence);
      if (existing) {
        existing.count++;
      } else {
        patternCounts.set(cmd.sequence, { count: 1, efficiency: cmd.efficiency });
      }
    });
    
    return Array.from(patternCounts.entries())
      .map(([pattern, data]) => ({ pattern, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  /**
   * Update enhanced configuration
   */
  const updateEnhancedConfig = useCallback((updates: Partial<EnhancedKeystrokeConfig>) => {
    setEnhancedConfig(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Clear all enhanced data
   */
  const clearEnhancedData = useCallback(() => {
    setSequences([]);
    setPendingKeystrokes([]);
    setInsights([]);
    setEfficiency(null);
    vimCommandParser.reset();
  }, []);

  /**
   * Mark insight as seen
   */
  const markInsightSeen = useCallback((insightIndex: number) => {
    setInsights(prev => prev.map((insight, index) => 
      index === insightIndex ? { ...insight, seen: true } : insight
    ));
  }, []);

  /**
   * Toggle educational overlay
   */
  const toggleEducationalOverlay = useCallback(() => {
    setShowEducationalOverlay(prev => !prev);
  }, []);

  // Enhanced state object
  const enhancedState: EnhancedVisualizerState = {
    sequences,
    currentMode,
    pendingKeystrokes,
    efficiency,
    insights,
    showEducationalOverlay
  };

  return {
    // Base visualizer
    ...baseVisualizer,
    
    // Enhanced features
    enhancedConfig,
    enhancedState,
    addEnhancedKeystroke,
    updateEnhancedConfig,
    clearEnhancedData,
    markInsightSeen,
    toggleEducationalOverlay
  };
}

export type EnhancedKeystrokeVisualizerHook = ReturnType<typeof useEnhancedKeystrokeVisualizer>;
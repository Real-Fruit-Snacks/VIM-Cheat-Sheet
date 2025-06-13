/**
 * Enhanced Keystroke Overlay - Advanced visualization with command grouping and VIM analysis
 */

import { useEffect, useState } from 'react';
import type {
  EnhancedKeystroke,
  KeystrokeSequence,
  EnhancedKeystrokeConfig,
  EnhancedVisualizerState,
  EfficiencyAnalysis,
  LearningInsight
} from '../types/enhanced-keystroke-types';

interface EnhancedKeystrokeOverlayProps {
  config: EnhancedKeystrokeConfig;
  state: EnhancedVisualizerState;
  onInsightSeen: (index: number) => void;
}

export default function EnhancedKeystrokeOverlay({ 
  config, 
  state, 
  onInsightSeen 
}: EnhancedKeystrokeOverlayProps) {
  const [visibleSequences, setVisibleSequences] = useState<KeystrokeSequence[]>([]);
  const [visiblePending, setVisiblePending] = useState<EnhancedKeystroke[]>([]);

  // Update visible sequences and pending keystrokes
  useEffect(() => {
    const now = Date.now();
    
    // Filter and update sequences
    const activeSequences = state.sequences.filter(seq => 
      seq.endTime > now - 3000 // Show for 3 seconds after completion
    );
    setVisibleSequences(activeSequences);

    // Filter and update pending keystrokes
    const activePending = state.pendingKeystrokes.filter(ks =>
      ks.fadeOutAt > now
    );
    setVisiblePending(activePending);
  }, [state.sequences, state.pendingKeystrokes]);

  if (!config.showCommandGroups && !config.showModeIndicators) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Main keystroke visualization */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2">
          {/* Completed command sequences */}
          {visibleSequences.map((sequence) => (
            <CommandSequenceDisplay 
              key={sequence.id}
              sequence={sequence}
              config={config}
            />
          ))}
          
          {/* Pending keystrokes */}
          {visiblePending.length > 0 && (
            <PendingKeystrokesDisplay 
              keystrokes={visiblePending}
              config={config}
              currentMode={state.currentMode}
            />
          )}
        </div>
      </div>

      {/* Mode indicator */}
      {config.showModeIndicators && (
        <ModeIndicator 
          mode={state.currentMode}
          config={config}
        />
      )}

      {/* Efficiency analysis */}
      {config.showEfficiencyHints && state.efficiency && (
        <EfficiencyDisplay 
          analysis={state.efficiency}
        />
      )}

      {/* Learning insights */}
      {config.showSuggestions && state.insights.length > 0 && (
        <InsightsDisplay 
          insights={state.insights}
          onInsightSeen={onInsightSeen}
        />
      )}

      {/* Educational overlay */}
      {state.showEducationalOverlay && (
        <EducationalOverlay 
          sequences={visibleSequences}
        />
      )}
    </div>
  );
}

/**
 * Display a completed command sequence with grouping
 */
function CommandSequenceDisplay({ 
  sequence, 
  config 
}: { 
  sequence: KeystrokeSequence; 
  config: EnhancedKeystrokeConfig; 
}) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fadeStart = sequence.endTime + 1000; // Start fading after 1 second
    const fadeEnd = sequence.endTime + 3000; // Complete fade after 3 seconds
    
    const updateOpacity = () => {
      const now = Date.now();
      if (now < fadeStart) {
        setOpacity(1);
      } else if (now > fadeEnd) {
        setOpacity(0);
      } else {
        const progress = (now - fadeStart) / (fadeEnd - fadeStart);
        setOpacity(1 - progress);
      }
    };

    updateOpacity();
    const interval = setInterval(updateOpacity, 50);
    return () => clearInterval(interval);
  }, [sequence.endTime]);

  if (opacity <= 0) return null;

  const efficiencyColor = config.efficiencyColors[sequence.command.efficiency];

  return (
    <div
      className="flex items-center gap-1 px-3 py-2 bg-gray-800/90 backdrop-blur-sm 
                 border rounded-lg shadow-lg transition-all duration-300"
      style={{
        opacity,
        borderColor: efficiencyColor,
        boxShadow: `0 0 10px ${efficiencyColor}20`
      }}
    >
      {/* Command type icon */}
      {sequence.displayGroup?.icon && (
        <span className="text-sm mr-1">
          {sequence.displayGroup.icon}
        </span>
      )}

      {/* Keystroke sequence */}
      <div className="flex items-center gap-1">
        {sequence.keystrokes.map((keystroke) => (
          <KeystrokeDisplay
            key={keystroke.id}
            keystroke={keystroke}
            isInSequence={true}
            sequenceColor={efficiencyColor}
          />
        ))}
      </div>

      {/* Efficiency indicator */}
      <div 
        className="w-2 h-2 rounded-full ml-2"
        style={{ backgroundColor: efficiencyColor }}
      />
    </div>
  );
}

/**
 * Display pending keystrokes that haven't formed a complete command yet
 */
function PendingKeystrokesDisplay({ 
  keystrokes, 
  config, 
  currentMode 
}: { 
  keystrokes: EnhancedKeystroke[]; 
  config: EnhancedKeystrokeConfig;
  currentMode: string;
}) {
  const modeColor = config.modeColors[currentMode as keyof typeof config.modeColors];

  return (
    <div
      className="flex items-center gap-1 px-3 py-2 bg-gray-800/70 backdrop-blur-sm 
                 border border-dashed rounded-lg shadow-lg"
      style={{ borderColor: modeColor }}
    >
      {keystrokes.map((keystroke) => (
        <KeystrokeDisplay
          key={keystroke.id}
          keystroke={keystroke}
          isInSequence={false}
          sequenceColor={modeColor}
        />
      ))}
      
      {/* Pending indicator */}
      <div className="flex items-center ml-2">
        <div 
          className="w-1 h-1 rounded-full animate-pulse"
          style={{ backgroundColor: modeColor }}
        />
        <div 
          className="w-1 h-1 rounded-full animate-pulse ml-1"
          style={{ 
            backgroundColor: modeColor,
            animationDelay: '0.2s'
          }}
        />
        <div 
          className="w-1 h-1 rounded-full animate-pulse ml-1"
          style={{ 
            backgroundColor: modeColor,
            animationDelay: '0.4s'
          }}
        />
      </div>
    </div>
  );
}

/**
 * Display individual keystroke with enhanced styling
 */
function KeystrokeDisplay({ 
  keystroke, 
  isInSequence, 
  sequenceColor 
}: {
  keystroke: EnhancedKeystroke;
  isInSequence: boolean;
  sequenceColor: string;
}) {
  const getCommandTypeStyle = (type?: string) => {
    switch (type) {
      case 'operator':
        return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'motion':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'text-object':
        return 'bg-purple-600/20 text-purple-400 border-purple-600/30';
      case 'count':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Modifiers */}
      {keystroke.modifiers.map((mod, i) => (
        <span
          key={i}
          className={`inline-flex items-center justify-center px-2 py-1 
                     rounded font-mono font-semibold min-w-[2.5rem] text-xs
                     ${getCommandTypeStyle('modifier')}`}
        >
          {mod}
        </span>
      ))}
      
      {/* Separator */}
      {keystroke.modifiers.length > 0 && (
        <span className="text-gray-500 text-xs">+</span>
      )}
      
      {/* Main key */}
      <span
        className={`inline-flex items-center justify-center px-2 py-1 
                   rounded font-mono font-semibold min-w-[2.5rem] text-xs border
                   ${isInSequence 
                     ? getCommandTypeStyle(keystroke.commandType)
                     : 'bg-gray-600/20 text-gray-300 border-gray-600/30'
                   }`}
        style={isInSequence ? {} : { borderColor: sequenceColor }}
      >
        {keystroke.key}
      </span>
    </div>
  );
}

/**
 * Mode indicator in the top-right corner
 */
function ModeIndicator({ 
  mode, 
  config 
}: { 
  mode: string; 
  config: EnhancedKeystrokeConfig; 
}) {
  const modeColor = config.modeColors[mode as keyof typeof config.modeColors];
  const modeLabels = {
    normal: 'NORMAL',
    insert: 'INSERT',
    visual: 'VISUAL',
    command: 'COMMAND'
  };

  return (
    <div className="fixed top-8 right-8">
      <div
        className="px-3 py-1 rounded-lg font-mono font-bold text-sm backdrop-blur-sm
                   border transition-all duration-200"
        style={{
          backgroundColor: `${modeColor}20`,
          color: modeColor,
          borderColor: modeColor
        }}
      >
        {modeLabels[mode as keyof typeof modeLabels] || mode.toUpperCase()}
      </div>
    </div>
  );
}

/**
 * Efficiency analysis display
 */
function EfficiencyDisplay({ 
  analysis 
}: { 
  analysis: EfficiencyAnalysis; 
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#3b82f6'; // blue
    return '#ef4444'; // red
  };

  return (
    <div className="fixed top-8 left-8">
      <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 
                      rounded-lg p-3 max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-gray-300">Efficiency</span>
          <div
            className="px-2 py-1 rounded text-xs font-bold"
            style={{
              backgroundColor: `${getScoreColor(analysis.score)}20`,
              color: getScoreColor(analysis.score)
            }}
          >
            {analysis.score}%
          </div>
        </div>
        
        <div className="text-xs text-gray-400 space-y-1">
          <div>Optimal: {analysis.optimalCount}</div>
          <div>Good: {analysis.goodCount}</div>
          <div>Inefficient: {analysis.inefficientCount}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Learning insights display
 */
function InsightsDisplay({ 
  insights, 
  onInsightSeen 
}: {
  insights: LearningInsight[];
  onInsightSeen: (index: number) => void;
}) {
  const unseenInsights = insights.filter(insight => !insight.seen);
  
  if (unseenInsights.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-8 max-w-sm">
      {unseenInsights.slice(0, 2).map((insight) => (
        <div
          key={insight.timestamp}
          className="bg-blue-800/90 backdrop-blur-sm border border-blue-600 
                     rounded-lg p-3 mb-2 cursor-pointer hover:bg-blue-700/90
                     transition-all duration-200"
          onClick={() => onInsightSeen(insights.indexOf(insight))}
        >
          <div className="flex items-start gap-2">
            <div className="text-blue-400 text-sm">💡</div>
            <div>
              <div className="text-xs font-semibold text-blue-300 mb-1">
                {insight.type.toUpperCase()} TIP
              </div>
              <div className="text-xs text-gray-200">
                {insight.message}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Educational overlay with detailed command information
 */
function EducationalOverlay({ 
  sequences 
}: {
  sequences: KeystrokeSequence[];
}) {
  if (sequences.length === 0) return null;

  const recentSequence = sequences[sequences.length - 1];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">
          Command Analysis
        </h3>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm font-semibold text-gray-300">Command:</span>
            <span className="ml-2 font-mono text-green-400">
              {recentSequence.command.sequence}
            </span>
          </div>
          
          <div>
            <span className="text-sm font-semibold text-gray-300">Type:</span>
            <span className="ml-2 text-blue-400">
              {recentSequence.command.type}
            </span>
          </div>
          
          <div>
            <span className="text-sm font-semibold text-gray-300">Description:</span>
            <div className="text-sm text-gray-200 mt-1">
              {recentSequence.command.description}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-semibold text-gray-300">Efficiency:</span>
            <span 
              className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                recentSequence.command.efficiency === 'optimal' ? 'bg-green-500/20 text-green-400' :
                recentSequence.command.efficiency === 'good' ? 'bg-blue-500/20 text-blue-400' :
                'bg-red-500/20 text-red-400'
              }`}
            >
              {recentSequence.command.efficiency.toUpperCase()}
            </span>
          </div>
          
          {recentSequence.command.alternatives && recentSequence.command.alternatives.length > 0 && (
            <div>
              <span className="text-sm font-semibold text-gray-300">Alternatives:</span>
              <div className="text-sm text-gray-200 mt-1">
                {recentSequence.command.alternatives[0]}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-xs text-gray-400 text-center">
          Click anywhere to close
        </div>
      </div>
    </div>
  );
}
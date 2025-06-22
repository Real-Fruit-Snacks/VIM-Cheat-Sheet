import { useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'

interface ExampleState {
  text: string[]
  cursorRow: number
  cursorCol: number
  mode: 'normal' | 'insert' | 'visual' | 'command'
  description: string
}

interface VimCommandExampleProps {
  command: string
  beforeState: ExampleState
  afterState: ExampleState
  explanation: string
}

export default function VimCommandExample({ 
  command, 
  beforeState, 
  afterState, 
  explanation 
}: VimCommandExampleProps) {
  const [currentState, setCurrentState] = useState<'before' | 'after'>('before')
  const [isAnimating, setIsAnimating] = useState(false)

  const state = currentState === 'before' ? beforeState : afterState

  const executeCommand = () => {
    if (currentState === 'before') {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentState('after')
        setIsAnimating(false)
      }, 300)
    }
  }

  const reset = () => {
    setCurrentState('before')
    setIsAnimating(false)
  }

  const renderTextWithCursor = () => {
    return state.text.map((line, rowIndex) => (
      <div key={rowIndex} className="flex font-mono text-sm leading-relaxed">
        {[...line].map((char, colIndex) => {
          const isCursor = rowIndex === state.cursorRow && colIndex === state.cursorCol
          const isAfterCursor = rowIndex === state.cursorRow && colIndex === state.cursorCol + 1 && char === ' '
          
          return (
            <span
              key={colIndex}
              className={`relative ${
                isCursor 
                  ? 'bg-green-400 text-black font-bold' 
                  : isAfterCursor && currentState === 'before'
                  ? 'bg-green-400/30'
                  : ''
              } ${isAnimating ? 'transition-all duration-300' : ''}`}
            >
              {char === ' ' ? '\u00A0' : char}
              {isCursor && currentState === 'after' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
            </span>
          )
        })}
        {/* Handle cursor at end of line */}
        {rowIndex === state.cursorRow && state.cursorCol >= line.length && (
          <span className="bg-green-400 text-black font-bold">\u00A0</span>
        )}
      </div>
    ))
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'normal': return 'text-blue-400 bg-blue-400/20'
      case 'insert': return 'text-green-400 bg-green-400/20'
      case 'visual': return 'text-yellow-400 bg-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mt-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <code className="bg-gray-900 text-green-300 px-2 py-1 rounded font-mono text-sm font-bold">
            {command}
          </code>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getModeColor(state.mode)}`}>
            {state.mode.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={executeCommand}
            disabled={currentState === 'after' || isAnimating}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded text-xs transition-colors"
          >
            <Play className="h-3 w-3" />
            <span>Execute</span>
          </button>
          
          <button
            onClick={reset}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* State Indicator */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xs text-gray-400">State:</span>
        <span className={`text-xs font-medium ${
          currentState === 'before' ? 'text-yellow-400' : 'text-green-400'
        }`}>
          {currentState === 'before' ? 'Before' : 'After'} execution
        </span>
        <span className="text-xs text-gray-500">•</span>
        <span className="text-xs text-gray-400">{state.description}</span>
      </div>

      {/* Text Editor View */}
      <div className="bg-gray-900 rounded border border-gray-600 p-3 mb-3">
        <div className="space-y-1">
          {renderTextWithCursor()}
        </div>
      </div>

      {/* Explanation */}
      <div className="text-sm text-gray-300 leading-relaxed">
        <span className="font-medium text-gray-200">Explanation:</span> {explanation}
      </div>
    </div>
  )
}
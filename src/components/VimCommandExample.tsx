import { useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'

interface ExampleState {
  text: string[]
  cursorRow: number
  cursorCol: number
  mode: 'normal' | 'insert' | 'visual' | 'command'
  description: string
  visualEnd?: { row: number; col: number }
  commandLine?: string
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
      <div key={rowIndex} className="flex font-mono text-sm">
        <span className="text-gray-500 select-none pr-2 text-right" style={{ minWidth: '3ch' }}>
          {rowIndex + 1}
        </span>
        <span className="text-gray-600 select-none pr-2">│</span>
        {[...line].map((char, colIndex) => {
          const isCursor = rowIndex === state.cursorRow && colIndex === state.cursorCol
          const isVisualMode = state.mode === 'visual'
          
          // Check if this character is within visual selection
          let isSelected = false
          if (isVisualMode && state.visualEnd) {
            const startRow = Math.min(state.cursorRow, state.visualEnd.row)
            const endRow = Math.max(state.cursorRow, state.visualEnd.row)
            
            if (rowIndex >= startRow && rowIndex <= endRow) {
              if (startRow === endRow) {
                // Single line selection
                const startCol = Math.min(state.cursorCol, state.visualEnd.col)
                const endCol = Math.max(state.cursorCol, state.visualEnd.col)
                isSelected = colIndex >= startCol && colIndex <= endCol
              } else if (rowIndex === startRow) {
                // First line of multi-line selection
                const startCol = state.cursorRow < state.visualEnd.row ? state.cursorCol : state.visualEnd.col
                isSelected = colIndex >= startCol
              } else if (rowIndex === endRow) {
                // Last line of multi-line selection
                const endCol = state.cursorRow > state.visualEnd.row ? state.cursorCol : state.visualEnd.col
                isSelected = colIndex <= endCol
              } else {
                // Middle lines of multi-line selection
                isSelected = true
              }
            }
          } else if (isVisualMode && !state.visualEnd) {
            // Visual mode just started, only cursor position is selected
            isSelected = isCursor
          }
          
          return (
            <span
              key={colIndex}
              className={`relative ${
                isCursor 
                  ? state.mode === 'insert' 
                    ? 'border-l-2 border-green-400' 
                    : 'bg-gray-300 text-gray-900'
                  : ''
              } ${isSelected ? 'bg-blue-600 text-white' : ''} ${
                isAnimating ? 'transition-all duration-300' : ''
              }`}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          )
        })}
        {/* Handle cursor at end of line */}
        {rowIndex === state.cursorRow && state.cursorCol >= line.length && (
          <span className={
            state.mode === 'insert' 
              ? 'border-l-2 border-green-400' 
              : 'bg-gray-300 text-gray-900'
          }>\u00A0</span>
        )}
      </div>
    ))
  }

  const getModeDisplay = () => {
    switch (state.mode) {
      case 'normal': return ''
      case 'insert': return '-- INSERT --'
      case 'visual': return '-- VISUAL --'
      case 'command': return ':'
      default: return ''
    }
  }

  const getModeColor = () => {
    switch (state.mode) {
      case 'insert': return 'text-green-400'
      case 'visual': return 'text-yellow-400'
      case 'command': return 'text-gray-300'
      default: return 'text-gray-500'
    }
  }

  // Show command being typed for search/command mode
  const getCommandLine = () => {
    // Use explicit commandLine if provided
    if (state.commandLine) {
      return state.commandLine
    }
    
    // Otherwise, derive from command and mode
    if (command.startsWith('/') || command.startsWith('?')) {
      return command
    }
    if (command.startsWith(':')) {
      return command
    }
    if (state.mode === 'command') {
      return ':' + command.substring(1)
    }
    return getModeDisplay()
  }

  // Generate a realistic filename
  const filename = 'example.txt'
  const isModified = currentState === 'after'
  
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 mt-3 overflow-hidden">
      {/* VIM Editor Container */}
      <div className="bg-gray-900">
        {/* Text Editor Area */}
        <div className="p-3 min-h-[120px]">
          <div className="space-y-0">
            {renderTextWithCursor()}
          </div>
          {/* Empty lines to fill space */}
          {state.text.length < 6 && Array(6 - state.text.length).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="flex font-mono text-sm">
              <span className="text-gray-600 select-none pr-2 text-right" style={{ minWidth: '3ch' }}>~</span>
              <span className="text-gray-600 select-none pr-2">│</span>
            </div>
          ))}
        </div>

        {/* VIM Status Line */}
        <div className="bg-gray-800 border-t border-gray-700 px-3 py-1 flex justify-between items-center">
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="text-gray-300">
              {filename}{isModified ? ' [+]' : ''}
            </span>
            <span className="text-gray-500">
              {state.cursorRow + 1},{state.cursorCol + 1}
            </span>
            <span className="text-gray-500">
              {Math.round(((state.cursorRow + 1) / state.text.length) * 100)}%
            </span>
          </div>
          <div className="text-xs font-mono text-gray-500">
            {state.mode === 'insert' ? 'INSERT' : state.mode === 'visual' ? 'VISUAL' : ''}
          </div>
        </div>

        {/* VIM Command Line */}
        <div className="bg-black px-3 py-1 min-h-[24px] flex items-center">
          <span className={`font-mono text-sm ${getModeColor()}`}>
            {getCommandLine()}
          </span>
          {state.mode === 'normal' && currentState === 'after' && command !== ':' && (
            <span className="font-mono text-sm text-gray-400 ml-1">
              {command.length <= 3 ? `[${command} executed]` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-800 p-3 border-t border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400 font-medium">
              {currentState === 'before' ? 'Before' : 'After'}: {state.description}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={executeCommand}
              disabled={currentState === 'after' || isAnimating}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded text-xs transition-colors"
            >
              <Play className="h-3 w-3" />
              <span>Execute {command}</span>
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

        {/* Explanation */}
        <div className="text-sm text-gray-300 leading-relaxed">
          <span className="font-medium text-gray-200">Explanation:</span> {explanation}
        </div>
      </div>
    </div>
  )
}
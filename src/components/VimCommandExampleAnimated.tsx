import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Play, RotateCcw } from 'lucide-react'

export interface ExampleState {
  text: string[]
  cursorRow: number
  cursorCol: number
  mode: 'normal' | 'insert' | 'visual' | 'visual-line' | 'visual-block' | 'command'
  description: string
  visualEnd?: { row: number; col: number }
  commandLine?: string
}

interface VimCommandExampleProps {
  command: string
  before: ExampleState
  after: ExampleState
  className?: string
  autoPlay?: boolean
}

const VimCommandExampleAnimated = React.memo(({ command, before, after, className = '', autoPlay = false }: VimCommandExampleProps) => {
  const [currentState, setCurrentState] = useState<ExampleState>(before)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showBefore, setShowBefore] = useState(true)
  const playbackRef = useRef<string>('')

  // Create a unique key for the current state
  const stateKey = `${command}-${JSON.stringify(before)}-${JSON.stringify(after)}`

  // Update internal state when props change (for demo auto-play and reset)
  useEffect(() => {
    setCurrentState(before)
    setShowBefore(true)
    setIsAnimating(false)
    // Reset playback ref when state changes
    playbackRef.current = ''
  }, [before, after, command])

  const runExample = useCallback(() => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setShowBefore(false)
    setCurrentState(before)
    
    // VIM cursor movements are instant, not animated
    // Show the command execution with a brief delay for clarity
    setTimeout(() => {
      setCurrentState(after)
      setIsAnimating(false)
    }, 150) // Brief pause to show the command execution
  }, [isAnimating, before, after])

  // Trigger animation when autoPlay prop is true
  useEffect(() => {
    if (autoPlay && !isAnimating && playbackRef.current !== stateKey) {
      playbackRef.current = stateKey
      // Small delay to ensure the component renders the before state first
      const timeoutId = setTimeout(() => {
        runExample()
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [autoPlay, isAnimating, stateKey, runExample])

  const reset = () => {
    setIsAnimating(false)
    setShowBefore(true)
    setCurrentState(before)
    playbackRef.current = ''
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'normal': return 'bg-blue-500'
      case 'insert': return 'bg-green-500'
      case 'visual': return 'bg-purple-500'
      case 'visual-line': return 'bg-purple-600'
      case 'visual-block': return 'bg-purple-700'
      case 'command': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getModeText = (mode: string) => {
    switch (mode) {
      case 'normal': return '-- NORMAL --'
      case 'insert': return '-- INSERT --'
      case 'visual': return '-- VISUAL --'
      case 'visual-line': return '-- VISUAL LINE --'
      case 'visual-block': return '-- VISUAL BLOCK --'
      case 'command': return ':'
      default: return ''
    }
  }

  const renderTextWithCursor = () => {
    const lines = currentState.text.map((line, rowIndex) => {
      const chars = line.split('')
      const elements: React.JSX.Element[] = []
      
      chars.forEach((char, colIndex) => {
        const isCursor = rowIndex === currentState.cursorRow && colIndex === currentState.cursorCol
        const isSelected = (currentState.mode === 'visual' || currentState.mode === 'visual-line' || currentState.mode === 'visual-block') && 
          currentState.visualEnd && 
          isInVisualSelection(rowIndex, colIndex, currentState)
        
        const charElement = (
          <span
            key={`${rowIndex}-${colIndex}`}
            className={`
              relative inline-block
              ${isSelected ? 'bg-purple-500/50 text-white' : ''}
            `}
          >
            {char === ' ' ? '\u00A0' : char}
            {isCursor && (
              <div
                className={`
                  absolute inset-0 
                  ${currentState.mode === 'insert' ? 'border-l-2' : 'bg-opacity-70'} 
                  ${getModeColor(currentState.mode)}
                `}
                style={{
                  width: currentState.mode === 'insert' ? '2px' : '100%',
                }}
              />
            )}
          </span>
        )
        
        elements.push(charElement)
      })
      
      // Handle cursor at end of line
      if (rowIndex === currentState.cursorRow && currentState.cursorCol >= chars.length) {
        elements.push(
          <span key={`${rowIndex}-cursor`} className="relative inline-block">
            <span className="opacity-0">_</span>
            <div
              className={`
                absolute inset-0 
                ${currentState.mode === 'insert' ? 'border-l-2' : 'bg-opacity-70'} 
                ${getModeColor(currentState.mode)}
              `}
              style={{
                width: currentState.mode === 'insert' ? '2px' : '100%',
              }}
            />
          </span>
        )
      }
      
      return elements
    })
    
    return lines
  }

  const isInVisualSelection = (row: number, col: number, state: ExampleState) => {
    if (!state.visualEnd) return false
    
    const startRow = Math.min(state.cursorRow, state.visualEnd.row)
    const endRow = Math.max(state.cursorRow, state.visualEnd.row)
    
    // For visual line mode, select entire lines
    if (state.mode === 'visual-line') {
      return row >= startRow && row <= endRow
    }
    
    // For character visual mode, use character-by-character selection
    const startCol = state.cursorRow < state.visualEnd.row ? state.cursorCol : state.visualEnd.col
    const endCol = state.cursorRow < state.visualEnd.row ? state.visualEnd.col : state.cursorCol
    
    if (row < startRow || row > endRow) return false
    if (row === startRow && row === endRow) {
      return col >= Math.min(startCol, endCol) && col <= Math.max(startCol, endCol)
    }
    if (row === startRow) return col >= startCol
    if (row === endRow) return col <= endCol
    return true
  }

  const isLineInVisualSelection = (row: number, state: ExampleState) => {
    if (!state.visualEnd) return false
    if (state.mode !== 'visual' && state.mode !== 'visual-line' && state.mode !== 'visual-block') return false
    const startRow = Math.min(state.cursorRow, state.visualEnd.row)
    const endRow = Math.max(state.cursorRow, state.visualEnd.row)
    return row >= startRow && row <= endRow
  }

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-700 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono text-gray-300">{command}</span>
          <span className="text-xs text-gray-400">
            {showBefore ? 'Before' : isAnimating ? 'Running...' : 'After'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={runExample}
            disabled={isAnimating}
            className="p-1 text-green-400 hover:text-green-300 disabled:text-gray-500 transition-colors"
            title="Run example"
          >
            <Play className="h-4 w-4" />
          </button>
          <button
            onClick={reset}
            className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="p-4">
        {/* Line numbers and content */}
        <div className="font-mono text-sm">
          {currentState.text.map((_, index) => {
            const isLineSelected = isLineInVisualSelection(index, currentState)
            return (
              <div key={index} className="flex relative">
                {/* Visual mode line indicator */}
                {isLineSelected && (
                  <div className="absolute left-0 w-1 h-full bg-purple-500" />
                )}
                
                {/* Line number */}
                <span className={`mr-4 select-none w-8 text-right ${
                  isLineSelected ? 'text-purple-400 font-bold' : 'text-gray-600'
                }`}>
                  {index + 1}
                </span>
                
                {/* Line content with optional background */}
                <div className={`text-gray-200 whitespace-pre flex-1 ${
                  isLineSelected ? (currentState.mode === 'visual-line' ? 'bg-purple-500/30' : 'bg-purple-500/10') : ''
                }`}>
                  {renderTextWithCursor()[index]}
                </div>
              </div>
            )
          })}
          
          {/* Empty lines with tilde */}
          {Array.from({ length: Math.max(0, 6 - currentState.text.length) }, (_, i) => (
            <div key={`empty-${i}`} className="flex">
              <span className="text-gray-600 mr-4 select-none w-8 text-right">~</span>
              <div className="text-gray-600"></div>
            </div>
          ))}
        </div>
        
        {/* Status Line */}
        <div className="mt-4 pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center text-xs">
            <div className="text-gray-400">
              <span className="font-bold">example.txt</span>
              {' '}
              {currentState.cursorRow + 1},{currentState.cursorCol + 1}
              {' '}
              {(currentState.mode === 'visual' || currentState.mode === 'visual-line' || currentState.mode === 'visual-block') && currentState.visualEnd && (
                <>
                  {' → '}
                  {currentState.visualEnd.row + 1},{currentState.visualEnd.col + 1}
                  {' '}
                </>
              )}
              {Math.round(((currentState.cursorRow + 1) / currentState.text.length) * 100)}%
            </div>
            <div className={`px-2 py-0.5 rounded ${getModeColor(currentState.mode)} text-white font-semibold`}>
              {getModeText(currentState.mode)}
            </div>
          </div>
          
          {/* Command Line */}
          {currentState.commandLine && (
            <div className="mt-1 text-gray-300 font-mono text-sm">
              {currentState.commandLine}
            </div>
          )}
        </div>
        
        {/* Description */}
        <div className="mt-3 text-sm text-gray-400 italic">
          {currentState.description}
        </div>
      </div>
    </div>
  )
})

VimCommandExampleAnimated.displayName = 'VimCommandExampleAnimated'

export default VimCommandExampleAnimated
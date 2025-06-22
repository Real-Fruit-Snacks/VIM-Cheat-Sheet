import React, { useState, useEffect, useRef } from 'react'
import { Play, RotateCcw } from 'lucide-react'

export interface ExampleState {
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
  before: ExampleState
  after: ExampleState
  className?: string
}

const VimCommandExampleAnimated = React.memo(({ command, before, after, className = '' }: VimCommandExampleProps) => {
  const [currentState, setCurrentState] = useState<ExampleState>(before)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showBefore, setShowBefore] = useState(true)
  const animationRef = useRef<number | undefined>(undefined)
  const cursorRef = useRef<HTMLDivElement>(null)

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const animateCursor = (fromRow: number, fromCol: number, toRow: number, toCol: number, duration: number) => {
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeInOutCubic = (t: number) => t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2
      
      const easedProgress = easeInOutCubic(progress)
      
      const currentRow = fromRow + (toRow - fromRow) * easedProgress
      const currentCol = fromCol + (toCol - fromCol) * easedProgress
      
      setCurrentState(prev => ({
        ...prev,
        cursorRow: Math.round(currentRow),
        cursorCol: Math.round(currentCol)
      }))
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete, set final state
        setCurrentState(after)
        setIsAnimating(false)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }

  const runExample = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setShowBefore(false)
    setCurrentState(before)
    
    // Calculate animation duration based on cursor distance
    const rowDiff = Math.abs(after.cursorRow - before.cursorRow)
    const colDiff = Math.abs(after.cursorCol - before.cursorCol)
    const distance = Math.sqrt(rowDiff * rowDiff + colDiff * colDiff)
    const duration = Math.min(300 + distance * 50, 1000) // 300-1000ms
    
    // Start animation after a brief pause
    setTimeout(() => {
      animateCursor(before.cursorRow, before.cursorCol, after.cursorRow, after.cursorCol, duration)
    }, 200)
  }

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setIsAnimating(false)
    setShowBefore(true)
    setCurrentState(before)
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'normal': return 'bg-blue-500'
      case 'insert': return 'bg-green-500'
      case 'visual': return 'bg-purple-500'
      case 'command': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getModeText = (mode: string) => {
    switch (mode) {
      case 'normal': return '-- NORMAL --'
      case 'insert': return '-- INSERT --'
      case 'visual': return '-- VISUAL --'
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
        const isSelected = currentState.mode === 'visual' && currentState.visualEnd && 
          isInVisualSelection(rowIndex, colIndex, currentState)
        
        const charElement = (
          <span
            key={`${rowIndex}-${colIndex}`}
            className={`
              relative inline-block
              ${isSelected ? 'bg-blue-500/30 text-white' : ''}
              ${isCursor && isAnimating ? 'transition-all duration-150' : ''}
            `}
          >
            {char === ' ' ? '\u00A0' : char}
            {isCursor && (
              <div
                ref={cursorRef}
                className={`
                  absolute inset-0 
                  ${currentState.mode === 'insert' ? 'border-l-2' : 'bg-opacity-70'} 
                  ${getModeColor(currentState.mode)}
                  ${isAnimating ? 'animate-pulse' : ''}
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
          {currentState.text.map((_, index) => (
            <div key={index} className="flex">
              <span className="text-gray-600 mr-4 select-none w-8 text-right">
                {index + 1}
              </span>
              <div className="text-gray-200 whitespace-pre">
                {renderTextWithCursor()[index]}
              </div>
            </div>
          ))}
          
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
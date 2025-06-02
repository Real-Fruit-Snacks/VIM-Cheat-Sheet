import { useEffect } from 'react'
import CheatSheetModal from './CheatSheetModal'

interface CheatSheetButtonProps {
  isOpen: boolean
  onToggle: (open: boolean) => void
  whichKeyEnabled: boolean
  onToggleWhichKey: (enabled: boolean) => void
}

export default function CheatSheetButton({ isOpen, onToggle, whichKeyEnabled, onToggleWhichKey }: CheatSheetButtonProps) {
  /** Handle global keyboard shortcuts for cheat sheet */
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger when body element has focus
      if (event.target === document.body && event.key === '?') {
        event.preventDefault()
        onToggle(!isOpen)
      }
      
      // Close with Escape key
      if (event.key === 'Escape' && isOpen) {
        onToggle(false)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, onToggle])

  return (
    <>
      <button
        onClick={() => onToggle(!isOpen)}
        className={`
          w-8 h-8 rounded 
          bg-gray-700 hover:bg-green-600 
          text-gray-300 hover:text-white font-bold text-sm
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-green-500/50
          ${isOpen ? 'bg-green-600 text-white' : ''}
        `}
        title="VIM Cheat Sheet (Press ? to toggle)"
        aria-label="Toggle VIM cheat sheet"
      >
        {isOpen ? '×' : '?'}
      </button>

      <CheatSheetModal 
        isOpen={isOpen} 
        onClose={() => onToggle(false)} 
        whichKeyEnabled={whichKeyEnabled}
        onToggleWhichKey={onToggleWhichKey}
      />
    </>
  )
}
import { useState } from 'react'
import { vimGolfEngine } from '../utils/vim-golf-engine'

interface VimGolfButtonProps {
  onClick: () => void
}

export default function VimGolfButton({ onClick }: VimGolfButtonProps) {
  const [progress] = useState(() => vimGolfEngine.getProgress())

  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded bg-gray-700 hover:bg-purple-600 text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 relative"
      title="Vim Golf Challenges"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      
      {/* Progress indicator */}
      {progress.challengesCompleted > 0 && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">
            {progress.challengesCompleted}
          </span>
        </div>
      )}
    </button>
  )
}
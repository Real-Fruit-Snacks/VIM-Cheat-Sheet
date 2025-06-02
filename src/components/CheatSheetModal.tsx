import { useState } from 'react'
import { vimCommands } from '../data/vim-commands'

interface CheatSheetModalProps {
  isOpen: boolean
  onClose: () => void
  whichKeyEnabled: boolean
  onToggleWhichKey: (enabled: boolean) => void
}

export default function CheatSheetModal({ isOpen, onClose, whichKeyEnabled, onToggleWhichKey }: CheatSheetModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('basicMovement')

  if (!isOpen) return null

  const categories = Object.keys(vimCommands)
  
  const filteredCommands = searchTerm
    ? Object.entries(vimCommands).reduce((acc, [category, commands]) => {
        const filtered = commands.filter(cmd => 
          cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        if (filtered.length > 0) {
          acc[category] = filtered
        }
        return acc
      }, {} as typeof vimCommands)
    : { [activeCategory]: vimCommands[activeCategory] }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-modal="cheat-sheet">
      <div className="w-full max-w-6xl max-h-[90vh] bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-400">VIM Cheat Sheet</h2>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <span className="text-sm text-gray-300">Which-Key Helper</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={whichKeyEnabled}
                  onClick={() => onToggleWhichKey(!whichKeyEnabled)}
                  className={`
                    relative inline-flex h-6 w-12 items-center rounded-full
                    transition-colors duration-200 focus:outline-none focus:ring-2 
                    focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800
                    ${whichKeyEnabled ? 'bg-green-600' : 'bg-gray-600'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${whichKeyEnabled ? 'translate-x-7' : 'translate-x-1'}
                    `}
                  />
                </button>
              </label>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl font-bold p-2 hover:bg-gray-700 rounded"
                aria-label="Close cheat sheet"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {!searchTerm && (
            <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto custom-scrollbar">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Categories
                </h3>
                <ul className="space-y-1">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => setActiveCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${
                          activeCategory === category
                            ? 'bg-green-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {Object.entries(filteredCommands).map(([category, commands]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold text-green-400 mb-4 border-b border-gray-700 pb-2">
                  {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {commands.map((cmd, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <code className="bg-gray-900 text-green-300 px-2 py-1 rounded font-mono text-sm">
                          {cmd.command}
                        </code>
                        {cmd.mode && (
                          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                            {cmd.mode}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {cmd.description}
                      </p>
                      {cmd.example && (
                        <p className="text-gray-400 text-xs mt-2 italic">
                          Example: {cmd.example}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(filteredCommands).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No commands found matching "{searchTerm}"</p>
                <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 border-t border-gray-700 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Press <kbd className="bg-gray-700 px-2 py-1 rounded">?</kbd> to toggle • <kbd className="bg-gray-700 px-2 py-1 rounded">Esc</kbd> to close</span>
            <span>{Object.values(filteredCommands).reduce((total, commands) => total + commands.length, 0)} commands shown</span>
          </div>
        </div>
      </div>
    </div>
  )
}
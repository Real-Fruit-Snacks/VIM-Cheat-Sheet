import React from 'react'
import { Command, Lightbulb } from 'lucide-react'

interface SearchSuggestionsProps {
  suggestions: string[]
  relatedCommands: string[]
  commonMistake?: string
  onSelectSuggestion: (suggestion: string) => void
  isVisible: boolean
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  relatedCommands,
  commonMistake,
  onSelectSuggestion,
  isVisible
}) => {
  if (!isVisible || (suggestions.length === 0 && !commonMistake)) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
      {commonMistake && (
        <div className="p-3 border-b border-gray-700">
          <div className="flex items-center space-x-2 text-sm">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <span className="text-gray-300">Did you mean:</span>
            <button
              onClick={() => onSelectSuggestion(commonMistake)}
              className="text-green-400 font-mono hover:text-green-300 transition-colors"
            >
              {commonMistake}
            </button>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="p-2">
          <div className="text-xs text-gray-500 mb-2 px-2">Suggestions</div>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSelectSuggestion(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors rounded flex items-center space-x-2"
            >
              <Command className="h-3 w-3 text-gray-400" />
              <span className="text-gray-300 text-sm font-mono">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {relatedCommands.length > 0 && (
        <div className="p-2 border-t border-gray-700">
          <div className="text-xs text-gray-500 mb-2 px-2">Related Commands</div>
          <div className="flex flex-wrap gap-1 px-2">
            {relatedCommands.map((cmd) => (
              <button
                key={cmd}
                onClick={() => onSelectSuggestion(cmd)}
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors font-mono"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchSuggestions
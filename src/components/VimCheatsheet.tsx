import { useState, useEffect, useMemo } from 'react'
import { vimCommands } from '../data/vim-commands'
import { vimExamples } from '../data/vim-examples'
import VimCommandExample from './VimCommandExample'
import { Search, Copy, Heart, Filter, ArrowUp, ArrowDown, PlayCircle } from 'lucide-react'

interface VimCommand {
  command: string
  description: string
  mode?: string
  example?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  frequency?: 'common' | 'rare' | 'essential'
}

type FilterType = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'essential' | 'common' | 'rare'
type SortType = 'alphabetical' | 'difficulty' | 'frequency' | 'category'

export default function VimCheatsheet() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('category')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [commandBuilder, setCommandBuilder] = useState<string>('')
  const [showCommandBuilder, setShowCommandBuilder] = useState(false)
  const [showExamples, setShowExamples] = useState<Set<string>>(new Set())

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('vim-cheatsheet-favorites')
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('vim-cheatsheet-favorites', JSON.stringify(Array.from(favorites)))
  }, [favorites])

  // Enhanced commands with difficulty and frequency
  const enhancedCommands = useMemo(() => {
    const enhanced: Record<string, (VimCommand & { category: string })[]> = {}
    
    Object.entries(vimCommands).forEach(([category, commands]) => {
      enhanced[category] = commands.map(cmd => ({
        ...cmd,
        category,
        difficulty: getDifficultyLevel(cmd.command, category),
        frequency: getFrequencyLevel(cmd.command)
      }))
    })
    
    return enhanced
  }, [])

  // Get all commands as flat array for searching
  const allCommands = useMemo(() => {
    return Object.values(enhancedCommands).flat()
  }, [enhancedCommands])

  // Filter and search commands
  const filteredCommands = useMemo(() => {
    let filtered = allCommands

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(cmd => 
        cmd.command.toLowerCase().includes(term) ||
        cmd.description.toLowerCase().includes(term) ||
        cmd.mode?.toLowerCase().includes(term) ||
        cmd.example?.toLowerCase().includes(term)
      )
    }

    // Apply category filter
    if (activeCategory) {
      filtered = filtered.filter(cmd => cmd.category === activeCategory)
    }

    // Apply difficulty/frequency filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(cmd => 
        cmd.difficulty === selectedFilter || cmd.frequency === selectedFilter
      )
    }

    // Sort commands
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.command.localeCompare(b.command))
        break
      case 'difficulty': {
        const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 }
        filtered.sort((a, b) => difficultyOrder[a.difficulty!] - difficultyOrder[b.difficulty!])
        break
      }
      case 'frequency': {
        const frequencyOrder = { essential: 0, common: 1, rare: 2 }
        filtered.sort((a, b) => frequencyOrder[a.frequency!] - frequencyOrder[b.frequency!])
        break
      }
      default: // category
        filtered.sort((a, b) => a.category.localeCompare(b.category))
    }

    return filtered
  }, [allCommands, searchTerm, activeCategory, selectedFilter, sortBy])

  // Group filtered commands by category for display
  const groupedCommands = useMemo(() => {
    const grouped: Record<string, typeof filteredCommands> = {}
    filteredCommands.forEach(cmd => {
      if (!grouped[cmd.category]) {
        grouped[cmd.category] = []
      }
      grouped[cmd.category].push(cmd)
    })
    return grouped
  }, [filteredCommands])

  const categories = Object.keys(enhancedCommands)

  const toggleFavorite = (command: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(command)) {
      newFavorites.delete(command)
    } else {
      newFavorites.add(command)
    }
    setFavorites(newFavorites)
  }

  const copyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopiedCommand(command)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (error) {
      console.error('Failed to copy command:', error)
    }
  }

  const addToCommandBuilder = (command: string) => {
    setCommandBuilder(prev => prev + command)
    if (!showCommandBuilder) {
      setShowCommandBuilder(true)
    }
  }

  const toggleExample = (command: string) => {
    const newShowExamples = new Set(showExamples)
    if (newShowExamples.has(command)) {
      newShowExamples.delete(command)
    } else {
      newShowExamples.add(command)
    }
    setShowExamples(newShowExamples)
  }

  const clearCommandBuilder = () => {
    setCommandBuilder('')
  }

  const copyCommandBuilder = async () => {
    try {
      await navigator.clipboard.writeText(commandBuilder)
      setCopiedCommand(commandBuilder)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (error) {
      console.error('Failed to copy command builder:', error)
    }
  }

  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-green-400 mb-4">VIM Cheatsheet</h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search commands, descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
            >
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </div>
              {showFilters ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </button>

            {showFilters && (
              <div className="space-y-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as FilterType)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  <option value="all">All Commands</option>
                  <option value="essential">Essential</option>
                  <option value="common">Common</option>
                  <option value="rare">Advanced/Rare</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  <option value="category">Sort by Category</option>
                  <option value="alphabetical">Sort Alphabetically</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="frequency">Sort by Frequency</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Categories ({categories.length})
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  activeCategory === null
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                All Categories ({allCommands.length})
              </button>
              {categories.map((category) => {
                const count = enhancedCommands[category].length
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      activeCategory === category
                        ? 'bg-green-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')} ({count})
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Command Builder */}
        {showCommandBuilder && (
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-400">Command Builder</h4>
              <button
                onClick={clearCommandBuilder}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-800 text-green-300 px-3 py-2 rounded font-mono text-sm">
                {commandBuilder || 'Empty'}
              </code>
              <button
                onClick={copyCommandBuilder}
                className="p-2 text-gray-400 hover:text-white"
                title="Copy command"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              {activeCategory 
                ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1).replace(/([A-Z])/g, ' $1')} Commands`
                : 'All VIM Commands'
              }
            </h2>
            <p className="text-gray-400">
              Showing {filteredCommands.length} commands
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedFilter !== 'all' && ` • ${selectedFilter} level`}
            </p>
          </div>

          {/* Commands Grid */}
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No commands found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedCommands).map(([category, commands]) => (
                <div key={category} className="space-y-4">
                  {!activeCategory && (
                    <h3 className="text-lg font-semibold text-green-400 border-b border-gray-700 pb-2">
                      {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                    </h3>
                  )}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {commands.map((cmd, index) => (
                      <div
                        key={`${category}-${index}`}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <code 
                              className="bg-gray-900 text-green-300 px-3 py-1 rounded font-mono text-sm cursor-pointer hover:bg-gray-700 transition-colors"
                              onClick={() => addToCommandBuilder(cmd.command)}
                              title="Click to add to command builder"
                            >
                              {cmd.command}
                            </code>
                            {vimExamples[cmd.command] && (
                              <span className="text-xs text-blue-400 font-semibold" title="Interactive example available">
                                ▶
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {vimExamples[cmd.command] && (
                              <button
                                onClick={() => toggleExample(cmd.command)}
                                className={`p-1 transition-colors ${
                                  showExamples.has(cmd.command)
                                    ? 'text-blue-400 hover:text-blue-300'
                                    : 'text-gray-400 hover:text-blue-400'
                                }`}
                                title="Toggle interactive example"
                              >
                                <PlayCircle className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={() => copyCommand(cmd.command)}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                              title="Copy command"
                            >
                              {copiedCommand === cmd.command ? (
                                <span className="text-green-400 text-xs">✓</span>
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                            <button
                              onClick={() => toggleFavorite(cmd.command)}
                              className={`p-1 transition-colors ${
                                favorites.has(cmd.command)
                                  ? 'text-red-400 hover:text-red-300'
                                  : 'text-gray-400 hover:text-red-400'
                              }`}
                              title="Toggle favorite"
                            >
                              <Heart className={`h-3 w-3 ${favorites.has(cmd.command) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                          {cmd.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {cmd.mode && (
                              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                {cmd.mode}
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded ${
                              cmd.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                              cmd.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {cmd.difficulty}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              cmd.frequency === 'essential' ? 'bg-blue-500/20 text-blue-400' :
                              cmd.frequency === 'common' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {cmd.frequency}
                            </span>
                          </div>
                        </div>

                        {cmd.example && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <p className="text-gray-400 text-xs">
                              <span className="font-semibold">Example:</span> {cmd.example}
                            </p>
                          </div>
                        )}

                        {/* Interactive Examples */}
                        {showExamples.has(cmd.command) && vimExamples[cmd.command] && (
                          <VimCommandExample
                            command={vimExamples[cmd.command].command}
                            beforeState={vimExamples[cmd.command].beforeState}
                            afterState={vimExamples[cmd.command].afterState}
                            explanation={vimExamples[cmd.command].explanation}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions to assign difficulty and frequency levels
function getDifficultyLevel(command: string, _category: string): 'beginner' | 'intermediate' | 'advanced' {
  // Essential movement commands
  if (['h', 'j', 'k', 'l', 'w', 'b', 'e', '0', '$', 'gg', 'G'].includes(command)) {
    return 'beginner'
  }
  
  // Basic editing
  if (['i', 'a', 'o', 'x', 'dd', 'u', 'p', 'yy', ':w', ':q', '/'].includes(command)) {
    return 'beginner'
  }

  // Text objects, advanced search/replace, macros
  if (command.includes('\\') || command.startsWith('@') || command.startsWith('q') || 
      command.includes('reg') || command.includes('marks') || _category === 'macrosAndAdvanced') {
    return 'advanced'
  }

  // Everything else is intermediate
  return 'intermediate'
}

function getFrequencyLevel(command: string): 'essential' | 'common' | 'rare' {
  // Most essential commands
  if (['h', 'j', 'k', 'l', 'i', 'a', 'x', 'dd', 'u', 'p', 'yy', ':w', ':q', ':wq', '/', 'n', 'gg', 'G'].includes(command)) {
    return 'essential'
  }

  // Common but not essential
  if (['o', 'O', 'w', 'b', 'e', '$', '0', 'dw', 'cw', 'cc', 'C', 'D', 'A', 'I', 'v', 'V'].includes(command)) {
    return 'common'
  }

  // Advanced/rare commands
  return 'rare'
}
import { useState, useEffect, useMemo } from 'react'
import { vimCommands } from '../data/vim-commands'
import { vimExamples } from '../data/vim-examples'
import VimCommandExample from './VimCommandExample'
import VimHelpViewer from './VimHelpViewer'
import { Search, Copy, Heart, Filter, ArrowUp, ArrowDown, PlayCircle, HelpCircle } from 'lucide-react'

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
  const [showHelpViewer, setShowHelpViewer] = useState(false)
  const [helpFile, setHelpFile] = useState<string>('index.txt')
  const [helpTag, setHelpTag] = useState<string | undefined>(undefined)

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

  const openHelpViewer = (command: string, category: string) => {
    const helpInfo = getVimHelpInfo(command, category)
    setHelpFile(helpInfo.file)
    setHelpTag(helpInfo.tag)
    setShowHelpViewer(true)
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

          {/* VIM Help Integration Notice */}
          <div className="mb-6 bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-300 font-medium mb-1">Integrated VIM Documentation</p>
                <p className="text-blue-200/80">
                  Official VIM help documentation is now available directly within this app. 
                  Click the <HelpCircle className="inline-block h-3 w-3" /> icon next to any command to view detailed documentation offline.
                </p>
                <p className="text-blue-200/60 mt-2 text-xs">
                  Tip: In VIM, use <code className="bg-gray-800 px-1 rounded">:help command</code> to access the same documentation.
                </p>
              </div>
            </div>
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openHelpViewer(cmd.command, category)
                              }}
                              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                              title="View VIM help documentation"
                            >
                              <HelpCircle className="h-3 w-3" />
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
      
      {/* VIM Help Viewer */}
      <VimHelpViewer
        isOpen={showHelpViewer}
        onClose={() => setShowHelpViewer(false)}
        initialFile={helpFile}
        initialTag={helpTag}
      />
    </div>
  )
}

// Get help file and tag for a command
function getVimHelpInfo(command: string, category: string): { file: string; tag?: string } {
  // Map commands to their help documentation
  const helpMap: Record<string, { file: string; tag?: string }> = {
    // Movement
    'h': { file: 'motion.txt', tag: 'h' },
    'j': { file: 'motion.txt', tag: 'j' },
    'k': { file: 'motion.txt', tag: 'k' },
    'l': { file: 'motion.txt', tag: 'l' },
    'w': { file: 'motion.txt', tag: 'w' },
    'b': { file: 'motion.txt', tag: 'b' },
    'e': { file: 'motion.txt', tag: 'e' },
    '0': { file: 'motion.txt', tag: '0' },
    '$': { file: 'motion.txt', tag: '$' },
    '^': { file: 'motion.txt', tag: '^' },
    'gg': { file: 'motion.txt', tag: 'gg' },
    'G': { file: 'motion.txt', tag: 'G' },
    '%': { file: 'motion.txt', tag: '%' },
    
    // Editing
    'i': { file: 'insert.txt', tag: 'i' },
    'a': { file: 'insert.txt', tag: 'a' },
    'o': { file: 'insert.txt', tag: 'o' },
    'O': { file: 'insert.txt', tag: 'O' },
    'I': { file: 'insert.txt', tag: 'I' },
    'A': { file: 'insert.txt', tag: 'A' },
    'dd': { file: 'change.txt', tag: 'dd' },
    'dw': { file: 'change.txt', tag: 'dw' },
    'd$': { file: 'change.txt', tag: 'd$' },
    'x': { file: 'change.txt', tag: 'x' },
    'u': { file: 'undo.txt', tag: 'u' },
    'Ctrl-r': { file: 'undo.txt', tag: 'CTRL-R' },
    'p': { file: 'change.txt', tag: 'p' },
    'P': { file: 'change.txt', tag: 'P' },
    'yy': { file: 'change.txt', tag: 'yy' },
    'yw': { file: 'change.txt', tag: 'yw' },
    
    // Visual mode
    'v': { file: 'visual.txt', tag: 'v' },
    'V': { file: 'visual.txt', tag: 'V' },
    'Ctrl-v': { file: 'visual.txt', tag: 'CTRL-V' },
    
    // Search
    '/': { file: 'pattern.txt', tag: '/' },
    '?': { file: 'pattern.txt', tag: '?' },
    'n': { file: 'pattern.txt', tag: 'n' },
    'N': { file: 'pattern.txt', tag: 'N' },
    '*': { file: 'pattern.txt', tag: 'star' },
    '#': { file: 'pattern.txt', tag: '#' },
    
    // Files
    ':w': { file: 'editing.txt', tag: ':w' },
    ':q': { file: 'editing.txt', tag: ':q' },
    ':wq': { file: 'editing.txt', tag: ':wq' },
    ':x': { file: 'editing.txt', tag: ':x' },
    ':e': { file: 'editing.txt', tag: ':e' },
    
    // Windows
    ':sp': { file: 'windows.txt', tag: ':sp' },
    ':vsp': { file: 'windows.txt', tag: ':vsp' },
    'Ctrl-w w': { file: 'windows.txt', tag: 'CTRL-W_w' },
    'Ctrl-w h': { file: 'windows.txt', tag: 'CTRL-W_h' },
    'Ctrl-w j': { file: 'windows.txt', tag: 'CTRL-W_j' },
    'Ctrl-w k': { file: 'windows.txt', tag: 'CTRL-W_k' },
    'Ctrl-w l': { file: 'windows.txt', tag: 'CTRL-W_l' },
    
    // Help
    ':help': { file: 'index.txt', tag: ':help' },
    
    // Add more mappings as needed
  }
  
  // Return specific help info if mapped, otherwise general help based on category
  if (helpMap[command]) {
    return helpMap[command]
  }
  
  // Category-based fallbacks
  const categoryMap: Record<string, { file: string; tag?: string }> = {
    'basicMovement': { file: 'motion.txt' },
    'documentNavigation': { file: 'motion.txt' },
    'scrolling': { file: 'scroll.txt' },
    'basicEditing': { file: 'change.txt' },
    'insertMode': { file: 'insert.txt' },
    'visualMode': { file: 'visual.txt' },
    'searchAndReplace': { file: 'pattern.txt' },
    'fileOperations': { file: 'editing.txt' },
    'windowsAndTabs': { file: 'windows.txt' },
    'marksAndJumps': { file: 'motion.txt', tag: 'mark-motions' },
    'registers': { file: 'change.txt', tag: 'registers' },
    'macrosAndAdvanced': { file: 'repeat.txt' },
    'folding': { file: 'fold.txt' },
    'completion': { file: 'insert.txt', tag: 'ins-completion' },
    'spellChecking': { file: 'spell.txt' },
    'diffMode': { file: 'diff.txt' },
    'helpSystem': { file: 'index.txt' }
  }
  
  return categoryMap[category] || { file: 'index.txt' }
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
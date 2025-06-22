import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Search, Copy, Heart, Filter, ArrowUp, ArrowDown, PlayCircle, HelpCircle, Keyboard, X } from 'lucide-react'
import { useDebounce } from '../hooks/useDebounce'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { useSwipeGesture } from '../hooks/useSwipeGesture'
import MobileSidebar from './MobileSidebar'
import VirtualCommandList from './VirtualCommandList'
import SearchSuggestions from './SearchSuggestions'
import VimCommandExampleAnimated from './VimCommandExampleAnimated'
import VimHelpViewer from './VimHelpViewer'
import { vimCommands } from '../data/vim-commands'
import { vimExamples } from '../data/vim-examples'
import { EnhancedSearch, COMMON_MISTAKES, RELATED_COMMANDS } from '../utils/enhancedSearch'
import type { ExpandedCommand } from '../utils/dataCompression'

type FilterType = 'all' | 'favorites' | 'beginner' | 'intermediate' | 'advanced' | 'essential' | 'common' | 'rare'
type SortType = 'alphabetical' | 'difficulty' | 'frequency' | 'category'

export default function VimCheatsheetEnhanced() {
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const commandListRef = useRef<HTMLDivElement>(null)

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Initialize enhanced search
  const enhancedSearch = useMemo(() => new EnhancedSearch(vimCommands), [])

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
    const enhanced: Record<string, (ExpandedCommand & { category: string })[]> = {}
    
    Object.entries(vimCommands).forEach(([category, commands]) => {
      enhanced[category] = commands.map(cmd => ({
        ...cmd,
        category,
        difficulty: getDifficultyLevel(cmd.command),
        frequency: getFrequencyLevel(cmd.command)
      } as ExpandedCommand & { category: string }))
    })
    
    return enhanced
  }, [])

  const allCommands = useMemo(() => {
    return Object.values(enhancedCommands).flat()
  }, [enhancedCommands])

  // Filter and search commands
  const filteredCommands = useMemo(() => {
    let filtered = activeCategory 
      ? enhancedCommands[activeCategory] || []
      : allCommands

    // Apply search with enhanced search
    if (debouncedSearchTerm) {
      const searchResults = enhancedSearch.search(debouncedSearchTerm)
      const searchResultCommands = new Set(searchResults.map(r => r.command))
      filtered = filtered.filter(cmd => searchResultCommands.has(cmd.command))
    }

    // Apply difficulty/frequency/favorites filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'favorites') {
        filtered = filtered.filter(cmd => favorites.has(cmd.command))
      } else {
        filtered = filtered.filter(cmd => 
          cmd.difficulty === selectedFilter || cmd.frequency === selectedFilter
        )
      }
    }

    // Sort
    switch (sortBy) {
      case 'alphabetical': {
        filtered = [...filtered].sort((a, b) => a.command.localeCompare(b.command))
        break
      }
      case 'difficulty': {
        const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 }
        filtered = [...filtered].sort((a, b) => 
          (difficultyOrder[a.difficulty || 'intermediate'] || 1) - 
          (difficultyOrder[b.difficulty || 'intermediate'] || 1)
        )
        break
      }
      case 'frequency': {
        const frequencyOrder = { essential: 0, common: 1, rare: 2 }
        filtered = [...filtered].sort((a, b) => 
          (frequencyOrder[a.frequency || 'common'] || 1) - 
          (frequencyOrder[b.frequency || 'common'] || 1)
        )
        break
      }
    }

    return filtered
  }, [debouncedSearchTerm, activeCategory, selectedFilter, sortBy, allCommands, enhancedCommands, enhancedSearch, favorites])

  // Group commands by category for display
  const groupedCommands = useMemo(() => {
    if (activeCategory) {
      return { [activeCategory]: filteredCommands }
    }
    
    const grouped: Record<string, typeof filteredCommands> = {}
    filteredCommands.forEach(cmd => {
      if (!grouped[cmd.category]) {
        grouped[cmd.category] = []
      }
      grouped[cmd.category].push(cmd)
    })
    
    return grouped
  }, [filteredCommands, activeCategory])

  const categories = Object.keys(enhancedCommands)

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return []
    return enhancedSearch.getSuggestions(searchTerm, 5)
  }, [searchTerm, enhancedSearch])

  const commonMistakeSuggestion = useMemo(() => {
    return searchTerm ? COMMON_MISTAKES[searchTerm.toLowerCase()] || undefined : undefined
  }, [searchTerm])

  const relatedCommands = useMemo(() => {
    if (!searchTerm || filteredCommands.length === 0) return []
    const firstCommand = filteredCommands[0]?.command
    return firstCommand ? (RELATED_COMMANDS[firstCommand] || []) : []
  }, [searchTerm, filteredCommands])

  // Event handlers
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
    setHelpTag(helpInfo.tag || undefined)
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

  const selectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }

  const clearFavorites = () => {
    if (confirm('Are you sure you want to clear all favorites? This cannot be undone.')) {
      setFavorites(new Set())
      if (selectedFilter === 'favorites') {
        setSelectedFilter('all')
      }
    }
  }

  // Keyboard navigation handlers
  const navigateUp = useCallback(() => {
    setSelectedCommandIndex(prev => Math.max(0, prev - 1))
  }, [])

  const navigateDown = useCallback(() => {
    setSelectedCommandIndex(prev => Math.min(filteredCommands.length - 1, prev + 1))
  }, [filteredCommands.length])

  const focusSearch = useCallback(() => {
    searchInputRef.current?.focus()
    searchInputRef.current?.select()
  }, [])

  const scrollToTop = useCallback(() => {
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const scrollToBottom = useCallback(() => {
    mainContentRef.current?.scrollTo({ 
      top: mainContentRef.current.scrollHeight, 
      behavior: 'smooth' 
    })
  }, [])

  const toggleKeyboardHelp = useCallback(() => {
    setShowKeyboardHelp(prev => !prev)
  }, [])

  // Setup keyboard navigation
  useKeyboardNavigation({
    onNavigateUp: navigateUp,
    onNavigateDown: navigateDown,
    onFocusSearch: focusSearch,
    onScrollToTop: scrollToTop,
    onScrollToBottom: scrollToBottom,
    onToggleHelp: toggleKeyboardHelp,
    onEscape: () => {
      setShowSuggestions(false)
      setShowKeyboardHelp(false)
    },
    isEnabled: !showHelpViewer
  })

  // Setup swipe gestures for mobile  
  useSwipeGesture(mainContentRef as React.RefObject<HTMLElement>, {
    onSwipeRight: () => setIsSidebarOpen(true),
    onSwipeLeft: () => setIsSidebarOpen(false),
  })

  // Check if command has example
  const hasExample = (command: string): boolean => {
    return command in vimExamples
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <MobileSidebar
        ref={sidebarRef}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(prev => !prev)}
        className="w-64 md:w-80 border-r border-gray-700 flex flex-col"
      >
        <div className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search commands... (press /)"
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setShowSuggestions(false)
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            <SearchSuggestions
              suggestions={searchSuggestions}
              relatedCommands={relatedCommands}
              commonMistake={commonMistakeSuggestion}
              onSelectSuggestion={selectSuggestion}
              isVisible={showSuggestions && (searchSuggestions.length > 0 || !!commonMistakeSuggestion)}
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
                  <option value="favorites">❤️ My Favorites ({favorites.size})</option>
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
                onClick={() => {
                  setActiveCategory(null)
                  setSelectedFilter('all')
                }}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  activeCategory === null && selectedFilter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                All Categories ({allCommands.length})
              </button>
              
              {/* Favorites Section */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedFilter('favorites')
                    setActiveCategory(null)
                  }}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedFilter === 'favorites'
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 fill-current" />
                      <span>My Favorites</span>
                    </span>
                    <span className="text-sm">({favorites.size})</span>
                  </div>
                </button>
                
                {/* Clear Favorites Button - only show when we have favorites */}
                {favorites.size > 0 && (
                  <button
                    onClick={clearFavorites}
                    className="w-full text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1"
                    title="Clear all favorites"
                  >
                    Clear All Favorites
                  </button>
                )}
                
                {/* Favorites tip when empty */}
                {favorites.size === 0 && (
                  <div className="px-3 py-2 text-xs text-gray-500">
                    <p>Click the ❤️ icon next to commands to add them to your favorites!</p>
                  </div>
                )}
              </div>
              {categories.map((category) => {
                const count = enhancedCommands[category].length
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category)
                      setSelectedFilter('all')
                    }}
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

        {/* Keyboard Help Toggle */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={toggleKeyboardHelp}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            <Keyboard className="h-4 w-4" />
            <span className="text-sm">Keyboard Shortcuts</span>
          </button>
        </div>
      </MobileSidebar>

      {/* Main Content */}
      <div 
        ref={mainContentRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              VIM Cheatsheet
            </h1>
            <p className="text-gray-400">
              Showing {filteredCommands.length} commands
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedFilter !== 'all' && ` • ${selectedFilter} level`}
            </p>
          </div>

          {/* Keyboard Shortcuts Help */}
          {showKeyboardHelp && (
            <div className="mb-6 bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-blue-300 font-medium mb-2">Keyboard Shortcuts</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div><kbd className="kbd">j</kbd> Navigate down</div>
                    <div><kbd className="kbd">k</kbd> Navigate up</div>
                    <div><kbd className="kbd">/</kbd> Focus search</div>
                    <div><kbd className="kbd">gg</kbd> Go to top</div>
                    <div><kbd className="kbd">G</kbd> Go to bottom</div>
                    <div><kbd className="kbd">?</kbd> Toggle help</div>
                    <div><kbd className="kbd">Esc</kbd> Close/cancel</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowKeyboardHelp(false)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Commands */}
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No commands found</p>
              {searchTerm && (
                <p className="text-gray-500 mt-2">
                  Try a different search term or clear the search
                </p>
              )}
            </div>
          ) : (
            <div 
              ref={commandListRef}
              className="space-y-8"
            >
              {Object.entries(groupedCommands).map(([category, commands]) => {
                // Calculate the selected index within this category
                let categorySelectedIndex: number | undefined
                const selectedCmd = filteredCommands[selectedCommandIndex]
                const indexInCategory = commands.findIndex(cmd => cmd.command === selectedCmd?.command)
                if (indexInCategory !== -1) {
                  categorySelectedIndex = indexInCategory
                }

                return (
                  <div key={category}>
                    <h2 className="text-2xl font-semibold text-white mb-4 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h2>
                    
                    {/* Use Virtual List for large command lists */}
                    {commands.length > 20 ? (
                      <VirtualCommandList
                        commands={commands}
                        height={600}
                        onCopyCommand={copyCommand}
                        onToggleFavorite={toggleFavorite}
                        onAddToBuilder={addToCommandBuilder}
                        onToggleExample={toggleExample}
                        onOpenHelp={openHelpViewer}
                        favorites={favorites}
                        copiedCommand={copiedCommand}
                        showExamples={showExamples}
                        hasExample={hasExample}
                        selectedIndex={categorySelectedIndex}
                      />
                  ) : (
                    <div className="space-y-4">
                      {commands.map((cmd, index) => {
                        // Check if this command is selected
                        const isSelected = categorySelectedIndex === index
                        
                        return (
                          <div key={cmd.command}>
                            <div
                              className={`
                                bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 
                                transition-colors cursor-pointer group
                                ${isSelected ? 'ring-2 ring-green-500' : ''}
                              `}
                              onClick={() => addToCommandBuilder(cmd.command)}
                            >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <code className="text-green-400 font-mono text-base font-semibold">
                                  {cmd.command}
                                </code>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      copyCommand(cmd.command)
                                    }}
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
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(cmd.command)
                                    }}
                                    className={`p-1 transition-colors ${
                                      favorites.has(cmd.command) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
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
                              {hasExample(cmd.command) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleExample(cmd.command)
                                  }}
                                  className={`
                                    px-2 py-1 rounded text-xs font-medium transition-all
                                    ${showExamples.has(cmd.command) 
                                      ? 'bg-green-600 text-white hover:bg-green-700' 
                                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                                    }
                                    flex items-center space-x-1
                                  `}
                                >
                                  <PlayCircle className="h-3 w-3" />
                                  <span>Example</span>
                                </button>
                              )}
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
                          </div>

                          {/* Show example if toggled */}
                          {showExamples.has(cmd.command) && hasExample(cmd.command) && vimExamples[cmd.command] && (
                            <div className="mt-4">
                              <VimCommandExampleAnimated
                                command={cmd.command}
                                before={vimExamples[cmd.command].beforeState}
                                after={vimExamples[cmd.command].afterState}
                              />
                            </div>
                          )}
                        </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                )
              })}
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
function getDifficultyLevel(command: string): 'beginner' | 'intermediate' | 'advanced' {
  // Essential movement commands
  if (['h', 'j', 'k', 'l', 'w', 'b', 'i', 'a', ':w', ':q', 'dd', 'yy', 'p', 'u'].includes(command)) {
    return 'beginner'
  }
  
  // Advanced commands
  if (command.includes('g') || command.includes('z') || command.includes('"') || 
      command.includes('q') || command.includes('@') || command.length > 3) {
    return 'advanced'
  }
  
  return 'intermediate'
}

function getFrequencyLevel(command: string): 'essential' | 'common' | 'rare' {
  // Most essential commands
  if (['h', 'j', 'k', 'l', 'i', ':w', ':q', 'dd', 'u', '/', 'n', 'p', 'yy'].includes(command)) {
    return 'essential'
  }
  
  // Rarely used commands
  if (command.includes('g') || command.includes('z') || command.length > 4) {
    return 'rare'
  }
  
  return 'common'
}
import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X, Home, Search, Menu, PanelLeftClose } from 'lucide-react'
import { vimHelpCache, type ParsedHelpContent } from '../utils/vimHelpParser'

interface VimHelpViewerProps {
  isOpen: boolean
  onClose: () => void
  initialFile?: string
  initialTag?: string
}

export default function VimHelpViewer({ 
  isOpen, 
  onClose, 
  initialFile = 'index.txt',
  initialTag 
}: VimHelpViewerProps) {
  const [currentFile, setCurrentFile] = useState(initialFile)
  const [helpContent, setHelpContent] = useState<ParsedHelpContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showTOC, setShowTOC] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  // Common help files for quick access
  const commonFiles = [
    { name: 'index.txt', label: 'Index' },
    { name: 'motion.txt', label: 'Motion' },
    { name: 'insert.txt', label: 'Insert' },
    { name: 'change.txt', label: 'Change' },
    { name: 'visual.txt', label: 'Visual' },
    { name: 'pattern.txt', label: 'Search' },
    { name: 'windows.txt', label: 'Windows' },
    { name: 'editing.txt', label: 'Files' },
  ]

  const loadHelpFile = useCallback(async (filename: string, tag?: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const content = await vimHelpCache.getHelpFile(filename)
      if (content) {
        setHelpContent(content)
        
        // Add to history
        if (history[historyIndex] !== filename) {
          const newHistory = [...history.slice(0, historyIndex + 1), filename]
          setHistory(newHistory)
          setHistoryIndex(newHistory.length - 1)
        }
        
        // Scroll to tag if specified
        if (tag && contentRef.current) {
          setTimeout(() => {
            const element = document.getElementById(tag)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }, 100)
        }
      }
    } catch (err) {
      setError('Failed to load help file')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [history, historyIndex])

  useEffect(() => {
    if (isOpen && currentFile) {
      loadHelpFile(currentFile, initialTag)
    }
  }, [isOpen, currentFile, initialTag, loadHelpFile])

  // Preload common help files on first open
  useEffect(() => {
    if (isOpen && !vimHelpCache.isPreloaded) {
      vimHelpCache.preloadCommonFiles()
    }
  }, [isOpen])

  // Auto-hide TOC on mobile screens when modal opens
  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 768
      setShowTOC(!isMobile)
    }
  }, [isOpen])

  const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('vim-help-link')) {
      e.preventDefault()
      const href = target.getAttribute('href')
      if (href) {
        const tag = href.substring(1) // Remove #
        
        // Check if it's a file reference (contains .txt)
        if (tag.includes('.txt')) {
          const [file, anchor] = tag.split('#')
          setCurrentFile(file)
          if (anchor) {
            setTimeout(() => {
              document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
          }
        } else {
          // Just scroll to tag in current file
          document.getElementById(tag)?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const navigateBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentFile(history[historyIndex - 1])
    }
  }

  const navigateForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentFile(history[historyIndex + 1])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-200">VIM Help Documentation</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={navigateBack}
                disabled={historyIndex <= 0}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Back"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={navigateForward}
                disabled={historyIndex >= history.length - 1}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                title="Forward"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => loadHelpFile('index.txt')}
                className="p-1 text-gray-400 hover:text-white"
                title="Home"
              >
                <Home className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowTOC(!showTOC)}
                className="p-1 text-gray-400 hover:text-white"
                title={showTOC ? "Hide table of contents" : "Show table of contents"}
              >
                {showTOC ? <PanelLeftClose className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Access Tabs */}
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center space-x-2 overflow-x-auto">
          {commonFiles.map(file => (
            <button
              key={file.name}
              onClick={() => setCurrentFile(file.name)}
              className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${
                currentFile === file.name
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {file.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in help..."
              className="flex-1 bg-gray-800 text-gray-200 px-3 py-1 rounded border border-gray-600 focus:border-green-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Table of Contents */}
          {showTOC && helpContent && helpContent.sections.length > 0 && (
            <div className="w-64 md:w-64 sm:w-56 border-r border-gray-700 overflow-y-auto p-4 bg-gray-850">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-400">Table of Contents</h4>
                <button
                  onClick={() => setShowTOC(false)}
                  className="p-1 text-gray-500 hover:text-gray-300 md:hidden"
                  title="Hide table of contents"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <nav className="space-y-1">
                {helpContent.sections.map(section => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`block text-sm hover:text-white transition-colors ${
                      section.level === 1 ? 'text-gray-300 font-medium' :
                      section.level === 2 ? 'text-gray-400 pl-4' :
                      'text-gray-500 pl-8'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                      // Auto-hide TOC on mobile after navigation
                      if (window.innerWidth < 768) {
                        setShowTOC(false)
                      }
                    }}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Main Content */}
          <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto p-6 relative"
            onClick={handleLinkClick}
          >
            {/* Floating TOC Toggle for Mobile */}
            {!showTOC && helpContent && helpContent.sections.length > 0 && (
              <button
                onClick={() => setShowTOC(true)}
                className="fixed bottom-6 right-6 p-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg z-10 md:hidden transition-colors"
                title="Show table of contents"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-12">{error}</div>
            ) : helpContent ? (
              <div className="vim-help-content max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-green-400 mb-4">{helpContent.title}</h1>
                {helpContent.sections.map(section => (
                  <section key={section.id} id={section.id} className="mb-8">
                    <h2 className={`font-semibold mb-3 ${
                      section.level === 1 ? 'text-xl text-green-300' :
                      section.level === 2 ? 'text-lg text-gray-300' :
                      'text-base text-gray-400'
                    }`}>
                      {section.title}
                    </h2>
                    <div 
                      className="text-gray-300 leading-relaxed vim-help-prose"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </section>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-12">No content loaded</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 text-xs text-gray-500">
          <p>
            Viewing: <span className="text-gray-300 font-mono">{currentFile}</span>
            {helpContent?.tags.size ? ` • ${helpContent.tags.size} tags` : ''}
            {helpContent?.sections.length ? ` • ${helpContent.sections.length} sections` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}

// Styles for VIM help content
export const vimHelpStyles = `
  .vim-help-content {
    font-family: monospace;
  }
  
  .vim-help-tag {
    color: #10b981;
    font-weight: bold;
  }
  
  .vim-help-link {
    color: #60a5fa;
    text-decoration: underline;
    cursor: pointer;
  }
  
  .vim-help-link:hover {
    color: #93bbfc;
  }
  
  .vim-help-code {
    background-color: #1f2937;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0;
    border-radius: 0.25rem;
    font-family: monospace;
    white-space: pre;
    overflow-x: auto;
  }
  
  .vim-help-prose kbd {
    background-color: #374151;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    border: 1px solid #4b5563;
  }
`
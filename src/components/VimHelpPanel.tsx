import { useState, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react'

interface VimHelpPanelProps {
  command: string
  isOpen: boolean
  onClose: () => void
}

export default function VimHelpPanel({ command, isOpen, onClose }: VimHelpPanelProps) {
  const [helpContent, setHelpContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Map commands to their help topics
  const getHelpTopic = (cmd: string): string => {
    // Remove special characters for searching
    const cleanCmd = cmd.replace(/[{}[\]]/g, '').toLowerCase()
    
    // Map common commands to their help pages
    const helpMap: Record<string, string> = {
      'h': 'motion.txt.html#h',
      'j': 'motion.txt.html#j',
      'k': 'motion.txt.html#k',
      'l': 'motion.txt.html#l',
      'w': 'motion.txt.html#w',
      'b': 'motion.txt.html#b',
      'e': 'motion.txt.html#e',
      'gg': 'motion.txt.html#gg',
      'g': 'motion.txt.html#G',
      'dd': 'change.txt.html#dd',
      'yy': 'change.txt.html#yy',
      'p': 'change.txt.html#p',
      'u': 'undo.txt.html#u',
      'ctrl-r': 'undo.txt.html#CTRL-R',
      '/': 'pattern.txt.html#/',
      '?': 'pattern.txt.html#?',
      ':w': 'editing.txt.html#:w',
      ':q': 'editing.txt.html#:q',
      ':help': 'helphelp.txt.html#:help',
      'i': 'insert.txt.html#i',
      'a': 'insert.txt.html#a',
      'o': 'insert.txt.html#o',
      'v': 'visual.txt.html#v',
      'ctrl-v': 'visual.txt.html#CTRL-V',
      // Add more mappings as needed
    }

    return helpMap[cleanCmd] || 'index.txt.html'
  }

  useEffect(() => {
    if (isOpen && command) {
      setIsLoading(true)
      setError(null)
      
      // In a real implementation, you would fetch from vimhelp.org
      // For now, we'll show a placeholder with the correct URL
      const helpUrl = `https://vimhelp.org/${getHelpTopic(command)}`
      
      // Simulate loading
      setTimeout(() => {
        setHelpContent(`
          <div class="vim-help-content">
            <p class="text-sm text-gray-400 mb-2">Help for: <code class="text-green-400">${command}</code></p>
            <p class="text-gray-300">
              Due to CORS restrictions, we cannot directly fetch content from vimhelp.org.
              Click the link below to view the official documentation:
            </p>
            <a href="${helpUrl}" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center space-x-2 mt-4 text-blue-400 hover:text-blue-300">
              <span>View on vimhelp.org</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        `)
        setIsLoading(false)
      }, 500)
    }
  }, [isOpen, command])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-medium text-gray-200">VIM Help Documentation</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm">{error}</div>
          ) : (
            <div 
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: helpContent }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-900 px-4 py-3 border-t border-gray-700 text-xs text-gray-500">
          <p>Tip: Use <code className="text-green-400">:help {command}</code> in VIM for detailed documentation</p>
        </div>
      </div>
    </div>
  )
}

// Alternative implementation that could work with a proxy server
export function VimHelpIntegration() {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mt-4">
      <h3 className="text-lg font-medium text-gray-200 mb-3 flex items-center space-x-2">
        <HelpCircle className="h-5 w-5 text-green-400" />
        <span>VIM Help Integration Options</span>
      </h3>
      
      <div className="space-y-4 text-sm text-gray-300">
        <div>
          <h4 className="font-medium text-gray-200 mb-1">Option 1: Direct Links</h4>
          <p className="mb-2">Each command can link directly to its vimhelp.org documentation.</p>
          <code className="text-xs bg-gray-900 px-2 py-1 rounded">https://vimhelp.org/motion.txt.html#j</code>
        </div>

        <div>
          <h4 className="font-medium text-gray-200 mb-1">Option 2: Embedded iFrame</h4>
          <p className="mb-2">Embed vimhelp.org pages in an iframe (if allowed by their CORS policy).</p>
          <code className="text-xs bg-gray-900 px-2 py-1 rounded">&lt;iframe src="https://vimhelp.org/..." /&gt;</code>
        </div>

        <div>
          <h4 className="font-medium text-gray-200 mb-1">Option 3: API/Proxy Server</h4>
          <p className="mb-2">Set up a proxy server to fetch and serve vimhelp.org content.</p>
          <code className="text-xs bg-gray-900 px-2 py-1 rounded">GET /api/vimhelp?topic=motion.txt&amp;anchor=j</code>
        </div>

        <div>
          <h4 className="font-medium text-gray-200 mb-1">Option 4: Local Help Files</h4>
          <p className="mb-2">Include VIM help files directly in the project (with proper licensing).</p>
          <code className="text-xs bg-gray-900 px-2 py-1 rounded">import helpContent from './vim-help/motion.txt'</code>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded">
        <p className="text-xs text-yellow-400">
          <strong>Note:</strong> Integration depends on vimhelp.org's CORS policy and licensing terms.
          Direct linking is the simplest and most respectful approach.
        </p>
      </div>
    </div>
  )
}
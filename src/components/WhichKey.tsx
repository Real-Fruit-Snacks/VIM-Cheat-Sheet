import { useState, useEffect, useRef } from 'react'

interface KeyBinding {
  key: string
  description: string
  group?: string
  mode?: string[]
  command?: string
  preview?: string
  subKeys?: KeyBinding[]
}

interface WhichKeyProps {
  isVisible: boolean
  keySequence: string
  availableKeys: KeyBinding[]
  onKeySelect: (key: string) => void
  onClose: () => void
}

export default function WhichKey({ 
  isVisible, 
  keySequence, 
  availableKeys, 
  onKeySelect, 
  onClose 
}: WhichKeyProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible) {
      setSelectedIndex(0)
    }
  }, [isVisible, keySequence])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return

      // Prevent only UI navigation keys
      const shouldPrevent = ['Escape', 'ArrowDown', 'ArrowUp', 'j', 'k', 'Enter'].includes(e.key)
      
      if (shouldPrevent) {
        e.preventDefault()
        e.stopPropagation()
      }

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowDown':
        case 'j':
          setSelectedIndex((prev) => (prev + 1) % availableKeys.length)
          break
        case 'ArrowUp':
        case 'k':
          setSelectedIndex((prev) => (prev - 1 + availableKeys.length) % availableKeys.length)
          break
        case 'Enter':
        case ' ':
          if (availableKeys[selectedIndex]) {
            onKeySelect(availableKeys[selectedIndex].key)
          }
          break
        default:
          // Match key to available options
          const matchingKey = availableKeys.find(k => k.key === e.key)
          if (matchingKey) {
            onKeySelect(matchingKey.key)
          }
          break
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown, true)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isVisible, availableKeys, selectedIndex, onKeySelect, onClose])

  if (!isVisible || availableKeys.length === 0) {
    return null
  }

  // Group keys by their group property
  const groupedKeys = availableKeys.reduce((acc, key) => {
    const groupName = key.group || 'Commands'
    if (!acc[groupName]) {
      acc[groupName] = []
    }
    acc[groupName].push(key)
    return acc
  }, {} as Record<string, KeyBinding[]>)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 pointer-events-none">
      <div 
        ref={containerRef}
        className="h-full max-h-[90vh] w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl pointer-events-auto animate-slide-in-right flex flex-col"
      >
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-green-400 font-semibold">Which Key</span>
              {keySequence && (
                <span className="text-gray-300">
                  Building: <code className="bg-gray-700 px-1 rounded text-green-300">{keySequence}_</code>
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              Press key to execute • ESC to close • ↑↓ to navigate
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {Object.entries(groupedKeys).map(([groupName, keys]) => (
            <div key={groupName} className="p-2">
              {Object.keys(groupedKeys).length > 1 && (
                <div className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2 px-2">
                  {groupName}
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-1">
                {keys.map((keyBinding) => {
                  const globalIndex = availableKeys.indexOf(keyBinding)
                  const isSelected = globalIndex === selectedIndex
                  
                  return (
                    <div
                      key={`${groupName}-${keyBinding.key}`}
                      className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-green-600 text-white' 
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                      onClick={() => onKeySelect(keyBinding.key)}
                    >
                      <kbd className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border ${
                        isSelected 
                          ? 'bg-green-700 border-green-500 text-white' 
                          : 'bg-gray-800 border-gray-600 text-green-400'
                      }`}>
                        {keyBinding.key}
                      </kbd>
                      <span className="ml-3 truncate">
                        {keyBinding.description}
                      </span>
                      {keyBinding.preview && (
                        <code className="ml-auto text-xs bg-gray-600 px-1 rounded text-yellow-300">
                          {keyBinding.preview}
                        </code>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {availableKeys.length} command{availableKeys.length !== 1 ? 's' : ''} available
            </span>
            <span>
              Use ? to open cheat sheet for all commands
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
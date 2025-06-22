import React, { memo, useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { Heart, Copy, HelpCircle, PlayCircle } from 'lucide-react'
import type { ExpandedCommand } from '../utils/dataCompression'

interface VirtualCommandListProps {
  commands: (ExpandedCommand & { category: string })[]
  height: number
  onCopyCommand: (command: string) => void
  onToggleFavorite: (command: string) => void
  onAddToBuilder: (command: string) => void
  onToggleExample: (command: string) => void
  onOpenHelp: (command: string, category: string) => void
  favorites: Set<string>
  copiedCommand: string | null
  showExamples: Set<string>
  hasExample: (command: string) => boolean
}

interface CommandRowProps {
  index: number
  style: React.CSSProperties
  data: {
    commands: (ExpandedCommand & { category: string })[]
    onCopyCommand: (command: string) => void
    onToggleFavorite: (command: string) => void
    onAddToBuilder: (command: string) => void
    onToggleExample: (command: string) => void
    onOpenHelp: (command: string, category: string) => void
    favorites: Set<string>
    copiedCommand: string | null
    showExamples: Set<string>
    hasExample: (command: string) => boolean
  }
}

const CommandRow = memo(({ index, style, data }: CommandRowProps) => {
  const cmd = data.commands[index]
  if (!cmd) return null

  const isFavorite = data.favorites.has(cmd.command)
  const isCopied = data.copiedCommand === cmd.command
  const hasExample = data.hasExample(cmd.command)
  const showExample = data.showExamples.has(cmd.command)

  return (
    <div style={style} className="px-4">
      <div
        className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer group"
        onClick={() => data.onAddToBuilder(cmd.command)}
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
                  data.onCopyCommand(cmd.command)
                }}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Copy command"
              >
                {isCopied ? (
                  <span className="text-green-400 text-xs">✓</span>
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  data.onToggleFavorite(cmd.command)
                }}
                className={`p-1 transition-colors ${
                  isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
                title="Toggle favorite"
              >
                <Heart className={`h-3 w-3 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  data.onOpenHelp(cmd.command, cmd.category)
                }}
                className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                title="View VIM help documentation"
              >
                <HelpCircle className="h-3 w-3" />
              </button>
            </div>
          </div>
          {hasExample && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                data.onToggleExample(cmd.command)
              }}
              className={`
                px-2 py-1 rounded text-xs font-medium transition-all
                ${showExample 
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
            {cmd.difficulty && (
              <span className={`text-xs px-2 py-1 rounded ${
                cmd.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                cmd.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {cmd.difficulty}
              </span>
            )}
            {cmd.frequency && (
              <span className={`text-xs px-2 py-1 rounded ${
                cmd.frequency === 'essential' ? 'bg-blue-500/20 text-blue-400' :
                cmd.frequency === 'common' ? 'bg-purple-500/20 text-purple-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {cmd.frequency}
              </span>
            )}
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
    </div>
  )
})

CommandRow.displayName = 'CommandRow'

const VirtualCommandList: React.FC<VirtualCommandListProps> = ({
  commands,
  height,
  onCopyCommand,
  onToggleFavorite,
  onAddToBuilder,
  onToggleExample,
  onOpenHelp,
  favorites,
  copiedCommand,
  showExamples,
  hasExample
}) => {
  const itemCount = commands.length
  const itemSize = 180 // Approximate height of each command card

  const isItemLoaded = useCallback((index: number) => {
    return index < commands.length
  }, [commands.length])

  const loadMoreItems = useCallback(() => {
    // In this case, all items are already loaded
    return Promise.resolve()
  }, [])

  const itemData = {
    commands,
    onCopyCommand,
    onToggleFavorite,
    onAddToBuilder,
    onToggleExample,
    onOpenHelp,
    favorites,
    copiedCommand,
    showExamples,
    hasExample
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          ref={ref}
          height={height}
          width="100%"
          itemCount={itemCount}
          itemSize={itemSize}
          itemData={itemData}
          onItemsRendered={onItemsRendered}
          overscanCount={5}
          className="custom-scrollbar"
        >
          {CommandRow}
        </List>
      )}
    </InfiniteLoader>
  )
}

export default memo(VirtualCommandList)
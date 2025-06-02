import { useState } from 'react'
import type { KeystrokeVisualizerConfig } from '../hooks/useKeystrokeVisualizer'

interface KeystrokeVisualizerButtonProps {
  config: KeystrokeVisualizerConfig
  onUpdateConfig: (updates: Partial<KeystrokeVisualizerConfig>) => void
}

export default function KeystrokeVisualizerButton({ config, onUpdateConfig }: KeystrokeVisualizerButtonProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative">
      {/* Main button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`
          w-8 h-8 rounded transition-all duration-200 flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-green-500/50
          ${config.enabled
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white'
          }
        `}
        title="Keystroke Visualizer Settings"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Settings menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-100">Keystroke Visualizer</h3>
                <button
                  onClick={() => setShowMenu(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Enable/Disable toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Enable Visualizer</label>
                <button
                  onClick={() => onUpdateConfig({ enabled: !config.enabled })}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800
                    ${config.enabled ? 'bg-green-600' : 'bg-gray-600'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${config.enabled ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              {/* Position */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Position</label>
                <select
                  value={config.position}
                  onChange={(e) => onUpdateConfig({ position: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Font Size</label>
                <select
                  value={config.fontSize}
                  onChange={(e) => onUpdateConfig({ fontSize: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="xs">Extra Small</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>

              {/* Max Keystrokes */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Max Keystrokes: {config.maxKeystrokes}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={config.maxKeystrokes}
                  onChange={(e) => onUpdateConfig({ maxKeystrokes: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Fade Out Delay */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Display Duration: {(config.fadeOutDelay / 1000).toFixed(1)}s
                </label>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={config.fadeOutDelay}
                  onChange={(e) => onUpdateConfig({ fadeOutDelay: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  )
}
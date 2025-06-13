import { useState } from 'react'
import type { KeystrokeVisualizerConfig } from '../hooks/useKeystrokeVisualizer'
import type { EnhancedKeystrokeConfig } from '../types/enhanced-keystroke-types'

interface EnhancedKeystrokeVisualizerButtonProps {
  config: KeystrokeVisualizerConfig
  enhancedConfig: EnhancedKeystrokeConfig
  onUpdateConfig: (updates: Partial<KeystrokeVisualizerConfig>) => void
  onUpdateEnhancedConfig: (updates: Partial<EnhancedKeystrokeConfig>) => void
  onToggleEducationalOverlay: () => void
  onClearData: () => void
}

export default function EnhancedKeystrokeVisualizerButton({ 
  config, 
  enhancedConfig,
  onUpdateConfig, 
  onUpdateEnhancedConfig,
  onToggleEducationalOverlay,
  onClearData
}: EnhancedKeystrokeVisualizerButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'enhanced'>('basic')

  return (
    <div className="relative">
      {/* Main button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`
          w-8 h-8 rounded transition-all duration-200 flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-green-500/50
          ${config.enabled || enhancedConfig.showCommandGroups || enhancedConfig.showModeIndicators
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white'
          }
        `}
        title="Enhanced Keystroke Visualizer Settings"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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
          <div className="absolute top-full right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-100">Enhanced Keystroke Visualizer</h3>
                <button
                  onClick={() => setShowMenu(false)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tab navigation */}
              <div className="flex space-x-1 mt-3">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'basic'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setActiveTab('enhanced')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'enhanced'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Enhanced
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {activeTab === 'basic' && (
                <>
                  {/* Basic visualizer settings */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Enable Basic Visualizer</label>
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
                </>
              )}

              {activeTab === 'enhanced' && (
                <>
                  {/* Enhanced features */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-200 border-b border-gray-600 pb-1">
                      Enhanced Features
                    </h4>
                    
                    {/* Command Groups */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Command Grouping</label>
                        <p className="text-xs text-gray-400">Group related keystrokes together</p>
                      </div>
                      <button
                        onClick={() => onUpdateEnhancedConfig({ showCommandGroups: !enhancedConfig.showCommandGroups })}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full
                          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
                          ${enhancedConfig.showCommandGroups ? 'bg-blue-600' : 'bg-gray-600'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${enhancedConfig.showCommandGroups ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>

                    {/* Mode Indicators */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Mode Indicators</label>
                        <p className="text-xs text-gray-400">Show current VIM mode</p>
                      </div>
                      <button
                        onClick={() => onUpdateEnhancedConfig({ showModeIndicators: !enhancedConfig.showModeIndicators })}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full
                          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
                          ${enhancedConfig.showModeIndicators ? 'bg-blue-600' : 'bg-gray-600'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${enhancedConfig.showModeIndicators ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>

                    {/* Efficiency Hints */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Efficiency Hints</label>
                        <p className="text-xs text-gray-400">Color-code commands by efficiency</p>
                      </div>
                      <button
                        onClick={() => onUpdateEnhancedConfig({ showEfficiencyHints: !enhancedConfig.showEfficiencyHints })}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full
                          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
                          ${enhancedConfig.showEfficiencyHints ? 'bg-blue-600' : 'bg-gray-600'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${enhancedConfig.showEfficiencyHints ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>

                    {/* Suggestions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Learning Suggestions</label>
                        <p className="text-xs text-gray-400">Show alternative commands</p>
                      </div>
                      <button
                        onClick={() => onUpdateEnhancedConfig({ showSuggestions: !enhancedConfig.showSuggestions })}
                        className={`
                          relative inline-flex h-6 w-11 items-center rounded-full
                          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
                          ${enhancedConfig.showSuggestions ? 'bg-blue-600' : 'bg-gray-600'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${enhancedConfig.showSuggestions ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Animation Settings */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-200 border-b border-gray-600 pb-1">
                      Animations
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(enhancedConfig.animations).map(([key, enabled]) => (
                        <div key={key} className="flex items-center justify-between">
                          <label className="text-sm text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <button
                            onClick={() => onUpdateEnhancedConfig({ 
                              animations: { 
                                ...enhancedConfig.animations, 
                                [key]: !enabled 
                              } 
                            })}
                            className={`
                              relative inline-flex h-5 w-9 items-center rounded-full
                              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
                              ${enabled ? 'bg-blue-600' : 'bg-gray-600'}
                            `}
                          >
                            <span
                              className={`
                                inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                                ${enabled ? 'translate-x-5' : 'translate-x-1'}
                              `}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-200 border-b border-gray-600 pb-1">
                      Actions
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={onToggleEducationalOverlay}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        Toggle Educational Mode
                      </button>
                      
                      <button
                        onClick={onClearData}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        Clear All Data
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
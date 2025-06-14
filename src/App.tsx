import { useState, useEffect, useRef } from 'react'
import VimEditorHybrid from './components/VimEditorHybrid'
import type { VimEditorRef } from './components/VimEditor'
import CheatSheetButton from './components/CheatSheetButton'
import VimrcButton from './components/VimrcButton'
import VimrcEditorEnhanced from './components/VimrcEditorEnhanced'
import { ToastContainer } from './components/Toast'
import { useToast } from './hooks/useToast'
import { useKeystrokeVisualizer } from './hooks/useKeystrokeVisualizer'
import KeystrokeOverlay from './components/KeystrokeOverlay'
import KeystrokeVisualizerButton from './components/KeystrokeVisualizerButton'
import PracticeFilesButton from './components/PracticeFilesButton'
import PracticeFilesModal from './components/PracticeFilesModal'

function App() {
  const [showCheatSheet, setShowCheatSheet] = useState(false)
  const [showVimrcEditor, setShowVimrcEditor] = useState(false)
  const [showPracticeFiles, setShowPracticeFiles] = useState(false)
  const [vimrcContent, setVimrcContent] = useState<string>('')
  const [whichKeyEnabled, setWhichKeyEnabled] = useState(true)
  const [vimFullyReady, setVimFullyReady] = useState(false)
  const vimEditorRef = useRef<VimEditorRef>(null)
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast()
  const keystrokeVisualizer = useKeystrokeVisualizer()

  /** Initialize vimrc content and which-key preference from localStorage */
  useEffect(() => {
    const savedVimrc = localStorage.getItem('vim-vimrc')
    if (savedVimrc) {
      setVimrcContent(savedVimrc)
    }
    
    // Load Which-Key preference
    const savedWhichKeyEnabled = localStorage.getItem('vim-which-key-enabled')
    if (savedWhichKeyEnabled !== null) {
      setWhichKeyEnabled(savedWhichKeyEnabled === 'true')
    }
  }, [])

  /** Check VIM readiness periodically and update state */
  useEffect(() => {
    const checkVimReadiness = () => {
      const isReady = vimEditorRef.current?.isVimReady() || false
      if (isReady !== vimFullyReady) {
        setVimFullyReady(isReady)
        if (isReady) {
          console.log('🎉 VIM is now fully ready for file operations!')
        }
      }
    }

    // Check immediately and then every second
    checkVimReadiness()
    const interval = setInterval(checkVimReadiness, 1000)
    
    return () => clearInterval(interval)
  }, [vimFullyReady])

  const handleSaveVimrc = async (content: string) => {
    /** Ensure vim-wasm is ready before applying configuration */
    if (!vimEditorRef.current?.isVimReady()) {
      showError('Vim is not ready yet. Please wait a moment.')
      throw new Error('Vim is not ready')
    }
    
    // Apply vimrc commands permanently to the running vim instance
    const result = await vimEditorRef.current.applyVimrc(content, false)
    
    // Persist configuration to localStorage
    setVimrcContent(content)
    localStorage.setItem('vim-vimrc', content)
    
    // Display execution results to user
    if (result.failedCount === 0) {
      showSuccess(`Vimrc saved and applied! ${result.successCount} commands executed.`)
    } else {
      showWarning(`Vimrc saved but some commands failed: ${result.successCount} succeeded, ${result.failedCount} failed.`)
    }
  }

  const handleToggleWhichKey = (enabled: boolean) => {
    setWhichKeyEnabled(enabled)
    localStorage.setItem('vim-which-key-enabled', enabled.toString())
    showSuccess(`Which-Key helper ${enabled ? 'enabled' : 'disabled'}`)
  }

  const handleSelectPracticeFile = async (content: string, filename?: string) => {
    try {
      // Show loading state
      showSuccess('Loading file... Please wait while VIM initializes.')
      
      await vimEditorRef.current?.loadFile(content, filename)
      showSuccess(`Loaded practice file: ${filename || 'Untitled'}`)
      setShowPracticeFiles(false)
    } catch (error) {
      console.error('Practice file loading error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (errorMessage.includes('failed to become ready') || errorMessage.includes('refresh the page')) {
        showError('VIM initialization timed out. Please refresh the page and try again.')
      } else if (errorMessage.includes('VIM is not ready') || errorMessage.includes('input method unavailable')) {
        showError('VIM is still initializing. Please wait a few more seconds and try again.')
      } else {
        showError(`Failed to load practice file: ${errorMessage}`)
      }
    }
  }


  return (
    <div className="h-screen bg-gray-950 text-gray-100 overflow-hidden p-2 flex items-center justify-center">
      <div className="w-full h-full max-w-none max-h-[calc(100vh-1rem)] bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Terminal window header with control buttons */}
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-2">
            {/* macOS-style window controls */}
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-400 font-mono">Interactive VIM Learning Platform</span>
              {vimFullyReady ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  VIM Ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  Initializing...
                </span>
              )}
            </div>
          </div>
          
          {/* Editor action buttons */}
          {!showVimrcEditor && (
            <div className="flex items-center space-x-2">
              <KeystrokeVisualizerButton
                config={keystrokeVisualizer.config}
                onUpdateConfig={keystrokeVisualizer.updateConfig}
              />
              
              <PracticeFilesButton 
                onClick={() => setShowPracticeFiles(true)}
              />

              
              <VimrcButton 
                onClick={() => setShowVimrcEditor(true)}
              />
              
              <CheatSheetButton 
                isOpen={showCheatSheet}
                onToggle={setShowCheatSheet}
                whichKeyEnabled={whichKeyEnabled}
                onToggleWhichKey={handleToggleWhichKey}
              />
            </div>
          )}
        </div>
        
        {/* Main editor content area */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          <VimEditorHybrid 
            ref={vimEditorRef} 
            vimrcContent={vimrcContent}
            disableWhichKey={!whichKeyEnabled || showVimrcEditor}
            onKeyPress={keystrokeVisualizer.addKeystroke}
            hasModalOpen={showCheatSheet || showVimrcEditor || showPracticeFiles}
          />
          
          <VimrcEditorEnhanced
            isOpen={showVimrcEditor}
            onClose={() => setShowVimrcEditor(false)}
            onSave={handleSaveVimrc}
            initialContent={vimrcContent}
          />
          
          <ToastContainer toasts={toasts} onClose={removeToast} />
          
          <PracticeFilesModal
            isOpen={showPracticeFiles}
            onClose={() => setShowPracticeFiles(false)}
            onSelectFile={handleSelectPracticeFile}
          />
          
          <KeystrokeOverlay
            config={keystrokeVisualizer.config}
            keystrokes={keystrokeVisualizer.keystrokes}
          />
        </div>
      </div>
    </div>
  )
}

export default App

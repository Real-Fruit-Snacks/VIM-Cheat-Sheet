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
  const vimEditorRef = useRef<VimEditorRef>(null)
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast()
  const { keystrokes, config, addKeystroke, updateConfig } = useKeystrokeVisualizer()

  /** Initialize vimrc content and which-key preference from localStorage */
  useEffect(() => {
    const savedVimrc = localStorage.getItem('vim-io-vimrc')
    if (savedVimrc) {
      setVimrcContent(savedVimrc)
    }
    
    // Load Which-Key preference
    const savedWhichKeyEnabled = localStorage.getItem('vim-io-which-key-enabled')
    if (savedWhichKeyEnabled !== null) {
      setWhichKeyEnabled(savedWhichKeyEnabled === 'true')
    }
  }, [])

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
    localStorage.setItem('vim-io-vimrc', content)
    
    // Display execution results to user
    if (result.failedCount === 0) {
      showSuccess(`Vimrc saved and applied! ${result.successCount} commands executed.`)
    } else {
      showWarning(`Vimrc saved but some commands failed: ${result.successCount} succeeded, ${result.failedCount} failed.`)
    }
  }

  const handleToggleWhichKey = (enabled: boolean) => {
    setWhichKeyEnabled(enabled)
    localStorage.setItem('vim-io-which-key-enabled', enabled.toString())
    showSuccess(`Which-Key helper ${enabled ? 'enabled' : 'disabled'}`)
  }

  const handleSelectPracticeFile = async (content: string, filename?: string) => {
    if (!vimEditorRef.current?.isVimReady()) {
      showError('Vim is not ready yet. Please wait a moment.')
      return
    }
    
    try {
      await vimEditorRef.current.loadFile(content, filename)
      showSuccess(`Loaded practice file: ${filename || 'Untitled'}`)
      setShowPracticeFiles(false)
    } catch (error) {
      showError(`Failed to load practice file: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
            <span className="text-sm text-gray-400 font-mono">Interactive VIM Learning Platform</span>
          </div>
          
          {/* Editor action buttons */}
          {!showVimrcEditor && (
            <div className="flex items-center space-x-2">
              <KeystrokeVisualizerButton
                config={config}
                onUpdateConfig={updateConfig}
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
            onKeyPress={addKeystroke}
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
            keystrokes={keystrokes}
            config={config}
          />
        </div>
      </div>
    </div>
  )
}

export default App

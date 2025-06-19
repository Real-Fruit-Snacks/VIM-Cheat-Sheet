import { useEffect, useState, forwardRef, useRef } from 'react';
import { getBrowserCapabilities, getBrowserInstructions } from '../utils/browser-capabilities';
import { useBrowserCapabilities } from '../contexts/BrowserCapabilities';
import { getEditorLoader, type EditorComponent } from '../utils/dynamic-editor-loader';
import type { VimEditorRef } from './VimEditor';

interface VimEditorHybridProps {
  vimrcContent?: string;
  disableWhichKey?: boolean;
  onKeyPress?: (event: KeyboardEvent) => void;
  hasModalOpen?: boolean;
}

/**
 * Hybrid VIM editor that automatically selects the best implementation
 * based on browser capabilities
 */
const VimEditorHybrid = forwardRef<VimEditorRef, VimEditorHybridProps>((props, ref) => {
  const [editorType, setEditorType] = useState<'loading' | 'vim-wasm' | 'monaco'>('loading');
  const [EditorComponent, setEditorComponent] = useState<EditorComponent | null>(null);
  const [isLoadingEditor, setIsLoadingEditor] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  // Use pre-detected capabilities from context
  const earlyCapabilities = useBrowserCapabilities();
  
  // For compatibility, we'll also get runtime capabilities for the banner
  const [runtimeCapabilities, setRuntimeCapabilities] = useState<ReturnType<typeof getBrowserCapabilities> | null>(null);
  
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    async function loadEditor() {
      // Check if we're already using the ultra-early detection
      if (earlyCapabilities.detectedAt === 'ultra-early') {
        console.log('🔍 VIM Editor - Using ultra-early detected capabilities');
      }
      
      // Get runtime capabilities for banner display
      const runtimeCaps = getBrowserCapabilities();
      if (isMountedRef.current) {
        setRuntimeCapabilities(runtimeCaps);
      }
      
      // Define window extension interface
      interface WindowWithVimFlags extends Window {
        __canUseVimWasm?: boolean;
        __vimWasmLoadError?: Error;
      }
      
      // Check if vim.wasm was already decided in HTML
      const canUseVimWasm = (window as WindowWithVimFlags).__canUseVimWasm;
      
      // Also check for vim.wasm load errors from conditional loading
      const vimWasmError = (window as WindowWithVimFlags).__vimWasmLoadError;
      
      if (canUseVimWasm && !vimWasmError) {
        console.log('✅ Using vim.wasm (decision made ultra-early)');
        if (isMountedRef.current) {
          setEditorType('vim-wasm');
        }
      } else {
        const reason = vimWasmError ? 'load error' : 
                      !earlyCapabilities.hasWebAssembly ? 'no WebAssembly' :
                      !earlyCapabilities.hasSharedArrayBuffer ? 'no SharedArrayBuffer' :
                      'not secure context';
        console.log(`⚠️ Using Monaco-vim fallback (${reason})`);
        if (reason === 'no SharedArrayBuffer') {
          console.log('💡 Tip:', getBrowserInstructions(earlyCapabilities.browserName));
        }
        if (isMountedRef.current) {
          setEditorType('monaco');
        }
      }
      
      // Load the appropriate editor component
      if (isMountedRef.current) {
        setIsLoadingEditor(true);
        try {
          const loader = getEditorLoader(canUseVimWasm && !vimWasmError);
          const component = await loader();
          setEditorComponent(component);
          setIsLoadingEditor(false);
        } catch (error) {
          console.error('[VimEditorHybrid] Failed to load editor component:', error);
          if (isMountedRef.current) {
            setIsLoadingEditor(false);
          }
        }
      }
    }
    
    loadEditor();
  }, [earlyCapabilities]);

  // Handle mode change for Which-Key integration
  const handleModeChange = () => {
    // This will be passed to MonacoVimEditor
    // VimEditor handles this internally
  };

  // Show loading state while detecting capabilities or loading editor
  if (editorType === 'loading' || isLoadingEditor || !EditorComponent) {
    const loadingMessage = editorType === 'loading' ? 
      'Detecting browser capabilities...' :
      editorType === 'vim-wasm' ?
        'Loading VIM...' :
        'Loading Monaco Editor...';
    return (
      <div className="h-full bg-gray-950 overflow-hidden">
        <div className="h-full relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
              <p className="text-gray-400">{loadingMessage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (editorType === 'vim-wasm') {
    // Use the full vim.wasm implementation
    const VimEditorComponent = EditorComponent;
    return <VimEditorComponent ref={ref} {...props} />;
  }

  // Use Monaco-vim fallback
  return (
    <div className="h-full bg-gray-950 overflow-hidden">
      <div className="h-full relative overflow-hidden">
        {runtimeCapabilities?.requiresWorkaround && !bannerDismissed && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-yellow-900 text-yellow-100 px-4 py-2 text-sm shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span className="font-semibold">⚠️ Limited Mode:</span>{' '}
                Using Monaco VIM emulation. For the full VIM experience, enable SharedArrayBuffer in your browser.
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  className="text-yellow-200 hover:text-white underline text-xs whitespace-nowrap"
                  onClick={() => {
                    const instruction = runtimeCapabilities ? 
                      `${runtimeCapabilities.browserName === 'firefox' ? 
                        'In Firefox: Go to about:config and set dom.postMessage.sharedArrayBuffer.bypassCOOP_COEP.insecure.enabled to true' :
                        runtimeCapabilities.browserName === 'safari' ?
                        'In Safari: Enable the Develop menu, then go to Develop > Disable Cross-Origin Restrictions' :
                        'Your browser should support SharedArrayBuffer. Try refreshing the page.'
                      }` : '';
                    alert(instruction);
                  }}
                >
                  How to enable?
                </button>
                <button
                  className="px-3 py-1 bg-yellow-800 text-white hover:bg-yellow-700 border border-yellow-600 rounded transition-all text-base leading-none font-bold shadow-sm hover:shadow-md"
                  onClick={() => setBannerDismissed(true)}
                  aria-label="Dismiss banner"
                  title="Dismiss this message"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
        {(() => {
          const MonacoEditorComponent = EditorComponent;
          return <MonacoEditorComponent 
            ref={ref} 
            {...props} 
            onModeChange={handleModeChange} 
          />;
        })()}
      </div>
    </div>
  );
});

VimEditorHybrid.displayName = 'VimEditorHybrid';

export default VimEditorHybrid;
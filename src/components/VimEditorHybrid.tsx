import { useEffect, useState, forwardRef } from 'react';
import { getBrowserCapabilities, getBrowserInstructions } from '../utils/browser-capabilities';
import { useBrowserCapabilities } from '../contexts/BrowserCapabilities';
import VimEditor from './VimEditor';
import MonacoVimEditor from './MonacoVimEditor';
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
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  // Use pre-detected capabilities from context
  const earlyCapabilities = useBrowserCapabilities();
  
  // For compatibility, we'll also get runtime capabilities for the banner
  const [runtimeCapabilities, setRuntimeCapabilities] = useState<ReturnType<typeof getBrowserCapabilities> | null>(null);

  useEffect(() => {
    // Use early detected capabilities first
    if (earlyCapabilities.detectedAt === 'early') {
      console.log('🔍 VIM Editor - Using early-detected browser capabilities:', {
        hasSharedArrayBuffer: earlyCapabilities.hasSharedArrayBuffer,
        hasWebAssembly: earlyCapabilities.hasWebAssembly,
        browser: earlyCapabilities.browserName,
        isSecureContext: earlyCapabilities.isSecureContext,
        detectedAt: earlyCapabilities.detectedAt
      });
    }
    
    // Get runtime capabilities for additional checks
    const runtimeCaps = getBrowserCapabilities();
    setRuntimeCapabilities(runtimeCaps);
    
    // Determine which editor to use based on early detection
    if (earlyCapabilities.hasSharedArrayBuffer && earlyCapabilities.hasWebAssembly) {
      console.log('✅ Using vim.wasm (full VIM experience)');
      setEditorType('vim-wasm');
    } else if (earlyCapabilities.hasWebAssembly && !earlyCapabilities.hasSharedArrayBuffer) {
      // Browser supports WebAssembly but not SharedArrayBuffer
      console.log('⚠️ Using Monaco-vim fallback (SharedArrayBuffer not available)');
      console.log('💡 Tip:', getBrowserInstructions(earlyCapabilities.browserName));
      setEditorType('monaco');
    } else {
      // No WebAssembly support at all
      console.log('⚠️ Using Monaco-vim fallback (WebAssembly not supported)');
      setEditorType('monaco');
    }
  }, [earlyCapabilities]);

  // Handle mode change for Which-Key integration
  const handleModeChange = () => {
    // This will be passed to MonacoVimEditor
    // VimEditor handles this internally
  };

  // Skip loading state when using early detection
  if (editorType === 'loading' && earlyCapabilities.detectedAt !== 'early') {
    return (
      <div className="h-full bg-gray-950 overflow-hidden">
        <div className="h-full relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Detecting browser capabilities...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (editorType === 'vim-wasm') {
    // Use the full vim.wasm implementation
    return <VimEditor ref={ref} {...props} />;
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
        <MonacoVimEditor 
          ref={ref} 
          {...props} 
          onModeChange={handleModeChange}
        />
      </div>
    </div>
  );
});

VimEditorHybrid.displayName = 'VimEditorHybrid';

export default VimEditorHybrid;
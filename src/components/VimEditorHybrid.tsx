import { useEffect, useState, forwardRef } from 'react';
import { getBrowserCapabilities, getBrowserInstructions } from '../utils/browser-capabilities';
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
  const [capabilities, setCapabilities] = useState<ReturnType<typeof getBrowserCapabilities> | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    // Detect browser capabilities
    const caps = getBrowserCapabilities();
    setCapabilities(caps);
    
    // Log browser capabilities to console
    console.log('🔍 VIM Editor - Browser Capabilities:', {
      hasSharedArrayBuffer: caps.hasSharedArrayBuffer,
      hasWebAssembly: caps.hasWebAssembly,
      browser: caps.browserName,
      requiresWorkaround: caps.requiresWorkaround
    });
    
    // Determine which editor to use
    if (caps.hasSharedArrayBuffer && caps.hasWebAssembly) {
      console.log('✅ Using vim.wasm (full VIM experience)');
      setEditorType('vim-wasm');
    } else if (caps.hasWebAssembly && !caps.hasSharedArrayBuffer) {
      // Browser supports WebAssembly but not SharedArrayBuffer
      // This means the user could enable it
      console.log('⚠️ Using Monaco-vim fallback (SharedArrayBuffer not available)');
      console.log('💡 Tip:', getBrowserInstructions(caps.browserName));
      setEditorType('monaco');
    } else {
      // No WebAssembly support at all
      console.log('⚠️ Using Monaco-vim fallback (WebAssembly not supported)');
      setEditorType('monaco');
    }
  }, []);

  // Handle mode change for Which-Key integration
  const handleModeChange = (_mode: string) => {
    // This will be passed to MonacoVimEditor
    // VimEditor handles this internally
  };

  if (editorType === 'loading') {
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
        {capabilities?.requiresWorkaround && !bannerDismissed && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-yellow-900/90 text-yellow-100 px-4 py-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <strong>Limited Mode:</strong> Using Monaco VIM emulation. 
                For the full VIM experience, enable SharedArrayBuffer in your browser.
              </div>
              <div className="flex items-center gap-2">
                <button 
                className="ml-4 text-yellow-200 hover:text-white underline text-xs"
                onClick={() => {
                  const instruction = capabilities ? 
                    `${capabilities.browserName === 'firefox' ? 
                      'In Firefox: Go to about:config and set dom.postMessage.sharedArrayBuffer.bypassCOOP_COEP.insecure.enabled to true' :
                      capabilities.browserName === 'safari' ?
                      'In Safari: Enable the Develop menu, then go to Develop > Disable Cross-Origin Restrictions' :
                      'Your browser should support SharedArrayBuffer. Try refreshing the page.'
                    }` : '';
                  alert(instruction);
                }}
              >
                How to enable?
              </button>
              <button
                className="ml-3 px-3 py-1 bg-yellow-800 text-yellow-100 hover:bg-yellow-700 hover:text-white border border-yellow-600 rounded transition-colors text-lg leading-none font-bold shadow-sm"
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss banner"
                title="Dismiss"
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
import { useEffect, useState, forwardRef, useRef } from 'react';
import { useBrowserCapabilities } from '../contexts/BrowserCapabilities';
import { getEditorLoader, type EditorComponent } from '../utils/dynamic-editor-loader';
import { testBrowserCompatibility } from '../utils/browser-compatibility-tester';
import { setupServiceWorkerForMode, getStoredModeAfterReload, type EditorMode as ServiceWorkerEditorMode } from '../utils/service-worker-manager';
import { configureMonacoForBrowser } from '../utils/monaco-environment-configurator';
import type { VimEditorRef } from './VimEditor';
import BasicTextEditor from './BasicTextEditor';

interface VimEditorHybridProps {
  vimrcContent?: string;
  disableWhichKey?: boolean;
  onKeyPress?: (event: KeyboardEvent) => void;
  hasModalOpen?: boolean;
}

type EditorMode = 'loading' | 'vim-wasm' | 'monaco' | 'basic' | 'error';

interface EditorState {
  mode: EditorMode;
  component: EditorComponent | typeof BasicTextEditor | null;
  isLoading: boolean;
  error: string | null;
  compatibility: any;
  bannerDismissed: boolean;
}

/**
 * Progressive VIM editor with three-tier fallback system:
 * 1. vim.wasm (best experience)
 * 2. Monaco-vim (good fallback)
 * 3. Basic textarea (always works)
 */
const VimEditorHybrid = forwardRef<VimEditorRef, VimEditorHybridProps>((props, ref) => {
  const [state, setState] = useState<EditorState>({
    mode: 'loading',
    component: null,
    isLoading: true,
    error: null,
    compatibility: null,
    bannerDismissed: false
  });
  
  // Use pre-detected capabilities from context for vim.wasm decision
  const earlyCapabilities = useBrowserCapabilities();
  
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    initializeEditor();
  }, [earlyCapabilities]);

  const updateState = (updates: Partial<EditorState>) => {
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, ...updates }));
    }
  };

  const initializeEditor = async () => {
    try {
      console.log('[VimEditorHybrid] Initializing progressive editor system...');
      
      // Check if we're coming back from a service worker reload
      const storedMode = getStoredModeAfterReload();
      if (storedMode) {
        console.log('[VimEditorHybrid] Resuming after service worker reload, target mode:', storedMode);
      }
      
      // Run comprehensive browser compatibility test
      const compatibility = await testBrowserCompatibility();
      updateState({ compatibility });
      
      console.log('[VimEditorHybrid] Browser compatibility results:', {
        canUseVimWasm: compatibility.canUseVimWasm,
        canUseMonaco: compatibility.canUseMonaco,
        restrictions: compatibility.restrictions
      });
      
      // Determine the best editor mode
      let targetMode: EditorMode;
      
      if (compatibility.canUseVimWasm) {
        targetMode = 'vim-wasm';
        console.log('✅ Target: vim.wasm (full VIM experience)');
      } else if (compatibility.canUseMonaco) {
        targetMode = 'monaco';
        console.log('⚠️ Target: Monaco-vim (fallback mode)');
      } else {
        targetMode = 'basic';
        console.log('🔧 Target: Basic editor (maximum compatibility)');
      }
      
      // Override with stored mode if available
      if (storedMode && ['vim-wasm', 'monaco', 'basic'].includes(storedMode)) {
        targetMode = storedMode as EditorMode;
        console.log('[VimEditorHybrid] Using stored mode:', targetMode);
      }
      
      // Set up service worker for the target mode
      try {
        // Only set up service worker for modes that need it
        if (targetMode === 'vim-wasm' || targetMode === 'monaco' || targetMode === 'basic') {
          await setupServiceWorkerForMode(targetMode as ServiceWorkerEditorMode);
        }
      } catch (error) {
        console.error('[VimEditorHybrid] Service worker setup failed:', error);
        // Don't fail completely, just log the error
      }
      
      // Load the appropriate editor
      await loadEditorForMode(targetMode, compatibility);
      
    } catch (error) {
      console.error('[VimEditorHybrid] Editor initialization failed:', error);
      updateState({
        mode: 'error',
        error: error instanceof Error ? error.message : 'Unknown initialization error',
        isLoading: false
      });
    }
  };

  const loadEditorForMode = async (mode: EditorMode, compatibility: any) => {
    updateState({ mode, isLoading: true });
    
    try {
      switch (mode) {
        case 'vim-wasm':
          await loadVimWasmEditor();
          break;
        case 'monaco':
          await loadMonacoEditor(compatibility);
          break;
        case 'basic':
          await loadBasicEditor();
          break;
        default:
          throw new Error(`Invalid editor mode: ${mode}`);
      }
    } catch (error) {
      console.error(`[VimEditorHybrid] Failed to load ${mode} editor:`, error);
      
      // Try to fall back to the next level
      if (mode === 'vim-wasm') {
        console.log('[VimEditorHybrid] Falling back to Monaco editor...');
        await loadEditorForMode('monaco', compatibility);
      } else if (mode === 'monaco') {
        console.log('[VimEditorHybrid] Falling back to basic editor...');
        await loadEditorForMode('basic', compatibility);
      } else {
        // Even basic editor failed - this should be very rare
        updateState({
          mode: 'error',
          error: `All editor modes failed. Last error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          isLoading: false
        });
      }
    }
  };

  const loadVimWasmEditor = async () => {
    console.log('[VimEditorHybrid] Loading vim.wasm editor...');
    
    // Check for vim.wasm load errors from the HTML conditional loading
    const vimWasmError = (window as any).__vimWasmLoadError;
    if (vimWasmError) {
      throw new Error(`vim.wasm failed to load: ${vimWasmError.message}`);
    }
    
    const loader = getEditorLoader(true); // true = use vim.wasm
    const component = await loader();
    
    updateState({
      mode: 'vim-wasm',
      component,
      isLoading: false
    });
    
    console.log('[VimEditorHybrid] vim.wasm editor loaded successfully');
  };

  const loadMonacoEditor = async (compatibility: any) => {
    console.log('[VimEditorHybrid] Loading Monaco editor...');
    
    // Configure Monaco environment based on browser capabilities
    try {
      await configureMonacoForBrowser(compatibility);
    } catch (error) {
      console.warn('[VimEditorHybrid] Monaco configuration failed:', error);
      // Continue anyway, Monaco might still work
    }
    
    const loader = getEditorLoader(false); // false = use Monaco
    const component = await loader();
    
    updateState({
      mode: 'monaco',
      component,
      isLoading: false
    });
    
    console.log('[VimEditorHybrid] Monaco editor loaded successfully');
  };

  const loadBasicEditor = async () => {
    console.log('[VimEditorHybrid] Loading basic text editor...');
    
    // Basic editor is just a component, no async loading needed
    updateState({
      mode: 'basic',
      component: BasicTextEditor,
      isLoading: false
    });
    
    console.log('[VimEditorHybrid] Basic editor loaded successfully');
  };

  const getBannerInfo = () => {
    if (!state.compatibility) return null;
    
    const { mode, compatibility } = state;
    
    switch (mode) {
      case 'vim-wasm':
        return null; // No banner needed for best mode
        
      case 'monaco':
        return {
          type: 'warning' as const,
          title: 'Limited VIM Mode',
          message: 'Using Monaco-vim emulation due to browser restrictions.',
          instructions: compatibility.restrictions.join(', '),
          canEnable: compatibility.hasWebAssembly && !compatibility.hasSharedArrayBuffer
        };
        
      case 'basic':
        return {
          type: 'error' as const,
          title: 'Basic Text Mode',
          message: 'Using simple text editor due to significant browser restrictions.',
          instructions: compatibility.restrictions.join(', '),
          canEnable: false
        };
        
      default:
        return null;
    }
  };

  // Show loading state
  if (state.isLoading || state.mode === 'loading') {
    const loadingMessage = state.mode === 'loading' ? 
      'Detecting browser capabilities...' :
      state.mode === 'vim-wasm' ? 'Loading VIM...' :
      state.mode === 'monaco' ? 'Loading Monaco Editor...' :
      'Loading Basic Editor...';
      
    return (
      <div className="h-full bg-gray-950 overflow-hidden">
        <div className="h-full relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
              <p className="text-gray-400">{loadingMessage}</p>
              {state.compatibility?.restrictions?.length > 0 && (
                <p className="text-gray-500 text-sm mt-2">
                  Detected: {state.compatibility.restrictions.length} restriction(s)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (state.mode === 'error') {
    return (
      <div className="h-full bg-gray-950 overflow-hidden">
        <div className="h-full relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 p-8">
            <div className="text-center max-w-md">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-red-400 mb-4">Editor Failed to Load</h2>
              <p className="text-gray-400 mb-4">
                All editor modes failed to initialize in your browser environment.
              </p>
              <details className="text-left bg-gray-800 p-4 rounded text-sm">
                <summary className="cursor-pointer text-gray-300">Technical Details</summary>
                <pre className="mt-2 text-red-300 overflow-auto">{state.error}</pre>
              </details>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the selected editor
  const bannerInfo = getBannerInfo();
  const EditorComponent = state.component;

  if (!EditorComponent) {
    return (
      <div className="h-full bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">No editor component available</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-950 overflow-hidden">
      <div className="h-full relative overflow-hidden">
        {/* Status banner for non-optimal modes */}
        {bannerInfo && !state.bannerDismissed && (
          <div className={`absolute top-0 left-0 right-0 z-20 px-4 py-2 text-sm shadow-lg ${
            bannerInfo.type === 'warning' ? 'bg-yellow-900 text-yellow-100' : 'bg-red-900 text-red-100'
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span className="font-semibold">{bannerInfo.title}:</span>{' '}
                {bannerInfo.message}
                {bannerInfo.instructions && (
                  <div className="text-xs mt-1 opacity-90">
                    Issues: {bannerInfo.instructions}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {bannerInfo.canEnable && (
                  <button 
                    className="text-xs underline hover:no-underline"
                    onClick={() => {
                      const msg = state.compatibility?.browserName === 'Firefox' ? 
                        'Firefox: Go to about:config and set dom.postMessage.sharedArrayBuffer.bypassCOOP_COEP.insecure.enabled to true' :
                        state.compatibility?.browserName === 'Safari' ?
                        'Safari: Enable the Develop menu, then go to Develop > Disable Cross-Origin Restrictions' :
                        'Enable SharedArrayBuffer support in your browser settings';
                      alert(msg);
                    }}
                  >
                    How to enable?
                  </button>
                )}
                <button
                  className="px-2 py-1 bg-opacity-50 hover:bg-opacity-75 rounded text-xs font-bold transition-all"
                  onClick={() => updateState({ bannerDismissed: true })}
                  aria-label="Dismiss banner"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Editor component */}
        <div className={bannerInfo && !state.bannerDismissed ? 'h-full pt-14' : 'h-full'}>
          <EditorComponent ref={ref} {...props} />
        </div>
      </div>
    </div>
  );
});

VimEditorHybrid.displayName = 'VimEditorHybrid';

export default VimEditorHybrid;
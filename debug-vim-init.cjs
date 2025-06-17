const puppeteer = require('puppeteer');

async function debugVimInitialization() {
  console.log('🔍 Debugging VIM Initialization Process...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-features=SharedArrayBuffer',
      '--disable-features=VizDisplayCompositor',
      '--cross-origin-isolated'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Monitor console messages
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      
      if (type === 'log' && text.includes('[')) {
        console.log(`📝 [${timestamp}] ${text}`);
      } else if (type === 'error') {
        console.log(`❌ [${timestamp}] ERROR: ${text}`);
      } else if (type === 'warning') {
        console.log(`⚠️  [${timestamp}] WARN: ${text}`);
      }
    });

    // Monitor network failures
    page.on('response', response => {
      if (!response.ok()) {
        console.log(`🌐 Network Error: ${response.status()} ${response.url()}`);
      }
    });

    // Navigate to the application
    console.log('🚀 Loading VIM application...');
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Wait for initial loading
    console.log('⏳ Waiting for application to load...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if browser capabilities are detected
    const capabilities = await page.evaluate(() => {
      return {
        hasSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
        hasWebAssembly: typeof WebAssembly !== 'undefined',
        isSecureContext: window.isSecureContext,
        skipVimWasmLoad: window.__skipVimWasmLoad,
        browserCapabilities: window.__browserCapabilities,
        vimWasmPromise: !!window.__vimWasmPromise,
        vimWasmLoadError: window.__vimWasmLoadError
      };
    });

    console.log('\n🔧 Browser Capabilities:');
    console.log(`   SharedArrayBuffer: ${capabilities.hasSharedArrayBuffer ? '✅' : '❌'}`);
    console.log(`   WebAssembly: ${capabilities.hasWebAssembly ? '✅' : '❌'}`);
    console.log(`   Secure Context: ${capabilities.isSecureContext ? '✅' : '❌'}`);
    console.log(`   Skip VIM WASM: ${capabilities.skipVimWasmLoad ? '❌' : '✅'}`);
    console.log(`   VIM WASM Promise: ${capabilities.vimWasmPromise ? '✅' : '❌'}`);
    
    if (capabilities.vimWasmLoadError) {
      console.log(`   VIM WASM Error: ${capabilities.vimWasmLoadError}`);
    }

    // Check current editor state
    const editorState = await page.evaluate(() => {
      const loadingElement = document.querySelector('[class*="Loading"]') || 
                           document.querySelector('div:contains("Loading")');
      const errorElement = document.querySelector('[class*="error"]') || 
                         document.querySelector('div:contains("Error")');
      const canvasElement = document.querySelector('canvas');
      const inputElement = document.querySelector('input[style*="1px"]');
      
      return {
        hasLoadingIndicator: !!loadingElement,
        loadingText: loadingElement?.textContent || null,
        hasError: !!errorElement,
        errorText: errorElement?.textContent || null,
        hasCanvas: !!canvasElement,
        hasVimInput: !!inputElement,
        bodyClasses: document.body.className,
        editorContainerExists: !!document.querySelector('[ref="containerRef"]') || !!document.querySelector('.relative.w-full.h-full')
      };
    });

    console.log('\n📊 Editor State:');
    console.log(`   Loading Indicator: ${editorState.hasLoadingIndicator ? '❌ STUCK' : '✅'}`);
    if (editorState.loadingText) {
      console.log(`   Loading Text: "${editorState.loadingText}"`);
    }
    console.log(`   Has Error: ${editorState.hasError ? '❌' : '✅'}`);
    if (editorState.errorText) {
      console.log(`   Error Text: "${editorState.errorText}"`);
    }
    console.log(`   Canvas Element: ${editorState.hasCanvas ? '✅' : '❌'}`);
    console.log(`   VIM Input: ${editorState.hasVimInput ? '✅' : '❌'}`);
    console.log(`   Editor Container: ${editorState.editorContainerExists ? '✅' : '❌'}`);

    // Wait and check for vim.wasm loading completion
    console.log('\n⏳ Monitoring vim.wasm loading (30 seconds)...');
    let vimWasmLoaded = false;
    let vimStarted = false;
    let vimInitialized = false;

    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const status = await page.evaluate(() => {
        return {
          vimWasmAvailable: !!window.VimWasm,
          vimInstanceExists: !!window.vimInstanceForDebug,
          isLoadingVisible: !!document.querySelector('div:contains("Loading")'),
          canvasCount: document.querySelectorAll('canvas').length
        };
      });

      if (status.vimWasmAvailable && !vimWasmLoaded) {
        console.log(`✅ [${i+1}s] vim.wasm module loaded`);
        vimWasmLoaded = true;
      }

      if (status.canvasCount > 0 && !vimStarted) {
        console.log(`✅ [${i+1}s] VIM canvas created`);
        vimStarted = true;
      }

      if (!status.isLoadingVisible && !vimInitialized) {
        console.log(`✅ [${i+1}s] Loading indicator removed - VIM initialized`);
        vimInitialized = true;
        break;
      }

      if (i % 5 === 4) {
        console.log(`⏳ [${i+1}s] Still loading... (canvas: ${status.canvasCount}, loading: ${status.isLoadingVisible})`);
      }
    }

    // Final state check
    const finalState = await page.evaluate(() => {
      const loadingDiv = document.querySelector('div:contains("Loading")');
      return {
        stillLoading: !!loadingDiv,
        loadingText: loadingDiv?.textContent,
        canvasElements: document.querySelectorAll('canvas').length,
        inputElements: document.querySelectorAll('input').length
      };
    });

    console.log('\n🏁 Final State:');
    console.log(`   Still Loading: ${finalState.stillLoading ? '❌ FAILED' : '✅ SUCCESS'}`);
    if (finalState.loadingText) {
      console.log(`   Loading Text: "${finalState.loadingText}"`);
    }
    console.log(`   Canvas Elements: ${finalState.canvasElements}`);
    console.log(`   Input Elements: ${finalState.inputElements}`);

    // Test basic interaction if initialized
    if (!finalState.stillLoading && finalState.canvasElements > 0) {
      console.log('\n🧪 Testing basic VIM interaction...');
      
      // Try to focus and type
      await page.click('canvas');
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.keyboard.type('i'); // Enter insert mode
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.keyboard.type('Hello VIM!');
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.keyboard.press('Escape'); // Back to normal mode
      
      console.log('✅ Basic VIM interaction test completed');
    }

    // Take a screenshot for visual verification
    await page.screenshot({ 
      path: './test-screenshots/vim-debug-final-state.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: ./test-screenshots/vim-debug-final-state.png');

  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the debug test
debugVimInitialization().catch(console.error);
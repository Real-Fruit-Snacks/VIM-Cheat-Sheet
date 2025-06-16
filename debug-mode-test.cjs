const puppeteer = require('puppeteer');

async function debugModeTest() {
  console.log('🔍 Debugging which editor mode is actually being used...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Listen to console logs to see what's happening
    page.on('console', (msg) => {
      console.log(`[PAGE LOG ${msg.type()}] ${msg.text()}`);
    });
    
    // Load the application
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for app to load
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check what editor components are present
    const editorInfo = await page.evaluate(() => {
      const vimScreen = document.querySelector('.vim-screen');
      const monacoEditor = document.querySelector('.monaco-editor');
      const vimContainer = document.querySelector('[class*="vim"]');
      const anyTextArea = document.querySelector('textarea');
      const anyCanvas = document.querySelector('canvas');
      
      return {
        hasVimScreen: !!vimScreen,
        hasMonacoEditor: !!monacoEditor,
        hasVimContainer: !!vimContainer,
        hasTextArea: !!anyTextArea,
        hasCanvas: !!anyCanvas,
        vimScreenHTML: vimScreen ? vimScreen.outerHTML.substring(0, 200) + '...' : null,
        monacoHTML: monacoEditor ? monacoEditor.outerHTML.substring(0, 200) + '...' : null
      };
    });
    
    console.log('Editor detection:', editorInfo);
    
    // Check browser capabilities
    const capabilities = await page.evaluate(() => {
      return {
        hasWebAssembly: typeof WebAssembly !== 'undefined',
        hasSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
        hasVimWasm: typeof window.VimWasm !== 'undefined',
        browserCapabilities: window.__browserCapabilities
      };
    });
    
    console.log('Browser capabilities:', capabilities);
    
    // Try to force Monaco mode by disabling SharedArrayBuffer and reloading
    console.log('\\nDisabling SharedArrayBuffer and reloading...');
    await page.evaluate(() => {
      delete window.SharedArrayBuffer;
      // Also try to prevent vim.wasm loading
      window.__skipVimWasmLoad = true;
    });
    
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check again after reload
    const editorInfo2 = await page.evaluate(() => {
      const vimScreen = document.querySelector('.vim-screen');
      const monacoEditor = document.querySelector('.monaco-editor');
      const statusBar = document.querySelector('.monaco-vim-status-bar');
      
      return {
        hasVimScreen: !!vimScreen,
        hasMonacoEditor: !!monacoEditor,
        hasStatusBar: !!statusBar,
        statusBarText: statusBar ? statusBar.textContent : null,
        monacoEditorId: monacoEditor ? monacoEditor.id : null
      };
    });
    
    console.log('After reload editor detection:', editorInfo2);
    
    const capabilities2 = await page.evaluate(() => {
      return {
        hasWebAssembly: typeof WebAssembly !== 'undefined',
        hasSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
        hasVimWasm: typeof window.VimWasm !== 'undefined',
        skipFlag: window.__skipVimWasmLoad
      };
    });
    
    console.log('After reload capabilities:', capabilities2);
    
    // Take a screenshot to see what's actually rendered
    await page.screenshot({ 
      path: 'debug-editor-mode.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: debug-editor-mode.png');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

debugModeTest();
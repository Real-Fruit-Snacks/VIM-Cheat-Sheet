const puppeteer = require('puppeteer');

async function testMonacoFallback() {
  console.log('🦊 Testing Monaco-vim fallback mode (Firefox scenario)...');
  
  const browser = await puppeteer.launch({
    headless: false,
    // Use Firefox-like flags to disable SharedArrayBuffer
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-features=SharedArrayBuffer',
      '--disable-web-security' // Disable to simulate missing SharedArrayBuffer
    ]
  });
  
  const page = await browser.newPage();
  
  // Listen to console logs
  page.on('console', (msg) => {
    console.log(`[CONSOLE ${msg.type()}] ${msg.text()}`);
  });
  
  try {
    // Force disable SharedArrayBuffer before loading
    await page.evaluateOnNewDocument(() => {
      // Simulate Firefox without SharedArrayBuffer
      delete window.SharedArrayBuffer;
      Object.defineProperty(window, 'SharedArrayBuffer', {
        value: undefined,
        writable: false
      });
      
      // Also disable service worker to match your logs
      Object.defineProperty(navigator, 'serviceWorker', {
        value: undefined,
        writable: false
      });
    });
    
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    console.log('✅ Application loaded');
    
    // Verify we're actually in Monaco mode
    const editorInfo = await page.evaluate(() => {
      const monacoEditor = document.querySelector('.monaco-editor');
      const vimScreen = document.querySelector('.vim-screen');
      const statusBar = document.querySelector('.monaco-vim-status-bar');
      
      return {
        hasMonaco: !!monacoEditor,
        hasVimScreen: !!vimScreen,
        hasStatusBar: !!statusBar,
        capabilities: window.__browserCapabilities
      };
    });
    
    console.log('Editor info:', editorInfo);
    
    if (!editorInfo.hasMonaco) {
      console.log('❌ Not in Monaco mode - test invalid');
      return false;
    }
    
    console.log('✅ Confirmed Monaco-vim fallback mode');
    
    // Test 1: Space in normal mode (should trigger which-key)
    console.log('\\n🧪 Test 1: Space in normal mode');
    
    // Focus on Monaco editor
    await page.click('.monaco-editor');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear any content
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await page.keyboard.press('Delete');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Press space in normal mode
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const whichKeyVisible = await page.$('.fixed.inset-0, [class*="which-key"]');
    console.log('Which-key visible:', !!whichKeyVisible);
    
    // Close which-key
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Test 2: Enter insert mode and test space
    console.log('\\n🧪 Test 2: Space in insert mode');
    
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if we're in insert mode
    const insertMode = await page.evaluate(() => {
      const statusBar = document.querySelector('.monaco-vim-status-bar');
      const statusText = statusBar ? statusBar.textContent.toLowerCase() : '';
      return statusText.includes('insert');
    });
    
    console.log('In insert mode:', insertMode);
    
    // Type text with spaces
    await page.keyboard.type('hello world test');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Exit insert mode
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get the content from Monaco editor
    const content = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor');
      if (editor) {
        // Try to get Monaco editor model content
        if (window.monaco && window.monaco.editor) {
          const instances = window.monaco.editor.getModels();
          if (instances.length > 0) {
            return instances[0].getValue();
          }
        }
        
        // Fallback: get visible text
        const lines = editor.querySelectorAll('.view-line');
        let text = '';
        lines.forEach(line => {
          const content = line.textContent || '';
          text += content + '\\n';
        });
        return text.trim();
      }
      return '';
    });
    
    console.log(`Content: "${content}"`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'monaco-fallback-test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: monaco-fallback-test.png');
    
    // Analysis
    console.log('\\n📊 Analysis:');
    
    if (whichKeyVisible) {
      console.log('✅ Space in normal mode triggers which-key');
    } else {
      console.log('❌ Space in normal mode does not trigger which-key');
    }
    
    if (content.includes('hello world test')) {
      console.log('✅ Spaces work correctly in insert mode');
    } else {
      console.log('❌ Spaces do not work in insert mode');
      console.log(`  Expected: "hello world test", Got: "${content}"`);
    }
    
    const success = whichKeyVisible && content.includes('hello world test');
    
    if (success) {
      console.log('\\n🎉 SUCCESS: Monaco-vim fallback mode working correctly!');
    } else {
      console.log('\\n❌ FAILURE: Monaco-vim fallback mode has issues');
    }
    
    return success;
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    return false;
  } finally {
    await browser.close();
  }
}

testMonacoFallback().then(success => {
  console.log(success ? '🎉 Monaco fallback test passed!' : '💥 Monaco fallback test failed!');
  process.exit(success ? 0 : 1);
});
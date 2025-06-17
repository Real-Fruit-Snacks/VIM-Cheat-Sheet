const puppeteer = require('puppeteer');

async function debugMonacoSpace() {
  console.log('🔍 Debugging Monaco-vim space issue...');
  
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Force Monaco fallback
  await page.evaluateOnNewDocument(() => {
    delete window.SharedArrayBuffer;
    Object.defineProperty(window, 'SharedArrayBuffer', {
      value: undefined,
      writable: false
    });
  });
  
  // Add console logging
  page.on('console', msg => {
    if (msg.text().includes('[MonacoVim]') || msg.text().includes('Space key')) {
      console.log('Browser:', msg.text());
    }
  });
  
  try {
    await page.goto('http://localhost:5175/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    console.log('✅ Page loaded');
    
    // Inject debugging code
    await page.evaluate(() => {
      console.log('[MonacoVim] Injecting debug code...');
      
      // Find Monaco editor instance
      let editor = null;
      if (window.monaco && window.monaco.editor) {
        const models = window.monaco.editor.getModels();
        if (models.length > 0) {
          // Find editor by model
          const editors = Array.from(document.querySelectorAll('.monaco-editor')).map(el => {
            return el._editor || el.editor;
          }).filter(e => e);
          editor = editors[0];
        }
      }
      
      if (!editor) {
        console.log('[MonacoVim] No editor found! Checking alternative methods...');
        // Try to find via global references
        if (window.editorRef?.current) {
          editor = window.editorRef.current;
          console.log('[MonacoVim] Found editor via editorRef');
        }
      }
      
      if (!editor) {
        console.log('[MonacoVim] Still no editor found!');
        return;
      }
      
      console.log('[MonacoVim] Found editor:', editor);
      
      // Log all key events
      const domNode = editor.getDomNode();
      if (domNode) {
        // Add capture phase listener
        domNode.addEventListener('keydown', (e) => {
          console.log(`[MonacoVim] keydown (capture): key="${e.key}" code="${e.code}" prevented=${e.defaultPrevented}`);
        }, true);
        
        // Add bubble phase listener
        domNode.addEventListener('keydown', (e) => {
          console.log(`[MonacoVim] keydown (bubble): key="${e.key}" code="${e.code}" prevented=${e.defaultPrevented}`);
        }, false);
        
        // Add keypress listener
        domNode.addEventListener('keypress', (e) => {
          console.log(`[MonacoVim] keypress: key="${e.key}" code="${e.code}" prevented=${e.defaultPrevented}`);
        }, true);
      }
      
      // Monitor editor content changes
      editor.onDidChangeModelContent((e) => {
        console.log('[MonacoVim] Content changed:', editor.getValue());
      });
      
      // Check vim mode status
      const statusBar = document.querySelector('.monaco-vim-status-bar');
      if (statusBar) {
        console.log('[MonacoVim] Status bar found:', statusBar.textContent);
      }
    });
    
    // Test space in insert mode
    console.log('\\n🧪 Testing space in insert mode...');
    await page.click('.monaco-editor');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Clear content
    await page.keyboard.type('ggdG');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Enter insert mode
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('\\n📝 Typing "hello world" with space...');
    await page.keyboard.type('hello');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('\\n🔍 Now pressing space key...');
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await page.keyboard.type('world');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get content
    const content = await page.evaluate(() => {
      const editor = window.monaco?.editor?.getEditors()?.[0];
      return editor ? editor.getValue() : '';
    });
    
    console.log(`\\n📋 Final content: "${content}"`);
    console.log(`\\n✅ Space working: ${content.includes(' ') ? 'YES' : 'NO'}`);
    
    console.log('\\n⏳ Keeping browser open for manual inspection...');
    console.log('Press Ctrl+C to close');
    
    // Keep browser open
    await new Promise(() => {});
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

debugMonacoSpace();
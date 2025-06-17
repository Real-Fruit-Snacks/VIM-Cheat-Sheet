const puppeteer = require('puppeteer');

async function testSpaceDebug() {
  console.log('🔍 Testing space key with debug logs...');
  
  const browser = await puppeteer.launch({
    headless: false,
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
  
  // Capture console logs
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[MonacoVimEditor]') || text.includes('Space')) {
      console.log('Browser:', text);
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
    
    // Click on editor and enter insert mode
    await page.click('.monaco-editor');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('\\n📝 Entering insert mode...');
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\\n🔍 Pressing space key...');
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\\n📝 Typing more text with spaces...');
    await page.keyboard.type('hello world');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get content
    const content = await page.evaluate(() => {
      // Try multiple methods to get content
      const methods = [];
      
      // Method 1: Via models
      const models = window.monaco?.editor?.getModels();
      if (models && models.length > 0) {
        methods.push(`Model[0]: "${models[0].getValue()}"`);
      }
      
      // Method 2: Via editor instances
      if (window.monaco && window.monaco.editor) {
        const editors = window.monaco.editor.getEditors();
        if (editors && editors.length > 0) {
          methods.push(`Editor[0]: "${editors[0].getValue()}"`);
        }
      }
      
      // Method 3: Check DOM
      const editorTextarea = document.querySelector('.monaco-editor textarea');
      if (editorTextarea) {
        methods.push(`Textarea: "${editorTextarea.value}"`);
      }
      
      // Method 4: Check view lines
      const viewLines = document.querySelectorAll('.view-line');
      if (viewLines.length > 0) {
        const domText = Array.from(viewLines).map(el => el.textContent).join('\\n');
        methods.push(`DOM: "${domText}"`);
      }
      
      console.log('[Debug] Content methods:', methods.join(' | '));
      
      return models?.[0]?.getValue() || '';
    });
    
    console.log(`\\n📋 Final content: "${content}"`);
    console.log(`\\n✅ Spaces working: ${content.includes(' ') ? 'YES' : 'NO'}`);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testSpaceDebug();
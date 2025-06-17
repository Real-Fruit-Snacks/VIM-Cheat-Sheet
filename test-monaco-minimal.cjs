const puppeteer = require('puppeteer');

async function testMonacoMinimal() {
  console.log('🔍 Minimal Monaco-vim test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Force Monaco fallback
  await page.evaluateOnNewDocument(() => {
    delete window.SharedArrayBuffer;
  });
  
  try {
    await page.goto('http://localhost:5175/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await page.waitForSelector('.monaco-editor', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('✅ Page loaded');
    
    // Clear any existing content
    await page.click('.monaco-editor');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Make sure we're in normal mode
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear all content
    await page.keyboard.type('ggdG');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enter insert mode
    console.log('\\n📝 Entering insert mode with "i"...');
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Type a single character first
    console.log('\\n📝 Typing "a"...');
    await page.keyboard.press('a');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let content = await page.evaluate(() => {
      // Try multiple ways to get the editor
      let editor = null;
      
      // Method 1: getEditors
      const editors = window.monaco?.editor?.getEditors();
      if (editors && editors.length > 0) {
        editor = editors[0];
      }
      
      // Method 2: Via model
      if (!editor) {
        const models = window.monaco?.editor?.getModels();
        if (models && models.length > 0) {
          return models[0].getValue();
        }
      }
      
      return editor ? editor.getValue() : 'No editor found';
    });
    console.log(`Content after 'a': "${content}"`);
    
    // Now try space
    console.log('\\n📝 Typing space...');
    await page.keyboard.press('Space');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    content = await page.evaluate(() => {
      const models = window.monaco?.editor?.getModels();
      if (models && models.length > 0) {
        return models[0].getValue();
      }
      return 'No model found';
    });
    console.log(`Content after space: "${content}"`);
    
    // Type another character
    console.log('\\n📝 Typing "b"...');
    await page.keyboard.press('b');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    content = await page.evaluate(() => {
      const models = window.monaco?.editor?.getModels();
      if (models && models.length > 0) {
        return models[0].getValue();
      }
      return 'No model found';
    });
    console.log(`Final content: "${content}"`);
    
    // Check DOM content too
    const domContent = await page.evaluate(() => {
      const viewLines = document.querySelectorAll('.view-line');
      return Array.from(viewLines).map(el => el.textContent).join('\\n');
    });
    console.log(`DOM content: "${domContent}"`);
    
    // Check if we're still in insert mode
    const statusBar = await page.evaluate(() => {
      const bar = document.querySelector('.monaco-vim-status-bar');
      return bar ? bar.textContent : 'No status bar';
    });
    console.log(`Status bar: "${statusBar}"`);
    
    console.log('\\n⏳ Keeping browser open for inspection...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testMonacoMinimal();
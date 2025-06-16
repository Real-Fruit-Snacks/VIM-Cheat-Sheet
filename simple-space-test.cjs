const puppeteer = require('puppeteer');

async function simpleSpaceTest() {
  console.log('🧪 Simple space insertion test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Load the application
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for app to load
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 4000)); // Wait longer for initialization
    
    console.log('✅ Application loaded');
    
    // Try to focus on the Monaco editor directly
    const editorFocused = await page.evaluate(async () => {
      // Find Monaco editor
      const editorElement = document.querySelector('.monaco-editor textarea') || 
                           document.querySelector('.monaco-editor') ||
                           document.querySelector('[class*="monaco"]');
      
      if (editorElement) {
        editorElement.focus();
        
        // If it's a textarea, focus on it specifically
        const textarea = editorElement.querySelector ? 
          editorElement.querySelector('textarea') : 
          (editorElement.tagName === 'TEXTAREA' ? editorElement : null);
        
        if (textarea) {
          textarea.focus();
          console.log('Focused on Monaco textarea');
          return true;
        }
        
        console.log('Found Monaco editor but no textarea');
        return true;
      }
      
      console.log('No Monaco editor found');
      return false;
    });
    
    console.log('Editor focused:', editorFocused);
    
    // Wait a bit more
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enter insert mode explicitly
    console.log('Pressing i to enter insert mode...');
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if we're in insert mode
    const insertMode = await page.evaluate(() => {
      const statusBar = document.querySelector('.monaco-vim-status-bar') ||
                       document.querySelector('[class*="status"]');
      const statusText = statusBar ? statusBar.textContent : '';
      console.log('Status bar text:', statusText);
      return statusText.toLowerCase().includes('insert');
    });
    
    console.log('In insert mode:', insertMode);
    
    // Now try typing a simple character first
    console.log('Typing letter "a"...');
    await page.keyboard.press('a');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if "a" appeared
    let content = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor');
      if (editor) {
        const lines = editor.querySelectorAll('.view-line');
        let text = '';
        lines.forEach(line => {
          text += line.textContent + '\\n';
        });
        return text.trim();
      }
      return '';
    });
    
    console.log('Content after "a":', JSON.stringify(content));
    
    if (content.includes('a')) {
      console.log('✅ Letter "a" was inserted - basic typing works');
      
      // Now try space
      console.log('Typing space...');
      await page.keyboard.press(' ');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check content again
      content = await page.evaluate(() => {
        const editor = document.querySelector('.monaco-editor');
        if (editor) {
          const lines = editor.querySelectorAll('.view-line');
          let text = '';
          lines.forEach(line => {
            text += line.textContent + '\\n';
          });
          return text.trim();
        }
        return '';
      });
      
      console.log('Content after space:', JSON.stringify(content));
      
      if (content.includes('a ')) {
        console.log('✅ SUCCESS: Space was inserted after "a"!');
        return true;
      } else {
        console.log('❌ FAIL: Space was not inserted');
        return false;
      }
      
    } else {
      console.log('❌ Basic typing doesn\'t work - deeper issue');
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    return false;
  } finally {
    await browser.close();
  }
}

simpleSpaceTest().then(success => {
  console.log(success ? '🎉 Test passed!' : '💥 Test failed!');
  process.exit(success ? 0 : 1);
});
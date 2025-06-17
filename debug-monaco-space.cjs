const puppeteer = require('puppeteer');

async function debugMonacoSpace() {
  console.log('🔍 Debugging Monaco-vim space handling...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Listen to all key events
  await page.evaluateOnNewDocument(() => {
    window.keyEventLog = [];
    
    // Capture at multiple levels
    document.addEventListener('keydown', (e) => {
      window.keyEventLog.push({
        type: 'keydown',
        key: e.key,
        code: e.code,
        prevented: e.defaultPrevented,
        target: e.target.tagName,
        phase: 'capture'
      });
    }, true);
    
    document.addEventListener('keypress', (e) => {
      window.keyEventLog.push({
        type: 'keypress',
        key: e.key,
        code: e.code,
        prevented: e.defaultPrevented,
        target: e.target.tagName,
        phase: 'capture'
      });
    }, true);
    
    document.addEventListener('beforeinput', (e) => {
      window.keyEventLog.push({
        type: 'beforeinput',
        data: e.data,
        inputType: e.inputType,
        prevented: e.defaultPrevented,
        target: e.target.tagName
      });
    }, true);
  });
  
  // Force Monaco fallback
  await page.evaluateOnNewDocument(() => {
    delete window.SharedArrayBuffer;
    Object.defineProperty(window, 'SharedArrayBuffer', {
      value: undefined,
      writable: false
    });
  });
  
  try {
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    console.log('✅ Application loaded in Monaco mode');
    
    // Clear event log
    await page.evaluate(() => { window.keyEventLog = []; });
    
    // Focus and enter insert mode
    await page.click('.monaco-editor');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear log again after mode change
    await page.evaluate(() => { window.keyEventLog = []; });
    
    console.log('\\n🔍 Pressing space key...');
    
    // Press space
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get the event log
    const events = await page.evaluate(() => window.keyEventLog);
    
    console.log('\\n📊 Key Events for Space:');
    events.forEach(e => {
      console.log(`  ${e.type}: key="${e.key}" prevented=${e.prevented} target=${e.target} ${e.phase || ''}`);
    });
    
    // Check if space was actually inserted
    const content = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor');
      if (editor && window.monaco && window.monaco.editor) {
        const instances = window.monaco.editor.getModels();
        if (instances.length > 0) {
          return instances[0].getValue();
        }
      }
      return '';
    });
    
    console.log('\\nEditor content after space:', JSON.stringify(content));
    
    // Try different space insertion methods
    console.log('\\n🔍 Testing different insertion methods...');
    
    // Method 1: Direct input event
    await page.evaluate(() => {
      const textarea = document.querySelector('.monaco-editor textarea');
      if (textarea) {
        const event = new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          data: ' ',
          inputType: 'insertText'
        });
        textarea.dispatchEvent(event);
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const content2 = await page.evaluate(() => {
      if (window.monaco && window.monaco.editor) {
        const instances = window.monaco.editor.getModels();
        if (instances.length > 0) {
          return instances[0].getValue();
        }
      }
      return '';
    });
    
    console.log('Content after input event:', JSON.stringify(content2));
    
    // Method 2: Direct Monaco API
    await page.evaluate(() => {
      if (window.monaco && window.monaco.editor) {
        const editors = window.monaco.editor.getEditors();
        if (editors.length > 0) {
          const editor = editors[0];
          const position = editor.getPosition();
          editor.executeEdits('', [{
            range: new window.monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
            text: ' ',
            forceMoveMarkers: true
          }]);
        }
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const content3 = await page.evaluate(() => {
      if (window.monaco && window.monaco.editor) {
        const instances = window.monaco.editor.getModels();
        if (instances.length > 0) {
          return instances[0].getValue();
        }
      }
      return '';
    });
    
    console.log('Content after Monaco API:', JSON.stringify(content3));
    
    // Check monaco-vim status
    const vimInfo = await page.evaluate(() => {
      const statusBar = document.querySelector('.monaco-vim-status-bar');
      const vimMode = window.vimMode || window.vim || window.monacoVim;
      
      return {
        statusText: statusBar ? statusBar.textContent : 'no status bar',
        hasVimMode: !!vimMode,
        vimModeType: vimMode ? typeof vimMode : 'undefined'
      };
    });
    
    console.log('\\nVim info:', vimInfo);
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

debugMonacoSpace();
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
      const models = window.monaco?.editor?.getModels();
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
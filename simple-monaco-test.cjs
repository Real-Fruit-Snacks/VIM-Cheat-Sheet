const puppeteer = require('puppeteer');

async function simpleMonacoTest() {
  console.log('🎯 Simple Monaco-vim space test...');
  
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
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await page.waitForSelector('.monaco-editor', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    console.log('✅ Monaco editor loaded');
    
    // Click on the editor to focus
    await page.click('.monaco-editor');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Press escape to ensure normal mode
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Press 'o' to open a new line and enter insert mode
    console.log('Pressing "o" to create new line and enter insert mode...');
    await page.keyboard.press('o');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Type text with spaces
    console.log('Typing text with spaces...');
    await page.keyboard.type('test space here');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get the content directly from Monaco
    const content = await page.evaluate(() => {
      // Try multiple methods to get content
      
      // Method 1: Monaco API
      if (window.monaco && window.monaco.editor) {
        const models = window.monaco.editor.getModels();
        if (models.length > 0) {
          const value = models[0].getValue();
          console.log('Monaco model value:', value);
          return { method: 'monaco-api', content: value };
        }
      }
      
      // Method 2: Visible text
      const viewLines = document.querySelectorAll('.monaco-editor .view-line');
      let visibleText = '';
      viewLines.forEach(line => {
        visibleText += line.textContent + '\\n';
      });
      console.log('Visible text:', visibleText);
      
      return { method: 'visible-text', content: visibleText };
    });
    
    console.log('\\nContent retrieved:');
    console.log(`  Method: ${content.method}`);
    console.log(`  Content: "${content.content}"`);
    
    // Check if spaces are present
    const hasTestText = content.content.includes('test space here');
    const hasSpaceBetweenWords = content.content.includes('test space') || content.content.includes('space here');
    console.log(`\\n${hasTestText ? '✅' : '❌'} Text with spaces found: ${hasTestText}`);
    
    // Also check for the individual words to debug
    const hasTest = content.content.includes('test');
    const hasSpace = content.content.includes('space');
    const hasHere = content.content.includes('here');
    console.log(`  - Contains "test": ${hasTest}`);
    console.log(`  - Contains "space": ${hasSpace}`);
    console.log(`  - Contains "here": ${hasHere}`);
    
    // Extract just the line we typed
    const lines = content.content.split('\\n');
    const typedLine = lines.find(line => line.includes('test') || line.includes('space') || line.includes('here'));
    console.log(`  - Line we typed: "${typedLine || 'not found'}"`);
    
    const hasSpaces = hasTestText || (typedLine && typedLine.includes(' '));
    
    // Test space in normal mode
    console.log('\\nTesting space in normal mode...');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const whichKey = await page.$('[class*="which-key"], .fixed.inset-0');
    console.log(`${whichKey ? '✅' : '❌'} Which-key ${whichKey ? 'appears' : 'does NOT appear'} on space in normal mode`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'simple-monaco-test.png',
      fullPage: true 
    });
    console.log('\\n📸 Screenshot saved: simple-monaco-test.png');
    
    return hasSpaces && !!whichKey;
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    return false;
  } finally {
    await browser.close();
  }
}

simpleMonacoTest().then(success => {
  console.log(success ? '\\n🎉 SUCCESS: Spaces work in Monaco-vim!' : '\\n❌ FAILED: Space issues remain');
  process.exit(success ? 0 : 1);
});
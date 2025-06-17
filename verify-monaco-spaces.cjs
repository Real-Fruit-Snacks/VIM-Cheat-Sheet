const puppeteer = require('puppeteer');

async function verifyMonacoSpaces() {
  console.log('✅ Verifying Monaco-vim space handling...');
  
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
  
  try {
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    console.log('✅ Monaco-vim fallback loaded');
    
    // Test 1: Space in normal mode
    console.log('\\n🧪 Test 1: Space as which-key leader');
    await page.click('.monaco-editor');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Clear content first
    await page.keyboard.type('ggdG'); // Go to top and delete everything
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Press space in normal mode
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const whichKeyVisible = await page.$('.fixed.inset-0, [class*="which-key"]');
    console.log(whichKeyVisible ? '✅ Which-key triggered' : '❌ Which-key not triggered');
    
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Test 2: Multiple spaces in insert mode
    console.log('\\n🧪 Test 2: Multiple spaces in insert mode');
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Type with multiple spaces
    await page.keyboard.type('a  b   c    d');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get content
    const content = await page.evaluate(() => {
      if (window.monaco && window.monaco.editor) {
        const instances = window.monaco.editor.getModels();
        if (instances.length > 0) {
          return instances[0].getValue();
        }
      }
      return '';
    });
    
    console.log(`Content: "${content}"`);
    
    // Test 3: Space at different positions
    console.log('\\n🧪 Test 3: Spaces at different positions');
    await page.keyboard.type('o'); // New line
    await new Promise(resolve => setTimeout(resolve, 300));
    
    await page.keyboard.type(' leading');
    await page.keyboard.press('Enter');
    await page.keyboard.type('trailing ');
    await page.keyboard.press('Enter');
    await page.keyboard.type('mid dle');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.keyboard.press('Escape');
    
    const finalContent = await page.evaluate(() => {
      if (window.monaco && window.monaco.editor) {
        const instances = window.monaco.editor.getModels();
        if (instances.length > 0) {
          return instances[0].getValue();
        }
      }
      return '';
    });
    
    console.log('\\nFinal content:', JSON.stringify(finalContent));
    
    // Analysis
    console.log('\\n📊 Test Results:');
    
    const hasMultipleSpaces = content.includes('  ') && content.includes('   ') && content.includes('    ');
    const hasLeadingSpace = finalContent.includes('\\n leading');
    const hasTrailingSpace = finalContent.includes('trailing \\n');
    const hasMidSpace = finalContent.includes('mid dle');
    
    console.log(`✅ Which-key in normal mode: ${whichKeyVisible ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Multiple spaces preserved: ${hasMultipleSpaces ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Leading space: ${hasLeadingSpace ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Trailing space: ${hasTrailingSpace ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Mid-word space: ${hasMidSpace ? 'PASS' : 'FAIL'}`);
    
    // Screenshot
    await page.screenshot({ 
      path: 'monaco-spaces-final.png',
      fullPage: true 
    });
    console.log('\\n📸 Screenshot saved: monaco-spaces-final.png');
    
    const allPassed = whichKeyVisible && hasMultipleSpaces && hasLeadingSpace && hasTrailingSpace && hasMidSpace;
    
    if (allPassed) {
      console.log('\\n🎉 ALL TESTS PASSED! Monaco-vim space handling is working correctly!');
    } else {
      console.log('\\n❌ Some tests failed. Check the results above.');
    }
    
    return allPassed;
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    return false;
  } finally {
    await browser.close();
  }
}

verifyMonacoSpaces().then(success => {
  process.exit(success ? 0 : 1);
});
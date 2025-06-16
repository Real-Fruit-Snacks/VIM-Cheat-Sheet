const puppeteer = require('puppeteer');

async function testSpaceInsertion() {
  console.log('🧪 Testing space insertion in Monaco-vim fallback mode...');
  
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
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Application loaded');
    
    // Force Monaco-vim mode by disabling SharedArrayBuffer
    await page.evaluate(() => {
      // This should force fallback to Monaco-vim
      delete window.SharedArrayBuffer;
    });
    
    // Reload to trigger Monaco-vim fallback
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Reloaded in Monaco-vim mode');
    
    // Test 1: Space in normal mode (should trigger which-key, not insert space)
    console.log('\n🧪 Test 1: Space in normal mode');
    await page.keyboard.press('Escape'); // Ensure normal mode
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear any existing content first
    await page.keyboard.press('Home');
    await page.keyboard.down('Shift');
    await page.keyboard.press('End');
    await page.keyboard.up('Shift');
    await page.keyboard.press('Delete');
    
    // Now test space in normal mode
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if which-key appeared (space should NOT be inserted)
    let content1 = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor') || document.querySelector('[class*="editor"]');
      return editor ? editor.textContent.trim() : '';
    });
    
    console.log(`Content after space in normal mode: "${content1}"`);
    
    // Escape to close which-key
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 2: Space in insert mode (should insert actual space)
    console.log('\n🧪 Test 2: Space in insert mode');
    
    // Enter insert mode
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Entered insert mode');
    
    // Type some text with spaces
    await page.keyboard.type('Hello World Test');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check content
    let content2 = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor') || document.querySelector('[class*="editor"]');
      return editor ? editor.textContent.trim() : '';
    });
    
    console.log(`Content after typing in insert mode: "${content2}"`);
    
    // Test 3: More specific space insertion test
    console.log('\n🧪 Test 3: Specific space insertion');
    
    // Clear content
    await page.keyboard.press('Escape'); // Exit insert mode
    await new Promise(resolve => setTimeout(resolve, 200));
    await page.keyboard.press('Home');
    await page.keyboard.down('Shift');
    await page.keyboard.press('End');
    await page.keyboard.up('Shift');
    await page.keyboard.press('Delete');
    
    // Enter insert mode and test specific space pattern
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 200));
    await page.keyboard.type('a');
    await page.keyboard.press(' ');
    await page.keyboard.press(' ');
    await page.keyboard.type('b');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let content3 = await page.evaluate(() => {
      const editor = document.querySelector('.monaco-editor') || document.querySelector('[class*="editor"]');
      return editor ? editor.textContent.trim() : '';
    });
    
    console.log(`Content after "a  b" pattern: "${content3}"`);
    
    // Analysis
    console.log('\n📊 Analysis:');
    
    if (content1.includes(' ')) {
      console.log('❌ FAIL: Space was inserted in normal mode (should trigger which-key instead)');
    } else {
      console.log('✅ PASS: Space in normal mode did not insert text (triggered which-key)');
    }
    
    if (content2.includes('Hello World Test')) {
      console.log('✅ PASS: Text with spaces was inserted in insert mode');
    } else {
      console.log('❌ FAIL: Text with spaces was not inserted properly in insert mode');
      console.log(`Expected: "Hello World Test", Got: "${content2}"`);
    }
    
    if (content3 === 'a  b') {
      console.log('✅ PASS: Individual spaces are being inserted correctly');
    } else {
      console.log('❌ FAIL: Individual spaces are not being inserted');
      console.log(`Expected: "a  b", Got: "${content3}"`);
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'space-test-result.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: space-test-result.png');
    
    // Final verdict
    const allTestsPassed = 
      !content1.includes(' ') && 
      content2.includes('Hello World Test') && 
      content3 === 'a  b';
    
    if (allTestsPassed) {
      console.log('\n🎉 ALL TESTS PASSED: Space insertion working correctly!');
    } else {
      console.log('\n❌ SOME TESTS FAILED: Space insertion needs more work');
    }
    
    return allTestsPassed;
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    return false;
  } finally {
    await browser.close();
  }
}

testSpaceInsertion().then(success => {
  process.exit(success ? 0 : 1);
});
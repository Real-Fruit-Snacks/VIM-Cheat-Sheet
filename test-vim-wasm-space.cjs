const puppeteer = require('puppeteer');

async function testVimWasmSpace() {
  console.log('🧪 Testing space insertion in vim.wasm mode (the actual mode being used)...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Load the application (will use vim.wasm by default)
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for app to load
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    console.log('✅ Application loaded');
    
    // Wait for VIM to be ready
    await page.waitForFunction(() => {
      const readyElements = Array.from(document.querySelectorAll('.text-green-400'));
      return readyElements.some(el => el.textContent.includes('VIM Ready'));
    }, { timeout: 10000 });
    
    console.log('✅ VIM is ready');
    
    // Test 1: Clear any existing content and test space in normal mode
    console.log('\\n🧪 Test 1: Space in normal mode (should trigger which-key)');
    
    // Focus on the vim area and ensure normal mode
    await page.click('div.w-full.h-full.relative'); // Click on vim container
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear any content by selecting all and deleting
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await page.keyboard.press('Delete');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Press space in normal mode (should trigger which-key)
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if which-key appeared
    const whichKeyVisible = await page.$('.fixed.inset-0, [class*="which-key"]');
    console.log('Which-key visible after space:', !!whichKeyVisible);
    
    // Press escape to close which-key
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 2: Enter insert mode and test space insertion
    console.log('\\n🧪 Test 2: Space in insert mode (should insert spaces)');
    
    // Enter insert mode
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Type text with spaces
    await page.keyboard.type('Hello World Test');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Exit insert mode
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check the content by copying it
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    await page.keyboard.down('Control');
    await page.keyboard.press('c');
    await page.keyboard.up('Control');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Get clipboard content
    const content = await page.evaluate(async () => {
      try {
        return await navigator.clipboard.readText();
      } catch (e) {
        return 'clipboard access failed';
      }
    });
    
    console.log(`Content after typing: "${content}"`);
    
    // Test 3: More specific space test
    console.log('\\n🧪 Test 3: Specific space pattern test');
    
    // Clear content
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await page.keyboard.press('Delete');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Enter insert mode and type specific pattern
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    await page.keyboard.type('a');
    await page.keyboard.press(' ');
    await page.keyboard.press(' ');
    await page.keyboard.type('b');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Exit insert mode and copy again
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    await page.keyboard.down('Control');
    await page.keyboard.press('c');
    await page.keyboard.up('Control');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const content2 = await page.evaluate(async () => {
      try {
        return await navigator.clipboard.readText();
      } catch (e) {
        return 'clipboard access failed';
      }
    });
    
    console.log(`Content after "a  b" pattern: "${content2}"`);
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'vim-wasm-space-test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: vim-wasm-space-test.png');
    
    // Analysis
    console.log('\\n📊 Analysis:');
    
    if (whichKeyVisible) {
      console.log('✅ PASS: Space in normal mode triggered which-key');
    } else {
      console.log('❌ FAIL: Space in normal mode did not trigger which-key');
    }
    
    if (content.includes('Hello World Test')) {
      console.log('✅ PASS: Text with spaces was inserted in insert mode');
    } else {
      console.log('❌ FAIL: Text with spaces was not inserted properly');
      console.log(`  Expected: "Hello World Test", Got: "${content}"`);
    }
    
    if (content2.trim() === 'a  b') {
      console.log('✅ PASS: Individual spaces are being inserted correctly');
    } else {
      console.log('❌ FAIL: Individual spaces are not being inserted correctly');
      console.log(`  Expected: "a  b", Got: "${content2}"`);
    }
    
    const allTestsPassed = whichKeyVisible && content.includes('Hello World Test') && content2.trim() === 'a  b';
    
    if (allTestsPassed) {
      console.log('\\n🎉 ALL TESTS PASSED: Space handling works correctly in vim.wasm mode!');
    } else {
      console.log('\\n❌ SOME TESTS FAILED: Space handling needs more work');
    }
    
    return allTestsPassed;
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    return false;
  } finally {
    await browser.close();
  }
}

testVimWasmSpace().then(success => {
  console.log(success ? '🎉 Space handling test passed!' : '💥 Space handling test failed!');
  process.exit(success ? 0 : 1);
});
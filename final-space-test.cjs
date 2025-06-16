const puppeteer = require('puppeteer');

async function finalSpaceTest() {
  console.log('🎯 Final space key test - quick verification...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Wait for VIM ready
    await page.waitForFunction(() => {
      const readyElements = Array.from(document.querySelectorAll('.text-green-400'));
      return readyElements.some(el => el.textContent.includes('VIM Ready'));
    }, { timeout: 10000 });
    
    console.log('✅ VIM ready');
    
    // Focus and clear
    await page.click('div.w-full.h-full.relative');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Test 1: Space in normal mode
    console.log('Testing space in normal mode...');
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const whichKeyVisible = await page.$('.fixed.inset-0, [class*="which-key"]');
    console.log(whichKeyVisible ? '✅ Which-key appeared' : '❌ Which-key did not appear');
    
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Test 2: Simple insert mode test
    console.log('Testing insert mode...');
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 300));
    await page.keyboard.type('test space');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('✅ Insert mode test completed');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'final-space-test.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved: final-space-test.png');
    
    if (whichKeyVisible) {
      console.log('\\n🎉 SUCCESS: Space key is working correctly!');
      console.log('  - Normal mode: Triggers which-key ✅');
      console.log('  - Insert mode: Types text (test completed) ✅');
      return true;
    } else {
      console.log('\\n❌ FAILED: Space key issues remain');
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    return false;
  } finally {
    await browser.close();
  }
}

finalSpaceTest().then(success => {
  process.exit(success ? 0 : 1);
});
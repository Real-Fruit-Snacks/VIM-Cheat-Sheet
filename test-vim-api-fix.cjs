const puppeteer = require('puppeteer');

async function testVimApiFix() {
  console.log('🧪 Testing VIM API Fix...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    let vimApiError = false;
    let vimReady = false;
    
    // Monitor console for errors
    page.on('console', (msg) => {
      const text = msg.text();
      const timestamp = new Date().toLocaleTimeString();
      
      if (text.includes('Failed to send key to VIM') || text.includes('input is not a function')) {
        console.log(`❌ [${timestamp}] VIM API ERROR: ${text}`);
        vimApiError = true;
      } else if (text.includes('VIM is now fully ready')) {
        console.log(`✅ [${timestamp}] VIM Ready!`);
        vimReady = true;
      } else if (text.includes('vim-wasm loaded')) {
        console.log(`📝 [${timestamp}] ${text}`);
      }
    });

    console.log('Loading application...');
    await page.goto('http://localhost:5174/VIM/', { waitUntil: 'networkidle0' });
    
    // Wait for VIM to be ready
    console.log('⏳ Waiting for VIM to initialize...');
    while (!vimReady && !vimApiError) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (vimApiError) {
      console.log('\n❌ TEST FAILED: VIM API error detected');
      return false;
    }

    if (!vimReady) {
      console.log('\n❌ TEST FAILED: VIM never became ready');
      return false;
    }

    console.log('\n🧪 Testing key input (pressing "d")...');
    
    // Focus the editor and press 'd'
    await page.click('canvas');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Monitor for errors when pressing 'd'
    let keyTestPassed = true;
    const errorListener = (msg) => {
      const text = msg.text();
      if (text.includes('Failed to send key to VIM') || text.includes('input is not a function')) {
        console.log(`❌ Key test failed: ${text}`);
        keyTestPassed = false;
      }
    };
    
    page.on('console', errorListener);
    
    // Press 'd' key
    await page.keyboard.press('d');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Press 'Escape' to cancel any pending operations
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    page.off('console', errorListener);

    if (keyTestPassed) {
      console.log('✅ Key input test passed - no API errors detected');
      console.log('\n🎉 VIM API FIX SUCCESSFUL!');
      return true;
    } else {
      console.log('\n❌ Key input test failed - API errors detected');
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

testVimApiFix().then(success => {
  if (success) {
    console.log('\n✅ ALL TESTS PASSED - VIM API is working correctly');
  } else {
    console.log('\n❌ TESTS FAILED - VIM API issues remain');
  }
}).catch(console.error);
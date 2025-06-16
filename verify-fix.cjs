const puppeteer = require('puppeteer');

async function verifyFix() {
  console.log('🔧 Verifying infinite loop fix with full test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Count different types of console messages
  let errorCount = 0;
  let infiniteLoopErrors = 0;
  
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    
    if (type === 'error') {
      errorCount++;
      if (text.includes('Maximum update depth')) {
        infiniteLoopErrors++;
        console.log(`❌ Infinite loop error: ${text}`);
      } else {
        console.log(`⚠️ Other error: ${text}`);
      }
    }
  });
  
  try {
    console.log('Loading application...');
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for app to load
    await page.waitForSelector('div.h-screen.bg-gray-950', { timeout: 15000 });
    console.log('✅ Application loaded successfully');
    
    // Test some basic interactions that previously triggered infinite loops
    console.log('Testing space key...');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Testing insert mode...');
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.keyboard.press(' ');
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Testing mode switching...');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.keyboard.press('v');
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Final wait to ensure no delayed infinite loops
    console.log('Final stability check...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`\n📊 Results:`);
    console.log(`   Total errors: ${errorCount}`);
    console.log(`   Infinite loop errors: ${infiniteLoopErrors}`);
    
    if (infiniteLoopErrors === 0) {
      console.log('✅ SUCCESS: No infinite loop errors detected!');
      if (errorCount === 0) {
        console.log('🎉 PERFECT: No errors at all!');
      } else {
        console.log('⚠️ Some other errors present but infinite loop is fixed');
      }
    } else {
      console.log('❌ FAILURE: Infinite loop errors still present');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    infiniteLoopErrors = -1; // Mark as failed
  } finally {
    await browser.close();
  }
  
  return infiniteLoopErrors === 0;
}

verifyFix().then(success => {
  process.exit(success ? 0 : 1);
});
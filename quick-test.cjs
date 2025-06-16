const puppeteer = require('puppeteer');

async function quickTest() {
  console.log('🔍 Quick test for infinite loop fix...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Listen for console errors
  let errorCount = 0;
  page.on('console', (msg) => {
    if (msg.type() === 'error' && msg.text().includes('Maximum update depth')) {
      errorCount++;
      console.log(`❌ Infinite loop error detected: ${msg.text()}`);
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
    
    // Wait additional time to see if infinite loop occurs
    console.log('Waiting 10 seconds to check for infinite loop errors...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    if (errorCount === 0) {
      console.log('✅ No infinite loop errors detected! Fix successful.');
    } else {
      console.log(`❌ Found ${errorCount} infinite loop errors. Fix needs more work.`);
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  return errorCount === 0;
}

quickTest().then(success => {
  process.exit(success ? 0 : 1);
});
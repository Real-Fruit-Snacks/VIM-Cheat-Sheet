const puppeteer = require('puppeteer');

async function simpleDebug() {
  console.log('🔍 Simple VIM Debug Test...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Monitor console
    page.on('console', (msg) => {
      const text = msg.text();
      const timestamp = new Date().toLocaleTimeString();
      
      if (text.includes('vim-wasm') || text.includes('Loading') || text.includes('Error')) {
        console.log(`[${timestamp}] ${text}`);
      }
    });

    console.log('Loading application...');
    await page.goto('http://localhost:5174/VIM/', { waitUntil: 'networkidle0' });
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check page state
    const state = await page.evaluate(() => {
      // Find loading indicators
      const allDivs = Array.from(document.querySelectorAll('div'));
      const loadingDiv = allDivs.find(div => div.textContent && div.textContent.includes('Loading'));
      
      return {
        hasCanvas: document.querySelectorAll('canvas').length,
        hasInput: document.querySelectorAll('input').length,
        isLoading: !!loadingDiv,
        loadingText: loadingDiv ? loadingDiv.textContent : null,
        vimWasmAvailable: !!window.VimWasm,
        hasError: !!document.querySelector('[class*="error"]')
      };
    });

    console.log('\n📊 Application State:');
    console.log(`   VIM WASM Available: ${state.vimWasmAvailable ? '✅' : '❌'}`);
    console.log(`   Canvas Elements: ${state.hasCanvas}`);
    console.log(`   Input Elements: ${state.hasInput}`);
    console.log(`   Still Loading: ${state.isLoading ? '❌' : '✅'}`);
    console.log(`   Loading Text: ${state.loadingText || 'None'}`);
    console.log(`   Has Error: ${state.hasError ? '❌' : '✅'}`);

    // Take screenshot
    await page.screenshot({ path: './test-screenshots/debug-state.png', fullPage: true });
    console.log('\n📸 Screenshot saved: ./test-screenshots/debug-state.png');

    // Wait longer and check again
    console.log('\n⏳ Waiting 10 more seconds...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    const finalState = await page.evaluate(() => {
      const allDivs = Array.from(document.querySelectorAll('div'));
      const loadingDiv = allDivs.find(div => div.textContent && div.textContent.includes('Loading'));
      
      return {
        hasCanvas: document.querySelectorAll('canvas').length,
        isLoading: !!loadingDiv,
        loadingText: loadingDiv ? loadingDiv.textContent : null
      };
    });

    console.log('\n🏁 Final State:');
    console.log(`   Canvas Elements: ${finalState.hasCanvas}`);
    console.log(`   Still Loading: ${finalState.isLoading ? '❌ STUCK' : '✅ SUCCESS'}`);
    console.log(`   Loading Text: ${finalState.loadingText || 'None'}`);

    if (finalState.isLoading) {
      console.log('\n❌ CRITICAL ISSUE: VIM is stuck in loading state!');
    } else {
      console.log('\n✅ VIM initialized successfully');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

simpleDebug().catch(console.error);
const puppeteer = require('puppeteer');

async function debugVimEditor() {
  console.log('🔍 VimEditor Initialization Debug...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    let vimStarting = false;
    let vimStarted = false;
    let vimTimedOut = false;
    let lastConsoleMessage = null;

    // Monitor ALL console messages
    page.on('console', (msg) => {
      const text = msg.text();
      const timestamp = new Date().toLocaleTimeString();
      lastConsoleMessage = text;
      
      console.log(`[${timestamp}] ${text}`);
      
      // Track VIM initialization stages
      if (text.includes('[VimEditor] Starting vim.wasm')) {
        vimStarting = true;
        console.log('🎯 VIM START DETECTED');
      }
      
      if (text.includes('[VimEditor] vim.wasm started successfully')) {
        vimStarted = true;
        console.log('✅ VIM START SUCCESS');
      }
      
      if (text.includes('vim.start() timeout')) {
        vimTimedOut = true;
        console.log('⏰ VIM START TIMEOUT');
      }
    });

    // Monitor errors  
    page.on('pageerror', error => {
      console.log(`❌ PAGE ERROR: ${error.message}`);
    });

    console.log('Loading application...');
    await page.goto('http://localhost:5174/VIM/', { waitUntil: 'networkidle0' });
    
    console.log('⏳ Monitoring VIM initialization for 15 seconds...\n');
    
    // Monitor for 15 seconds
    for (let i = 0; i < 15; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (vimStarting && !vimStarted && !vimTimedOut) {
        console.log(`[${i+1}s] ⏳ VIM starting... (waiting for completion)`);
      } else if (vimStarted) {
        console.log(`[${i+1}s] ✅ VIM started successfully!`);
        break;
      } else if (vimTimedOut) {
        console.log(`[${i+1}s] ⏰ VIM start timed out`);
        break;
      } else if (!vimStarting) {
        console.log(`[${i+1}s] 🔍 Waiting for VIM initialization to begin...`);
      }
    }

    // Final assessment
    console.log('\n🏁 Final Assessment:');
    console.log(`   VIM Start Attempted: ${vimStarting ? '✅' : '❌'}`);
    console.log(`   VIM Start Completed: ${vimStarted ? '✅' : '❌'}`);
    console.log(`   VIM Start Timed Out: ${vimTimedOut ? '❌' : '✅'}`);
    console.log(`   Last Console Message: ${lastConsoleMessage || 'None'}`);

    // Check page elements
    const elements = await page.evaluate(() => {
      return {
        canvasCount: document.querySelectorAll('canvas').length,
        inputCount: document.querySelectorAll('input').length,
        hasVimContainer: !!document.querySelector('[ref="containerRef"]'),
        loadingText: (() => {
          const allDivs = Array.from(document.querySelectorAll('div'));
          const loadingDiv = allDivs.find(div => div.textContent && div.textContent.includes('Loading'));
          return loadingDiv ? loadingDiv.textContent : null;
        })()
      };
    });

    console.log('\n📊 DOM Elements:');
    console.log(`   Canvas Elements: ${elements.canvasCount}`);
    console.log(`   Input Elements: ${elements.inputCount}`);
    console.log(`   VIM Container: ${elements.hasVimContainer ? '✅' : '❌'}`);
    console.log(`   Loading Text: ${elements.loadingText || 'None'}`);

    if (!vimStarting) {
      console.log('\n❌ ISSUE: VIM initialization never started. Check VimEditor component loading.');
    } else if (vimStarting && !vimStarted && !vimTimedOut) {
      console.log('\n❌ ISSUE: VIM is hanging during start() call. This indicates a vim.wasm internal issue.');
    } else if (vimTimedOut) {
      console.log('\n❌ ISSUE: VIM start() call timed out after 10 seconds.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugVimEditor().catch(console.error);
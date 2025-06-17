const puppeteer = require('puppeteer');

async function debugSpaceChars() {
  console.log('🔍 Debugging space characters...');
  
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
    await page.goto('http://localhost:5175/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await page.waitForSelector('.monaco-editor', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Enter insert mode and type
    await page.click('.monaco-editor');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 300));
    await page.keyboard.type('ggdG');
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.keyboard.press('i');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Type with spaces
    await page.keyboard.type('a b');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get content and analyze
    const analysis = await page.evaluate(() => {
      const viewLines = document.querySelectorAll('.view-line');
      const text = viewLines[0]?.textContent || '';
      
      // Convert to char codes
      const charCodes = [];
      for (let i = 0; i < text.length; i++) {
        charCodes.push({
          char: text[i],
          code: text.charCodeAt(i),
          hex: text.charCodeAt(i).toString(16)
        });
      }
      
      return {
        text: text,
        length: text.length,
        charCodes: charCodes,
        includesSpace: text.includes(' '),
        includesNbsp: text.includes('\\u00A0'),
        spaceCode: ' '.charCodeAt(0),
        nbspCode: '\\u00A0'.charCodeAt(0)
      };
    });
    
    console.log('Analysis:', JSON.stringify(analysis, null, 2));
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

debugSpaceChars();
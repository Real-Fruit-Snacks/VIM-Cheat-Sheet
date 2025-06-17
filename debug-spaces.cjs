const puppeteer = require('puppeteer');

async function debugSpaces() {
  console.log('🔍 Debugging space characters in Monaco...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  await page.evaluateOnNewDocument(() => {
    delete window.SharedArrayBuffer;
  });
  
  try {
    await page.goto('http://localhost:5174/VIM/', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await page.waitForSelector('.monaco-editor', { timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    await page.click('.monaco-editor');
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await page.keyboard.press('o');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Type one character at a time
    console.log('Typing characters one by one...');
    await page.keyboard.type('a');
    await new Promise(resolve => setTimeout(resolve, 200));
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 200));
    await page.keyboard.type('b');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get detailed character analysis
    const analysis = await page.evaluate(() => {
      const viewLines = document.querySelectorAll('.monaco-editor .view-line');
      let result = { lines: [] };
      
      viewLines.forEach((line, index) => {
        const text = line.textContent;
        const chars = [];
        
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          chars.push({
            char: char,
            code: char.charCodeAt(0),
            hex: char.charCodeAt(0).toString(16),
            isSpace: char === ' ',
            isNBSP: char.charCodeAt(0) === 160
          });
        }
        
        result.lines.push({
          index: index,
          raw: text,
          length: text.length,
          characters: chars
        });
      });
      
      // Also get Monaco model value
      if (window.monaco && window.monaco.editor) {
        const models = window.monaco.editor.getModels();
        if (models.length > 0) {
          result.modelValue = models[0].getValue();
        }
      }
      
      return result;
    });
    
    console.log('\\nCharacter analysis:');
    analysis.lines.forEach(line => {
      if (line.raw.includes('a') || line.raw.includes('b')) {
        console.log(`\\nLine ${line.index}: "${line.raw}"`);
        console.log('Characters:');
        line.characters.forEach((char, i) => {
          if (char.code === 32 || char.code === 160) {
            console.log(`  [${i}] SPACE - code: ${char.code} (${char.code === 32 ? 'normal space' : 'non-breaking space'})`);
          } else if (char.char.trim()) {
            console.log(`  [${i}] "${char.char}" - code: ${char.code}`);
          }
        });
      }
    });
    
    console.log('\\nModel value:', analysis.modelValue);
    
    // Check what type of spaces we have
    const hasNormalSpaces = analysis.lines.some(line => 
      line.characters.some(char => char.code === 32)
    );
    const hasNBSP = analysis.lines.some(line => 
      line.characters.some(char => char.code === 160)
    );
    
    console.log(`\\n✅ Has normal spaces (code 32): ${hasNormalSpaces}`);
    console.log(`✅ Has non-breaking spaces (code 160): ${hasNBSP}`);
    
    if (hasNBSP && !hasNormalSpaces) {
      console.log('\\n⚠️  ISSUE FOUND: Monaco is using non-breaking spaces (\\u00A0) instead of normal spaces!');
      console.log('This is why string matching fails - the visual space is actually character code 160, not 32.');
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

debugSpaces();
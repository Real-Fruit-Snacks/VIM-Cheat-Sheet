const puppeteer = require('puppeteer');

async function simpleWhichKeyTest() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/VIM/', { waitUntil: 'networkidle0' });

    console.log('🔍 Simple Which-Key test...');

    // Wait for app to load
    await page.waitForSelector('body');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Take screenshot before
    await page.screenshot({ path: 'test-screenshots/before-key-press.png' });

    // Press 'd' key
    console.log('Pressing "d" key...');
    await page.keyboard.press('d');
    await new Promise(resolve => setTimeout(resolve, 200));

    // Take screenshot after
    await page.screenshot({ path: 'test-screenshots/after-d-key.png' });

    // Check for any visible popup
    const popupExists = await page.evaluate(() => {
      // Look for any div with 'Which Key' text
      const elements = Array.from(document.querySelectorAll('*'));
      const whichKeyElement = elements.find(el => 
        el.textContent && el.textContent.includes('Which Key')
      );
      
      if (whichKeyElement) {
        console.log('Found Which Key element:', whichKeyElement);
        return {
          found: true,
          text: whichKeyElement.textContent,
          visible: whichKeyElement.offsetHeight > 0 && whichKeyElement.offsetWidth > 0,
          style: window.getComputedStyle(whichKeyElement).display
        };
      }
      
      return { found: false };
    });

    console.log('Which Key detection result:', popupExists);

    // Test space key
    await page.keyboard.press('Escape');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Pressing space key...');
    await page.keyboard.press(' ');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    await page.screenshot({ path: 'test-screenshots/after-space-key.png' });

    const spacePopupExists = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const whichKeyElement = elements.find(el => 
        el.textContent && el.textContent.includes('Which Key')
      );
      
      if (whichKeyElement) {
        return {
          found: true,
          text: whichKeyElement.textContent,
          visible: whichKeyElement.offsetHeight > 0 && whichKeyElement.offsetWidth > 0
        };
      }
      
      return { found: false };
    });

    console.log('Space key Which Key result:', spacePopupExists);

    // Wait to see the result
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

simpleWhichKeyTest().catch(console.error);
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to 180x180 for Apple Touch Icon
  await page.setViewportSize({ width: 180, height: 180 });
  
  // Navigate to the local SVG rendered in HTML
  await page.goto('http://localhost:5173/icon-render.html');
  
  // Wait a bit for render
  await page.waitForTimeout(500);
  
  // Take screenshot
  await page.screenshot({ path: path.join(__dirname, 'public', 'apple-touch-icon.png') });
  
  await browser.close();
  console.log('Successfully generated apple-touch-icon.png');
})();

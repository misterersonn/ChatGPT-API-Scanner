/* Capture de sheet.html (planche de référence) en PNG. */
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2] || path.join(__dirname, 'style_reference.png');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1560, height: 1980 } });
  await page.goto('file://' + path.join(__dirname, 'sheet.html'));
  await page.waitForTimeout(400);
  await page.locator('#c').screenshot({ path: out });
  await browser.close();
  console.log('-> ' + out);
})();

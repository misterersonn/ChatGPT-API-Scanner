const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1520, height: 1180 } });
  await p.goto('file://' + path.join(__dirname, 'robin.html'));
  await p.waitForTimeout(400);
  await p.locator('#c').screenshot({ path: path.join(__dirname, 'robin_pistes.png') });
  await b.close(); console.log('ok');
})();

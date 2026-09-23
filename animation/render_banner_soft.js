const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const guides = process.argv[2] === '--guides';
  const out = guides ? 'banniere_douce_reperes.png' : 'banniere_douce.png';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2560, height: 1440 } });
  p.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await p.goto('file://' + path.join(__dirname, 'banner_soft.html') + (guides ? '?guides' : ''));
  await p.waitForTimeout(500);
  await p.locator('#c').screenshot({ path: path.join(__dirname, out) });
  await b.close(); console.log('-> ' + out);
})();

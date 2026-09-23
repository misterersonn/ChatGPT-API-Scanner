const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const outDir = process.argv[2] || path.join(__dirname, 'out', 'short_soft');
  const frameDir = path.join(outDir, 'frames');
  fs.mkdirSync(frameDir, { recursive: true });
  const b = await chromium.launch({ args:['--force-device-scale-factor=1','--hide-scrollbars'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await p.goto('file://' + path.join(__dirname, 'short_soft.html'));
  await p.evaluate(() => window.stopPlayback());
  await p.addStyleTag({ content: 'canvas{width:1080px !important;height:1920px !important}' });
  const total = await p.evaluate(() => window.TOTAL_FRAMES);
  const cv = p.locator('#c');
  for (let i=0;i<total;i++){
    await p.evaluate(f => window.drawFrame(f), i);
    await cv.screenshot({ path: path.join(frameDir, String(i).padStart(4,'0') + '.png') });
    if (i % 60 === 0) process.stdout.write(`frame ${i}/${total}\n`);
  }
  await b.close(); console.log('frames -> ' + frameDir);
})();

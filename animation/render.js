/* Capture deterministe de scene.html image par image via Chromium,
   puis encodage en MP4 vertical avec ffmpeg.
   Usage : node render.js [dossier_de_sortie] */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = process.argv[2] || path.join(__dirname, 'out');
  const frameDir = path.join(outDir, 'frames');
  fs.mkdirSync(frameDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--force-device-scale-factor=1', '--hide-scrollbars']
  });
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
  await page.goto('file://' + path.join(__dirname, 'scene.html'));
  await page.evaluate(() => window.stopPlayback());

  const total = await page.evaluate(() => window.TOTAL_FRAMES);
  const canvas = page.locator('#c');
  // le canvas est affiche en 360x640 par CSS : on capture la resolution native
  await page.addStyleTag({ content: 'canvas{width:720px !important;height:1280px !important}' });

  for (let i = 0; i < total; i++) {
    await page.evaluate(f => window.drawFrame(f), i);
    await canvas.screenshot({
      path: path.join(frameDir, String(i).padStart(4, '0') + '.png')
    });
    if (i % 25 === 0) process.stdout.write(`frame ${i}/${total}\n`);
  }

  await browser.close();
  console.log('frames -> ' + frameDir);
})();

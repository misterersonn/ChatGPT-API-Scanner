/* ===================================================================
   Moteur "doux" — seconde direction graphique de la chaine.
   A l'oppose de engine.js : degrades verticaux, formes arrondies,
   contours fins et sombres plutot que noir epais, ombres portees molles.
   Releves faits sur l'animation de reference fournie :
     - ciel en degrade vertical (#b3d2fd -> #c7d2ef)
     - ~27 600 couleurs distinctes (contre ~6 500 en aplat)
     - pas de contour noir epais sur les personnages
   Aucune variable globale partagee avec engine.js.
   =================================================================== */

const SOFT = {
  skyTop:'#b3d2fd', skyBot:'#d7dcf2',
  hillFar:'#a5d497', hillMid:'#8dca76', hillNear:'#78cc77',
  grassTop:'#7cc06a', grassBot:'#5fa855', grassTuft:'#66b45f',
  fence:'#fdedd4', fenceShade:'#f0dcbb', fenceLine:'#d9c3a0',
  ink:'#2a2a33', inkSoft:'#4a4a56',
  cloud:'#ffffff',
  robinTop:'#ef7a63', robinTopDark:'#d85f49',
  robinSkin:'#f6d9bd', robinSkinDark:'#e7c0a0',
  hair:'#6b4a32', hairDark:'#553824',
  blush:'#f2a08e',
  bubble:'#ffffff',
  warmTop:'#ffe3bd', warmBot:'#ffd0a0'
};

function sGrad(ctx, x0,y0,x1,y1, c0,c1){
  const g = ctx.createLinearGradient(x0,y0,x1,y1);
  g.addColorStop(0,c0); g.addColorStop(1,c1); return g;
}
function sRound(ctx, x,y,w,h,r){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); }
function sShadow(ctx, cx,cy,rx,ry,a){
  ctx.save(); ctx.globalAlpha = a===undefined?0.13:a;
  ctx.fillStyle='#2a2a33';
  ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

/* --- Ciel, collines, herbe --- */
function softSky(ctx, w, h, horizon){
  ctx.fillStyle = sGrad(ctx,0,0,0,horizon, SOFT.skyTop, SOFT.skyBot);
  ctx.fillRect(0,0,w,horizon);
}
function softCloud(ctx, cx, cy, s){
  ctx.save(); ctx.fillStyle=SOFT.cloud;
  ctx.beginPath();
  ctx.ellipse(cx,        cy,        62*s, 34*s, 0,0,Math.PI*2);
  ctx.ellipse(cx-52*s,   cy+10*s,   40*s, 24*s, 0,0,Math.PI*2);
  ctx.ellipse(cx+50*s,   cy+12*s,   44*s, 26*s, 0,0,Math.PI*2);
  ctx.ellipse(cx+8*s,    cy-22*s,   40*s, 26*s, 0,0,Math.PI*2);
  ctx.fill(); ctx.restore();
}
function softHills(ctx, w, horizon){
  const lay=[[SOFT.hillFar,0.0,150],[SOFT.hillMid,0.35,110],[SOFT.hillNear,0.7,80]];
  lay.forEach(([col,off,amp],i)=>{
    ctx.fillStyle=col; ctx.beginPath();
    ctx.moveTo(-50, horizon+20);
    for(let x=-50;x<=w+50;x+=40){
      const y = horizon - amp*Math.abs(Math.sin((x/w)*Math.PI*1.6 + off*3 + i)) + i*26;
      ctx.lineTo(x,y);
    }
    ctx.lineTo(w+50, horizon+20); ctx.closePath(); ctx.fill();
  });
}
function softGrass(ctx, w, h, horizon, seed){
  ctx.fillStyle = sGrad(ctx,0,horizon,0,h, SOFT.grassTop, SOFT.grassBot);
  ctx.fillRect(0,horizon,w,h-horizon);
  let s = seed||7;
  const rnd = ()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
  ctx.strokeStyle=SOFT.grassTuft; ctx.lineWidth=3; ctx.lineCap='round';
  for(let i=0;i<260;i++){
    const x=rnd()*w, y=horizon+20+rnd()*(h-horizon-20), k=6+rnd()*6;
    ctx.beginPath();
    ctx.moveTo(x-k,y-k); ctx.lineTo(x,y); ctx.lineTo(x+k,y-k); ctx.stroke();
  }
}
function softFence(ctx, w, y, ph){
  const pw=36, gap=26;
  ctx.fillStyle=SOFT.fenceShade;                       // barres d'abord, donc dessous
  ctx.fillRect(-20, y+ph*0.28, w+60, 14);
  ctx.fillRect(-20, y+ph*0.66, w+60, 14);
  for(let x=-20;x<w+40;x+=pw+gap){
    ctx.fillStyle = sGrad(ctx,x,y,x+pw,y, SOFT.fence, SOFT.fenceShade);
    ctx.beginPath();
    ctx.moveTo(x, y+ph); ctx.lineTo(x, y+16);
    ctx.quadraticCurveTo(x+pw/2, y-12, x+pw, y+16);
    ctx.lineTo(x+pw, y+ph); ctx.closePath(); ctx.fill();
    ctx.strokeStyle=SOFT.fenceLine; ctx.lineWidth=2.5; ctx.stroke();
  }
}

/* --- Bulle de dialogue : blanc, contour sombre fin, ombre dure decalee --- */
function softBubble(ctx, cx, cy, text, size, maxW){
  ctx.save();
  ctx.font = '700 '+size+'px "DejaVu Sans", sans-serif';
  const words = text.split(' ');
  const lines=[]; let cur='';
  for(const wd of words){
    const t = cur? cur+' '+wd : wd;
    if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur=wd; } else cur=t;
  }
  if(cur) lines.push(cur);
  const lh = size*1.25;
  const bw = Math.max(...lines.map(l=>ctx.measureText(l).width)) + size*1.5;
  const bh = lines.length*lh + size*0.9;
  const x = cx-bw/2, y = cy-bh/2, r = bh*0.30;
  ctx.fillStyle='rgba(42,42,51,0.92)';
  sRound(ctx, x+7, y+9, bw, bh, r); ctx.fill();          // ombre dure decalee
  ctx.fillStyle=SOFT.bubble; sRound(ctx, x, y, bw, bh, r); ctx.fill();
  ctx.strokeStyle=SOFT.ink; ctx.lineWidth=Math.max(4,size*0.10); ctx.lineJoin='round'; ctx.stroke();
  ctx.fillStyle=SOFT.ink; ctx.textAlign='center'; ctx.textBaseline='middle';
  lines.forEach((l,i)=> ctx.fillText(l, cx, y+size*0.45+lh*(i+0.5)));
  ctx.restore();
  return {x,y,w:bw,h:bh};
}

/* --- Robin, version douce : meme personnage, autre traitement --- */
function softRobin(ctx, cx, baseY, s, opt){
  opt = opt || {};
  const emo = opt.emo || 'flat';
  ctx.save(); ctx.translate(cx, baseY); ctx.scale(s, s);

  sShadow(ctx, 0, 6, 122, 22, 0.15);

  // corps : forme molle, degrade vertical
  ctx.fillStyle = sGrad(ctx,0,-250,0,0, SOFT.robinTop, SOFT.robinTopDark);
  ctx.beginPath();
  ctx.moveTo(-96, 0);
  ctx.quadraticCurveTo(-116,-150, -76,-212);
  ctx.quadraticCurveTo(0,-268, 76,-212);
  ctx.quadraticCurveTo(116,-150, 96, 0);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle='rgba(42,42,51,0.22)'; ctx.lineWidth=3; ctx.stroke();

  // bras fins
  ctx.strokeStyle=SOFT.robinTopDark; ctx.lineWidth=15; ctx.lineCap='round';
  const armL = opt.armUp ? -1 : 1;
  ctx.beginPath(); ctx.moveTo(-88,-120); ctx.quadraticCurveTo(-140,-96, -150,-150*(armL>0?0.35:1.15)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo( 88,-120); ctx.quadraticCurveTo( 140,-96,  150,-150*(armL>0?0.35:1.15)); ctx.stroke();

  // tete : pas de cou, elle prolonge le corps
  const hy = -300;
  ctx.fillStyle = sGrad(ctx,0,hy-118,0,hy+110, SOFT.robinSkin, SOFT.robinSkinDark);
  ctx.beginPath(); ctx.ellipse(0, hy, 118, 112, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(42,42,51,0.20)'; ctx.lineWidth=3; ctx.stroke();

  // cheveux : calotte souple avec une raie
  ctx.fillStyle = sGrad(ctx,0,hy-118,0,hy-10, SOFT.hair, SOFT.hairDark);
  ctx.beginPath();
  ctx.moveTo(-116, hy-24);
  ctx.quadraticCurveTo(-112, hy-124, 0, hy-118);
  ctx.quadraticCurveTo(114, hy-120, 116, hy-20);
  ctx.quadraticCurveTo(58, hy-60, 10, hy-42);
  ctx.quadraticCurveTo(-46, hy-26, -116, hy-24);
  ctx.closePath(); ctx.fill();

  // yeux : grands, blancs, pupille + reflet
  const ew = emo==='shock' ? 38 : 30;
  const eh = emo==='shock' ? 42 : 34;
  [-48, 48].forEach(dx=>{
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.ellipse(dx, hy+16, ew, eh, 0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(42,42,51,0.18)'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.fillStyle=SOFT.ink;
    const px = dx + (opt.look||0)*7;
    ctx.beginPath(); ctx.ellipse(px, hy+20, ew*0.42, eh*0.44, 0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.ellipse(px-ew*0.16, hy+20-eh*0.20, ew*0.15, eh*0.16, 0,0,Math.PI*2); ctx.fill();
  });

  // sourcils
  ctx.strokeStyle=SOFT.hairDark; ctx.lineWidth=9; ctx.lineCap='round';
  if (emo==='shock'){
    ctx.beginPath(); ctx.moveTo(-74, hy-36); ctx.quadraticCurveTo(-48, hy-48, -22, hy-38); ctx.stroke();
    ctx.beginPath(); ctx.moveTo( 22, hy-38); ctx.quadraticCurveTo( 48, hy-48,  74, hy-36); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(-72, hy-28); ctx.quadraticCurveTo(-48, hy-36, -24, hy-28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo( 24, hy-28); ctx.quadraticCurveTo( 48, hy-36,  72, hy-28); ctx.stroke();
  }

  // joues
  ctx.save(); ctx.globalAlpha=0.55; ctx.fillStyle=SOFT.blush;
  ctx.beginPath(); ctx.ellipse(-84, hy+58, 22, 13, 0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse( 84, hy+58, 22, 13, 0,0,Math.PI*2); ctx.fill();
  ctx.restore();

  // bouche
  ctx.fillStyle=SOFT.ink;
  if (emo==='shock'){
    ctx.beginPath(); ctx.ellipse(0, hy+70, 20, 26, 0,0,Math.PI*2); ctx.fill();
  } else if (emo==='happy'){
    ctx.strokeStyle=SOFT.ink; ctx.lineWidth=8; ctx.lineCap='round';
    ctx.beginPath(); ctx.arc(0, hy+52, 30, 0.2*Math.PI, 0.8*Math.PI); ctx.stroke();
  } else {
    ctx.strokeStyle=SOFT.ink; ctx.lineWidth=8; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-18, hy+68); ctx.lineTo(18, hy+68); ctx.stroke();
  }
  ctx.restore();
}

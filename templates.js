// ============================================================
// TEMPLATES.JS — this is the ONLY file you need to touch to add,
// remove, or tweak a sticker design. The rest of the app (photo
// upload, Strava connection, screens) never changes.
//
// TO ADD A NEW TEMPLATE:
//   1. Copy one of the draw functions below and rename it.
//   2. Change what it draws — use roundRect(ctx,x,y,w,h,r) for any
//      rounded card backing, it's defined at the bottom of this file.
//   3. Add one line to the TEMPLATES array below:
//        { id:'mytemplate', name:'My template', draw: drawMyTemplate }
//   4. Save, refresh — it shows up in the picker automatically,
//      including its own live thumbnail. No other file changes needed.
//
// WHAT YOUR draw FUNCTION RECEIVES:
//   draw(ctx, w, h, s)
//     ctx — canvas 2D context, already has the photo drawn on it.
//     w,h — canvas size in pixels (thumbnail vs full preview).
//     s   — scale factor (w / 1080). Multiply every size, font size,
//           and position by s so it scales correctly at any resolution.
//   Read stats from the global `activity` object:
//     activity.title, .distance, .distanceUnit, .pace, .paceUnit,
//     .time, .elev, .elevUnit, .route (array of [x,y] points)
// ============================================================

const TEMPLATES = [
  { id:'classic', name:'Classic', draw: drawClassic },
  { id:'grid', name:'Grid', draw: drawGrid },
  { id:'minimal', name:'Minimal', draw: drawMinimal },
  { id:'route', name:'Route', draw: drawRoute },
];

function roundRect(ctx, x, y, w, h, r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y, x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x, y+h, rr);
  ctx.arcTo(x, y+h, x, y, rr);
  ctx.arcTo(x, y, x+w, y, rr);
  ctx.closePath();
}

function pill(ctx, x, y, text, s, accent){
  ctx.font = `700 ${20*s}px -apple-system, sans-serif`;
  const tw = ctx.measureText(text).width;
  const padX = 14*s, h = 34*s;
  roundRect(ctx, x, y, tw+padX*2, h, h/2);
  ctx.fillStyle = accent ? '#FC4C02' : 'rgba(255,255,255,0.14)';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x+padX, y+h/2+1);
  ctx.textBaseline = 'alphabetic';
  return tw+padX*2;
}

function drawClassic(ctx, w, h, s){
  const pad = 32*s;
  const cardH = 340*s;
  const cardY = h - cardH - pad;

  ctx.save();
  roundRect(ctx, pad, cardY, w-pad*2, cardH, 26*s);
  ctx.clip();
  ctx.fillStyle = 'rgba(10,10,10,0.6)';
  ctx.fillRect(pad, cardY, w-pad*2, cardH);
  ctx.restore();

  const innerX = pad + 30*s;
  let y = cardY + 46*s;
  pill(ctx, innerX, y, activity.title, s, true);

  y += 92*s;
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `600 ${20*s}px -apple-system, sans-serif`;
  ctx.fillText('Distance', innerX, y);

  y += 12*s;
  ctx.fillStyle = '#fff';
  ctx.font = `700 ${76*s}px -apple-system, sans-serif`;
  ctx.fillText(activity.distance, innerX, y+70*s);
  const numW = ctx.measureText(activity.distance).width;
  ctx.font = `600 ${26*s}px -apple-system, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText(activity.distanceUnit, innerX+numW+10*s, y+70*s);

  y = cardY + cardH - 44*s;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `600 ${23*s}px -apple-system, sans-serif`;
  ctx.fillText(`${activity.pace} ${activity.paceUnit}`, innerX, y);
  const t1 = ctx.measureText(`${activity.pace} ${activity.paceUnit}`).width;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('/', innerX+t1+16*s, y);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(activity.time, innerX+t1+34*s, y);
  const t2 = ctx.measureText(activity.time).width;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('/', innerX+t1+t2+50*s, y);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(`${activity.elev} ${activity.elevUnit}`, innerX+t1+t2+68*s, y);
}

function drawGrid(ctx, w, h, s){
  const pad = 32*s;
  const cardH = 380*s;
  const cardY = h - cardH - pad;

  ctx.save();
  roundRect(ctx, pad, cardY, w-pad*2, cardH, 26*s);
  ctx.clip();
  ctx.fillStyle = 'rgba(10,10,10,0.6)';
  ctx.fillRect(pad, cardY, w-pad*2, cardH);
  ctx.restore();

  const innerPad = 40*s;
  const stats = [
    ['Distance', activity.distance+' '+activity.distanceUnit],
    ['Pace', activity.pace+' '+activity.paceUnit],
    ['Time', activity.time],
    ['Elevation', activity.elev+' '+activity.elevUnit],
  ];
  const colW = (w-pad*2-innerPad*2)/2, rowH = cardH/2;

  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1*s;
  ctx.beginPath();
  ctx.moveTo(pad+innerPad+colW, cardY+30*s); ctx.lineTo(pad+innerPad+colW, cardY+cardH-30*s);
  ctx.moveTo(pad+innerPad, cardY+rowH); ctx.lineTo(w-pad-innerPad, cardY+rowH);
  ctx.stroke();

  stats.forEach((st,i)=>{
    const col = i%2, row = Math.floor(i/2);
    const x = pad+innerPad + col*colW, y = cardY + 78*s + row*rowH;
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = `600 ${19*s}px -apple-system, sans-serif`;
    ctx.fillText(st[0], x, y);
    ctx.fillStyle = '#fff';
    ctx.font = `700 ${46*s}px -apple-system, sans-serif`;
    ctx.fillText(st[1], x, y+50*s);
  });
}

function drawMinimal(ctx, w, h, s){
  const pad = 52*s;
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 20*s; ctx.shadowOffsetY = 4*s;

  ctx.fillStyle = '#fff';
  ctx.font = `700 ${124*s}px -apple-system, sans-serif`;
  ctx.fillText(activity.distance, pad, h-210*s);
  const numW = ctx.measureText(activity.distance).width;
  ctx.font = `600 ${34*s}px -apple-system, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText(activity.distanceUnit, pad+numW+12*s, h-210*s);

  ctx.shadowBlur = 10*s;
  pill(ctx, pad, h-164*s, activity.time, s, false);
}

function drawRoute(ctx, w, h, s){
  const pad = 32*s;
  const pts = activity.route;
  const boxH = 320*s;
  const cardY = h - boxH - pad;

  ctx.save();
  roundRect(ctx, pad, cardY, w-pad*2, boxH, 26*s);
  ctx.clip();
  ctx.fillStyle = 'rgba(10,10,10,0.6)';
  ctx.fillRect(pad, cardY, w-pad*2, boxH);
  ctx.restore();

  const innerPad = 46*s;
  const xs = pts.map(p=>p[0]), ys = pts.map(p=>p[1]);
  const rw = Math.max(...xs)-Math.min(...xs) || 1, rh = Math.max(...ys)-Math.min(...ys) || 1;
  const drawW = w-pad*2-innerPad*2, drawH = 160*s;
  const k = Math.min(drawW/rw, drawH/rh);
  const originX = pad+innerPad, originY = cardY+56*s;

  const coords = pts.map(p => [
    originX + (p[0]-Math.min(...xs))*k,
    originY + (p[1]-Math.min(...ys))*k,
  ]);

  ctx.strokeStyle = '#FC4C02'; ctx.lineWidth = 5*s; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath();
  coords.forEach((c,i)=>{ if(i===0) ctx.moveTo(c[0],c[1]); else ctx.lineTo(c[0],c[1]); });
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(coords[0][0], coords[0][1], 6*s, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#FC4C02';
  ctx.beginPath(); ctx.arc(coords[coords.length-1][0], coords[coords.length-1][1], 6*s, 0, Math.PI*2); ctx.fill();

  const y = cardY + boxH - 50*s;
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `600 ${19*s}px -apple-system, sans-serif`;
  ctx.fillText('Route', pad+innerPad, y);
  ctx.fillStyle = '#fff';
  ctx.font = `700 ${30*s}px -apple-system, sans-serif`;
  ctx.fillText(activity.distance+' '+activity.distanceUnit+'  ·  '+activity.time, pad+innerPad, y+38*s);
}

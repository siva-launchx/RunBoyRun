// ============================================================
// TEMPLATES.JS — this is the ONLY file you need to touch to add,
// remove, or tweak a sticker design. The rest of the app (photo
// upload, Strava connection, screens) never changes.
//
// TO ADD A NEW TEMPLATE:
//   1. Copy one of the draw functions below (e.g. drawMinimal) and
//      rename it, e.g. drawMyTemplate.
//   2. Change what it draws.
//   3. Add one line to the TEMPLATES array below:
//        { id:'mytemplate', name:'My template', draw: drawMyTemplate }
//   4. Save, refresh — it shows up in the picker automatically,
//      including its own live thumbnail. No other file changes needed.
//
// WHAT YOUR draw FUNCTION RECEIVES:
//   draw(ctx, w, h, s)
//     ctx — canvas 2D context, already has the photo drawn on it.
//           Just draw your stat text/shapes on top.
//     w,h — canvas size in pixels (changes between the small
//           thumbnail and the full-size preview).
//     s   — scale factor (w / 1080). Multiply every size, font
//           size, and position by s so your design scales correctly
//           at any resolution. e.g. `44 * s` not `44`.
//   Read the activity's stats from the global `activity` object:
//     activity.title                 e.g. "Morning run"
//     activity.distance / .distanceUnit    e.g. "10.2" / "km"
//     activity.pace / .paceUnit            e.g. "5:07" / "/km"
//     activity.time                        e.g. "52:11"
//     activity.elev / .elevUnit            e.g. "140" / "m"
//     activity.route                       array of [x,y] points
// ============================================================

const TEMPLATES = [
  { id:'classic', name:'Classic', draw: drawClassic },
  { id:'grid', name:'Grid', draw: drawGrid },
  { id:'minimal', name:'Minimal', draw: drawMinimal },
  { id:'route', name:'Route', draw: drawRoute },
  // Add new templates here, e.g.:
  // { id:'yourid', name:'Your name', draw: drawYourTemplate },
];

function drawClassic(ctx, w, h, s){
  const grad = ctx.createLinearGradient(0, h*0.6, 0, h);
  grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(0,0,0,0.62)');
  ctx.fillStyle = grad; ctx.fillRect(0, h*0.6, w, h*0.4);
  const pad = 44*s;
  ctx.fillStyle = '#fff';
  ctx.font = `700 ${28*s}px -apple-system, sans-serif`;
  ctx.fillText(activity.title, pad, h-190*s);
  ctx.font = `800 ${86*s}px -apple-system, sans-serif`;
  ctx.fillText(activity.distance+' '+activity.distanceUnit, pad, h-110*s);
  ctx.font = `600 ${26*s}px -apple-system, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(`${activity.pace} ${activity.paceUnit}   ·   ${activity.time}   ·   ${activity.elev} ${activity.elevUnit}`, pad, h-56*s);
}

function drawGrid(ctx, w, h, s){
  const boxH = 420*s, y0 = h-boxH-40*s;
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, y0, w, boxH);
  const stats = [
    ['Distance', activity.distance+' '+activity.distanceUnit],
    ['Pace', activity.pace+' '+activity.paceUnit],
    ['Time', activity.time],
    ['Elevation', activity.elev+' '+activity.elevUnit],
  ];
  const colW = w/2, rowH = boxH/2;
  stats.forEach((st,i)=>{
    const col = i%2, row = Math.floor(i/2);
    const x = 50*s + col*colW, y = y0 + 90*s + row*rowH;
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `600 ${22*s}px -apple-system, sans-serif`;
    ctx.fillText(st[0], x, y);
    ctx.fillStyle = '#fff';
    ctx.font = `800 ${54*s}px -apple-system, sans-serif`;
    ctx.fillText(st[1], x, y+56*s);
  });
}

function drawMinimal(ctx, w, h, s){
  ctx.fillStyle = '#fff';
  ctx.font = `800 ${130*s}px -apple-system, sans-serif`;
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 12*s;
  ctx.fillText(activity.distance, 44*s, h-160*s);
  ctx.font = `700 ${34*s}px -apple-system, sans-serif`;
  ctx.fillText(activity.distanceUnit+'  ·  '+activity.time, 44*s, h-100*s);
  ctx.shadowBlur = 0;
}

function drawRoute(ctx, w, h, s){
  const pts = activity.route;
  const pad = 60*s;
  const xs = pts.map(p=>p[0]), ys = pts.map(p=>p[1]);
  const rw = Math.max(...xs)-Math.min(...xs) || 1, rh = Math.max(...ys)-Math.min(...ys) || 1;
  const boxW = w-pad*2, boxH = 220*s;
  const k = Math.min(boxW/rw, boxH/rh);
  const originX = pad, originY = h-360*s;

  ctx.strokeStyle = '#fff'; ctx.lineWidth = 6*s; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath();
  pts.forEach((p,i)=>{
    const x = originX + (p[0]-Math.min(...xs))*k;
    const y = originY + (p[1]-Math.min(...ys))*k;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = `700 ${30*s}px -apple-system, sans-serif`;
  ctx.fillText(activity.distance+' '+activity.distanceUnit+'  ·  '+activity.time, pad, h-100*s);
}

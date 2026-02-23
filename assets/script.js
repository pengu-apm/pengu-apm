const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');

mobileToggle.addEventListener('click', function() {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    mobileMenu.classList.remove('open');
  });
});

const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let bgNodes = [];
let bgEdges = [];

function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
resizeBgCanvas();
window.addEventListener('resize', resizeBgCanvas);

for (let i = 0; i < 40; i++) {
  bgNodes.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: Math.random() * 2.5 + 1.5,
    type: Math.random() < 0.12 ? 'root' : Math.random() < 0.28 ? 'group' : 'user'
  });
}

for (let i = 0; i < bgNodes.length; i++) {
  for (let j = i + 1; j < bgNodes.length; j++) {
    if (Math.random() < 0.08) {
      bgEdges.push([i, j]);
    }
  }
}

function drawBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  bgNodes.forEach(function(n) {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > bgCanvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > bgCanvas.height) n.vy *= -1;
  });

  bgEdges.forEach(function(pair) {
    const a = bgNodes[pair[0]];
    const b = bgNodes[pair[1]];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d > 300) return;
    const alpha = (1 - d / 300) * 0.35;
    bgCtx.beginPath();
    bgCtx.moveTo(a.x, a.y);
    bgCtx.lineTo(b.x, b.y);
    bgCtx.strokeStyle = 'rgba(160, 0, 8, ' + alpha + ')';
    bgCtx.lineWidth = 0.5;
    bgCtx.stroke();
  });

  bgNodes.forEach(function(n) {
    let r, g, b;
    if (n.type === 'root') { r = 192; g = 0; b = 10; }
    else if (n.type === 'group') { r = 58; g = 154; b = 106; }
    else { r = 200; g = 168; b = 32; }

    const grd = bgCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
    grd.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',0.12)');
    grd.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    bgCtx.beginPath();
    bgCtx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
    bgCtx.fillStyle = grd;
    bgCtx.fill();

    bgCtx.beginPath();
    bgCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    bgCtx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    bgCtx.fill();
  });

  requestAnimationFrame(drawBackground);
}
drawBackground();

const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const archSteps = document.querySelectorAll('.arch-step');
const shotCards = document.querySelectorAll('.shot-card');
const collectorsAll = document.querySelectorAll('.collector');
const featCards = document.querySelectorAll('.feat-card');

shotCards.forEach(function(card) {
  const dir = card.dataset.dir;
  if (dir === 'left') {
    card.classList.add('from-left');
  } else {
    card.classList.add('from-right');
  }
});

function checkVisible(el, threshold) {
  const t = threshold !== undefined ? threshold : 0.88;
  return el.getBoundingClientRect().top < window.innerHeight * t;
}

function runReveal() {
  revealElements.forEach(function(el) {
    if (checkVisible(el)) {
      el.classList.add('visible');
    }
  });

  archSteps.forEach(function(el, i) {
    if (checkVisible(el)) {
      setTimeout(function() {
        el.classList.add('visible');
      }, i * 110);
    }
  });

  shotCards.forEach(function(el) {
    if (checkVisible(el, 0.86)) {
      el.classList.add('visible');
    }
  });

  featCards.forEach(function(el) {
    if (checkVisible(el)) {
      const delay = parseInt(el.dataset.delay) || 0;
      setTimeout(function() {
        el.classList.add('visible');
      }, delay);
    }
  });

  collectorsAll.forEach(function(el) {
    if (checkVisible(el)) {
      const delay = parseInt(el.dataset.delay) || 0;
      setTimeout(function() {
        el.classList.add('visible');
      }, delay);
    }
  });
}

window.addEventListener('scroll', runReveal);
window.addEventListener('load', runReveal);
runReveal();

const demoCanvas = document.createElement('canvas');
const demoSection = document.querySelector('.screenshots-section');

const demoNodes = [
  { id: 'Vuln-User', label: 'Vuln-User', type: 'USER', x: 0, y: 0, vx: 0, vy: 0 },
  { id: 'lxd', label: 'lxd', type: 'GROUP', x: 0, y: 0, vx: 0, vy: 0 },
  { id: 'docker', label: 'docker', type: 'GROUP', x: 0, y: 0, vx: 0, vy: 0 },
  { id: 'root', label: 'root', type: 'ROOT', x: 0, y: 0, vx: 0, vy: 0 },
  { id: 'find', label: '/usr/bin/find', type: 'SUID', x: 0, y: 0, vx: 0, vy: 0 },
  { id: 'python', label: '/usr/bin/python3', type: 'SUID', x: 0, y: 0, vx: 0, vy: 0 }
];

const demoEdges = [
  { from: 'Vuln-User', to: 'lxd', label: 'MemberOf', risk: 'HIGH' },
  { from: 'Vuln-User', to: 'docker', label: 'MemberOf', risk: 'HIGH' },
  { from: 'lxd', to: 'root', label: 'LXDGroupEscape', risk: 'CRITICAL' },
  { from: 'docker', to: 'root', label: 'DockerEscape', risk: 'CRITICAL' },
  { from: 'Vuln-User', to: 'find', label: 'CanExecute', risk: 'MEDIUM' },
  { from: 'Vuln-User', to: 'python', label: 'CanExecute', risk: 'MEDIUM' },
  { from: 'find', to: 'root', label: 'SUIDBin', risk: 'CRITICAL' },
  { from: 'python', to: 'root', label: 'SUIDBin', risk: 'CRITICAL' }
];

const nodeColors = {
  USER: { r: 200, g: 168, b: 32 },
  GROUP: { r: 58, g: 154, b: 106 },
  ROOT: { r: 192, g: 0, b: 10 },
  SUID: { r: 112, g: 80, b: 200 }
};

const riskColors = {
  CRITICAL: { r: 232, g: 0, b: 13 },
  HIGH: { r: 208, g: 96, b: 0 },
  MEDIUM: { r: 176, g: 144, b: 0 }
};

function getNodeById(id) {
  return demoNodes.find(function(n) { return n.id === id; });
}

function initDemoPositions(w, h) {
  demoNodes.forEach(function(n, i) {
    const angle = (i / demoNodes.length) * Math.PI * 2;
    n.x = w / 2 + Math.cos(angle) * 160;
    n.y = h / 2 + Math.sin(angle) * 130;
    n.vx = 0;
    n.vy = 0;
  });
}

function runForce(w, h) {
  const cx = w / 2;
  const cy = h / 2;

  demoNodes.forEach(function(n) {
    n.vx += (cx - n.x) * 0.0018;
    n.vy += (cy - n.y) * 0.0018;

    demoNodes.forEach(function(m) {
      if (m === n) return;
      const dx = n.x - m.x;
      const dy = n.y - m.y;
      const d = Math.hypot(dx, dy) || 1;
      const f = 2800 / (d * d);
      n.vx += (dx / d) * f;
      n.vy += (dy / d) * f;
    });
  });

  demoEdges.forEach(function(e) {
    const a = getNodeById(e.from);
    const b = getNodeById(e.to);
    if (!a || !b) return;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1;
    const target = 180;
    const f = (d - target) * 0.014;
    a.vx += (dx / d) * f;
    a.vy += (dy / d) * f;
    b.vx -= (dx / d) * f;
    b.vy -= (dy / d) * f;
  });

  demoNodes.forEach(function(n) {
    n.vx *= 0.84;
    n.vy *= 0.84;
    n.x += n.vx;
    n.y += n.vy;
    n.x = Math.max(40, Math.min(w - 40, n.x));
    n.y = Math.max(40, Math.min(h - 40, n.y));
  });
}

function drawDemoCanvas(ctx, w, h, t, hovered, selected) {
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.018)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  demoEdges.forEach(function(e) {
    const a = getNodeById(e.from);
    const b = getNodeById(e.to);
    if (!a || !b) return;

    const rc = riskColors[e.risk];
    const isLit = selected && (selected.id === e.from || selected.id === e.to);
    const alpha = isLit ? 0.9 : 0.38;

    const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.22;
    const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.22;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(mx, my, b.x, b.y);
    ctx.strokeStyle = 'rgba(' + rc.r + ',' + rc.g + ',' + rc.b + ',' + alpha + ')';
    ctx.lineWidth = isLit ? 2.2 : 1.4;
    ctx.stroke();

    const tp = 0.86;
    const tp2 = 0.83;
    const ax = (1-tp)*(1-tp)*a.x + 2*(1-tp)*tp*mx + tp*tp*b.x;
    const ay = (1-tp)*(1-tp)*a.y + 2*(1-tp)*tp*my + tp*tp*b.y;
    const ax2 = (1-tp2)*(1-tp2)*a.x + 2*(1-tp2)*tp2*mx + tp2*tp2*b.x;
    const ay2 = (1-tp2)*(1-tp2)*a.y + 2*(1-tp2)*tp2*my + tp2*tp2*b.y;
    const ang = Math.atan2(ay - ay2, ax - ax2);

    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-9, -4.5);
    ctx.lineTo(-9, 4.5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(' + rc.r + ',' + rc.g + ',' + rc.b + ',' + alpha + ')';
    ctx.fill();
    ctx.restore();

    if (isLit || hovered) {
      ctx.save();
      ctx.font = '9px Space Mono, monospace';
      ctx.fillStyle = 'rgba(' + rc.r + ',' + rc.g + ',' + rc.b + ',0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(e.label, mx, my - 6);
      ctx.restore();
    }
  });

  demoNodes.forEach(function(n) {
    const c = nodeColors[n.type];
    const isHov = hovered === n;
    const isSel = selected === n;
    const radius = 21;
    const pulse = isSel ? Math.sin(t * 3) * 3 : 0;

    const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius + 22 + pulse);
    grd.addColorStop(0, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0.18)');
    grd.addColorStop(1, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0)');
    ctx.beginPath();
    ctx.arc(n.x, n.y, radius + 22 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(n.x, n.y, radius + (isHov ? 4 : 0), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0.16)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (isSel ? 1 : 0.65) + ')';
    ctx.lineWidth = isSel ? 2.5 : 1.5;
    ctx.stroke();

    ctx.save();
    ctx.font = 'bold 11px Space Mono, monospace';
    ctx.fillStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',1)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const icon = n.type === 'GROUP' ? 'G' : n.type === 'SUID' ? 'S' : n.type === 'ROOT' ? '#' : 'U';
    ctx.fillText(icon, n.x, n.y);
    ctx.restore();

    ctx.save();
    ctx.font = '9px Space Mono, monospace';
    ctx.fillStyle = isHov ? '#f0f0f0' : 'rgba(240,240,240,0.55)';
    ctx.textAlign = 'center';
    ctx.fillText(n.label, n.x, n.y + radius + 13);
    ctx.restore();
  });

  const legend = [
    { label: 'User', c: nodeColors.USER },
    { label: 'Group', c: nodeColors.GROUP },
    { label: 'Root', c: nodeColors.ROOT },
    { label: 'SUID', c: nodeColors.SUID }
  ];
  const rLegend = [
    { label: 'Critical', c: riskColors.CRITICAL },
    { label: 'High', c: riskColors.HIGH },
    { label: 'Medium', c: riskColors.MEDIUM }
  ];

  ctx.save();
  ctx.font = '8px Space Mono, monospace';
  ctx.fillStyle = 'rgba(74,79,90,0.7)';
  ctx.fillText('NODE', 16, h - 70);
  legend.forEach(function(item, i) {
    ctx.beginPath();
    ctx.arc(22, h - 55 + i * 15, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + item.c.r + ',' + item.c.g + ',' + item.c.b + ',0.8)';
    ctx.fill();
    ctx.fillStyle = 'rgba(138,143,154,0.7)';
    ctx.fillText(item.label, 32, h - 51 + i * 15);
  });

  ctx.fillStyle = 'rgba(74,79,90,0.7)';
  ctx.fillText('RISK', 116, h - 70);
  rLegend.forEach(function(item, i) {
    ctx.beginPath();
    ctx.moveTo(116, h - 55 + i * 15);
    ctx.lineTo(130, h - 55 + i * 15);
    ctx.strokeStyle = 'rgba(' + item.c.r + ',' + item.c.g + ',' + item.c.b + ',0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(138,143,154,0.7)';
    ctx.fillText(item.label, 136, h - 51 + i * 15);
  });
  ctx.restore();
}

function setupDemoCanvas() {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;z-index:1;margin-top:60px;border:1px solid #0e1218;background:#0d1117;overflow:hidden;';

  const topbar = document.createElement('div');
  topbar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:11px 18px;border-bottom:1px solid #0e1218;background:rgba(4,6,10,0.7);';
  topbar.innerHTML = '<div style="display:flex;gap:6px;"><div style="width:9px;height:9px;border-radius:50%;background:#4a1010;"></div><div style="width:9px;height:9px;border-radius:50%;background:#4a4010;"></div><div style="width:9px;height:9px;border-radius:50%;background:#104a28;"></div></div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#4a4f5a;font-family:Space Mono,monospace;">BloodPengu Live Graph</div><div style="display:flex;align-items:center;gap:6px;font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#c0000a;font-family:Space Mono,monospace;"><div style="width:5px;height:5px;background:#e8000d;border-radius:50%;animation:pulseDot 1.5s infinite;box-shadow:0 0 8px #e8000d;"></div>Live</div>';

  demoCanvas.style.cssText = 'display:block;width:100%;height:400px;';
  wrap.appendChild(topbar);
  wrap.appendChild(demoCanvas);

  if (demoSection) {
    demoSection.appendChild(wrap);
  }

  function resizeDemo() {
    demoCanvas.width = demoCanvas.offsetWidth * window.devicePixelRatio;
    demoCanvas.height = demoCanvas.offsetHeight * window.devicePixelRatio;
    const ctx = demoCanvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    initDemoPositions(demoCanvas.offsetWidth, demoCanvas.offsetHeight);
  }

  window.addEventListener('resize', resizeDemo);
  resizeDemo();

  const ctx = demoCanvas.getContext('2d');
  let t = 0;
  let hoveredNode = null;
  let selectedNode = null;

  demoCanvas.addEventListener('mousemove', function(e) {
    const rect = demoCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    hoveredNode = demoNodes.find(function(n) {
      return Math.hypot(n.x - mx, n.y - my) < 26;
    }) || null;
  });

  demoCanvas.addEventListener('mouseleave', function() {
    hoveredNode = null;
  });

  demoCanvas.addEventListener('click', function(e) {
    const rect = demoCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const found = demoNodes.find(function(n) {
      return Math.hypot(n.x - mx, n.y - my) < 26;
    });
    selectedNode = found || null;
  });

  function loop() {
    t += 0.012;
    const w = demoCanvas.offsetWidth;
    const h = demoCanvas.offsetHeight;
    runForce(w, h);
    drawDemoCanvas(ctx, w, h, t, hoveredNode, selectedNode);
    requestAnimationFrame(loop);
  }
  loop();
}

window.addEventListener('load', setupDemoCanvas);

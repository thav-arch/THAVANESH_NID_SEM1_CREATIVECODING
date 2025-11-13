// Chroma Echoes (refined single-file p5.js)
// Canvas 800x600, 60 FPS
// Game states: 0..6 as specified
// Aesthetic: Minimalist Monochrome + Conceptual Abstract (subtle glows, soft particles)

let gameState = 0;
const START_SCREEN = 0;
const SCENE_1_INERTIA = 1;
const SCENE_2_GATHERING = 2;
const SCENE_3_CROSSROADS = 3;
const PATH_A_JOURNEY = 4;
const PATH_B_REFLECTION = 5;
const END_CRACKERS = 6;

const W = 800, H = 600;
const PLAYER_SIZE = 20;

// Physics constants
const GRAVITY = 0.6;
const MAX_H_SPEED = 5;
const JUMP_STRENGTH = 12;

// Scene1 constraints
const SC1_VMAX = 0.5;

// Colors
const BG_BLACK = [0,0,0];
const BG_DARK20 = [20,20,20];
const BG_MEDIUM40 = [40,40,40];

// Chroma colors (Scene 2)
const CHROMA_RGB = [
  [255, 0, 0],    // Red
  [0, 0, 255],    // Blue
  [0, 255, 0],    // Green
  [255, 255, 0],  // Yellow
  [255, 0, 255],  // Magenta
  [0, 255, 255]   // Cyan
];

let echo;
let frameSinceState = 0;

// Scene 1 transition control
let scene1Time = 6 * 60; // frames to do background lerp

// Scene 2 vessels
let vessels = [];
const VESSEL_COUNT = 6;
const VESSEL_SIZE = 15;
let scene2_autoAscend = false;

// Scene 3 / platform
const PLATFORM_Y = H - 60;
const PLATFORM_H = 20;

// Path A
let levelWidthA = W * 4;
let platformsA = [];
let camX = 0;
let pathA_cluster = [];
let pathATriggered = false;

// Path B
let pathB_waiting = true;
let pathB_timer = 0;
const PATHB_WAIT_FRAMES = 5 * 60;
let pathB_incoming = [];

// End crackers
let crackersStartedAt = 0;
let crackersDur = 4 * 60;
let crackersParticles = [];

// Input (smooth)
let input = { left:false, right:false, up:false, down:false };

// UI fonts (system)
function preload() {
  // no external fonts – use default
}

function setup() {
  createCanvas(W, H);
  frameRate(60);
  initEcho();
  textAlign(CENTER, CENTER);
  noSmooth();
}

function initEcho() {
  echo = {
    x: 50,
    y: H/2,
    w: PLAYER_SIZE,
    h: PLAYER_SIZE,
    vx: 0,
    vy: 0,
    onGround: false,
    collectedColors: [], // p5 color objects
    haloBlend: null,
    worldMode: false // when path A uses world coords
  };
}

// Helpers
function aabb(ax,ay,aw,ah, bx,by,bw,bh){ return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by; }

function enterState(s) {
  gameState = s;
  frameSinceState = 0;

  if (s === SCENE_1_INERTIA) {
    echo.x = -echo.w;
    echo.y = H/2 - echo.h/2;
    echo.vx = 0; echo.vy = 0;
    scene2_autoAscend = false;
  } else if (s === SCENE_2_GATHERING) {
    // center-bottom start
    echo.x = W/2 - echo.w/2;
    echo.y = H - echo.h;
    echo.vx = 0; echo.vy = 0;
    // Build vessels without overlap
    vessels = [];
    let pad = 40;
    let tries = 0;
    while (vessels.length < VESSEL_COUNT && tries < 3000) {
      tries++;
      let px = random(pad, W - pad - VESSEL_SIZE);
      let py = random(60, H - 140);
      let coll = false;
      for (let v of vessels) {
        if (aabb(px,py,VESSEL_SIZE,VESSEL_SIZE, v.x, v.y, VESSEL_SIZE+16, VESSEL_SIZE+16)) { coll = true; break; }
      }
      if (!coll) {
        let idx = vessels.length;
        let c = color(CHROMA_RGB[idx][0], CHROMA_RGB[idx][1], CHROMA_RGB[idx][2]);
        vessels.push({ x: px, y: py, w: VESSEL_SIZE, h: VESSEL_SIZE, color: c, collected:false });
      }
    }
    scene2_autoAscend = false;
  } else if (s === SCENE_3_CROSSROADS) {
    echo.x = W/2 - echo.w/2;
    echo.y = PLATFORM_Y - echo.h;
    echo.vx = 0; echo.vy = 0;
    echo.worldMode = false;
    // prepare Path A world platforms and cluster
    platformsA = [];
    let screens = levelWidthA / W;
    for (let sidx=0; sidx < screens; sidx++) {
      let base = sidx * W;
      // ground platform
      platformsA.push({x: base, y: H - 40, w: W, h: 40});
      // 2 floating platforms
      for (let i=0;i<2;i++){
        let pw = random(90,160);
        let px = base + random(50, W - pw - 50);
        let py = random(H - 220, H - 120);
        platformsA.push({x: px, y: py, w: pw, h: 12});
      }
    }
    // cluster in 4th frame (index 3)
    pathA_cluster = [];
    let baseX = 3*W + 120;
    for (let k=0;k<5;k++){
      pathA_cluster.push({ x: baseX + k*60, y: H - 110, w: 28, h: 28, triggered:false });
    }
    pathATriggered = false;
  } else if (s === PATH_A_JOURNEY) {
    // ensure world-based echo.x in world coordinates
    if (!echo.worldMode) {
      // put the echo at world x ~ W (just past crossroads)
      echo.x = W;
      echo.worldMode = true;
    }
    echo.y = PLATFORM_Y - echo.h;
    echo.vx = 0; echo.vy = 0;
    camX = constrain(echo.x - W/2, 0, max(0, levelWidthA - W));
  } else if (s === PATH_B_REFLECTION) {
    // leftwards entry
    echo.x = 60;
    echo.y = H/2 - echo.h/2;
    echo.vx = 0; echo.vy = 0;
    pathB_waiting = true;
    pathB_timer = 0;
    pathB_incoming = [];
  } else if (s === END_CRACKERS) {
    // prepare crackers using collected colors, center burst
    crackersStartedAt = frameCount;
    crackersParticles = [];
    let count = 140;
    for (let i=0;i<count;i++){
      let ang = random(TWO_PI);
      let spd = random(1.5, 6.0);
      let col = echo.collectedColors.length ? random(echo.collectedColors) : color(255);
      crackersParticles.push({
        x: W/2, y: H/2,
        vx: cos(ang) * spd,
        vy: sin(ang) * spd,
        age: 0,
        life: random(40, 110),
        color: col,
        shape: int(random(3))
      });
    }
  }
  frameSinceState = 0;
}

// Input handling (we use keyIsDown each frame for smoothness; also map WASD + arrows + space)
function readInput() {
  input.left = keyIsDown(65) || keyIsDown(37); // A or left arrow
  input.right = keyIsDown(68) || keyIsDown(39); // D or right arrow
  input.up = keyIsDown(87) || keyIsDown(38) || keyIsDown(32); // W or up or space
  input.down = keyIsDown(83) || keyIsDown(40); // S or down
}

function draw() {
  frameSinceState++;
  readInput();

  // ROUTE by state
  if (gameState === START_SCREEN) {
    background(0);
    drawStartScreen();
  } else if (gameState === SCENE_1_INERTIA) {
    // background lerp 0 -> (20,20,20)
    let t = constrain(frameSinceState / scene1Time, 0, 1);
    let bgv = lerp(0, BG_DARK20[0], t);
    background(bgv);
    drawHUD("SCENE 1 — INERTIA");
    // movement: strictly capped to SC1_VMAX, no vertical & no gravity
    if (input.left) echo.vx = -SC1_VMAX;
    else if (input.right) echo.vx = SC1_VMAX;
    else echo.vx = 0;
    echo.x += echo.vx;
    // center vertically
    echo.y = H/2 - echo.h/2;
    drawEcho();
    // if fully crosses right edge
    if (echo.x > W) {
      enterState(SCENE_2_GATHERING);
    }
  } else if (gameState === SCENE_2_GATHERING) {
    background(BG_DARK20[0]);
    drawHUD("SCENE 2 — GATHERING");
    // movement: no gravity, vertical movement allowed; slightly quicker control
    let moveSpeed = 3.2;
    if (!scene2_autoAscend) {
      if (input.left) echo.x -= moveSpeed;
      if (input.right) echo.x += moveSpeed;
      if (input.up) echo.y -= moveSpeed;
      if (input.down) echo.y += moveSpeed;
      echo.x = constrain(echo.x, -echo.w, W + echo.w);
      echo.y = constrain(echo.y, 0, H - echo.h);
    } else {
      echo.y -= 3; // ascend speed
    }

    // draw vessels
    for (let v of vessels) {
      if (!v.collected) {
        noStroke();
        fill(v.color);
        rect(v.x, v.y, v.w, v.h, 3);
        // subtle glow
        push();
        drawingContext.shadowBlur = 14;
        drawingContext.shadowColor = color(red(v.color), green(v.color), blue(v.color), 80);
        pop();
      } else {
        noFill();
        stroke(255);
        strokeWeight(1.5);
        rect(v.x, v.y, v.w, v.h, 3);
      }
    }

    // collisions collect color
    for (let v of vessels) {
      if (!v.collected && aabb(echo.x,echo.y,echo.w,echo.h, v.x, v.y, v.w, v.h)) {
        v.collected = true;
        echo.collectedColors.push(v.color);
        updateHaloBlend();
      }
    }

    // draw echo
    drawEcho();

    // when all collected, auto ascend
    if (!scene2_autoAscend) {
      let all = vessels.every(v => v.collected);
      if (all) {
        scene2_autoAscend = true;
      }
    }

    // transition when fully above top
    if (scene2_autoAscend && echo.y + echo.h < 0) {
      enterState(SCENE_3_CROSSROADS);
    }
  } else if (gameState === SCENE_3_CROSSROADS) {
    background(BG_MEDIUM40[0]);
    drawHUD("SCENE 3 — CROSSROADS");
    // draw full-width platform
    noStroke();
    fill(80);
    rect(0, PLATFORM_Y, W, PLATFORM_H, 6);

    // apply platformer physics (screen coords)
    applyPlatformerPhysics(false);

    drawEcho();

    // choose path if exit sides
    if (echo.x > W) {
      // convert to world mode for path A
      echo.x = W; // set to boundary
      enterState(PATH_A_JOURNEY);
    } else if (echo.x + echo.w < 0) {
      enterState(PATH_B_REFLECTION);
    }
  } else if (gameState === PATH_A_JOURNEY) {
    background(BG_MEDIUM40[0]);
    // platformer but world coords
    applyPlatformerPhysics(true);

    // camera follow with easing
    camX = lerp(camX, constrain(echo.x - W/2, 0, max(0, levelWidthA - W)), 0.12);
    push();
    translate(-camX, 0);

    // draw minimal world platforms
    noStroke();
    for (let p of platformsA) {
      fill(75);
      rect(p.x, p.y, p.w, p.h, 4);
    }

    // draw cluster if reached 4th logical frame
    if (echo.x > 3 * W) {
      for (let c of pathA_cluster) {
        noStroke();
        fill(255);
        rect(c.x, c.y, c.w, c.h, 3);
      }
    }

    // draw echo in world coords
    drawEchoWorld(echo.x, echo.y);

    // trigger climax when touching cluster
    if (!pathATriggered && echo.x > 3 * W) {
      for (let c of pathA_cluster) {
        if (aabb(echo.x,echo.y,echo.w,echo.h, c.x, c.y, c.w, c.h)) {
          pathATriggered = true;
          enterState(END_CRACKERS);
        }
      }
    }

    pop();

    // keep camera clamped if near end
    camX = constrain(camX, 0, max(0, levelWidthA - W));
  } else if (gameState === PATH_B_REFLECTION) {
    background(BG_MEDIUM40[0]);
    drawHUD("PATH B — REFLECTION");
    // initial wait phase: horizontal disabled
    if (pathB_waiting) {
      pathB_timer++;
      // allow only vertical movement
      if (input.up) echo.y -= 2.4;
      if (input.down) echo.y += 2.4;
      echo.y = constrain(echo.y, 0, H - echo.h);

      // spawn incoming squares periodically (5 total)
      if (frameSinceState % 36 === 0 && pathB_incoming.length < 5) {
        pathB_incoming.push({ x: -40, y: random(60, H - 120), w: 30, h: 30, vx: random(1.8, 3.0) });
      }
      // move them
      for (let s of pathB_incoming) {
        s.x += s.vx;
        noStroke();
        fill(255);
        rect(s.x, s.y, s.w, s.h, 4);
        if (aabb(echo.x, echo.y, echo.w, echo.h, s.x, s.y, s.w, s.h)) {
          enterState(END_CRACKERS);
        }
      }

      if (pathB_timer >= PATHB_WAIT_FRAMES) {
        pathB_waiting = false;
      }
    } else {
      // enable normal platformer (single-screen)
      applyPlatformerPhysics(false);
      // continue showing any incoming squares
      for (let s of pathB_incoming) {
        s.x += s.vx;
        noStroke();
        fill(255);
        rect(s.x, s.y, s.w, s.h, 4);
        if (aabb(echo.x, echo.y, echo.w, echo.h, s.x, s.y, s.w, s.h)) {
          enterState(END_CRACKERS);
        }
      }
    }

    drawEcho();
  } else if (gameState === END_CRACKERS) {
    background(0);
    // particles update/draw
    for (let p of crackersParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.age++;
      let a = map(p.age, 0, p.life, 255, 0);
      if (p.shape === 0) {
        noStroke();
        fill(red(p.color), green(p.color), blue(p.color), a);
        ellipse(p.x, p.y, 6 + sin(p.age * 0.2) * 2);
      } else if (p.shape === 1) {
        stroke(red(p.color), green(p.color), blue(p.color), a);
        strokeWeight(2);
        line(p.x, p.y, p.x - p.vx * 2, p.y - p.vy * 2);
      } else {
        noStroke();
        fill(red(p.color), green(p.color), blue(p.color), a);
        rect(p.x, p.y, 4, 4);
      }
    }

    // progress timer; after crackersDur show finish message
    if (frameSinceState > crackersDur) {
      push();
      fill(255);
      textSize(36);
      text("CHROMA ECHOES COMPLETE.", W/2, H/2 - 10);
      textSize(14);
      text("Press R to restart", W/2, H/2 + 36);
      pop();
    }
  }

  // draw subtle minimalist UI (swatches + scene label)
  if (gameState !== START_SCREEN && gameState !== END_CRACKERS) {
    drawSwatches();
  }

  // small vignette for aesthetic
  drawVignette();
}

// ---------- drawing helpers ----------

function drawStartScreen(){
  push();
  background(0);
  fill(255);
  noStroke();
  textSize(56);
  text("CHROMA ECHOES", W/2, H/2 - 40);
  textSize(18);
  text("PRESS ENTER TO START", W/2, H/2 + 30);

  // minimal echo with halo preview
  drawHalo(W/2, H/2 - 140, 30, true);
  pop();
}

function drawHUD(title){
  push();
  fill(255);
  noStroke();
  textSize(14);
  text(title, W/2, 18);
  pop();
}

function drawEcho() {
  // on-screen echo (screen coords)
  drawHalo(echo.x + echo.w/2, echo.y + echo.h/2);
  noStroke();
  fill(255);
  rect(echo.x, echo.y, echo.w, echo.h, 3);
}

function drawEchoWorld(px, py) {
  // when world coords, camera handled externally
  drawHalo(px + echo.w/2, py + echo.h/2);
  noStroke();
  fill(255);
  rect(px, py, echo.w, echo.h, 3);
}

// Halo: stacked concentric ellipses + subtle particle halo
function drawHalo(cx, cy, base=PLAYER_SIZE + 12, preview=false) {
  push();
  translate(0,0);
  noFill();
  // outer minimalist stroke ring (soft, semi-transparent)
  stroke(255, 10);
  strokeWeight(2);
  ellipse(cx, cy, base + 28, base + 28);

  // draw collected colors stack: older outer, newer inner
  let cols = echo.collectedColors;
  for (let i = 0; i < cols.length; i++) {
    let sz = base + (cols.length - i) * 6;
    stroke(red(cols[i]), green(cols[i]), blue(cols[i]), 160);
    strokeWeight(2.0);
    ellipse(cx, cy, sz, sz);
  }

  // inner blended stroke (cumulative)
  if (echo.haloBlend) {
    stroke(red(echo.haloBlend), green(echo.haloBlend), blue(echo.haloBlend), 220);
    strokeWeight(3);
    ellipse(cx, cy, base - 2, base - 2);
  }

  // conceptual abstract: small ghost particles that pulse (only if not preview)
  if (!preview) {
    for (let i = 0; i < 10; i++) {
      let ang = (frameCount * 0.01) + i * (TWO_PI / 10);
      let r = base/2 + sin((frameCount * 0.03) + i) * 6 + i;
      let px = cx + cos(ang) * r;
      let py = cy + sin(ang) * r;
      noStroke();
      let c = echo.haloBlend ? echo.haloBlend : color(255,255,255,80);
      fill(red(c), green(c), blue(c), 22);
      ellipse(px, py, 6, 6);
    }
  }

  pop();
}

function updateHaloBlend(){
  if (echo.collectedColors.length === 0) {
    echo.haloBlend = null;
    return;
  }
  // chain lerpColor to accumulate blend
  let cur = echo.collectedColors[0];
  for (let i=1;i<echo.collectedColors.length;i++){
    cur = lerpColor(cur, echo.collectedColors[i], 0.5);
  }
  echo.haloBlend = cur;
}

function drawSwatches(){
  push();
  translate(W - 150, 24);
  textSize(12);
  fill(200);
  noStroke();
  text("Collected", 60, -10);
  for (let i=0; i<echo.collectedColors.length; i++){
    fill(echo.collectedColors[i]);
    rect(i * 28, 0, 22, 22, 4);
  }
  pop();
}

function drawVignette(){
  push();
  drawingContext.save();
  // subtle dark vignette
  noFill();
  stroke(0, 80);
  strokeWeight(120);
  rect(-60, -60, W + 120, H + 120);
  drawingContext.restore();
  pop();
}

// ---------- physics ----------

function applyPlatformerPhysics(worldMode) {
  // worldMode true => platformsA used; echo.x treated as world x
  // Horizontal acceleration & friction
  let accel = 0.6;
  if (input.left) echo.vx -= accel;
  if (input.right) echo.vx += accel;
  if (!input.left && !input.right) {
    echo.vx *= 0.78; // friction
    if (abs(echo.vx) < 0.05) echo.vx = 0;
  }
  echo.vx = constrain(echo.vx, -MAX_H_SPEED, MAX_H_SPEED);

  // Jump (allow small coyote via small buffer - optional, kept simple)
  if (input.up && echo.onGround) {
    echo.vy = -JUMP_STRENGTH;
    echo.onGround = false;
  }

  // gravity
  echo.vy += GRAVITY;

  // apply velocities
  echo.x += echo.vx;
  echo.y += echo.vy;

  // collisions
  if (worldMode) {
    echo.onGround = false;
    // clamp world x
    echo.x = constrain(echo.x, -100, levelWidthA + 100);
    for (let p of platformsA) {
      // only check when falling
      if (echo.vy >= 0 && aabb(echo.x, echo.y + 1, echo.w, echo.h, p.x, p.y, p.w, p.h)) {
        echo.y = p.y - echo.h;
        echo.vy = 0;
        echo.onGround = true;
      }
    }
  } else {
    // single wide platform at PLATFORM_Y
    if (echo.y + echo.h >= PLATFORM_Y) {
      echo.y = PLATFORM_Y - echo.h;
      echo.vy = 0;
      echo.onGround = true;
    } else {
      echo.onGround = false;
    }
    // small clamp so leaving left/right area is allowed for transitions
    echo.y = constrain(echo.y, -200, H+200);
  }
}

// ---------- keyboard events ----------

function keyPressed() {
  if ((keyCode === ENTER || keyCode === 13) && gameState === START_SCREEN) {
    enterState(SCENE_1_INERTIA);
  }
  // Jump permit with space / up handled via keyIsDown in draw
  if ((key === 'r' || key === 'R') && gameState === END_CRACKERS) {
    resetGame();
  }
  // Support restart anytime with R
  if ((key === 'r' || key === 'R') && gameState !== START_SCREEN) {
    // quick restart back to start screen
    resetGame();
  }
}

function resetGame() {
  initEcho();
  vessels = [];
  platformsA = [];
  pathA_cluster = [];
  pathB_incoming = [];
  crackersParticles = [];
  gameState = START_SCREEN;
}

// ---------- small polish: pointer to collected color blending if user wants to visually check ----------
/* End of single-file sketch */


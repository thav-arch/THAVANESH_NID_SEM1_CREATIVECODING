/* Fragments of Light (enhanced single-file p5.js)
   Canvas logical: 800x600, 60 FPS
   - Responsive scaling to fill browser window (no distortion; letterboxed if needed)
   - Vignette
   - Sounds (synths + envelopes)
   - Transitions (fade)
   - Grain "shader" overlay via graphics
   - Firecracker burst with delay
   - Mobile controls (on-screen)
   - Scene subtitles with fade-in, held until scene ends
   - Background soundtrack (looping, safe-init)
   - Contextual controls overlay in every scene (with soft fade)
   - Path A: click a Fragment of Light to trigger crackers + moving obstacles
   - Path B: more intense incoming boxes
*/

/* -------------------------------------------------------
   BACKGROUND MUSIC SETUP
   -------------------------------------------------------
   Place your instrumental track here:
     GAMEPOEMREMAKE/libraries/yellow_instrumental.mp3

   This code assumes a relative URL:
     libraries/yellow_instrumental.mp3

   If it’s missing, the game still runs (just without music).
-------------------------------------------------------- */
const BG_MUSIC_FILE = "libraries/yellow_instrumental.mp3";  // relative path

// Logical game resolution (virtual space)
const W = 800, H = 600;

// UI font (system font – elegant & readable)
const UI_FONT = "Segoe UI";

let gameState = 0;
const START_SCREEN       = 0;
const SCENE_1_INERTIA    = 1;
const SCENE_2_GATHERING  = 2;
const SCENE_3_CROSSROADS = 3;
const PATH_A_JOURNEY     = 4;
const PATH_B_REFLECTION  = 5;
const END_CRACKERS       = 6;

const PLAYER_SIZE = 20;

// Physics constants
const GRAVITY = 0.6;
const MAX_H_SPEED = 6.5;    // slightly faster horizontal movement
const JUMP_STRENGTH = 12;

// Scene1 constraints
const SC1_VMAX = 0.8;       // slightly faster slide in Scene 1

// Colors
const BG_BLACK    = [0,0,0];
const BG_DARK20   = [20,20,20];
const BG_MEDIUM40 = [40,40,40];

// Chroma colors (Scene 2) now treated as "Fragments of Light"
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

// Scene1 transition control
let scene1Time = 6 * 60; // frames to do background lerp

// Scene 2 vessels (Fragments of Light)
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
let pathA_cluster = [];    // clickable fragments of light at the end
let pathATriggered = false;
let pathAReadyForClick = false;
let obstaclesA = [];       // moving obstacles on right path

// Path B
let pathB_waiting = true;
let pathB_timer = 0;
const PATHB_WAIT_FRAMES = 5 * 60;
let pathB_incoming = [];

// End crackers
let crackersStartedAt = 0;
let crackersDur = 4 * 60;
let crackersParticles = [];
let crackersDelayFrames = 45;
let crackersTriggeredAt = -9999;

// Input (smooth)
let input = { left:false, right:false, up:false, down:false };

// UI / post FX
let grainGfx; // graphics buffer for grain / shader-like
let transitionAlpha = 0; // 0..1 crossfade in new state
let transitioning = false;
let transitionEase = 0.12;
let transitionTarget = 0; // 0 or 1 for fade-in/out

// Audio synths (p5.sound)
let sCollect, sJump, sTransition, sCrackerBurst;

// Background soundtrack
let bgMusic = null;

// Mobile controls
let showMobileControls = false;
let mobileTouches = {}; // map id -> touch
let mobileButtons = {
  left:  { x: 20,    y: H-120, w: 90, h: 100 },
  right: { x: 120,   y: H-120, w: 90, h: 100 },
  jump:  { x: W-110, y: H-120, w: 90, h: 100 }
};

// Performance: reuse arrays where possible
let tempParticles = [];

// ---------- Subtitle system ----------
// Subtitles fade in at scene start and remain until scene ends.

const SUB_FADE_IN  = 60;
let currentSubtitle = ""; // the subtitle text for the current scene

// ---------- Canvas scaling & layout ----------
let cnv;  // p5 canvas element

function resizeGameCanvas() {
  // Maintain 800x600 aspect ratio, scale to fit window with no distortion
  let scale = min(windowWidth / W, windowHeight / H);
  let displayW = W * scale;
  let displayH = H * scale;

  // Resize DOM canvas (CSS) but keep internal resolution 800x600
  cnv.style('width', displayW + 'px');
  cnv.style('height', displayH + 'px');

  // Center canvas in window
  let x = (windowWidth - displayW) / 2;
  let y = (windowHeight - displayH) / 2;
  cnv.position(x, y);
}

function windowResized() {
  resizeGameCanvas();
}

// ---------- Subtitle helpers ----------

function updateSubtitleForState(s) {
  if (s === SCENE_1_INERTIA) {
    currentSubtitle = "Time leaks softly, whispering memories I never asked to keep.";
  } else if (s === SCENE_2_GATHERING) {
    currentSubtitle =
      "In the ruins of memory, little joys bloom again, fragments of light return to me.";
  } else if (s === SCENE_3_CROSSROADS) {
    currentSubtitle =
      "Home is not found—it’s chosen, one fragment of light at a time. Which way will you move?";
  } else {
    currentSubtitle = "";
  }
}

function drawSubtitle() {
  if (!currentSubtitle) return;

  let t = frameSinceState;

  // Fade in only. After fade-in, keep alpha at 255 until scene ends.
  let alpha;
  if (t <= SUB_FADE_IN) {
    alpha = map(t, 0, SUB_FADE_IN, 0, 255);
  } else {
    alpha = 255;
  }

  push();
  textAlign(CENTER, CENTER);
  textSize(16);
  textLeading(20);
  rectMode(CENTER);

  let margin = 40;
  let boxW = W - 2 * margin;
  let boxH = 80;
  let x = W / 2;
  let y = H - 80;

  // Subtitle background box
  let rectAlpha = alpha * 0.6;
  noStroke();
  fill(5, 5, 10, rectAlpha);
  rect(x, y, boxW, boxH, 12);

  // Subtitle text
  fill(240, alpha);
  text(currentSubtitle, x, y, boxW - 24, boxH - 20);
  pop();
}

// ---------- CONTROLS OVERLAY (contextual per scene) ----------

function drawControlsOverlay() {
  let lines = [];

  switch (gameState) {
    case START_SCREEN:
      lines.push("Controls");
      lines.push("Desktop: ←/→ or A/D to move, ↑/W/Space to jump");
      lines.push("Mobile: On-screen arrows and ▲ button");
      lines.push("Press Enter or Tap to begin.");
      break;

    case SCENE_1_INERTIA:
      lines.push("Scene 1 – Fragments drifting");
      lines.push("Use ←/→ or A/D to move right across the screen.");
      lines.push("Reach the right edge to move on.");
      break;

    case SCENE_2_GATHERING:
      lines.push("Scene 2 – Gathering Fragments of Light");
      lines.push("Use ←/→/↑/↓ or WASD to move freely.");
      lines.push("Collect all colored fragments to ascend.");
      break;

    case SCENE_3_CROSSROADS:
      lines.push("Scene 3 – Crossroads");
      lines.push("Use ←/→ or A/D, ↑/W/Space to jump.");
      lines.push("Walk off the RIGHT edge for the bright path.");
      lines.push("Walk off the LEFT edge for the harder path.");
      break;

    case PATH_A_JOURNEY:
      lines.push("Right Path – Journey through Light");
      lines.push("Use ←/→ or A/D, ↑/W/Space.");
      lines.push("Avoid the moving light barriers.");
      lines.push("At the far right, CLICK a bright fragment to release the fireworks.");
      break;

    case PATH_B_REFLECTION:
      lines.push("Left Path – Reflection under Pressure");
      lines.push("Phase 1: move ↑/↓ to dodge white boxes.");
      lines.push("Phase 2: platformer – ←/→ or A/D, ↑/W/Space.");
      lines.push("If a box hits you, your reflections explode in light.");
      break;

    case END_CRACKERS:
      lines.push("Finale – Fragments of Light");
      lines.push("Enjoy the fireworks of your choices.");
      lines.push("Press R to restart the journey.");
      break;

    default:
      break;
  }

  if (lines.length === 0) return;

  // Subtle fade-in for overlay
  let t = constrain(frameSinceState, 0, 20);
  let alphaFactor = map(t, 0, 20, 0, 1);

  push();
  textAlign(LEFT, TOP);
  textSize(12);
  textLeading(16);

  let padding = 10;
  let lineH = 16;
  let boxW = 380;
  let boxH = lineH * lines.length + padding * 2;

  let x = 16;
  let y = 16;

  noStroke();
  fill(5, 5, 15, 180 * alphaFactor);
  rect(x, y, boxW, boxH, 12);

  fill(230, 230, 240, 255 * alphaFactor);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x + padding, y + padding + i * lineH);
  }

  pop();
}

// ---------- preload / setup ----------

function preload() {
  // Background soundtrack (optional).
  if (BG_MUSIC_FILE && typeof soundFormats === "function") {
    soundFormats('mp3', 'ogg', 'wav');
  }

  if (BG_MUSIC_FILE && typeof loadSound === "function") {
    bgMusic = loadSound(
      BG_MUSIC_FILE,
      () => {
        console.log("Background music loaded:", BG_MUSIC_FILE);
      },
      (err) => {
        console.log("Background music failed to load:", err);
        bgMusic = null; // fail gracefully
      }
    );
  }
}

function setup() {
  cnv = createCanvas(W, H);   // logical resolution
  frameRate(60);
  initEcho();

  // Global typography
  textFont(UI_FONT);
  textAlign(CENTER, CENTER);
  textLeading(20);
  noSmooth();

  // grain graphics
  grainGfx = createGraphics(W, H);
  grainGfx.pixelDensity(1);

  // init audio synths
  initAudio();

  // detect mobile
  showMobileControls = /Mobi|Android/i.test(navigator.userAgent);

  // Light body styling to complement the game canvas
  if (document && document.body) {
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "#050608";
  }

  // Responsive scaling now that canvas is created
  resizeGameCanvas();

  // start on START_SCREEN
  enterState(START_SCREEN);

  // If audio context is already running (rare), we can start bg music here.
  if (typeof getAudioContext === "function") {
    let ctx = getAudioContext();
    if (ctx && ctx.state === "running") {
      startBackgroundMusic();
    }
  }
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
    collectedColors: [], // stored as "fragments of light"
    haloBlend: null,
    worldMode: false
  };
}

// Helper to see if sound library exists
function hasSoundLib() {
  return typeof p5 !== "undefined" &&
         typeof p5.Oscillator !== "undefined" &&
         typeof p5.Envelope !== "undefined";
}

// simple audio using p5.Oscillator and p5.Env
function initAudio() {
  if (!hasSoundLib()) {
    console.warn("p5.sound not detected – game will run silently.");
    return;
  }

  // collect ping
  sCollect = new p5.Oscillator('sine');
  sCollect.freq(880);
  sCollect.amp(0);
  sCollect.start();
  sCollect.env = new p5.Envelope(0.001, 0.18, 0.12, 0.3);

  // jump thump
  sJump = new p5.Oscillator('triangle');
  sJump.freq(160);
  sJump.amp(0);
  sJump.start();
  sJump.env = new p5.Envelope(0.001, 0.22, 0.06, 0.12);

  // transition swoosh
  sTransition = new p5.Oscillator('sawtooth');
  sTransition.freq(220);
  sTransition.amp(0);
  sTransition.start();
  sTransition.env = new p5.Envelope(0.001, 0.28, 0.08, 0.18);

  // crackers burst ensemble
  sCrackerBurst = [];
  for (let i = 0; i < 6; i++) {
    let o = new p5.Oscillator('square');
    o.freq(200 + i * 50);
    o.amp(0);
    o.start();
    o.env = new p5.Envelope(0.001, 0.12, 0.0, 0.4);
    sCrackerBurst.push(o);
  }
}

// Start/loop background music safely
function startBackgroundMusic() {
  if (!bgMusic) return;
  if (bgMusic.isPlaying && bgMusic.isPlaying()) return;
  bgMusic.setLoop(true);
  bgMusic.setVolume(0.4);
  try {
    bgMusic.play();
  } catch (e) {
    console.log("Attempt to play bgMusic blocked, will retry on next input.");
  }
}

// Helpers
function aabb(ax,ay,aw,ah, bx,by,bw,bh){
  return ax < bx + bw && ax + aw > bx &&
         ay < by + bh && ay + ah > by;
}

function startTransition() {
  transitioning = true;
  transitionAlpha = 1.0;
  transitionTarget = 0;
}

function enterState(s) {
  gameState = s;
  frameSinceState = 0;
  transitionAlpha = 1.0;
  transitioning = true;
  transitionTarget = 0;

  // Update subtitle for this state
  updateSubtitleForState(s);

  // reset/prepare per-state
  if (s === SCENE_1_INERTIA) {
    echo.x = -echo.w;
    echo.y = H/2 - echo.h/2;
    echo.vx = 0; echo.vy = 0;
    scene2_autoAscend = false;
  } else if (s === SCENE_2_GATHERING) {
    echo.x = W/2 - echo.w/2;
    echo.y = H - echo.h - 2;
    echo.vx = 0; echo.vy = 0;
    vessels = [];
    let pad = 40;
    let tries = 0;
    while (vessels.length < VESSEL_COUNT && tries < 3000) {
      tries++;
      let px = random(pad, W - pad - VESSEL_SIZE);
      let py = random(60, H - 140);
      let coll = false;
      for (let v of vessels) {
        if (aabb(px,py,VESSEL_SIZE,VESSEL_SIZE,
                 v.x, v.y, VESSEL_SIZE+16, VESSEL_SIZE+16)) {
          coll = true; break;
        }
      }
      if (!coll) {
        let idx = vessels.length;
        let c = color(CHROMA_RGB[idx][0],
                      CHROMA_RGB[idx][1],
                      CHROMA_RGB[idx][2]);
        vessels.push({ x: px, y: py, w: VESSEL_SIZE, h: VESSEL_SIZE,
                       color: c, collected:false });
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
    let screens = Math.max(1, Math.floor(levelWidthA / W));
    for (let sidx=0; sidx < screens; sidx++) {
      let base = sidx * W;
      platformsA.push({x: base, y: H - 40, w: W, h: 40});
      for (let i=0;i<2;i++){
        let pw = random(90,160);
        let px = base + random(50, W - pw - 50);
        let py = random(H - 220, H - 120);
        platformsA.push({x: px, y: py, w: pw, h: 12});
      }
    }

    // fragments of light cluster in 4th screen
    pathA_cluster = [];
    let baseX = 3*W + 120;
    for (let k=0;k<5;k++){
      pathA_cluster.push({
        x: baseX + k*60,
        y: H - 110,
        w: 28, h: 28,
        triggered:false
      });
    }
    pathATriggered = false;
    pathAReadyForClick = false;

    // NEW: create obstacles (moving light barriers) across PATH A
    obstaclesA = [];
    for (let sidx=0; sidx<screens; sidx++) {
      let base = sidx * W;
      let numObs = 2;
      for (let i=0; i<numObs; i++) {
        let ox = base + random(120, W - 80);
        let oyBase = random(H - 220, H - 140);
        obstaclesA.push({
          x: ox,
          y: oyBase,
          w: 30,
          h: 30,
          baseY: oyBase,
          amp: random(25, 45),
          speed: random(0.03, 0.06),
          phase: random(TWO_PI)
        });
      }
    }

  } else if (s === PATH_A_JOURNEY) {
    if (!echo.worldMode) {
      echo.x = W;
      echo.worldMode = true;
    }
    echo.y = PLATFORM_Y - echo.h;
    echo.vx = 0; echo.vy = 0;
    camX = constrain(echo.x - W/2, 0, max(0, levelWidthA - W));
    pathAReadyForClick = false;
  } else if (s === PATH_B_REFLECTION) {
    echo.x = 60;
    echo.y = H/2 - echo.h/2;
    echo.vx = 0; echo.vy = 0;
    pathB_waiting = true;
    pathB_timer = 0;
    pathB_incoming = [];
  } else if (s === END_CRACKERS) {
    crackersStartedAt = frameCount;
    crackersTriggeredAt = frameCount + crackersDelayFrames;
    crackersParticles = [];
  }

  // audio feedback for transitions
  try {
    if (sTransition && sTransition.env) {
      sTransition.freq(160 + random(0,100));
      sTransition.env.play(sTransition, 0, 0.05);
    }
  } catch(e){}
  frameSinceState = 0;
}

// ---------- Input handling ----------

function readInput() {
  input.left  = keyIsDown(65) || keyIsDown(37); // A or left arrow
  input.right = keyIsDown(68) || keyIsDown(39); // D or right arrow
  input.up    = keyIsDown(87) || keyIsDown(38) || keyIsDown(32); // W, up, space
  input.down  = keyIsDown(83) || keyIsDown(40); // S or down

  if (showMobileControls) {
    input.left  = input.left  || isTouchingButton(mobileButtons.left);
    input.right = input.right || isTouchingButton(mobileButtons.right);
    input.up    = input.up    || isTouchingButton(mobileButtons.jump);
  }
}

function isTouchingButton(btn) {
  for (let id in mobileTouches) {
    let t = mobileTouches[id];
    if (t.x >= btn.x && t.x <= btn.x + btn.w &&
        t.y >= btn.y && t.y <= btn.y + btn.h) return true;
  }
  return false;
}

// ---------- Main draw ----------

function draw() {
  frameSinceState++;
  readInput();

  // update transition alpha (ease out)
  if (transitioning) {
    transitionAlpha = lerp(transitionAlpha, transitionTarget, transitionEase);
    if (abs(transitionAlpha - transitionTarget) < 0.01) {
      transitionAlpha = transitionTarget;
      transitioning = false;
    }
  }

  // Clear whole logical canvas
  background(0);

  // ROUTE by state
  if (gameState === START_SCREEN) {
    drawStartScreen();
  } else if (gameState === SCENE_1_INERTIA) {
    let t = constrain(frameSinceState / scene1Time, 0, 1);
    let bgv = lerp(0, BG_DARK20[0], t);
    background(bgv);

    drawHUD("SCENE 1 — INERTIA");
    if (input.left) echo.vx = -SC1_VMAX;
    else if (input.right) echo.vx = SC1_VMAX;
    else echo.vx = 0;
    echo.x += echo.vx;
    echo.y = H/2 - echo.h/2;
    drawEcho();

    if (echo.x > W) {
      enterState(SCENE_2_GATHERING);
    }
  } else if (gameState === SCENE_2_GATHERING) {
    background(BG_DARK20[0]);
    drawHUD("SCENE 2 — GATHERING FRAGMENTS OF LIGHT");

    // Slightly faster free movement
    let moveSpeed = 4.0;
    if (!scene2_autoAscend) {
      if (input.left)  echo.x -= moveSpeed;
      if (input.right) echo.x += moveSpeed;
      if (input.up)    echo.y -= moveSpeed;
      if (input.down)  echo.y += moveSpeed;
      echo.x = constrain(echo.x, -echo.w, W + echo.w);
      echo.y = constrain(echo.y, 0, H - echo.h);
    } else {
      echo.y -= 3;
    }

    // draw vessels (Fragments of Light)
    for (let v of vessels) {
      if (!v.collected) {
        noStroke();
        fill(v.color);
        rect(v.x, v.y, v.w, v.h, 3);
        push();
        drawingContext.shadowBlur = 14;
        drawingContext.shadowColor = color(red(v.color),
                                           green(v.color),
                                           blue(v.color), 80);
        fill(red(v.color), green(v.color), blue(v.color), 28);
        rect(v.x - 6, v.y - 6, v.w + 12, v.h + 12, 6);
        pop();
      } else {
        noFill();
        stroke(255,120);
        strokeWeight(1.5);
        rect(v.x, v.y, v.w, v.h, 3);
      }
    }

    // collect fragments
    for (let v of vessels) {
      if (!v.collected &&
          aabb(echo.x,echo.y,echo.w,echo.h, v.x, v.y, v.w, v.h)) {
        v.collected = true;
        echo.collectedColors.push(v.color);
        updateHaloBlend();
        try {
          if (sCollect && sCollect.env) {
            sCollect.freq(600 + random(-80,120));
            sCollect.env.play(sCollect, 0, 0.02);
          }
        } catch(e){}
      }
    }

    drawEcho();

    if (!scene2_autoAscend) {
      let all = vessels.length > 0 && vessels.every(v => v.collected);
      if (all) scene2_autoAscend = true;
    }

    if (scene2_autoAscend && echo.y + echo.h < 0) {
      enterState(SCENE_3_CROSSROADS);
    }
  } else if (gameState === SCENE_3_CROSSROADS) {
    background(BG_MEDIUM40[0]);
    drawHUD("SCENE 3 — CROSSROADS OF LIGHT");
    noStroke();
    fill(80);
    rect(0, PLATFORM_Y, W, PLATFORM_H, 6);

    applyPlatformerPhysics(false);
    drawEcho();

    if (echo.x > W) {
      echo.x = W;
      enterState(PATH_A_JOURNEY);
    } else if (echo.x + echo.w < 0) {
      enterState(PATH_B_REFLECTION);
    }
  } else if (gameState === PATH_A_JOURNEY) {
    background(BG_MEDIUM40[0]);
    applyPlatformerPhysics(true);

    camX = lerp(
      camX,
      constrain(echo.x - W/2, 0, max(0, levelWidthA - W)),
      0.12
    );

    push();
    translate(-camX, 0);

    // platforms
    noStroke();
    for (let p of platformsA) {
      fill(75);
      rect(p.x, p.y, p.w, p.h, 4);
    }

    // moving obstacles (light barriers)
    for (let o of obstaclesA) {
      o.y = o.baseY + sin(frameCount * o.speed + o.phase) * o.amp;
      noStroke();
      fill(255, 230, 160);
      rect(o.x, o.y, o.w, o.h, 4);

      if (aabb(echo.x, echo.y, echo.w, echo.h,
               o.x, o.y, o.w, o.h)) {
        // Knockback to start of current screen
        let screenIdx = floor(echo.x / W);
        let safeX = screenIdx * W + 80;
        echo.x = safeX;
        echo.y = PLATFORM_Y - echo.h;
        echo.vx = 0;
        echo.vy = -6;
      }
    }

    // fragments cluster when Echo is in the 4th screen
    if (echo.x > 3 * W) {
      pathAReadyForClick = true;
      for (let c of pathA_cluster) {
        noStroke();
        fill(255, 255, 220);
        rect(c.x, c.y, c.w, c.h, 3);
      }
    }

    drawEchoWorld(echo.x, echo.y);
    pop();
    camX = constrain(camX, 0, max(0, levelWidthA - W));

  } else if (gameState === PATH_B_REFLECTION) {
    background(BG_MEDIUM40[0]);
    drawHUD("PATH B — REFLECTION");

    // LEFT PATH: more intense — more boxes, faster, and continued spawning
    if (pathB_waiting) {
      pathB_timer++;
      if (input.up)   echo.y -= 2.4;
      if (input.down) echo.y += 2.4;
      echo.y = constrain(echo.y, 0, H - echo.h);

      // More frequent + more max boxes + faster
      if (frameSinceState % 24 === 0 && pathB_incoming.length < 10) {
        pathB_incoming.push({
          x: -40,
          y: random(60, H - 120),
          w: 30, h: 30,
          vx: random(2.5, 4.0)
        });
      }

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
      // Enable normal platformer and continue intense spawning
      applyPlatformerPhysics(false);

      if (frameSinceState % 20 === 0 && pathB_incoming.length < 14) {
        pathB_incoming.push({
          x: -40,
          y: random(60, H - 120),
          w: 30, h: 30,
          vx: random(2.7, 4.5)
        });
      }

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

    if (frameCount >= crackersTriggeredAt &&
        crackersParticles.length === 0) {
      let total = 360;
      for (let i=0;i<total;i++){
        let ang = random(TWO_PI);
        let spd = random(0.6, 3.0);
        let col = echo.collectedColors.length ?
                  random(echo.collectedColors) : color(255);
        crackersParticles.push({
          x: W/2 + random(-8,8),
          y: H/2 + random(-8,8),
          vx: cos(ang) * spd,
          vy: sin(ang) * spd - random(0.2,1.0),
          age: 0,
          life: random(80, 180),
          color: col,
          shape: int(random(3)),
          spin: random(-0.08, 0.08),
          size: random(3,7)
        });
      }
      try {
        if (sCrackerBurst) {
          for (let i=0;i<sCrackerBurst.length;i++){
            let o = sCrackerBurst[i];
            o.freq(200 + i*40 + random(-20,20));
            o.env.play(o, 0, 0.01 + i*0.01);
          }
        }
      } catch(e){}
    }

    for (let p of crackersParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.age++;
      let a = map(p.age, 0, p.life, 255, 0);
      push();
      if (p.shape === 0) {
        noStroke();
        fill(red(p.color), green(p.color), blue(p.color), a);
        ellipse(p.x, p.y, p.size + sin(p.age * 0.08) * 2);
      } else if (p.shape === 1) {
        stroke(red(p.color), green(p.color), blue(p.color), a);
        strokeWeight(1.5);
        line(p.x, p.y, p.x - p.vx * 3, p.y - p.vy * 3);
      } else {
        noStroke();
        fill(red(p.color), green(p.color), blue(p.color), a);
        push();
        translate(p.x, p.y);
        rotate(p.age * p.spin);
        rect(-p.size/2, -p.size/2, p.size, p.size);
        pop();
      }
      pop();
    }

    if (crackersParticles.length) {
      crackersParticles =
        crackersParticles.filter(p => p.age < p.life);
    }

    if (frameSinceState > crackersDur) {
      push();
      fill(245);
      textSize(32);
      text("FRAGMENTS OF LIGHT — COMPLETE", W/2, H/2 - 14);
      textSize(14);
      text("Press R to restart", W/2, H/2 + 26);
      pop();
    }
  }

  // swatches (fragments collected)
  if (gameState !== START_SCREEN && gameState !== END_CRACKERS) {
    drawSwatches();
  }

  // grain / shader overlay
  drawGrain();

  // vignette
  drawVignette();

  // subtitles (Scenes 1–3)
  if (gameState === SCENE_1_INERTIA ||
      gameState === SCENE_2_GATHERING ||
      gameState === SCENE_3_CROSSROADS) {
    drawSubtitle();
  }

  // controls overlay in ALL scenes
  drawControlsOverlay();

  // transitions overlay
  if (transitioning || transitionAlpha > 0) {
    push();
    noStroke();
    fill(0, map(transitionAlpha, 0, 1, 0, 220));
    rect(0,0,W,H);
    pop();
  }

  // mobile UI
  if (showMobileControls &&
      gameState !== START_SCREEN &&
      gameState !== END_CRACKERS) {
    drawMobileControls();
  }
}

// ---------- drawing helpers ----------

function drawStartScreen(){
  push();
  background(0);
  fill(245);
  noStroke();
  textSize(44);
  text("FRAGMENTS OF LIGHT", W/2, H/2 - 40);
  textSize(16);
  fill(210);
  text("PRESS ENTER / TAP TO START", W/2, H/2 + 24);
  drawHalo(W/2, H/2 - 140, 30, true);
  pop();
}

function drawHUD(title){
  push();
  fill(230);
  noStroke();
  textSize(14);
  text(title, W/2, 18);
  pop();
}

function drawEcho() {
  drawHalo(echo.x + echo.w/2, echo.y + echo.h/2);
  noStroke();
  fill(255);
  rect(echo.x, echo.y, echo.w, echo.h, 3);
}

function drawEchoWorld(px, py) {
  drawHalo(px + echo.w/2, py + echo.h/2);
  noStroke();
  fill(255);
  rect(px, py, echo.w, echo.h, 3);
}

function drawHalo(cx, cy, base=PLAYER_SIZE + 12, preview=false) {
  push();
  noFill();
  stroke(255, 18);
  strokeWeight(2);
  ellipse(cx, cy, base + 30, base + 30);

  let cols = echo.collectedColors;
  for (let i = 0; i < cols.length; i++) {
    let sz = base + (cols.length - i) * 6;
    stroke(red(cols[i]), green(cols[i]), blue(cols[i]), 160);
    strokeWeight(2.0);
    ellipse(cx, cy, sz, sz);
  }

  if (echo.haloBlend) {
    stroke(red(echo.haloBlend), green(echo.haloBlend),
           blue(echo.haloBlend), 230);
    strokeWeight(3);
    ellipse(cx, cy, base - 2, base - 2);
  }

  if (!preview) {
    noStroke();
    for (let i = 0; i < 10; i++) {
      let ang = (frameCount * 0.01) + i * (TWO_PI / 10);
      let r = base/2 + sin((frameCount * 0.03) + i) * 6 + i;
      let px = cx + cos(ang) * r;
      let py = cy + sin(ang) * r;
      let c = echo.haloBlend ?
              echo.haloBlend : color(255,255,255,80);
      fill(red(c), green(c), blue(c), 18);
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
  let cur = echo.collectedColors[0];
  for (let i=1;i<echo.collectedColors.length;i++){
    cur = lerpColor(cur, echo.collectedColors[i], 0.5);
  }
  echo.haloBlend = cur;
}

function drawSwatches(){
  push();
  translate(W - 170, 24);
  textSize(11);
  fill(210);
  noStroke();
  text("Fragments Collected", 80, -10);
  for (let i=0; i<echo.collectedColors.length; i++){
    fill(echo.collectedColors[i]);
    rect(i * 26, 0, 22, 22, 4);
  }
  pop();
}

function drawVignette(){
  let ctx = drawingContext;
  let cx = W/2, cy = H/2;
  let r0 = min(W,H) * 0.2;
  let r1 = max(W,H) * 0.8;
  let grad = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
  grad.addColorStop(0, 'rgba(0,0,0,0.0)');
  grad.addColorStop(0.65, 'rgba(0,0,0,0.08)');
  grad.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);
  ctx.restore();
}

function drawGrain() {
  grainGfx.loadPixels();
  for (let y=0; y<H; y+=4) {
    for (let x=0; x<W; x+=4) {
      let v = floor(random(0,40));
      let r = v, g = v, b = v;
      for (let gy=0; gy<4; gy++){
        for (let gx=0; gx<4; gx++) {
          let px = x+gx;
          let py = y+gy;
          if (px < 0 || px >= W || py < 0 || py >= H) continue;
          let idx = 4 * (py * W + px);
          grainGfx.pixels[idx]   = r;
          grainGfx.pixels[idx+1] = g;
          grainGfx.pixels[idx+2] = b;
          grainGfx.pixels[idx+3] = 20;
        }
      }
    }
  }
  grainGfx.updatePixels();
  push();
  drawingContext.globalCompositeOperation = 'overlay';
  image(grainGfx, 0, 0);
  drawingContext.globalCompositeOperation = 'source-over';
  pop();
}

// ---------- physics ----------

function applyPlatformerPhysics(worldMode) {
  let accel = 0.75;
  if (input.left) echo.vx -= accel;
  if (input.right) echo.vx += accel;
  if (!input.left && !input.right) {
    echo.vx *= 0.78;
    if (abs(echo.vx) < 0.05) echo.vx = 0;
  }
  echo.vx = constrain(echo.vx, -MAX_H_SPEED, MAX_H_SPEED);

  if (input.up && echo.onGround) {
    echo.vy = -JUMP_STRENGTH;
    echo.onGround = false;
    try {
      if (sJump && sJump.env) {
        sJump.freq(140 + random(-20,40));
        sJump.env.play(sJump, 0, 0.02);
      }
    } catch(e){}
  }

  echo.vy += GRAVITY;
  echo.x += echo.vx;
  echo.y += echo.vy;

  if (worldMode) {
    echo.onGround = false;
    echo.x = constrain(echo.x, -100, levelWidthA + 100);
    for (let p of platformsA) {
      if (echo.vy >= 0 &&
          aabb(echo.x, echo.y + 1, echo.w, echo.h,
               p.x, p.y, p.w, p.h)) {
        echo.y = p.y - echo.h;
        echo.vy = 0;
        echo.onGround = true;
      }
    }
  } else {
    if (echo.y + echo.h >= PLATFORM_Y) {
      echo.y = PLATFORM_Y - echo.h;
      echo.vy = 0;
      echo.onGround = true;
    } else {
      echo.onGround = false;
    }
    echo.y = constrain(echo.y, -200, H+200);
  }
}

// ---------- keyboard / touch / mouse ----------

function keyPressed() {
  if ((keyCode === ENTER || keyCode === 13) &&
      gameState === START_SCREEN) {
    enterState(SCENE_1_INERTIA);
    try {
      if (sTransition && sTransition.env) {
        sTransition.env.play(sTransition, 0, 0.02);
      }
    } catch(e){}
  }

  if (key === 'r' || key === 'R') {
    resetGame();
  }

  if (typeof getAudioContext === "function") {
    let ctx = getAudioContext();
    if (ctx && ctx.state !== "running") {
      ctx.resume();
    }
  }
  startBackgroundMusic();
}

function touchStarted() {
  for (let t of touches) {
    mobileTouches[t.id] = {x: t.x, y: t.y};
  }

  if (gameState === START_SCREEN) {
    enterState(SCENE_1_INERTIA);
  }

  if (typeof getAudioContext === "function") {
    let ctx = getAudioContext();
    if (ctx && ctx.state !== "running") {
      ctx.resume();
    }
  }
  startBackgroundMusic();

  return false;
}

function touchMoved() {
  for (let t of touches) {
    mobileTouches[t.id] = {x: t.x, y: t.y};
  }
  return false;
}

function touchEnded(event) {
  let active = {};
  for (let t of touches) active[t.id] = true;
  for (let id in mobileTouches) {
    if (!active[id]) delete mobileTouches[id];
  }
  return false;
}

function mousePressed() {
  // support clicking mobile buttons on desktop
  for (let k in mobileButtons) {
    let b = mobileButtons[k];
    if (mouseX >= b.x && mouseX <= b.x + b.w &&
        mouseY >= b.y && mouseY <= b.y + b.h) {
      mobileTouches['mouse'] = {x:mouseX, y:mouseY};
    }
  }

  // RIGHT PATH: clicking a Fragment of Light triggers the cracker effect
  if (gameState === PATH_A_JOURNEY &&
      !pathATriggered &&
      pathAReadyForClick) {

    // convert mouseX from screen space to world space using camX
    let worldX = mouseX + camX;
    let worldY = mouseY;

    for (let c of pathA_cluster) {
      if (worldX >= c.x && worldX <= c.x + c.w &&
          worldY >= c.y && worldY <= c.y + c.h) {
        pathATriggered = true;
        enterState(END_CRACKERS);
        break;
      }
    }
  }

  if (typeof getAudioContext === "function") {
    let ctx = getAudioContext();
    if (ctx && ctx.state !== "running") {
      ctx.resume();
    }
  }
  startBackgroundMusic();
}

function mouseReleased() {
  if (mobileTouches['mouse']) delete mobileTouches['mouse'];
}

// ---------- reset ----------

function resetGame() {
  initEcho();
  vessels = [];
  platformsA = [];
  pathA_cluster = [];
  pathB_incoming = [];
  obstaclesA = [];
  crackersParticles = [];
  gameState = START_SCREEN;
  transitionAlpha = 0;
  currentSubtitle = "";
  pathATriggered = false;
  pathAReadyForClick = false;
}

// ---------- mobile UI ----------

function drawMobileControls() {
  push();
  noStroke();
  // left
  fill(255,16);
  rect(mobileButtons.left.x, mobileButtons.left.y,
       mobileButtons.left.w, mobileButtons.left.h, 12);
  textSize(14);
  fill(isTouchingButton(mobileButtons.left) ? 255 : 180);
  text("◀", mobileButtons.left.x + mobileButtons.left.w/2,
             mobileButtons.left.y + mobileButtons.left.h/2 - 8);

  // right
  fill(255,16);
  rect(mobileButtons.right.x, mobileButtons.right.y,
       mobileButtons.right.w, mobileButtons.right.h, 12);
  fill(isTouchingButton(mobileButtons.right) ? 255 : 180);
  text("▶", mobileButtons.right.x + mobileButtons.right.w/2,
              mobileButtons.right.y + mobileButtons.right.h/2 - 8);

  // jump
  fill(255,12);
  rect(mobileButtons.jump.x, mobileButtons.jump.y,
       mobileButtons.jump.w, mobileButtons.jump.h, 12);
  fill(isTouchingButton(mobileButtons.jump) ? 255 : 200);
  text("▲", mobileButtons.jump.x + mobileButtons.jump.w/2,
             mobileButtons.jump.y + mobileButtons.jump.h/2 - 8);
  pop();
}

/* End of single-file sketch */

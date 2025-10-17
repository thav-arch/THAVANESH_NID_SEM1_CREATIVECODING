// // Stages of Grief — Beginner-Friendly with Obstacles and Ending Quote

// let x, y, r = 80;             // Position and size of main sphere
// let colors = [];               // Array holding the background color stages
// let obstacles = [];            // Array to store moving obstacles
// let numObs = 6;                // Number of obstacles
// let ending = false;            // Flag to trigger ending sequence
// let textAlpha = 0;             // Controls fading in of the quote

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   noStroke();                  // Remove outlines, just filled shapes
//   x = 100; y = height / 2;

//   // Colors representing emotional stages from dark to light blue
//   colors = [
//     color(5,5,5),
//     color(70,70,70),
//     color(190,190,190),
//     color(220,240,255)
//   ];

//   // Create obstacles with random positions, sizes, and speeds
//   for(let i=0; i<numObs; i++){
//     obstacles.push({
//       x: random(width/2, width),
//       y: random(100, height-100),
//       size: random(40,80),
//       speed: random(1,2)
//     });
//   }
// }

// function draw() {
//   // Determine how far along the canvas the sphere is (0 = left, 1 = right)
//   let progress = constrain(x/width, 0, 1);
//   let bg = getColor(progress);  // Smoothly blended background color
//   background(bg);

//   if(!ending){
//     // ---------------- Player Movement ----------------
//     if(keyIsDown(RIGHT_ARROW)) x += 2;
//     if(keyIsDown(LEFT_ARROW)) x -= 2;
//     if(keyIsDown(UP_ARROW)) y -= 2;
//     if(keyIsDown(DOWN_ARROW)) y += 2;

//     // Keep the sphere inside canvas boundaries
//     x = constrain(x, 50, width-50);
//     y = constrain(y, 50, height-50);

//     // Draw the main sphere slightly lighter than background so it's always visible
//     fill(lerpColor(bg, color(255), 0.5));
//     ellipse(x, y, r);

//     // ---------------- Obstacles ----------------
//     for(let obs of obstacles){
//       fill(30,30,30);               // Dark grey obstacles
//       ellipse(obs.x, obs.y, obs.size);

//       obs.x -= obs.speed;           // Move obstacles left
//       if(obs.x < -obs.size){        // If off-screen, reset to right
//         obs.x = width + random(100,400);
//         obs.y = random(100, height-100);
//       }

//       // Simple collision detection
//       let d = dist(x, y, obs.x, obs.y);
//       if(d < (r/2 + obs.size/2)){
//         // If hit, gently push sphere back so player feels collision
//         x = max(50, x - 20);
//       }
//     }

//     // ---------------- Check Ending ----------------
//     // Trigger ending sequence when sphere reaches far right
//     if(x >= width-50) ending = true;

//   } else {
//     // ---------------- Ending Animation ----------------
//     // Sphere slowly moves to center
//     x = lerp(x, width/2, 0.02);
//     y = lerp(y, height/2, 0.02);
//     r = lerp(r, 120, 0.02);       // Sphere slightly expands

//     // Draw sphere
//     fill(lerpColor(bg, color(255), 0.5));
//     ellipse(x, y, r);

//     // Slowly fade in the final quote
//     textAlpha = lerp(textAlpha, 255, 0.02);
//     fill(0,50,150,textAlpha);
//     textAlign(CENTER,CENTER);
//     textSize(32);
//     text("Change is hard at first, messy in the middle\nand gorgeous at the end", width/2, height/2 + 100);
//   }
// }

// // ---------------- Helper Function ----------------
// // This blends the colors smoothly based on how far the sphere has traveled
// function getColor(p){
//   let i = floor(p*(colors.length-1));
//   let j = constrain(i+1,0,colors.length-1);
//   let t = (p*(colors.length-1)) % 1;
//   return lerpColor(colors[i], colors[j], t);
// }

// SETUP VARIABLES

// let x, y, r = 80;
// let colors = [];
// let obstacles = [];
// let numObs = 5;
// let ending = false;
// let textAlpha = 0;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   noStroke();

//   x = 100;
//   y = height / 2;

//   // Background colors — emotional healing progression
//   colors = [
//     color(10, 10, 10),
//     color(80, 80, 80),
//     color(180, 180, 200),
//     color(220, 240, 255)
//   ];

//   // Create random obstacles
//   for (let i = 0; i < numObs; i++) {
//     obstacles.push({
//       x: random(width / 2, width),
//       y: random(100, height - 100),
//       size: random(40, 80),
//       speed: random(1, 2)
//     });
//   }
// }

// function draw() {
//   // Manually calculate progress (0 → 1)
//   let progress = x / width;
//   if (progress < 0) progress = 0;
//   if (progress > 1) progress = 1;

//   // Get blended background color
//   let bg = getColor(progress);
//   background(bg);

//   if (!ending) {
//     // Move player with arrow keys
//     if (keyIsDown(RIGHT_ARROW)) x += 2;
//     if (keyIsDown(LEFT_ARROW)) x -= 2;
//     if (keyIsDown(UP_ARROW)) y -= 2;
//     if (keyIsDown(DOWN_ARROW)) y += 2;

//     // Keep player inside screen manually
//     if (x < 50) x = 50;
//     if (x > width - 50) x = width - 50;
//     if (y < 50) y = 50;
//     if (y > height - 50) y = height - 50;

//     // Draw player
//     fill(lerpColor(bg, color(255), 0.5));
//     ellipse(x, y, r);

//     // Draw and move obstacles
//     for (let obs of obstacles) {
//       fill(30);
//       ellipse(obs.x, obs.y, obs.size);
//       obs.x -= obs.speed;

//       // If off-screen, reset to right
//       if (obs.x < -obs.size) {
//         obs.x = width + random(100, 400);
//         obs.y = random(100, height - 100);
//       }

//       // Collision check
//       let d = dist(x, y, obs.x, obs.y);
//       if (d < (r / 2 + obs.size / 2)) {
//         x -= 20;
//         if (x < 50) x = 50; // prevent going past left wall
//       }
//     }

//     // Check if reached end
//     if (x >= width - 50) ending = true;

//   } else {

//     // Ending animation
//     x = lerp(x, width / 2, 0.02);
//     y = lerp(y, height / 2, 0.02);
//     r = lerp(r, 120, 0.02);

//     fill(lerpColor(bg, color(255), 0.5));
//     ellipse(x, y, r);

//     // Fade in quote

//     textAlpha = lerp(textAlpha, 255, 0.02);
//     fill(0, 50, 150, textAlpha);
//     textAlign(CENTER, CENTER);
//     textSize(28);
//     text(
//       "Change is hard at first,Messy in the middle,\nAnd gorgeous at the end.",
//       width / 2,
//       height / 2 + 100
//     );
//   }
// }

// //  COLOR BLENDING FUNCTION
// function getColor(p) {

//   // Manual bounds check instead of constrain()
//   if (p < 0) p = 0;
//   if (p > 1) p = 1;

//   let i = floor(p * (colors.length - 1));
//   let j = i + 1;
//   if (j >= colors.length) j = colors.length - 1;

//   let t = (p * (colors.length - 1)) % 1;
//   return lerpColor(colors[i], colors[j], t);
// }

// script.js
let gameState = 0; // 0 = start screen, 1 = game, 2 = end
let x, y, r;
let colors = [];
let obstacles = [];
let numObs = 5;
let ending = false;
let textAlpha = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont("Helvetica");

  x = 100;
  y = height / 2;
  r = 80;

  // Background color stages
  colors = [
    color(10, 10, 10),
    color(80, 80, 80),
    color(180, 180, 200),
    color(220, 240, 255),
  ];

  createObstacles();
}

function draw() {
  background(20);

  if (gameState === 0) {
    showStartScreen();
  } else if (gameState === 1) {
    playGame();
  } else if (gameState === 2) {
    showEnding(getColor(x / width));
  }
}

// --- START SCREEN ---
function showStartScreen() {
  background(15, 15, 15);
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(50);
  textStyle(BOLD);
  text("🌙  Stages of Healing 🌙 ", width / 2, height / 2 - 80);

  textSize(20);
  textStyle(NORMAL);
  text(
    "Move the circle through obstacles toward the light \n \n USE ARROW KEYS FOR MOVEMENT",
    width / 2,
    height / 2
  );

  textSize(20);
  fill(200);
  text("Press ENTER to begin", width / 2, height / 2 + 100);
}

// --- MAIN GAME LOOP ---

function playGame() {
  let progress = constrain(x / width, 0, 1);
  let bg = getColor(progress);
  background(bg);

  if (!ending) {
    movePlayer();
    keepPlayerInside();
    drawPlayer(bg);
    updateObstacles();
    checkCollisions();

    if (x >= width - 50) ending = true;
  } else {
    gameState = 2; // go to ending screen
  }
}

// --- Smooth background blend ---
function getColor(p) {
  let i = floor(p * (colors.length - 1));
  let j = min(i + 1, colors.length - 1);
  let t = (p * (colors.length - 1)) % 1;
  return lerpColor(colors[i], colors[j], t);
}

// --- Handle key press ---
function keyPressed() {
  if (gameState === 0 && keyCode === ENTER) {
    gameState = 1; // start game
  }
}

// Smooth background blend
function getColor(p) {
  let i = floor(p * (colors.length - 1));
  let j = min(i + 1, colors.length - 1);
  let t = (p * (colors.length - 1)) % 1;
  return lerpColor(colors[i], colors[j], t);
}

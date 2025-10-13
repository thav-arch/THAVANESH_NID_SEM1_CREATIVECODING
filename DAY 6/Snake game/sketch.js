// let triangleColor, sadTriangleColor;
// let rectX, rectY, rectSize;
// let circleX, circleY, circleSize;
// let triangleX, triangleY, triangleSize;
// let rectSpeed = 1;
// let startTime;
// let rectReachedCircle = false;
// let triangleSad = false;

// function setup() {
//   createCanvas(400, 200);
//   rectX = width / 2 - 50;
//   rectY = height / 2;
//   rectSize = 60;
//   circleX = width / 2 + 90;
//   circleY = height / 2;
//   circleSize = 60;
//   triangleX = width / 2 - 120;
//   triangleY = height / 2 + 20;
//   triangleSize = 60;
//   triangleColor = color(200, 100, 100);
//   sadTriangleColor = color(100, 50, 50);
//   startTime = millis();
// }

// function draw() {
//   background(220);

//   // Move rectangle towards circle gradually
//   if (!rectReachedCircle) {
//     rectX += rectSpeed;
//     if (rectX >= circleX - rectSize / 2) {
//       rectReachedCircle = true;
//       triangleSad = true;
//     }
//   }

//   // Draw circle
//   fill(150, 200, 220);
//   ellipse(circleX, circleY, circleSize);

//   // Draw rectangle
//   fill(100, 150, 200);
//   rectMode(CENTER);
//   rect(rectX, rectY, rectSize, rectSize);

//   // Draw triangle (different color if sad)
//   push();
//   translate(triangleX, triangleY);
//   if (triangleSad) {
//     fill(sadTriangleColor);
//   } else {
//     fill(triangleColor);
//   }
//   noStroke();
//   triangle(-triangleSize / 2, triangleSize / 2, triangleSize / 2, triangleSize / 2, 0, -triangleSize / 2);
//   pop();

//   // Player controls triangle using arrow keys
//   if (!triangleSad) {
//     if (keyIsDown(LEFT_ARROW)) {
//       triangleX -= 3;
//     }
//     if (keyIsDown(RIGHT_ARROW)) {
//       triangleX += 3;
//     }
//     if (keyIsDown(UP_ARROW)) {
//       triangleY -= 3;
//     }
//     if (keyIsDown(DOWN_ARROW)) {
//       triangleY += 3;
//     }
//   }

//   // Check if triangle reconnects with rectangle (game success)
//   if (!triangleSad && dist(triangleX, triangleY, rectX, rectY) < (triangleSize + rectSize) / 2) {
//     noLoop();
//     fill(0);
//     textAlign(CENTER);
//     textSize(20);
//     text("Reconnected! Trust Restored.", width / 2, height - 30);
//   }

//   // Show sadness message if rectangle reached the circle (betrayal)
//   if (triangleSad) {
//     fill(0);
//     textAlign(CENTER);
//     textSize(16);
//     text("Betrayed...", width / 2, height - 30);
//   }
// }

// function mousePressed() {
//   if (triangleSad) {
//     let d = dist(mouseX, mouseY, triangleX, triangleY);
//     if (d < triangleSize / 2) {
//       // Triangle pulse effect (simple color flash)
//       triangleColor = color(255, 0, 0);
//       setTimeout(() => {
//         triangleColor = sadTriangleColor;
//       }, 300);
//     }
//   }
// }


// Stages of Grief — Beginner-Friendly with Obstacles and Ending Quote

let x, y, r = 80;             // Position and size of main sphere
let colors = [];               // Array holding the background color stages
let obstacles = [];            // Array to store moving obstacles
let numObs = 6;                // Number of obstacles
let ending = false;            // Flag to trigger ending sequence
let textAlpha = 0;             // Controls fading in of the quote

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();                  // Remove outlines, just filled shapes
  x = 100; y = height / 2;

  // Colors representing emotional stages from dark to light blue
  colors = [
    color(5,5,5),
    color(70,70,70),
    color(190,190,190),
    color(220,240,255)
  ];

  // Create obstacles with random positions, sizes, and speeds
  for(let i=0; i<numObs; i++){
    obstacles.push({
      x: random(width/2, width),
      y: random(100, height-100),
      size: random(40,80),
      speed: random(1,2)
    });
  }
}

function draw() {
  // Determine how far along the canvas the sphere is (0 = left, 1 = right)
  let progress = constrain(x/width, 0, 1);
  let bg = getColor(progress);  // Smoothly blended background color
  background(bg);

  if(!ending){
    // ---------------- Player Movement ----------------
    if(keyIsDown(RIGHT_ARROW)) x += 2;
    if(keyIsDown(LEFT_ARROW)) x -= 2;
    if(keyIsDown(UP_ARROW)) y -= 2;
    if(keyIsDown(DOWN_ARROW)) y += 2;

    // Keep the sphere inside canvas boundaries
    x = constrain(x, 50, width-50);
    y = constrain(y, 50, height-50);

    // Draw the main sphere slightly lighter than background so it's always visible
    fill(lerpColor(bg, color(255), 0.5));
    ellipse(x, y, r);

    // ---------------- Obstacles ----------------
    for(let obs of obstacles){
      fill(30,30,30);               // Dark grey obstacles
      ellipse(obs.x, obs.y, obs.size);

      obs.x -= obs.speed;           // Move obstacles left
      if(obs.x < -obs.size){        // If off-screen, reset to right
        obs.x = width + random(100,400);
        obs.y = random(100, height-100);
      }

      // Simple collision detection
      let d = dist(x, y, obs.x, obs.y);
      if(d < (r/2 + obs.size/2)){
        // If hit, gently push sphere back so player feels collision
        x = max(50, x - 20);
      }
    }

    // ---------------- Check Ending ----------------
    // Trigger ending sequence when sphere reaches far right
    if(x >= width-50) ending = true;

  } else {
    // ---------------- Ending Animation ----------------
    // Sphere slowly moves to center
    x = lerp(x, width/2, 0.02);
    y = lerp(y, height/2, 0.02);
    r = lerp(r, 120, 0.02);       // Sphere slightly expands

    // Draw sphere
    fill(lerpColor(bg, color(255), 0.5));
    ellipse(x, y, r);

    // Slowly fade in the final quote
    textAlpha = lerp(textAlpha, 255, 0.02);
    fill(0,50,150,textAlpha);
    textAlign(CENTER,CENTER);
    textSize(32);
    text("Change is hard at first, messy in the middle\nand gorgeous at the end", width/2, height/2 + 100);
  }
}

// ---------------- Helper Function ----------------
// This blends the colors smoothly based on how far the sphere has traveled
function getColor(p){
  let i = floor(p*(colors.length-1));
  let j = constrain(i+1,0,colors.length-1);
  let t = (p*(colors.length-1)) % 1;
  return lerpColor(colors[i], colors[j], t);
}

// // main_player_script.js
// function movePlayer() {
//   if (keyIsDown(RIGHT_ARROW)) x += 2;
//   if (keyIsDown(LEFT_ARROW)) x -= 2;
//   if (keyIsDown(UP_ARROW)) y -= 2;
//   if (keyIsDown(DOWN_ARROW)) y += 2;
// }

// function keepPlayerInside() {
//   x = constrain(x, 50, width - 50);
//   y = constrain(y, 50, height - 50);
// }

// function drawPlayer(bg) {
//   fill(lerpColor(bg, color(255), 0.5));
//   ellipse(x, y, r);
// }

// function showEnding(bg) {
//   x = lerp(x, width / 2, 0.02);
//   y = lerp(y, height / 2, 0.02);
//   r = lerp(r, 120, 0.02);

//   drawPlayer(bg);

//   textAlpha = lerp(textAlpha, 255, 0.02);
//   fill(0, 50, 150, textAlpha);
//   textAlign(CENTER, CENTER);
//   textSize(28);
//   text(
//     "Change is hard at first, Messy in the middle,\nAnd gorgeous at the end.",
//     width / 2,
//     height / 2 + 100
//   );
// }



// VERSION 2
// main_player_script.js

// function movePlayer() {
//   if (keyIsDown(RIGHT_ARROW)) x += 2;
//   if (keyIsDown(LEFT_ARROW)) x -= 2;
//   if (keyIsDown(UP_ARROW)) y -= 2;
//   if (keyIsDown(DOWN_ARROW)) y += 2;
// }

// function keepPlayerInside() {
//   x = constrain(x, 50, width - 50);
//   y = constrain(y, 50, height - 50);
// }

// function drawPlayer() {
//   // Calculate progress (0 = start, 1 = end)
//   let progress = constrain(x / width, 0, 1);

//   // Color changes from black → deep blue → light sky blue
//   let startColor = color(10, 10, 10);         // dark (beginning)
//   let midColor = color(60, 100, 180);         // healing in progress
//   let endColor = color(200, 240, 255);        // peace / lightness

//   // Two-step gradient: first half to midColor, then mid to end
//   let sphereColor;
//   if (progress < 0.5) {
//     sphereColor = lerpColor(startColor, midColor, map(progress, 0, 0.5, 0, 1));
//   } else {
//     sphereColor = lerpColor(midColor, endColor, map(progress, 0.5, 1, 0, 1));
//   }

//   // Optional soft glow
//   noStroke();
//   for (let i = 3; i > 0; i--) {
//     fill(red(sphereColor), green(sphereColor), blue(sphereColor), 40 * i);
//     ellipse(x, y, r + i * 20);
//   }

//   // Main sphere
//   fill(sphereColor);
//   ellipse(x, y, r);
// }

// function showEnding(bg) {
//   // Smooth transition to center
//   x = lerp(x, width / 2, 0.02);
//   y = lerp(y, height / 2, 0.02);
//   r = lerp(r, 120, 0.02);

//   drawPlayer(); // sphere keeps its sky-blue color at the end

//   // Fade-in text
//   textAlpha = lerp(textAlpha, 255, 0.02);
//   fill(0, 50, 150, textAlpha);
//   textAlign(CENTER, CENTER);
//   textSize(28);
//   text(
//     "Change is hard at first, Messy in the middle,\nAnd gorgeous at the end.",
//     width / 2,
//     height / 2 + 100
//   );
// }


// #VERSION3;

// main_player_script.js

function movePlayer() {
  if (keyIsDown(RIGHT_ARROW)) x += 2;
  if (keyIsDown(LEFT_ARROW)) x -= 2;
  if (keyIsDown(UP_ARROW)) y -= 2;
  if (keyIsDown(DOWN_ARROW)) y += 2;
}

function keepPlayerInside() {
  x = constrain(x, 50, width - 50);
  y = constrain(y, 50, height - 50);
}

function drawPlayer() {
  // Calculate progress based on horizontal movement (0 = start, 1 = end)
  let progress = constrain(x / width, 0, 1);

  // Define the color transition: dark → medium → light
  let darkColor = color(15, 15, 30);        // very dark indigo
  let midColor = color(80, 130, 200);       // calm blue
  let lightColor = color(220, 240, 255);    // pale sky blue (final)

  // Smooth transition using two stages
  let sphereColor;
  if (progress < 0.5) {
    sphereColor = lerpColor(darkColor, midColor, map(progress, 0, 0.5, 0, 1));
  } else {
    sphereColor = lerpColor(midColor, lightColor, map(progress, 0.5, 1, 0, 1));
  }

  // Gentle glowing aura around the player
  noStroke();
  for (let i = 3; i > 0; i--) {
    fill(red(sphereColor), green(sphereColor), blue(sphereColor), 40 * i);
    ellipse(x, y, r + i * 20);
  }

  // Main player circle
  fill(sphereColor);
  ellipse(x, y, r);
}

function showEnding(bg) {
  // Smoothly move and grow towards the center
  x = lerp(x, width / 2, 0.02);
  y = lerp(y, height / 2, 0.02);
  r = lerp(r, 120, 0.02);

  drawPlayer(); // draw with final color (light sky blue)

  // Fade-in ending message
  textAlpha = lerp(textAlpha, 255, 0.02);
  fill(0, 50, 150, textAlpha);
  textAlign(CENTER, CENTER);
  textSize(28);
  text(
    "Change is hard at first, Messy in the middle,\nAnd gorgeous at the end.",
    width / 2,
    height / 2 + 100
  );
}

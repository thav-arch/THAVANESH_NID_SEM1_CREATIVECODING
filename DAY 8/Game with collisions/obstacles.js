// obstacles.js
// function createObstacles() { //creates multiple obstacles and stores them in the obstacles array.

//   for (let i = 0; i < numObs; i++) {
//     obstacles.push({
//       x: random(width / 2, width),
//       y: random(100, height - 100),
//       size: random(40, 80),
//       speed: random(1, 2)
//     });
//   }
// }

// function updateObstacles() {
//   fill(30);
//   for (let obs of obstacles) {
//     ellipse(obs.x, obs.y, obs.size);
//     obs.x -= obs.speed;

//     if (obs.x < -obs.size) {
//       obs.x = width + random(100, 400);
//       obs.y = random(100, height - 100);
//     }
//   }
// }

// function checkCollisions() {
//   for (let obs of obstacles) {
//     let d = dist(x, y, obs.x, obs.y);
//     if (d < (r / 2 + obs.size / 2)) {
//       x -= 20;
//       if (x < 50) x = 50;
//     }
//   }
// }


// version 2
// obstacles.js

// function createObstacles() {
//   for (let i = 0; i < numObs; i++) {
//     obstacles.push({
//       x: random(width / 2, width + 400),   // spread across right side
//       y: random(100, height - 100),
//       size: random(40, 100),
//       speed: random(0.5, 2),
//       angle: random(TWO_PI),               // for rotation
//       rotationSpeed: random(-0.03, 0.03),  // rotation direction
//       type: random(["circle", "rect", "triangle", "poly"]), // random shape type
//       offset: random(1000)                 // noise offset for organic movement
//     });
//   }
// }

// function updateObstacles() {
//   noStroke();
//   for (let obs of obstacles) {
//     push();
//     translate(obs.x, obs.y);
//     rotate(obs.angle);

//     // Organic wobble movement using Perlin noise
//     obs.y += map(noise(frameCount * 0.01 + obs.offset), 0, 1, -0.5, 0.5);

//     fill(lerpColor(color(50, 50, 60), color(180, 180, 200), noise(obs.offset + frameCount * 0.005)));
    
//     // Draw different shapes
//     switch (obs.type) {
//       case "circle":
//         ellipse(0, 0, obs.size);
//         break;
//       case "rect":
//         rectMode(CENTER);
//         rect(0, 0, obs.size, obs.size * 0.6, 10);
//         break;
//       case "triangle":
//         triangle(
//           -obs.size / 2, obs.size / 2,
//           obs.size / 2, obs.size / 2,
//           0, -obs.size / 2
//         );
//         break;
//       case "poly":
//         drawPolygon(0, 0, obs.size / 2, int(random(5, 8))); // irregular polygons
//         break;
//     }

//     pop();

//     // Movement
//     obs.x -= obs.speed;
//     obs.angle += obs.rotationSpeed;

//     // Recycle when off-screen
//     if (obs.x < -obs.size) {
//       obs.x = width + random(200, 500);
//       obs.y = random(100, height - 100);
//       obs.type = random(["circle", "rect", "triangle", "poly"]);
//       obs.size = random(40, 100);
//     }
//   }
// }

// // Helper: Draw polygon with n sides
// function drawPolygon(x, y, radius, npoints) {
//   let angle = TWO_PI / npoints;
//   beginShape();
//   for (let a = 0; a < TWO_PI; a += angle) {
//     let sx = x + cos(a) * radius * random(0.9, 1.1); // add slight randomness for organic feel
//     let sy = y + sin(a) * radius * random(0.9, 1.1);
//     vertex(sx, sy);
//   }
//   endShape(CLOSE);
// }

// // --- Collision detection remains similar ---
// function checkCollisions() {
//   for (let obs of obstacles) {
//     let d = dist(x, y, obs.x, obs.y);
//     if (d < (r / 2 + obs.size / 2)) {
//       x -= 25; // push player backward
//       if (x < 50) x = 50;
//     }
//   }
// }

// version 3

// obstacles.js

// obstacles.js

let hitAlpha = 0; // fade value for "don't give up yet" message

function createObstacles() {
  for (let i = 0; i < numObs * 2; i++) { // more obstacles
    obstacles.push({
      x: random(width, width * 2),     // start off-screen to the right
      y: random(80, height - 80),
      size: random(40, 100),
      speed: random(1, 3),
      type: random(["circle", "rect", "triangle"]),
      offset: random(1000)
    });
  }
}

function updateObstacles() {
  noStroke();
  for (let obs of obstacles) {
    // Gentle up–down motion
    obs.y += sin(frameCount * 0.02 + obs.offset) * 0.5;

    // Color changes slightly using noise
    let c = lerpColor(color(80, 130, 200), color(180, 220, 255),
                      noise(obs.offset + frameCount * 0.005));
    fill(c);

    // Draw the obstacle
    push();
    translate(obs.x, obs.y);
    switch (obs.type) {
      case "circle":
        ellipse(0, 0, obs.size);
        break;
      case "rect":
        rectMode(CENTER);
        rect(0, 0, obs.size, obs.size * 0.6, 10);
        break;
      case "triangle":
        triangle(
          -obs.size / 2, obs.size / 2,
          obs.size / 2, obs.size / 2,
          0, -obs.size / 2
        );
        break;
    }
    pop();

    // Move left
    obs.x -= obs.speed;

    // Recycle when off-screen
    if (obs.x < -obs.size) {
      obs.x = width + random(200, 600);
      obs.y = random(80, height - 80);
      obs.size = random(40, 100);
      obs.type = random(["circle", "rect", "triangle"]);
    }
  }

  // Show fade text when hit
  if (hitAlpha > 0) {
    fill(255, hitAlpha);
    textAlign(CENTER, CENTER);
    textSize(22);
    text("Don’t give up yet!", width / 2, height / 2 + 160);
    hitAlpha -= 2; // fade out gradually
  }
}

function checkCollisions() {
  for (let obs of obstacles) {
    let d = dist(x, y, obs.x, obs.y);
    if (d < (r / 2 + obs.size / 2)) {
      x -= 25; // push player backward
      if (x < 50) x = 50;

      // Trigger fade-in text
      hitAlpha = 255;
    }
  }
}


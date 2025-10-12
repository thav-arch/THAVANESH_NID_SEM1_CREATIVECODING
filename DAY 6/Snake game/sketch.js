let triangleColor, sadTriangleColor;
let rectX, rectY, rectSize;
let circleX, circleY, circleSize;
let triangleX, triangleY, triangleSize;
let rectSpeed = 1;
let startTime;
let rectReachedCircle = false;
let triangleSad = false;

function setup() {
  createCanvas(400, 200);
  rectX = width / 2 - 50;
  rectY = height / 2;
  rectSize = 60;
  circleX = width / 2 + 90;
  circleY = height / 2;
  circleSize = 60;
  triangleX = width / 2 - 120;
  triangleY = height / 2 + 20;
  triangleSize = 60;
  triangleColor = color(200, 100, 100);
  sadTriangleColor = color(100, 50, 50);
  startTime = millis();
}

function draw() {
  background(220);

  // Move rectangle towards circle gradually
  if (!rectReachedCircle) {
    rectX += rectSpeed;
    if (rectX >= circleX - rectSize / 2) {
      rectReachedCircle = true;
      triangleSad = true;
    }
  }

  // Draw circle
  fill(150, 200, 220);
  ellipse(circleX, circleY, circleSize);

  // Draw rectangle
  fill(100, 150, 200);
  rectMode(CENTER);
  rect(rectX, rectY, rectSize, rectSize);

  // Draw triangle (different color if sad)
  push();
  translate(triangleX, triangleY);
  if (triangleSad) {
    fill(sadTriangleColor);
  } else {
    fill(triangleColor);
  }
  noStroke();
  triangle(-triangleSize / 2, triangleSize / 2, triangleSize / 2, triangleSize / 2, 0, -triangleSize / 2);
  pop();

  // Player controls triangle using arrow keys
  if (!triangleSad) {
    if (keyIsDown(LEFT_ARROW)) {
      triangleX -= 3;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      triangleX += 3;
    }
    if (keyIsDown(UP_ARROW)) {
      triangleY -= 3;
    }
    if (keyIsDown(DOWN_ARROW)) {
      triangleY += 3;
    }
  }

  // Check if triangle reconnects with rectangle (game success)
  if (!triangleSad && dist(triangleX, triangleY, rectX, rectY) < (triangleSize + rectSize) / 2) {
    noLoop();
    fill(0);
    textAlign(CENTER);
    textSize(20);
    text("Reconnected! Trust Restored.", width / 2, height - 30);
  }

  // Show sadness message if rectangle reached the circle (betrayal)
  if (triangleSad) {
    fill(0);
    textAlign(CENTER);
    textSize(16);
    text("Betrayed... Click the triangle", width / 2, height - 30);
  }
}

function mousePressed() {
  if (triangleSad) {
    let d = dist(mouseX, mouseY, triangleX, triangleY);
    if (d < triangleSize / 2) {
      // Triangle pulse effect (simple color flash)
      triangleColor = color(255, 0, 0);
      setTimeout(() => {
        triangleColor = sadTriangleColor;
      }, 300);
    }
  }
}

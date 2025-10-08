let xPos;

function setup() {
  createCanvas(500, 700);
  background("#0B132B");
  noStroke();
  xPos = -50; // start off-screen to the left
}

function draw() {
  background("#0B132B");

  let yPos = height / 2;

  // Draw car
  drawShape(xPos, yPos);

  // Move car to the right
  xPos += 2;

  // When car moves off screen, reset position and color
  if (xPos > width + 50) {
    xPos = -60; // move back to left side
  }
}

function drawShape(x, y) {
  // Randomize color slightly each frame
  let r = random(150, 255);
  let g = random(100, 255);
  let b = random(100, 255);
  fill(r, g, b);

  // Body
  rect(x, y, 60, 30, 5);

  // Wheels
  fill(0);
  ellipse(x + 10, y + 35, 12, 12);
  ellipse(x + 50, y + 35, 12, 12);
}

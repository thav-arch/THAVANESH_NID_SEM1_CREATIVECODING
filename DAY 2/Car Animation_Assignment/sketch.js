let xPos;

function setup() {
  createCanvas(500, 700);
  background("#0B132B");
  noStroke();
  xPos = 0;
}

function draw() {
  // Clear the background each frame
  background("#0B132B");

  // Set a fixed vertical position for the car
  let yPos = height / 2;

  // Draw the car at the current x position
  drawCar(xPos, yPos);

  // Move the car to the right
  xPos += 1;

  // Reset position when it goes off screen
  if (xPos > width) {
    xPos = 40; // Start off-screen to the left
    
  }
}

function drawCar(x, y) {
  // Generate a random color
  let r = random(255);
  let g = random(255);
  let b = random(255);
  fill(r, g, b);

  rect(x, y, 40, 30);
  ellipse(x + 5, y + 35, 10, 10);
  ellipse(x + 35, y + 35, 10, 10);
}

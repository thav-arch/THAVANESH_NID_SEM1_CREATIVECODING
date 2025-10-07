let xPos;

function setup() {
  xPos = 0;
  createCanvas(500, 700);
  background("#0B132B");
  noStroke ();
}

function draw() {
}

function mouseDragged() {
  drawCar(mouseX, mouseY);
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

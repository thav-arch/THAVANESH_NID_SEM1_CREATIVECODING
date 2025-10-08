let xPos;

function setup() {
  xPos = 0;
  createCanvas(500, 700);
  background("#0B132B");
  strokeWeight (1)
}

function draw() {
}

function mouseDragged() {
  drawSnowman(mouseX, mouseY);
}

function mousePressed() {
  drawSnowman(mouseX, mouseY);
}

function drawSnowman(x, y) {

  let r = random(255);
  let g = random(255);
  let b = random(255);
  fill(r, g, b);
  ellipse(x + 0, y + 80, 100, 100);
  
  ellipse(x + 0, y , frameCount%50, frameCount%50);
}
let cols, rows;
let spacing = 50;
let current = 0;
let isPaused = false;
let reverse = false;

function setup() {
  createCanvas(innerWidth, innerHeight);
  background("#b0e0e6");
  noStroke();
  
  cols = floor(width / spacing);
  rows = floor(height / spacing);
  frameRate(30);
}

function draw() {
  if (isPaused) return;

  // calculate grid position
  let x = (current % cols) * spacing + spacing / 2;
  let y = floor(current / cols) * spacing + spacing / 2;

  if (!reverse) {
    // draw forward
    fill(random(255), random(255), random(255), 100);
    ellipse(x, y, 25, 25);
    current++;
    if (current >= cols * rows) {
      noLoop();
    }
  } else {
    // erase backward
    fill("#b0e0e6");
    rectMode(CENTER);
    rect(x, y, spacing, spacing); // cover that cell
    current--;
    if (current <= 0) {
      noLoop();
    }
  }
}

function mousePressed() {
  isPaused = !isPaused;

  if (!isPaused) {
    loop();
  } else {
    noLoop();
  }
}

// reverse direction on double click
function doubleClicked() {
  reverse = !reverse;
  loop(); // make sure it resumes after reversing
}

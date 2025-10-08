let x, y, size, choice;

function setup() {
  createCanvas(600, 600);
  background("#b0e0e6"); // light purple background
  x = 0;
  y = 0;
  size = 20;
}

function draw() {
  // Random stroke weight between 0 and 2
  strokeWeight(random(0, 2));

  
  stroke(random(0,250), random(0,250), random(0,250));

  // Random line orientation
  choice = random(0, 1);
  if (choice < 0.5) {
    line(x, y, x + size, y + size);
  } else {
    line(x + size, y, x, y + size);
  }

  // Move to next grid cell
  x = x + size;

  if (x > width) {
    x = 0;
    y = y + size;
  }

  // Stop drawing when the grid is full
  if (y > height) {
    noLoop();
  }
}

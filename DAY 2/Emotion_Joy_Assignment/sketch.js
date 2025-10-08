// Variables for the circle's position
let x, y;

// Variables for the circle's speed (movement per frame)
let speedX, speedY;

// Variable for the circle's current size
let size;

// Variable for controlling how much the circle grows or shrinks each frame
let growth;

function setup() {
  createCanvas(500, 700); // Create a drawing canvas 500px wide and 700px tall
  noStroke();             // Remove outline of shapes so only fill is visible
  
  // Start the circle at a random position on the canvas
  x = random(width);      // random number between 0 and canvas width
  y = random(height);     // random number between 0 and canvas height
  
  // Assign a random speed for X and Y direction
  // This decides how fast and which direction the circle moves initially
  speedX = random(-3, 3); 
  speedY = random(-3, 3);
  
  // Assign a random starting size for the circle
  size = random(20, 80); 
  
  // Assign a random growth rate, which controls how fast the circle grows or shrinks
  growth = random(0.5, 2); 
}

function draw() {
  // Clear the screen with a dark background each frame
  // This makes sure old circles don’t leave a trail
  background(30, 30, 50);
  
  // Move the circle by adding the speed to its current position
  // Each frame, the circle moves a little bit in X and Y
  x += speedX;
  y += speedY;
  
  // Bounce off edges without using if statements
  // If the circle goes past the canvas on either side, multiply speed by -1 to reverse direction
  // This makes it “bounce” off the edges
  speedX *= (x > width || x < 0) ? -1 : 1;
  speedY *= (y > height || y < 0) ? -1 : 1;
  
  // Change the circle's size every frame
  // Adds growth to current size
  size += growth;
  
  // Reverse growth direction if the circle becomes too big or too small
  // If size > 80 or size < 20, multiply growth by -1
  // This makes the circle shrink when it's too big, or grow when it's too small
  growth *= (size > 80 || size < 20) ? -1 : 1;
  
  // Draw the circle at current position and size
  // Fill color changes randomly every frame
  fill(random(255), random(255), random(255));
  ellipse(x, y, size);
}

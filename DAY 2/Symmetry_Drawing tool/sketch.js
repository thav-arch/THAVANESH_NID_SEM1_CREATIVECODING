function setup() {
  createCanvas(500, 700);       // Create a canvas 500px wide and 700px tall
  background("#3f4739");        // Fill background with dark green color
  noStroke();                   // Remove outlines from shapes
}

function draw() {
  // Dynamic fill color based on mouse position
  // Red = mouseX / 2, Green = mouseY / 2, Blue = mouseX/4 + mouseY + 4
  fill(mouseX / 2, mouseY / 2, mouseX / 4 + mouseY + 4);

  // Draw circle at mouse position
  ellipse(mouseX, mouseY, 20, 20);

  // Draw a mirrored circle horizontally
  // width - mouseX flips it across the vertical axis
  ellipse(width - mouseX, mouseY, 20, 20);
}

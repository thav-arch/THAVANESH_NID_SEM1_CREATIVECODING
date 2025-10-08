function setup() {
  createCanvas(600, 600);
  background("purple");
}

function draw() {
  background("purple"); // clear every frame
  

  // Check if mouse is inside the first quadrant
  if (mouseX < 300  && mouseY < height/2) {
    fill("red");
    ellipse(mouseX, mouseY, 40, 40); // draw a small red rectangle at mouse position
  } else {
    fill("white");
    rect(mouseX, mouseY, 50, 50); // small white rectangle for other areas
  }
}

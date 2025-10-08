function setup() {
  createCanvas(400, 400);
  background(220);
}

function draw() {

}

function mouseDragged() {
  if (mouseY < height / 2) {
    fill("green")
    rect(mouseX, mouseY, 40, 20);
  } else {
    fill("red")
    ellipse(mouseX, mouseY, 40, 40)
  }
}

function setup() {
  createCanvas(400, 400);
  background(220);
}

function draw() {
  
}

function mouseClicked  () {
if (mouseY < height/2) 
{fill (20)
rect (mouseX,mouseY, 40,20);
} else {
fill(90)
ellipse(mouseX,mouseY,40,40)
}
}

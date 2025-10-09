//angleMode(Degree)

let noPetals = 12;

function setup() {
  createCanvas(400, 400);
  background(220);
  angleMode(DEGREES);
}

function draw() {
  push();

  //origin
  translate(width / 2, height / 2);
  ellipse(0, 0, 60, 60);
  //petals
  
  for (let i=0; i=noPetals; i++) {
    fill(80,0,80,10);
    ellipse(80, 0, 60, 60);
    rotate (360/noPetals);
  }
  // rotate (60);
  // ellipse(80,0,100,50);
  // rotate (60);
  // ellipse(80,0,100,50);
  // rotate (60);
  // ellipse(80,0,100,50);
  // rotate (60);
  // ellipse(80,0,100,50);
  // rotate (60);
  // ellipse(80,0,100,50);
  // rotate (60);
  // ellipse(80,0,100,50);
  pop();



}

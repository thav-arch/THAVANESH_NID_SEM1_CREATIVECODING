let flowers = [];
function setup() {
  createCanvas(innerWidth, innerHeight);
  myFlower = new Flower (200,200);
}

function draw() {
  background(220);
  for (let i=0; i<flowers.length;i++){

    flowers[i].changeColour(mouseX,mouseY);

    flowers[i].drawFlower();
    
    flowers[i].moveFlower();

    for (let j=0 ; j<flowers.length; j++) {
      if (i!=j) {
        flowers[i].checkCollision
        (flowers[j]);
      }
    }
  }
}

function mouseClicked (){
  let tempFlower = new Flower (mouseX,mouseY, random(-2.5,5),random(-5,5));
  flowers.push(tempFlower);
}

//draw flower where i click on the canvas
//step 1 - click
//step 2 - create flower (let variable = new)
// create new flower at mouseX mouseY
// let variable = new Flower (mouseX, mouseY);
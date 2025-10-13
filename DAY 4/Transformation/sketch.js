let size = 250, f1, f2, f3, f0;
function setup() {
  createCanvas(innerHeight, innerWidth);
  frameRate(3);
}

function preload() {

f0= loadImage ("Images/f0.png")
f1= loadImage ("Images/f1.png")
f2= loadImage ("Images/f2.png")
f3= loadImage ("Images/f3.png")

}

function draw() {
  background(220);

  for (let i = 0; i < width; i=i+size) {
    for (let j = 0; j < height; j =j +size) {

      let choice = floor(random(0, 4));

      if (choice == 0) {
        image(f0, i,j); 
      } 
      else if (choice == 1) {
        image(f1, i,j);
      } 
      else if(choice == 2){
         image(f2, i,j);
      } 
      else {
        image(f3, i,j);

      }
    }
      
  }
}
let myCar;
let yourCar;

function setup() {
  createCanvas(400, 400);
  myCar=new Car(200,100,100);
  yourCar=new Car(150,200,200);
}

function draw() {
  background(220);
  myCar.show();
  yourCar.show();
}


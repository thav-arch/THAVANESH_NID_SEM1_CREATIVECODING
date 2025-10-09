let x, y, size, choice;
let imgs = [];
let numImages = 4;

function preload() {
  imgs[0] = loadImage("Frame8.png");
  imgs[1] = loadImage("Frame7.png");
  imgs[2] = loadImage("Frame6.png");
  imgs[3] = loadImage("Frame5_1.png");
}

function setup() {
  createCanvas(600, 600);
  background("#b0e0e6");
  x = 0;
  y = 0;
  size = 50;
  noStroke();
  imageMode(CENTER);
}

function draw() {
  choice = floor(random(numImages));
  image(imgs[choice], x + size / 2, y + size / 2, size, size);

  x += size;
  if (x >= width) {
    x = 0;
    y += size;
  }

  if (y >= height) {
    noLoop();
  }
}

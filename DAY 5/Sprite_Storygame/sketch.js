let spriteImg;
let sRows = 4, sCols = 8;
let sprites = [];
let x, y; 
let speed = 5;
let frameIndex = 0;
let frameDelay = 5;
let frameCounter = 0;

function preload() {
  spriteImg = loadImage("Images/explosionFull.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  let sWidth = spriteImg.width / sCols;
  let sHeight = spriteImg.height / sRows;

  for (let i = 0; i < sRows; i++) {
    for (let j = 0; j < sCols; j++) {
      let frame = spriteImg.get(j * sWidth, i * sHeight, sWidth, sHeight);
      sprites.push(frame);
    }
  }

  x = width / 2;
  y = height / 2;
}

function draw() {
  background(0);

  if (keyIsDown(68)) x += speed; // D
  if (keyIsDown(65)) x -= speed; // A
  if (keyIsDown(87)) y -= speed; // W
  if (keyIsDown(83)) y += speed; // S

  frameCounter++;
  if (frameCounter >= frameDelay) {
    frameCounter = 0;
    frameIndex = (frameIndex + 1) % sprites.length;
  }

  image(sprites[frameIndex], x, y, 64, 64);
}
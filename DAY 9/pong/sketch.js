let gBall;
let lPaddle, rPaddle;
let player1;
let player2;
let TingSound;
let img;
let bgMusic;

function preload (){
  TingSound = loadSound("assets/2.mp3");
  img = loadImage("assets/SM.png");
  bgMusic = loadSound("assets/Hola Amigo -KR$NA -Seedhe Maut ( Rap beat  instruments  karaoke 🎤.mp3");
}

function setup() {
  createCanvas(800, 400);
  bgMusic.play() 
  gBall = new Ball(width / 2, height / 2, 5, 5);
 
  // gPaddle = new Paddle(width-20, height / 2, 5, 5);

  let pWidth = 10, pHeight = 60;
  lPaddle = new Paddle (0, height/2 - pHeight/2, pWidth, pHeight, 10);  
  rPaddle = new Paddle (width-pWidth, height/2 - pHeight/2, pWidth, pHeight, 10);  
}

function draw() {
  background(220);
  image(img, 0, 0);
   gBall.move();
  gBall.checkCollisionPaddle(lPaddle);
  gBall.checkCollisionPaddle(rPaddle);
  gBall.checkCollisionWall();
  gBall.show();

  let point = gBall.checkWinner();
  if(point == 1) {
    player1++;
    gBall.reset();
    console.log("p1 vs p2 :" + player1 + " " + player2)
  } else if(point ==2 ) {
    player2++;
    gBall.reset();
    console.log("p1 vs p2 :" + player1 + " " + player2)
  }

  rPaddle.show();
  lPaddle.show();

  if (keyIsDown(UP_ARROW)) {
    rPaddle.moveUp();
  }else if(keyIsDown(DOWN_ARROW)) {
    rPaddle.moveDown();
  }

  if (keyIsDown(87)) {
    lPaddle.moveUp();
  }
    else if (keyIsDown(83)) {
    lPaddle.moveDown();
  }
  
}

let leftPaddle, rightPaddle, ball;
let roundOver = false;
let arenaX, arenaY;
let arenaW = 800, arenaH = 400;
let arenaAngle = 0;
let bgColor;
let fonts = ['monospace','serif','sans-serif','cursive','fantasy'];
let currentFont = 'sans-serif';

function setup(){
  createCanvas(1000,600);
  rectMode(CENTER);
  textAlign(CENTER,CENTER);

  arenaX = width/2;
  arenaY = height/2;

  leftPaddle = new Paddle(-arenaW/2 + 50);
  rightPaddle = new Paddle(arenaW/2 - 50);
  ball = new Ball();
  newRound();
}

function draw(){
  background(220);

  // arena
  push();
  translate(arenaX,arenaY);
  rotate(arenaAngle);
  fill(bgColor);
  noStroke();
  rect(0,0,arenaW,arenaH);

  // paddles
  leftPaddle.update(87,83);
  rightPaddle.update(UP_ARROW,DOWN_ARROW);
  leftPaddle.display();
  rightPaddle.display();

  // ball
  ball.update();
  ball.display();
  ball.checkPaddle(leftPaddle);
  ball.checkPaddle(rightPaddle);

  // check scoring
  if(ball.pos.x < -arenaW/2){ roundOver=true; }
  else if(ball.pos.x > arenaW/2){ roundOver=true; }

  pop();

  // score display
  fill(0);
  textSize(28);
  textFont(currentFont);
  text(`Player 1: ${leftPaddle.score}`, width/4, 40);
  text(`Player 2: ${rightPaddle.score}`, 3*width/4, 40);

  if(roundOver){
    textSize(32);
    text('Round Over - Press SPACE', width/2, height/2);
  }
}

function keyPressed(){
  if(key===' ' && roundOver) newRound();
}

function newRound(){
  ball.reset();
  leftPaddle.score = 0;
  rightPaddle.score = 0;
  leftPaddle.angle = random(-PI/12,PI/12);
  rightPaddle.angle = random(-PI/12,PI/12);
  arenaAngle = random(-PI/12,PI/12);
  // shift arena randomly
  arenaX = width/2 + random(-20,20);
  arenaY = height/2 + random(-20,20);
  bgColor = color(random(100,255),random(100,255),random(100,255));
  currentFont = random(fonts);
  roundOver = false;
}

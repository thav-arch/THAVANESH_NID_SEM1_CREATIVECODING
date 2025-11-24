// FINAL MERGED ABSURDIST PONG – Chaos Arena + Gravity + Absurdism

let arenaX, arenaY;
let arenaW = 800, arenaH = 400;
let arenaAngle = 0;
let bgColor;

let fonts = ['monospace','serif','sans-serif','cursive','fantasy'];
let currentFont = 'sans-serif';

let ball;
let leftPaddle, rightPaddle;

let roundOver = false;

let gravity = 0.1;

let absurdMessages = [
  "Nothing matters, yet keep playing.",
  "Gravity abandoned you.",
  "Your paddle fades like meaning.",
  "You were never meant to win.",
  "The universe tilts for its own amusement.",
  "Meaning dissolves again.",
  "Chaos reassures itself.",
  "Your achievements dissolve into the void."
];
let message = "";

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
  background(20);

  // Random absurd background flashes (from Code A)
  if (random(1) < 0.02) {
    background(random(255), random(255), random(255));
  }

  applyGravityChaos();

  // Arena container
  push();
  translate(arenaX, arenaY);
  rotate(arenaAngle);

  fill(bgColor);
  noStroke();
  rect(0,0,arenaW,arenaH);

  // Paddles
  leftPaddle.update(87,83); // W/S
  rightPaddle.update(UP_ARROW,DOWN_ARROW);

  leftPaddle.display();
  rightPaddle.display();

  // Ball
  ball.update();
  ball.display();
  ball.checkPaddle(leftPaddle);
  ball.checkPaddle(rightPaddle);

  // Scoring logic
  if(ball.pos.x < -arenaW/2){
    rightPaddle.score++;
    roundOver = true;
  }
  if(ball.pos.x > arenaW/2){
    leftPaddle.score++;
    roundOver = true;
  }

  pop();

  // UI Text
  fill(255);
  textSize(28);
  textFont(currentFont);
  text(`Player 1: ${leftPaddle.score}`, width/4, 40);
  text(`Player 2: ${rightPaddle.score}`, 3*width/4, 40);

  textSize(18);
  fill(200);
  text(message, width/2, height - 40);

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

  // Arena chaos (from CODE B)
  arenaAngle = random(-PI/10, PI/10);
  arenaX = width/2 + random(-30,30);
  arenaY = height/2 + random(-30,30);

  // Aesthetic randomness
  bgColor = color(random(100,255),random(100,255),random(100,255));
  currentFont = random(fonts);

  // Reset absurd message
  message = random(absurdMessages);

  roundOver = false;
}


// ------------------------
// PADDLE CLASS (MERGED)
// ------------------------
class Paddle {
  constructor(x){
    this.x = x;
    this.y = 0;
    this.baseW = 20;
    this.baseH = 120;
    this.w = this.baseW;
    this.h = this.baseH;
    this.speed = 7;
    this.angle = 0;
    this.alpha = 255;
    this.score = 0;
  }

  update(upKey, downKey){
    let moved = false;

    if(keyIsDown(upKey)){
      this.y -= this.speed;
      moved = true;
    }
    if(keyIsDown(downKey)){
      this.y += this.speed;
      moved = true;
    }

    // Random shape distortions (from Code A)
    if (random(1) < 0.03) this.alpha = random(50,255);
    if (random(1) < 0.01) this.alpha = 0;

    // Absurd height flicker on movement
    if(moved){
      this.h = random(40,180);
      this.angle = random(-0.4,0.4);
    }

    // Gentle absurd wobble
    this.y += random(-1,1);

    // Keep inside arena
    this.y = constrain(this.y, -arenaH/2 + this.h/2, arenaH/2 - this.h/2);
  }

  display(){
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(255, this.alpha);
    rectMode(CENTER);
    rect(0,0,this.w,this.h);
    pop();
  }
}


// ------------------------
// BALL CLASS (MERGED)
// ------------------------
class Ball {
  constructor(){
    this.pos = createVector(0,0);
    this.vel = createVector(5, random(-2,2));
    this.size = 20;
    this.weight = 1;
  }

  reset(){
    this.pos.set(0,0);
    this.vel = createVector(random([-5,5]), random(-2,2));

    // absurd ball weight variation (Code A)
    this.weight = random(0.5, 2);

    message = random(absurdMessages);
  }

  update(){
    this.pos.add(this.vel);

    // Gravity chaos effect (merge from Code A)
    this.vel.y += gravity * this.weight;

    // Arena bounds (vertical)
    if (this.pos.y < -arenaH/2 || this.pos.y > arenaH/2){
      this.vel.y *= -0.9;
      message = random(absurdMessages);
    }

    // Random score wipe (Code A tradition)
    if (random(1) < 0.002){
      leftPaddle.score = 0;
      rightPaddle.score = 0;
      message = "Your progress is meaningless.";
    }
  }

  display(){
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  checkPaddle(p){
    if(
      this.pos.x > p.x - p.w/2 &&
      this.pos.x < p.x + p.w/2 &&
      this.pos.y > p.y - p.h/2 &&
      this.pos.y < p.y + p.h/2
    ){
      this.vel.x *= -1.1;
      this.vel.y += random(-2,2);

      message = random(absurdMessages);
    }
  }
}


// ------------------------
// GRAVITY CHAOS
// ------------------------
function applyGravityChaos(){
  if(random(1) < 0.01){
    gravity = random(-0.4, 0.4);
    ball.weight = random(0.5,2);
    message = "Gravity reconsiders its life choices.";
  }
}

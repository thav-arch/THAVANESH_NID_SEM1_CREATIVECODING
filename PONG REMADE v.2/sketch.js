// // Absurdist Pong - p5.js

// let ball = {
//   x: 300,
//   y: 200,
//   size: 20,
//   xspeed: 5,
//   yspeed: 3
// };

// let p1 = {
//   x: 50,
//   y: 200,
//   w: 20,
//   h: 100,
//   angle: 0
// };

// let p2 = {
//   x: 550,
//   y: 200,
//   w: 20,
//   h: 100,
//   angle: 0
// };

// let score1 = 0;
// let score2 = 0;

// let absurdMessages = [
//   "Nothing matters, yet keep playing.",
//   "The universe is indifferent.",
//   "Winning is temporary. Meaning is fragile.",
//   "You cannot escape the absurd.",
//   "Try again. Or don't."
// ];

// let message = "";

// function setup() {
//   createCanvas(600, 400);
//   textAlign(CENTER, CENTER);
//   textSize(20);
// }

// function draw() {
//   // Random absurd background flashes
//   if (random(1) < 0.02) {
//     background(random(255), random(255), random(255));
//   } else {
//     background(10);
//   }

//   moveBall();
//   drawBall();

//   handlePaddle(p1, 'W', 'S', 'A', 'D');
//   handlePaddle(p2, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW);

//   drawPaddle(p1);
//   drawPaddle(p2);

//   drawScore();
//   drawMessage();
// }

// function moveBall() {
//   ball.x += ball.xspeed;
//   ball.y += ball.yspeed;

//   if (ball.y < 0 || ball.y > height) ball.yspeed *= -1;

//   // Collision with paddles
//   if (checkHit(p1) || checkHit(p2)) {
//     ball.xspeed *= -1.1;  // speed up absurdly
//     ball.yspeed += random(-2, 2); // add chaos
//     message = random(absurdMessages);
//   }

//   // Score handling
//   if (ball.x < 0) {
//     score2++;
//     resetBall();
//   }
//   if (ball.x > width) {
//     score1++;
//     resetBall();
//   }

//   // Randomly erase score (nothing matters)
//   if (random(1) < 0.005) {
//     score1 = 0;
//     score2 = 0;
//     message = "Your progress is meaningless.";
//   }
// }

// function resetBall() {
//   ball.x = width / 2;
//   ball.y = height / 2;
//   ball.xspeed = random([-5, 5]);
//   ball.yspeed = random(-3, 3);
// }

// function checkHit(p) {
//   let left = ball.x - ball.size / 2;
//   let right = ball.x + ball.size / 2;
//   return (
//     right > p.x - p.w / 2 &&
//     left < p.x + p.w / 2 &&
//     ball.y > p.y - p.h / 2 &&
//     ball.y < p.y + p.h / 2
//   );
// }

// function handlePaddle(p, upKey, downKey, leftKey, rightKey) {
//   // random paddle height per movement (absurdity)
//   if (keyIsDown(upKey)) {
//     p.y -= 5;
//     p.h = random(40, 150);
//     p.angle = random(-30, 30);
//   }
//   if (keyIsDown(downKey)) {
//     p.y += 5;
//     p.h = random(40, 150);
//     p.angle = random(-30, 30);
//   }

//   // horizontal rotation movement
//   if (keyIsDown(leftKey)) p.angle -= 5;
//   if (keyIsDown(rightKey)) p.angle += 5;

//   p.y = constrain(p.y, 50, height - 50);
// }

// function drawPaddle(p) {
//   push();
//   translate(p.x, p.y);
//   rotate(radians(p.angle));
//   fill(255);
//   rectMode(CENTER);
//   rect(0, 0, p.w, p.h, 10);
//   pop();
// }

// function drawBall() {
//   fill(255);
//   ellipse(ball.x, ball.y, ball.size);
// }

// function drawScore() {
//   textSize(18);
//   fill(255);
//   text(score1, width * 0.25, 40);
//   text(score2, width * 0.75, 40);
// }

// function drawMessage() {
//   fill(200);
//   textSize(16);
//   text(message, width / 2, height - 20);
// }

// Enhanced Absurdist Pong - Gravity + Vanishing Paddles

let ball = {
  x: 300,
  y: 200,
  size: 20,
  xspeed: 5,
  yspeed: 1,
  weight: 1     // gravity multiplier
};

let p1 = { x: 50, y: 200, w: 20, h: 100, angle: 0, alpha: 255 };
let p2 = { x: 550, y: 200, w: 20, h: 100, angle: 0, alpha: 255 };

let gravity = 0.1; // global absurd gravity
let score1 = 0;
let score2 = 0;

let absurdMessages = [
  "Gravity has abandoned you.",
  "Your paddle fades like meaning.",
  "What even holds you down?",
  "The universe blinks.",
  "Existence grows heavier.",
  "You were never meant to win.",
  "The world tilts… again."
];

let message = "";

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(20);
}

function draw() {
  // Random background flash of absurdity
  if (random(1) < 0.02) {
    background(random(255), random(255), random(255));
  } else {
    background(10);
  }

  applyGravityChaos();
  moveBall();
  drawBall();

  handlePaddle(p1, 'W', 'S', 'A', 'D');
  handlePaddle(p2, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW);

  drawPaddle(p1);
  drawPaddle(p2);

  drawScore();
  drawMessage();
}

function applyGravityChaos() {
  // RANDOM GRAVITY: direction flips, intensity changes
  if (random(1) < 0.01) {
    gravity = random(-0.4, 0.4);
    ball.weight = random(0.5, 2);
    message = "Gravity reconsiders its life choices.";
  }
}

function moveBall() {
  ball.x += ball.xspeed;
  ball.y += ball.yspeed;

  // gravity applied unpredictably
  ball.yspeed += gravity * ball.weight;

  if (ball.y < 0 || ball.y > height) {
    ball.yspeed *= -0.9;
  }

  // Paddle collisions
  if (checkHit(p1) || checkHit(p2)) {
    ball.xspeed *= -1.1;
    ball.yspeed += random(-2, 2);

    message = random(absurdMessages);
  }

  // Scoring events
  if (ball.x < 0) {
    score2++;
    resetBall();
  }
  if (ball.x > width) {
    score1++;
    resetBall();
  }

  // Random score wipe
  if (random(1) < 0.005) {
    score1 = 0;
    score2 = 0;
    message = "Your achievements dissolve into the void.";
  }
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.xspeed = random([-5, 5]);
  ball.yspeed = random(-2, 2);
  ball.weight = random(0.5, 2);
}

function checkHit(p) {
  let left = ball.x - ball.size / 2;
  let right = ball.x + ball.size / 2;
  return (
    right > p.x - p.w / 2 &&
    left < p.x + p.w / 2 &&
    ball.y > p.y - p.h / 2 &&
    ball.y < p.y + p.h / 2
  );
}

function handlePaddle(p, up, down, left, right) {
  // Paddle visibility flickers randomly
  if (random(1) < 0.03) p.alpha = random(50, 255);
  if (random(1) < 0.01) p.alpha = 0; // sometimes disappears entirely

  // Random size distortion
  p.h += random(-1, 1);
  p.h = constrain(p.h, 40, 200);

  if (keyIsDown(up)) {
    p.y -= 5;
    p.angle = random(-45, 45);
    p.h = random(40, 150);
  }

  if (keyIsDown(down)) {
    p.y += 5;
    p.angle = random(-45, 45);
    p.h = random(40, 150);
  }

  if (keyIsDown(left)) p.angle -= 5;
  if (keyIsDown(right)) p.angle += 5;

  p.y = constrain(p.y, 50, height - 50);
}

function drawPaddle(p) {
  push();
  translate(p.x, p.y);
  rotate(radians(p.angle));
  rectMode(CENTER);
  fill(255, p.alpha);  // use alpha for visibility flicker
  rect(0, 0, p.w, p.h, 10);
  pop();
}

function drawBall() {
  fill(255);
  ellipse(ball.x, ball.y, ball.size);
}

function drawScore() {
  fill(255);
  text(score1, width * 0.25, 40);
  text(score2, width * 0.75, 40);
}

function drawMessage() {
  fill(200);
  textSize(16);
  text(message, width / 2, height - 20);
}

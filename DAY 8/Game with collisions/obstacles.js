// obstacles.js
function createObstacles() { //creates multiple obstacles and stores them in the obstacles array.

  for (let i = 0; i < numObs; i++) {
    obstacles.push({
      x: random(width / 2, width),
      y: random(100, height - 100),
      size: random(40, 80),
      speed: random(1, 2)
    });
  }
}

function updateObstacles() {
  fill(30);
  for (let obs of obstacles) {
    ellipse(obs.x, obs.y, obs.size);
    obs.x -= obs.speed;

    if (obs.x < -obs.size) {
      obs.x = width + random(100, 400);
      obs.y = random(100, height - 100);
    }
  }
}

function checkCollisions() {
  for (let obs of obstacles) {
    let d = dist(x, y, obs.x, obs.y);
    if (d < (r / 2 + obs.size / 2)) {
      x -= 20;
      if (x < 50) x = 50;
    }
  }
}

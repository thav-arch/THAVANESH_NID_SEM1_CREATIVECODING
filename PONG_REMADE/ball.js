class Ball {
  constructor() {
    this.reset();
  }

  reset() {
    this.pos = createVector(0,0);
    this.r = random(20,35);
    this.vel = createVector(random([-5,5]), random(-3,3));
    this.color = color(255,200,0);
  }

  update() {
    this.pos.add(this.vel);
    if(this.pos.y < -arenaH/2 + this.r || this.pos.y > arenaH/2 - this.r){
      this.vel.y *= -1;
    }
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r*2);
  }

  checkPaddle(paddle){
    let relX = this.pos.x - paddle.x;
    let relY = this.pos.y - paddle.y;
    let ca = cos(-paddle.angle);
    let sa = sin(-paddle.angle);
    let localX = relX*ca - relY*sa;
    let localY = relX*sa + relY*ca;

    let halfW = paddle.w/2;
    let halfH = paddle.h/2;
    let closestX = constrain(localX,-halfW,halfW);
    let closestY = constrain(localY,-halfH,halfH);
    let distSq = (localX-closestX)**2 + (localY-closestY)**2;

    if(distSq <= this.r**2){
      this.vel.x *= -1.1; 
      this.vel.y *= 1.05;
      this.r = constrain(this.r + random(-2,2), 15, 40); 
      this.color = color(random(255), random(255), random(255)); 
    }
  }
}

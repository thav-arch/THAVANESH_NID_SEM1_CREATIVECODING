class Paddle {
  constructor(x) {
    this.x = x;
    this.y = 0;
    this.baseW = 20;
    this.baseH = 120;
    this.w = this.baseW;
    this.h = this.baseH;
    this.speed = 7;
    this.angle = 0;
    this.score = 0;
  }

  update(upKey, downKey) {
    let moved = false;

    if(keyIsDown(upKey)){
      this.y -= this.speed;
      moved = true;
    }
    if(keyIsDown(downKey)){
      this.y += this.speed;
      moved = true;
    }

    // Randomize size & rotation when moving
    if(moved){
      this.w = this.baseW + random(-5,5);
      this.h = this.baseH + random(-30,30);
      this.angle += random(-PI/60, PI/60);
    }

    // subtle wobble
    this.y += random(-0.5,0.5);
    this.y = constrain(this.y, -arenaH/2 + this.h/2, arenaH/2 - this.h/2);
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    rectMode(CENTER);
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(0,0,this.w,this.h);
    pop();
  }
}

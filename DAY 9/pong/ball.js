// // check collision 1 that for the wall and 2 one paddle
// //x speed and y speed
// // show
// // move

// class Ball {
//     constructor(x, y, xSpeed, ySpeed) {
//         this.x = x;
//         this.y = y;
//         this.xSpeed = xSpeed;
//         this.ySpeed = ySpeed;
//         this.size = 20;
//     }

//     show() {
//         circle(this.x, this.y, this.size);
//     }

//     move () {
//         this.y  += this.ySpeed;
//         this.x += this.xSpeed;
//     }

//    reset() {
//     this.x = width/2;
//     this.y = height/2;
//   }

//   checkCollisionWall() {
//     if(this.y <this.size/2 || this.y>height-this.size/2) {
//       this.ySpeed = -this.ySpeed;
//     }
//   } 
//   checkWinner() {
//     if(this.x<0) {
//       return 2;
//     } else if(this.x>width) {
//       return 1;
//     } else {
//       return 0;
//     }
//   }

//   checkCollisionPaddle(paddle) {
//      if(this.x<paddle.x+paddle.width &&
//       this.x > paddle.x &&
//       this.y<paddle.y + paddle.height &&
//       this.y > paddle.y
//     ) {
//       console.log("BAM!!");
//       TingSound.play();
//       this.xSpeed = -this.xSpeed*1.10;
//     }
//   }

// }


class Ball {
  constructor(x, y, xSpeed, ySpeed) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = 20;

    // Store the initial speed for reset
    this.initialXSpeed = xSpeed;
    this.initialYSpeed = ySpeed;
  }

  show() {
    circle(this.x, this.y, this.size);
  }

  move() {
    this.y += this.ySpeed;
    this.x += this.xSpeed;
  }

  reset() {
    // Reset position
    this.x = width / 2;
    this.y = height / 2;

    // Reset to original speed
    this.xSpeed = this.initialXSpeed * (random() > 0.5 ? 1 : -1); // random direction
    this.ySpeed = this.initialYSpeed * (random() > 0.5 ? 1 : -1);
  }

  checkCollisionWall() {
    if (this.y < this.size / 2 || this.y > height - this.size / 2) {
      this.ySpeed = -this.ySpeed;
    }
  }

  checkWinner() {
    if (this.x < 0) {
      return 2; // Right player scores
    } else if (this.x > width) {
      return 1; // Left player scores
    } else {
      return 0; // Game continues
    }
  }

  checkCollisionPaddle(paddle) {
    if (
      this.x < paddle.x + paddle.width &&
      this.x > paddle.x &&
      this.y < paddle.y + paddle.height &&
      this.y > paddle.y
    ) {
      console.log("BAM!!");
      TingSound.play();

      // Reverse direction and slightly increase speed
      this.xSpeed = -this.xSpeed * 1.10;
    }
  }
}
s
// define only on height
// can move up and down
// should bounce of the ball
//constant speed for the paddle


// class Paddle {
//     constructor(x, y, Speed) {
//         this.x = x;
//         this.y = y;
//         this.Speed = Speed;
//         this.height = 40;
//         this.width = 10;
    
//     }

//     show() {
//         rect(this.x, this.y, this.width, this.height);
        
//     }
// }



// 2nd iteration

class Paddle {
  constructor(x,y,width,height,speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  show() {
    rect(this.x, this.y, this.width, this.height) && this.y>0;
  }

  moveUp() {
    if (this.y>0)
    this.y -=this.speed;
  }
  moveDown(){
    if (this.y<height-this.height)
    this.y +=this.speed;
  }
}
class Flower {
    constructor (x,y,xSpeed,ySpeed) {
        this.x=x;
        this.y=y;
        

        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;

    }

    drawFlower () {
        
        ellipse (this.x+20,this.y,30,20);
        ellipse (this.x,this.y+20,20,30);
        ellipse (this.x,this.y-20,20,30);
        ellipse (this.x-20,this.y,30,20);
        
        // rotate (60);


        fill("purple");
        ellipse (this.x,this.y,20);

        // rotate (60);

    }

    moveFlower () {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if(this.x>height || this.x<0) {
            this.xSpeed = -this.xSpeed;
        }

        
        if(this.y>height || this.y<0) {
            this.ySpeed = -this.ySpeed;
        }
        
    }
}
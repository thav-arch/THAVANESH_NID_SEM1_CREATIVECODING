class Flower {
    constructor(x, y, xSpeed, ySpeed) {
        this.x = x;
        this.y = y;
        this.size = 30
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;

    }

    drawFlower() {

        ellipse(this.x + 20, this.y, 30, 20);
        ellipse(this.x, this.y + 20, 20, 30);
        ellipse(this.x, this.y - 20, 20, 30);
        ellipse(this.x - 20, this.y, 30, 20);

        // rotate (60);
        ellipse(this.x, this.y, this.size);

        // rotate (60);

    }

    moveFlower() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

           // there was an error 

        if (this.x > width || this.x < 0) {
            this.xSpeed = -this.xSpeed;
        }


        if (this.y > height || this.y < 0) {
            this.ySpeed = -this.ySpeed;
        }

    }

    changeColour(mouseX, mouseY) {
        //if mx and my are close to this.x and this.y ; make the flower red or else make it white

        let distance = dist(mouseX, mouseY, this.x, this.y)
        if (distance < this.size / 2) {
            fill(0, 0, 255);
        } else {
            fill(255, 0, 0);

        }

    }

    checkCollision(otherFlower){

        
        let distance = dist(this.x, this.y, otherFlower.x, otherFlower.y);
        if (distance < this.size/2 + otherFlower.size/2){
            this.xSpeed = -this.xSpeed
            this.ySpeed = -this.ySpeed

         
            
        }
    }
}

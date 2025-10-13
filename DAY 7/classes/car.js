console.log('inside car file')


// this is blueprint, this object doesnt exist

class Car {
    constructor(x,y,size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = this.speed;
        

    }

    show() {
       
        rect(this.x,this.y,this.size,20);
        ellipse(this.x+10,this.y+20,10);
        ellipse(this.x + this.y-10, this.y+20, 10);
        
    }

   
}
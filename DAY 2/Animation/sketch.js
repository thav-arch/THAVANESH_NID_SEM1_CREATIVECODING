let x;

function setup() {
  createCanvas(500, 700);
  noStroke()
  x=0;
}

function draw() {
  background('rgb(31,31,31)');
  
  
  fill('#2C2C2C')
  ellipse (600, 500, frameCount%1200)
  
  
  fill('rgb(78,78,78)')
  ellipse (20, 300, frameCount%500)
  
  
  fill('rgb(63,63,63)')
  ellipse (50, 20, frameCount%900)
  
  fill('#4E4E4E')
  ellipse (700, 20, frameCount%200)
  
  fill('#1F1F1F')
  ellipse (800, 500, frameCount%500)
  
  fill('#4A4949')
  ellipse (500, 700, frameCount%400)
  
  //circle in the mid- Represent the couragex
  

  //orange mid

  fill('#FFD447')
  ellipse (width/2, height/2, sin(frameCount/100)*200)

 
  //mid yellow
  fill('#FFD695')
  ellipse (width/2, height/2, sin(frameCount/100)*100)

  
  
  
  
}
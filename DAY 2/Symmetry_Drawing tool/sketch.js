function setup() {
  createCanvas(500, 700);
    //Dark Green BG
  background("#3f4739");
  noStroke(0)
  

}

function draw() {



  //Circle in the mid
  fill (mouseX/2,mouseY/2,mouseX/4+mouseY+4);
  
  ellipse (mouseX,mouseY,20,20);
  ellipse (width-mouseX,mouseY,20,20);
  

  


}

let size = 50;
function setup() {
  createCanvas(innerHeight, innerWidth);
  background("#b0e0e6");

}

function draw() {

  // Loop 3 times
  for (let i = 0; i < width; i++) {
    setTimeout(() => {
      // Draw an ellipse at different x positions
      fill(random(250), random(250), random(250),50  )

      ellipse(  15 + i* 50, 15 , 25, 25);

    

    }, i * 300); // each ellipse appears 0.5s apart
  }




}

function setup() {
  createCanvas(innerWidth, innerHeight);
  randomColor = color(random(255), random(255), random(255));
}

function draw() {
  background(0,0,0,50);

//CODE 1
  // let noiseValue = noise (0.01*frameCount+1000);
  // let noiseMapped = map (noiseValue,0,1,50,200)
  // ellipse(width/2, height/2, noiseMapped)
  // console.log(noise(frameCount))

//CODE 2
  // let noiseValue = noise (0.01*frameCount+1000);
  // let noiseMapped = map (noiseValue,0,1,10,25)
  // fill(randomColor)
  // ellipse(mouseX, mouseY, noiseMapped)

// CODE 3
  // for(let i=0; i<width; i+=5){
  //   for(let j=0; j<height;j+=5) {

  //     let outputNoise = noise((i+frameCount)*0.05,j*0.05);
  //     fill(outputNoise*255)
  //     noStroke();
  //     rect(i,j,5,5)
  //   }

  // }

  // CODE 3
  for(let i=0; i<width; i+=5){
    for(let j=0; j<height;j+=5) {

      let outputNoise = noise(i+frameCount*0.5,j+ frameCount*0.5);
      fill(outputNoise*255)
      noStroke();
      rect(i,j,5,5)
    }

  }
  

// pulsating effect --> narrative etc

}

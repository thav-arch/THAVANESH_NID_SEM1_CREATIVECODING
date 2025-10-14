function setup() {
  createCanvas(400, 400);
}

function draw() {
  // //Perlin NOice In 1D
  // background(0,0,0,50);
  // let noiseValue = noise(0.01*frameCount+1000);
  // let noiseMapped=map(noiseValue,0,1,10,100);
  // ellipse(width/2, height/2, noiseMapped, noiseMapped);

  for (let i = 0; i < width; i+=5) {
    for (let j = 0; j < height; j+=5) {

      let outputNoise=noise((i+frameCount)*0.01,j*0.01);
      fill(outputNoise*255);
      noStroke();
      rect(i, j, 5, 5);
    }
  }
}
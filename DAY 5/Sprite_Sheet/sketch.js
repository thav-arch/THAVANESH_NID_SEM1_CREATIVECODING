let spriteImg;
let sRows = 4, sCols = 8;
let sprites=[];

function preload() {
  spriteImg = loadImage("Images/explosionFull.png");
}

function setup() {
  noCursor ();
  createCanvas(innerWidth, innerHeight);
  let sWidth = spriteImg.width / sCols;
  let sHeight = spriteImg.height / sRows;
  //loop the sprite image and store it in a 1D array sprites
  for (let i = 0; i < sRows; i++) {
    for (let j = 0; j < sCols; j++) {
      console.log(i,j)
      //get the slice of the image
      sprites[sprites.length] =
       spriteImg.get(j*sWidth,i*sHeight,sWidth,sHeight);
      //store it in array 
      //image.get needs (x,y,width,height)
    }

  }
  console.log(sprites);
}

function draw() {
  background(0);
  let frames=frameCount;
  image(sprites[frames%32], 0, 0,100,100);
}

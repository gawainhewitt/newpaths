


let words = ["atmospheric", "music", "play", "humanity", "emotion", "creative", "stylistic", "guitar", "confidence", "recorded", "sequencer", "ownership", "song", "performing", "bridge", "help", "collaboration", "communal", "learning", "achieve", "validation", "choices", "reflect", "flow", "escapism", "engaged", "immersion", "improvising", "musicians", "sound", "young", "minds", "CLS", "BAU", "SAU", "ITP", "respond", "communicate", "dialogue", "listening", "composing", "fun", "imaginative", "beautiful", "enriching"]; //got to page 12 of eval
let wordCounter = 0;
let fontSize;
let textX;
let textY;
let textProperties = new Array; //this will be the array in which to put the objects within which all the stuff about the text will go
let textSquareDestination = new Array;
let squareProperties;
let time;
let framesPerSecond = 60;

let started = false; //have we invoked Tone.start() and left the info screen?
let interfaceState = 0; // 0 displays the text loading, 1 is a button, 2 is info screen, 3 is error loading sound to buffer



function preload(){

}

function setup() {
  // width = 600;
  // height = 600;
  // createCanvas(width, height);
  setupCanvas();
  frameRate(framesPerSecond);
  buildText();
  makeSquare();
  setupTouch();
  // pixelDensity(1)
}

function setupCanvas(){
  let masterDiv = document.getElementById("container");
  let divPos = masterDiv.getBoundingClientRect(); //The returned value is a DOMRect object which is the smallest rectangle which contains the entire element, including its padding and border-width. The left, top, right, bottom, x, y, width, and height properties describe the position and size of the overall rectangle in pixels.
  let masterLeft = divPos.left; // distance from left of screen to left edge of bounding box
  let masterRight = divPos.right; // distance from left of screen to the right edge of bounding box
  let cnv = createCanvas(windowWidth, windowHeight); // create canvas - because i'm now using css size and !important this is really about the ratio between them, so the second number effects the shape. First number will be moved by CSS
  cnv.id('mycanvas'); // assign id to the canvas so i can style it - this is where the css dynamic sizing is applied
  cnv.parent('p5parent'); //put the canvas in a div with this id if needed - this also needs to be sized
}

function draw() {
  background(230);
  textToButton();
}

function setupTouch(){
  // *** add vanilla JS event listeners for touch which i want to use in place of the p5 ones as I believe that they are significantly faster
  let el = document.getElementById("p5parent");
  el.addEventListener("click", handleClick); // this calls the function handleClick
}

function handleClick() {
  if(!started){
      Tone.start();
      started = true;
      interfaceState = 2;
  }else if(interfaceState === 2){
      interfaceState = 1;
  }else if(interfaceState === 3){
      console.log("network problems click");
      interfaceState = 0;
      assignSoundToPlayer();
  }else{
      let d = dist(mouseX, mouseY, loadButton.x, loadButton.y);
      if (d < buttonRadius/2) {
          debounce(loadButtonPressed(), 200);
          loadButton.state = true;
      }
      if(Tone.UserMedia.supported){
          let d4 = dist(mouseX, mouseY, recordButton.x, recordButton.y);
          if (d4 < buttonRadius/2) {
              debounce(recordButtonPressed(), 200);
          }
      }
      if(uneffectedSongPlayer.loaded === true){
          let d2 = dist(mouseX, mouseY, playButton.x, playButton.y);
          if (d2 < buttonRadius) {
              debounce(playSong(), 200);
          }
      }
      for(let i = 0; i < numberOfEffectButtons; i++){
          let d3 = dist(mouseX, mouseY, effectButtons[i].x, effectButtons[i].y);
          if (d3 < buttonRadius/2) {
              debounce(effectButtonPressed(i), 200);
          }
      }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildText();
  makeSquare();
}

function makeSquare(){
  textSquareDestination.length = 0;

  let size;
  if(width < height){
    size = width/3;
  }else{
    size = height/3;
  }
  squareProperties = ({
    x: width/2 - size/2,
    y: height/2 - size/2,
    size: size,
  })
  for(let i = 0; i < textProperties.length; i++){
    textSquareDestination.push ({
      x: random(squareProperties.x, (squareProperties.x+squareProperties.size)-textWidth(textProperties[i].word)),
      y: random(squareProperties.y, squareProperties.y+squareProperties.size),
      xDistance: 0,
      yDistance: 0,
      xStepSize: 0,
      yStepSize: 0,
    });
    }
  let largestXDistance = 0;
  let largestYDistance = 0;
  for(let i = 0; i < textProperties.length; i++){
    textSquareDestination[i].xDistance = Math.abs(textProperties[i].x - textSquareDestination[i].x); // Math.abs means always a positive number
    textSquareDestination[i].yDistance = Math.abs(textProperties[i].y - textSquareDestination[i].y);
    if(textSquareDestination[i].xDistance  > largestXDistance){
      largestXDistance = textSquareDestination[i].xDistance;
    }
    if(textSquareDestination[i].yDistance > largestYDistance){
      largestYDistance = textSquareDestination[i].yDistance;
    }
  }
  for(let i = 0; i < textProperties.length; i++){
    textSquareDestination[i].xStepSize = textSquareDestination[i].xDistance/largestXDistance;
    textSquareDestination[i].yStepSize = textSquareDestination[i].yDistance/largestYDistance;
  }
}

function buildText(){
  textProperties.length = 0;

  if(width < height){
    fontSize = width/40;
  }else{
    fontSize = height/40;
  }

  textX = 0;
  textY = fontSize;

  do{
    if(textX < width) {
      textProperties.push({
        word: words[wordCounter%words.length],
        x: textX,
        y: textY,
        xSet: false,
        ySet: false,
      });
      textX += textWidth(words[wordCounter%words.length]+ textWidth(' '));
      wordCounter +=1;
    }else{
      wordCounter -=1;
      textX = textX-width - textWidth(words[wordCounter%words.length]+ textWidth(' '));
      textY += fontSize+2;
    }
  }while(textY < height+fontSize);
}

function textToButton(){
  for(let i = 0; i < textProperties.length; i++){
    textFont('Helvetica');
    if(textProperties[i].x - textSquareDestination[i].x < -1){
      textProperties[i].x += textSquareDestination[i].xStepSize;
    }else if(textProperties[i].x - textSquareDestination[i].x > 1){
      textProperties[i].x -= textSquareDestination[i].xStepSize;
    }else{
      textProperties[i].xSet = true;
    }

    if(textProperties[i].y - textSquareDestination[i].y < -1){
      textProperties[i].y += textSquareDestination[i].yStepSize;
    }else if(textProperties[i].y - textSquareDestination[i].y > 1){
      textProperties[i].y -= textSquareDestination[i].yStepSize;
    }else{
      textProperties[i].ySet = true;
    }
      textSize(fontSize);
      fill(0);
      textAlign(LEFT, TOP);
      text(textProperties[i].word, textProperties[i].x, textProperties[i].y)

    if((textProperties[i].xSet === true)&&(textProperties[i].ySet === true)){
        noStroke();
        fill('rgba(255,255,255, 0.01)');
        circle(width/2, height/2, (squareProperties.size/6)*5);
        fill(0);
        textSize(fontSize*1.8);
        textAlign(CENTER, CENTER);
        text("CLICK ME", width/2, height/2);
    }
  }
}

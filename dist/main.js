


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

var buttonState = false;
var whichSound; // which of the samples?
var theSample; //current sample
var theVolume = -6;
const player = new Tone.Player().toDestination();
const toneWaveForm = new Tone.Waveform();
toneWaveForm.size = 128;
player.connect(toneWaveForm);
var buffer0;
var buffer1;
var usedSounds = new Array;
var cnvDimension;
var bufferToPlay = buffer1;
var lastBuffer;
var currentBuffer;
var numberOfSamples = 17;
let visualisationSize;
let welcome = 0;

function preload(){
    chooseSample();
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
  player.set(
    {
      "mute": false,
      "volume": 0,
      "autostart": false,
      "fadeIn": 0,
      "fadeOut": 0,
      "loop": false,
      "playbackRate": 1,
      "reverse": false,
      "onstop": reload
    }
  );
  visualisationSize = height*2;
welcomeScreen();
}

function welcomeScreen(){
  // welcome = 2;

  if(welcome === 0){
      console.log("in welcome screen 1");
  }else if(welcome === 1){
      console.log("in welcome screen 2");
  }
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

let visualisationX, visualisationY, visualisationWidth;

function draw() {
  if(welcome == 2){
    background(230);
    visualisationX = width/8;
    visualisationY = height/2;
    visualisationWidth = (width/8)*6;
    if(interfaceState === 0){
      fill(150);
      textAlign(CENTER, CENTER);
      textSize(cnvDimension/20);
      text("Loading", width/2, height/2);
    }else if(interfaceState === 1){
      background(230);
      textToButton();
    }else if(interfaceState === 2){
      //visualisation
      let x = visualisationX;
      let y = visualisationY;
      let startX = x;
      let startY = y;
      let endX;
      let endY;
      let visualisation = toneWaveForm.getValue();
      textAlign(LEFT, TOP);
      textSize(fontSize);
      for(let i = 0; i < visualisation.length-1; i++){
          // point(x, y + (visualisation[i]*visualisationSize));
          // x = x + rectangleWidth/visualisation.length;

          startY = y + (visualisation[i]*visualisationSize);
          endX = startX + visualisationWidth/visualisation.length;
          endY = y + (visualisation[i+1]*visualisationSize);

          // line(startX, startY, endX, endY);
          text(words[i%words.length],startX, startY);
          if(i < visualisation.length - 10){
            startX = startX + visualisationWidth/visualisation.length;
          }
      }
    }else if(interfaceState === 3){
      noStroke();
      fill(buttonColour);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(cnvDimension/30);
      text("Network Problems, click to try again", visualisationX, visualisationY);
    }
  }else if(welcome == 0){
    background(230);
    textAlign(CENTER, CENTER);
    text("New Paths", width/2, height/2);
  }else if(welcome == 1){
    background(230);
    textAlign(TOP, TOP)
    text("A Sound Installation by Gawain Hewitt for City of London Sinfonia", width/2, height/2, width/2, height/2);
  }
}

function setupTouch(){
  // *** add vanilla JS event listeners for touch which i want to use in place of the p5 ones as I believe that they are significantly faster
  let el = document.getElementById("p5parent");
  el.addEventListener("click", handleClick); // this calls the function handleClick
}

function handleClick() {
  if(welcome === 2){
    if(interfaceState === 1){
        let d = dist(mouseX, mouseY, width/2, height/2);
        if (d < ((squareProperties.size/6)*5)/2) {
            buttonPressed();
            buttonState = true;
        }
    }else if(interfaceState === 3){
            console.log("network click");
            interfaceState = 0;
            assignSoundToPlayer();
    }
  }else{
    welcome = welcome +1;
    Tone.start();
    welcomeScreen();
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

function buttonPressed() {
  player.start();
  lastBuffer = currentBuffer;
  console.log(`lastBuffer = ${lastBuffer}`);
  console.log("click");
  interfaceState = 2;
  chooseSample();
  }


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min +1) ) + min;
}

function chooseSample(){
  console.log(`usedSounds = ${usedSounds}`);
  if (usedSounds.length === numberOfSamples){
      console.log(`array full`);
      usedSounds = [];
  }

  do{
      whichSound = getRndInteger(1, numberOfSamples);
  }while(haveWeUsedSound(whichSound));

  usedSounds.push(whichSound);
  console.log(`whichSound = ${whichSound}`);
  theSample = `cls${whichSound}.flac`;
  console.log(`theSample = ${theSample}`);
  console.log(`usedSounds = ${usedSounds}`);

  assignSoundToPlayer();
}

function haveWeUsedSound(comparer) {
  for(var i=0; i < usedSounds.length; i++) {
      if(usedSounds[i] === comparer){
          return true;
      }
  }
  return false;
};

function assignSoundToPlayer() {
  if(bufferToPlay === buffer1){
      buffer0 = new Tone.ToneAudioBuffer(`/assets/${theSample}`, () => {
          console.log("buffer 0 loaded");
          bufferToPlay = buffer0;
          currentBuffer = 0;
          console.log(`currentBuffer = ${currentBuffer}`);
          if (interfaceState === 0){
              reload();
          }
      },
      () => {
          interfaceState = 3;
          console.log(`interfaceState = ${interfaceState}`)
      });
  }else{
      buffer1 = new Tone.ToneAudioBuffer(`/assets/${theSample}`, () => {
          console.log("buffer 1 loaded");
          bufferToPlay = buffer1;
          currentBuffer = 1;
          console.log(`currentBuffer = ${currentBuffer}`);
          if (interfaceState === 0){
              reload();
          }
      },
      () => {
          interfaceState = 3;
          console.log(`interfaceState = ${interfaceState}`)
      });
  }
}

function reload() {
  buildText();
  makeSquare();
  console.log(`in reload`);
  if(lastBuffer !== currentBuffer){
      player.buffer = bufferToPlay.get();
      interfaceState = 1;
  }else{
      interfaceState = 0;
  }
  // buffer0.dispose();
  // chooseSample();
}



let canvasWidth;
let canvasHeight;
let words = ["atmospheric", "music", "play", "humanity", "emotion", "creative", "stylistic", "guitar", "confidence", "recorded", "sequencer", "ownership", "song", "performing", "bridge", "help", "collaboration", "communal", "learning", "achieve", "validation", "choices", "reflect", "flow", "escapism", "engaged", "immersion", "improvising", "musicians", "sound", "young", "minds", "CLS", "BAU", "SAU", "ITP", "respond", "communicate", "dialogue", "listening", "composing", "fun", "imaginative", "beautiful", "enriching"]; //got to page 12 of eval
let wordCounter = 0;
let fontSize = 12;
let textX = 0;
let textY = fontSize;
let textProperties = new Array; //this will be the array in which to put the objects within which all the stuff about the text will go
let textSquareDestination = new Array;
let squareProperties;
let time;
let framesPerSecond = 60;
let triangleSize;
let myFont;

function preload(){

}

function setup() {
  canvasWidth = 600;
  canvasHeight = 600;
  triangleSize = width/2;
  createCanvas(canvasWidth, canvasHeight);
  frameRate(framesPerSecond);
  buildText();
  makeSquare();
//   pixelDensity(1);
}

function draw() {
  background(230);
  textToButton();
}

function makeSquare(){
  squareProperties = ({
    x: canvasWidth/2 - (canvasWidth/3)/2,
    y: canvasHeight/2 - (canvasHeight/3)/2,
    width: canvasWidth/3,
    height: canvasHeight/3,
  })
  for(let i = 0; i < textProperties.length; i++){
    textSquareDestination.push ({
      x: random(squareProperties.x, (squareProperties.x+squareProperties.width)-textWidth(textProperties[i].word)),
      y: random(squareProperties.y, squareProperties.y+squareProperties.height),
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
  do{
    if(textX < canvasWidth) {
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
      textX = textX-canvasWidth - textWidth(words[wordCounter%words.length]+ textWidth(' '));
      textY += fontSize+2;
    }
  }while(textY < canvasHeight+fontSize);
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
        circle(width/2, height/2, width/5);
        fill(0);
        textSize(fontSize*1.8);
        textAlign(CENTER, CENTER);
        text("CLICK ME", width/2, height/2);
    }
  }
}

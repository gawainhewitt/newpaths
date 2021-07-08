let words;
let type = ""; // this is where we put the gradually appearing text as it appears
let counter = 0; // use this to step through the letters of the words
let paragraph = 0;
let timer = 0; // use with millis to control text appearing
let speed = [350, 100, 200, 150, 250, 300]; // speed that words appear
let spaceSpeed = 500;
let pictureLag = 100; // how much to delay the picture by
let fontbigness;
let buffer;
let sampler;
// let typeNotes = ["A0", "A#0", "B0", "C1", "C#1", "D2", "D#2"];
let typeNotes = ["B0", "C1", "C#1"];

function preload() {
    myFont = loadFont("assets/gtw.otf");
    words = loadStrings("assets/test.txt");
    buffer = new Tone.ToneAudioBuffer("assets/typeKey.wav", () => {
	console.log("loaded");
});
  }

function setup() {
    createCanvas(windowWidth, windowHeight);
    fontbigness = windowWidth/40;

    sampler = new Tone.Sampler({
        urls:{
            C1: buffer,
        },
        baseUrl:"/assets/",
    }).toDestination();
}

function draw() {
    let test = millis();
    if(words[paragraph][counter]=== " "){
        if((test-timer) > spaceSpeed) {
            if(counter < words[paragraph].length){
                type += words[paragraph][counter];
                counter++;
                timer = millis();
                makePic();
            }else if (paragraph < words.length){
                paragraph++;
                counter = 0;
            }
        }
    }else{
        if((test-timer) > random(speed)) {
            if(counter < words[paragraph].length){
                type += words[paragraph][counter];
                sampler.triggerAttackRelease("C1");
                setTimeout(function(){  makePic(); }, pictureLag);
                counter++;
                timer = millis();
            }else if (paragraph < words.length){
                paragraph++;
                counter = 0;
            }
        }
    }
}

function makePic() {
    background(255);
    fill(0);
    textFont(myFont);
    textSize(fontbigness);
    text(type, (windowWidth/10)*1, (windowHeight/10)*1, (windowWidth/10)*8, (windowHeight/10)*8);
}

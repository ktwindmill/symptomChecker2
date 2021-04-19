/*
Data and machine learning for artistic practice
Week 8

Stateful generation CharRNN
*/

let buttonArray = [];
let string = '';
let reset;
let submit;

//button positions
var radius;
var angle;
var step;

//strings/story
let title = "What's ailing you?";

//charRNN variables
let charRNN, 
    isGenerating = false,
    generated_text ='',
prediction_text = '';
let story='';

//images
let backgroundImage;
let tiles;
let tempGraphics;

function preload(){

  westernFont = loadFont('media/font/Carnevalee Freakshow.ttf');
    roboto = loadFont('media/font/Roboto-Bold.ttf');
    
    backgroundImage=loadImage('media/layout.jpg');
    tiles=loadImage('media/tiles.jpg');
}



function setup() {
  createCanvas(displayWidth, displayHeight);
tempGraphics = createGraphics
    
  
  // Create the LSTM Generator passing it the model directory
  charRNN = ml5.charRNN('./models/adages/', modelReady);
  
  
     
    //alphabet
    background(0);
  
  
  //variables for the button positions
  r = 180;
  angle = 0;
  
  //pi * 2
  step = 6.28318/26;
  
 
  
  //create the alphabet
for(let i = 1; i<27; i++){
  let letter = char(64+i);
  
  buttonArray.push(createButton(letter, letter));
  
  
}  

  
 
  //give the alphabet a function and a position in a circle
  for(let i = 0; i<buttonArray.length; i++){
    
    buttonArray[i].mousePressed(changeBG);
    var x = r *sin(angle + (step*i))+(width/2);
    var y = r*cos(angle+ (step*i))+(380);
    buttonArray[i].style("font-family","Helvetica");
       buttonArray[i].style("font-size","20px");
      buttonArray[i].style("color","#ffffff");
      buttonArray[i].style("background-color",'Transparent');
    buttonArray[i].style("border", "none");
    buttonArray[i].style("outline", "none");
      buttonArray[i].position(x,y);
      
  }
  
  submit = createButton('SUBMIT');
  submit.mousePressed(generate);
    submit.position(width/2-60,height-80);
   submit.style("font-family","Times");
    submit.style("background-color",'Transparent');
    submit.style("border", "none");
    submit.style("outline", "none");
    submit.style("color","#fcba03");
    
    
    
    reset = createButton('RESET');
  reset.mousePressed(resetString);
  reset.position(width/2+25,height-80);
     reset.style("font-family","Times");
      reset.style("background-color",'Transparent');
    reset.style("border", "none");
    reset.style("outline", "none");
    reset.style("color","#Gfcba03");
        

  
    
    
}

function draw() {
    
 background(255);
    imageMode(CORNER);
    image(tiles, 0,0,width, height);
imageMode(CENTER);
  image(backgroundImage,width/2,height/2, 500,900);
    
    
    fill(255);
  textFont(westernFont);
  textSize(36);
  textAlign(CENTER, CENTER);
  text(title, 40,0,width-80,150);
  
    
    
  fill(255, 232, 25);  
  textSize(40);
  textAlign(CENTER, CENTER);
  text(string, width/2-60,220,130,300);
    
     fill(255);  
    textSize(20);
     textAlign(CENTER, CENTER);
    text(story, width/2-230, height-200, 460, 100);
    
    textFont(roboto);
    textSize(12);
    textAlign(LEFT);
    text("This text was generated using", width/2-200, height-40);
    

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function changeBG() {
  let letter = this.value();
  letter = letter.toLowerCase();
  //console.log(letter);
  string = string+letter;
  //console.log(string)
}

function resetString(){
      background(0);
    string='';
    // Clear everything
      prediction_text = "";
      original_text = "";
    story ='';
    //background(0);
    resetModel();
    
}





function windowResized() {
  resizeCanvas(windowWidth, canvasHeight);
}

async function modelReady() {
  console.log('model ready')
  resetModel();
}

function resetModel() {
  charRNN.reset();
  const seed = string;
  charRNN.feed(seed);
  generated_text = seed;
}

function generate() {
    if(!isGenerating) {
    isGenerating = true;
    
        console.log('generating...');
    
    // Grab the original text
    let original = string;
    original_text = original;

    
    // Check if there's something
    if (original_text.length > 0) {
        
        let newString = ` ${original_text} can be treated by `;
      // Here is the data for the LSTM generator
      let data = {
       // seed: original_text,
        seed: newString,
          temperature: 0.60,
        length:120
      };
    
      // Generate text with the charRNN
      charRNN.generate(data, gotData);
    
    }else {
      // Clear everything
      prediction_text = "";
      original_text = "";
         story ='';
    }
  }
}

// Update the DOM elements with typed and generated text
function gotData(err, result) {
 console.log('ahem');
  prediction_text = result.sample;
    story = ` ${string} can be treated by ${prediction_text}`
  isGenerating = false;

}


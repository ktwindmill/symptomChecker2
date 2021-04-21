/*
Data and machine learning for artistic practice
Week 8

Stateful generation CharRNN
*/



let buttonArray = [];
let myString = '';
let reset;
let submit;
let space;
let back;

//button positions
var radius;
var angle;
var step;

//strings/story
let title = "Tell us where it hurts";
let blurb = "This is a bit of a blurb which I've not written yet. Blah blah blah blah";

let link, link2, link3;

//charRNN variables
let charRNN, 
    isGenerating = false,
    generated_text ='',
prediction_text = '';
let story='';

//images
let backgroundImage;
let tiles;
var tempGraphics;
let caducues;


//pix2pix variables
tempGraphicSize = 256;



function preload(){

  westernFont = loadFont('media/font/Carnevalee Freakshow.ttf');
    roboto = loadFont('media/font/Roboto-Bold.ttf');
    
    backgroundImage=loadImage('media/layout.jpg');
    tiles=loadImage('media/tiles.jpg');
    caducues=loadImage('media/caducues.png');
}



function setup() {
createCanvas(displayWidth, displayHeight);
tempGraphics = createGraphics(tempGraphicSize,tempGraphicSize);
    
    //hyperlink
    link = createA('http://p5js.org/', 'This is a link');
    link.position(width/4*3,height/2);
    link.style("font-family","Helvetica");
    link.style("font-size","20px");
    link.style("color","rgb(133, 4, 23)");
    
    
    link2 = createA('http://p5js.org/', 'And this is a link');
    link2.position(width/4*3,height/2+30);
    link2.style("font-family","Helvetica");
    link2.style("font-size","20px");
    link2.style("color","rgb(133, 4, 23)");
    
    
    link3 = createA('http://p5js.org/', 'This too, is a link');
    link3.position(width/4*3,height/2+60);
    link3.style("font-family","Helvetica");
    link3.style("font-size","20px");
    link3.style("color","rgb(133, 4, 23)");
    
    
    
    

    //load out pix2pix model
//    pix2pix = ml5.pix2pix("/models/bones.pict",pixModelLoaded);
pix2pix = ml5.pix2pix("/models/brain.pict",pixModelLoaded);

    
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
    
    buttonArray[i].mousePressed(type);
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
  
    
    

    
  space = createButton('SPACE',char(32));
    space.mousePressed(type);
    space.position( width/2-180,height-200);
   space.style("font-family","Helvetica");
    space.style("background-color",'Transparent');
    space.style("border", "none");
    space.style("outline", "none");
    space.style("color","#ffffff");
    
    
    
  submit = createButton('SUBMIT');
  submit.mousePressed(generate);
    submit.position(width/2+25,height-200);
   submit.style("font-family","Helvetica");
    submit.style("background-color",'Transparent');
    submit.style("border", "none");
    submit.style("outline", "none");
    submit.style("color","#ffffff");
    
    
    
    reset = createButton('RESET');
  reset.mousePressed(resetString);
  reset.position(width/2+130,height-200);
     reset.style("font-family","Helvetica");
      reset.style("background-color",'Transparent');
    reset.style("border", "none");
    reset.style("outline", "none");
    reset.style("color","#ffffff");
        

    
    back = createButton('BACKSPACE');
  back.mousePressed(backspace);
  back.position(width/2-100,height-200);
     back.style("font-family","Helvetica");
      back.style("background-color",'Transparent');
    back.style("border", "none");
    back.style("outline", "none");
    back.style("color","#ffffff");
  
    
    
}

function draw() {
    
 background(255);
    imageMode(CORNER);
    image(tiles, 0,0,width, height);
imageMode(CENTER);
  image(backgroundImage,width/2,height/2, 500,900);
    
    
    fill(255);
    image(caducues, width/6,height/4,600,600);
    noStroke();
//    rectMode(CENTER);
    rect(width/6-140, height/4+140, 300,400,20);
    fill(133, 4, 23);
    
    textFont(roboto);
  textSize(17);
    textAlign(LEFT);
    text(blurb,width/6-130, height/4+140, 300,390);
    
    
    
    fill(255);
    textSize(36);
  textAlign(CENTER, CENTER);
  text(title, 40,0,width-80,150);
  
    
    
  fill(255, 232, 25);  
  textSize(40);
  textAlign(CENTER, CENTER);
  text(myString, width/2-60,220,130,300);
    
      
    textSize(17);
     textAlign(CENTER, CENTER);
    text(story, width/2-230, height-180, 460, 100);
    
    
 fill(255);
    textSize(12);
    textAlign(LEFT);
    text("This text was generated using", width/2-200, height-40);
    

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function type() {
  let letter = this.value();
  letter = letter.toLowerCase();
  //console.log(letter);
  myString = myString+letter;
  //console.log(string)
}

function backspace(){
    let backString = myString.slice(0,-1);
    myString = backString;
    
}


function resetString(){
      background(0);
    myString='';
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
    let original = myString;
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
    createTempCanvas();
        
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
 console.log('no results here');
  prediction_text = result.sample;
    story = ` ${myString} can be treated by ${prediction_text}`
  

 //createTempCanvas()
isGenerating = false;
    
}



function createTempCanvas(){
    
        //generate the pix2pix image
  with(tempGraphics){
    background(255);
      fill(0);
      //rect(width/2, height/2, 30,30);
      
      
    //  fill(255, 232, 25);  
  textSize(60);
  textAlign(CENTER, CENTER);
  text(myString, width/2,height/2);
      
      
      
  }
    runPix2Pix();
}

///pix2pix area

function pixModelLoaded() {
    console.log('model loaded');
    isProcessing = false;
}


function runPix2Pix() {
    // Update status message
    isProcessing = true;
    console.log("applying pix2pix");

    // pix2pix requires a canvas DOM element, we can get p5.js canvas and pass this
    // Select canvas DOM element, this is the p5.js canvas
  //  const canvasElement = select("tempGraphics").elt;

    // Apply pix2pix transformation
    //pix2pix.transfer(canvasElement).then((result) => {
    
   // const canvasElement = select("tempGraphics").elt;
    
    pix2pix.transfer(tempGraphics.elt).then((result) => {
        
    isProcessing = false;
        let rec_img = createImg(result.src, "a generated image using pix2pix").hide(); // hide the DOM element
        
        with(tempGraphics){
        image(rec_img, 0, 0); // draw the image on the canvas
        }
        
        saveCanvas(tempGraphics, "prescription", "png");
        
        rec_img.remove(); // this removes the DOM element, as we don't need it anymore
    });
}



//where i am at the moment is that I need to get make the pix to pix section work


                                
                                    
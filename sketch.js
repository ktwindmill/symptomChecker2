/*
Spooky perscription generator
Katie Tindle 2021
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
let blurb = "Welcome. Tell us where it hurts and we'll take a look. \n\n Once you have submitted your answer, please wait a few moments and your advice will be displayed in the central box. \n\n Allow downloads to receive your remote psychic scan.";

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
let tempGraphicSize = 256;
let isProcessing;



function preload(){
    //load font
    roboto = loadFont('media/font/Roboto-Bold.ttf');
    
    //load images
    backgroundImage=loadImage('media/layout.jpg');
    tiles=loadImage('media/tiles.jpg');
    caducues=loadImage('media/caducues.jpg');
}



function setup() {
    
    //create canvas and offscreen canvas
    createCanvas(displayWidth, displayHeight);
    tempGraphics = createGraphics(tempGraphicSize,tempGraphicSize);
    
    //hyperlink
    link = createA('https://ml5js.org/', 'This project uses ml5');
    link.position(width/4*3,height/2);
    link.style("font-family","Helvetica");
    link.style("font-size","20px");
    link.style("color","rgb(133, 4, 23)");
    
    
    link2 = createA('http://p5js.org/', 'and P5.js');
    link2.position(width/4*3,height/2+30);
    link2.style("font-family","Helvetica");
    link2.style("font-size","20px");
    link2.style("color","rgb(133, 4, 23)");
    
    
    link3 = createA('https://katietindle.co.uk/', 'katietindle.co.uk');
    link3.position(width/4*3,height/2+80);
    link3.style("font-family","Helvetica");
    link3.style("font-size","20px");
    link3.style("color","rgb(133, 4, 23)");
    
    
    
    

    //load our pix2pix model
    pix2pix = ml5.pix2pix("/models/bones.pict",pixModelLoaded);
    //pix2pix = ml5.pix2pix("./models/brain.pict",pixModelLoaded);

    
    // Create the LSTM Generator passing it the model directory
    charRNN = ml5.charRNN('./models/adages/', modelReady);
  
  
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
  
    //create space bar
    space = createButton('SPACE',char(32));
    space.mousePressed(type);
    space.position( width/2-180,height-200);
    space.style("font-family","Helvetica");
    space.style("background-color",'Transparent');
    space.style("border", "none");
    space.style("outline", "none");
    space.style("color","#ffffff");
    
    
    //create submit button
    submit = createButton('SUBMIT');
    submit.mousePressed(generate);
    submit.position(width/2+25,height-200);
    submit.style("font-family","Helvetica");
    submit.style("background-color",'Transparent');
    submit.style("border", "none");
    submit.style("outline", "none");
    submit.style("color","#ffffff");
    
    
    //create a reset button/clear the text output
    reset = createButton('RESET');
    reset.mousePressed(resetString);
    reset.position(width/2+130,height-200);
    reset.style("font-family","Helvetica");
    reset.style("background-color",'Transparent');
    reset.style("border", "none");
    reset.style("outline", "none");
    reset.style("color","#ffffff");
        

    //create a backspace
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
    
    //draw static images
    background(255);
    imageMode(CORNER);
    image(tiles, 0,0,width, height);
    imageMode(CENTER);
    image(backgroundImage,width/2,height/2, 500,900);
    
    
    fill(255);
    image(caducues, width/6,height/4,600,600);
    noStroke();

    //draw left text box
    rect(width/6-140, height/4+140, 300,400,20);
    fill(133, 4, 23);
    
    textFont(roboto);
    textSize(17);
    textAlign(LEFT);
    text(blurb,width/6-130, height/4+110, 300,390);
    
    
    //title
    fill(255);
    textSize(36);
    textAlign(CENTER, CENTER);
    text(title, 40,0,width-80,150);
  
    
    //central inputted text
    fill(255, 232, 25);  
    textSize(40);
    textAlign(CENTER, CENTER);
    text(myString, width/2-60,220,130,300);
    
    //generated text
    textSize(17);
    textAlign(CENTER, CENTER);
    text(story, width/2-230, height-180, 460, 100);
    
    
    fill(255);
    textSize(12);
    textAlign(LEFT);
    text("This text was generated using Mother's Remedies: Over One Thousand Tried and Tested Remedies from Mothers of the United States and Canada, by Thomas Jefferson Ritter (1910)", width/2-200, height-40,420);
    
    

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function type() {
    //record the text submission
    let letter = this.value();
    letter = letter.toLowerCase();
    myString = myString+letter;
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
    const seed = myString;
    charRNN.feed(seed);
    generated_text = seed;
}

function generate() {
     isProcessing = true;
    
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
        seed: newString,
        temperature: 0.60,
        length:120
      };
    
      // Generate text with the charRNN
    charRNN.generate(data, gotData);
    //create an offscreen image with the txt for the pix2pix model
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
  
   isGenerating = false;    
}



function createTempCanvas(){
    
        //generate the offscreen image to send to pix2pix
    with(tempGraphics){
        background(255);
        fill(0);
        textSize(60);
        textAlign(CENTER, CENTER);
        text(myString, width/2,height/2); 
    }
    
    runPix2Pix();
}



//pix2pix area

function pixModelLoaded() {
    console.log('model loaded');
    isProcessing = false;
}


function runPix2Pix() {
    // Update status message
    console.log("applying pix2pix");
    //isProcessing = true;
    pix2pix.transfer(tempGraphics.elt).then((result) => {
        
    isProcessing = false;
    let rec_img = createImg(result.src, "a generated image using pix2pix").hide(); // //hide the DOM element
        
    with(tempGraphics){
        image(rec_img, 0, 0); // draw the image on the canvas
    }
        
    saveCanvas(tempGraphics, "keepThisScan", "png");
        
    rec_img.remove(); // this removes the DOM element, as we don't need it anymore
    });
}




                                
                                    

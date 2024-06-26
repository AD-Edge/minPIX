//Main minPIX functions and setup
const { init, GameLoop, GameObject, Text, load, setImagePath, Sprite, 
    initPointer, imageAssets, track, pointer, Button} = kontra;

//get components from index
const { canvas, context } = init();

//Initilize interactions
initPointer();

setImagePath('assets/images/');

//Initialize Keys
kontra.initKeys();

var textOutput = document.getElementById("exportText");
var textOutputByte = document.getElementById("exportText2_byt");
var textOutputBin = document.getElementById("exportText_bin");
var textOutputCmp = document.getElementById("exportText_cmp");

//colour detection
var colSelect = document.getElementById('colourSelect')
var colCurrent = null; 
var multiMode = true;

//Grid Calcs / variables
var gridX = 4; //number of grid spaces, from 2 - 32
var gridY = 4; //number of grid spaces, from 2 - 32
var gridPix = 16; //number of pixels in each grid space
var areaX = gridPix * gridX; //size of grid area 
var areaY = gridPix * gridY;

var gDim = areaX / gridX;
var pixThic = 1;

var timerTog = 1.5;

var currentOver = null;

//Array for cells
let cells = [];
//set to true to initialize
var redraw = true;

//UI variables 
let buttonSet = null;
let buttonX = null;
let buttonWPlus = null;
let buttonWSub = null;
let buttonHPlus = null;
let buttonHSub = null;
let buttonY = null;

var tX = null;
let Area1 = null;
let Area1Col = null;

//experimental image gen
var imageArray = []; //save all generated images here
var urlArray = []; //save all generated urls here
const testImg = new Image();
var cmpIMG = document.getElementById('compileIMG');
var tstIMG = document.getElementById('test');
var cmctx = cmpIMG.getContext("2d");

//canvas for rendering
var renderIMG = document.getElementById('renderIMG');
var rdctx = renderIMG.getContext("2d");
renderIMG.width = gridX;
renderIMG.height = gridY;
var resize = 8;
var tempCanvas=document.createElement("canvas");
var tctx=tempCanvas.getContext("2d");
//outputs used during decoding process
var arrayBuffOut = [];
var initProcessing = false; //processing complete? 
var initSetup = false;

//image to bytes
var imageData;
const imageDataByteLen = document.querySelector('#imagedata-byte-length');
const bufferByteLen = document.querySelector('#arraybuffer-byte-length');
const mimeType = 'image/png';
const imageOut = document.querySelector('#image-out');

var charsArr = [];
var hexArr = [];
var colArr = [];
var genArr = [];

//set background
renderIMG.setAttribute('style', 'background-color:#666666')
//initial setting of render image canvas
ResizeTo(renderIMG, resize);

let testObj = null;
let testUrl = '';

var blobArr = [];

//debug test rendering and processing of textGen.txt letters
//ProcessTestLetters();

//test function, build all letter sprites
function ProcessTestLetters() {
    console.log("//Need to load " + tl.length + " sprites//");
    for(var i=0; i< tl.length; i++) {


        //get first string
        var pstr = tl[i];

        //decompile
        //render to canvas
        DecompileDrawSprite(pstr, 0, 0, 5, cmpIMG);
                
        ConvertCanvastoImageData(cmpIMG, false); 
    }
}

function ProcessTestLetterImages() {

    for(var i=0; i< blobArr.length; i++) {
        
        const newImg = new Image();
        newImg.src = URL.createObjectURL(blobArr[i]);

        var imgW = tl[i].charAt(0) * 4;
        var imgH = tl[i].charAt(2) * 4;

        //set image size 
        newImg.width = imgW;
        newImg.height = imgH;

        imageArray.push(newImg);
    }

    initProcessing = true;
    console.log("Images generated: " + imageArray.length);

}


//Draw a pixel in the renderImage canvas 
function DrawRenderPixel(col, x, y) {
    rdctx.fillStyle = col;
    rdctx.fillRect( (x/(gridPix/resize)), (y/(gridPix/resize)), resize, resize );
    //console.log(x + ", " + y);
}

//Refresh/rebuild the renderImage canvas sprite
function ReBuildSprite() {
    //set back to 1-1 scale 
    //ResizeTo(renderIMG, 1/resize);
    BlankSprite();
    //redraw pixels
    for(let i = 0; i< cells.length; i++) {
        //get colour
        var gCol = cells[i].color;
        //draw only where pixels are
        if(cells[i].type == 1) {
            DrawRenderPixel(gCol, cells[i].x, cells[i].y);  
        }
    }
    //rescale
    //ResizeTo(renderIMG, resize);
}

//clear renderImage canvas
function BlankSprite() {
    rdctx.clearRect(0, 0, renderIMG.width, renderIMG.height);
}

//Set renderImage canvas back to 1-1 scale
function ReSetSprite() {
    ResizeTo(renderIMG, 1/resize);
    //resize
    renderIMG.width = gridX;
    renderIMG.height = gridY;
    //rescale
    ResizeTo(renderIMG, resize);

}

//resize canvas with temp canvas 'bounce'
function ResizeTo(canvas,pct){
    var cw=canvas.width;
    var ch=canvas.height;
    tempCanvas.width=cw;
    tempCanvas.height=ch;
    tctx.drawImage(canvas,0,0);
    canvas.width*=pct;
    canvas.height*=pct;
    var ctx=canvas.getContext('2d');
    ctx.drawImage(tempCanvas,0,0,cw,ch,0,0,cw*pct,ch*pct);
}

//Switch between 1bit & multicolour mode
function ToggleColourMode(tog) {
    if(tog != multiMode) {
        multiMode = tog;
        ReSetSprite();
        CleanUpGrid();
        BuildPixelGrid();
    }
}

//Create text for the exporter field
function GenerateExportText() {
    //debug
    //textGen.text = 'Generated (' + gridX + "," + gridY + ') data for current sprite';
    //output to html page
    
    var colString ='';
    for(var i=0; i<colArr.length; i++) {
        if(i != colArr.length-1) {
            colString += colArr[i] + ',';
        } else {
            colString += colArr[i];
        }
        colString += "\n"
    }

    var outStr = '';
    if(multiMode) {
        outStr = gridX + ',' + gridY + ',' + charsArr

    } else {
        outStr = gridX + ',' + gridY + ',' + hexArr
    }

    textOutput.value = '[Generated Export Data]' + '\n'
    + 'Sprite dimensions: ' + gridX + "x" + gridY + "\nColours: " + colArr.length + '\n'
    + colString

    + '////////////////Copy the below data segment////////////////' + '\n'
    + '\n'

    + outStr

    + '\n \n'
    + '////////////////          End Data         ////////////////';
}

//Calculate byte estimate for current pixel art
function RecalcByteEstimate() {

    let area = gridX * gridY;
    let byteNum = Math.ceil(area/4); //8 bits in a byte
    let gridString = gridX.toString() + "," + gridY.toString();
    //console.log("Grid string " + gridString + " - " + gridString.length);

    byteNum += (byteNum*1)-2; //commas 
    byteNum += colArr.length; //colour register (!No accurate)
    byteNum += gridString.length; //size values

    textOutputByte.value = '[Estimated] \n~' + byteNum + ' bytes\n'

}

//Creates pixel-art grid to draw on
function CreateGrid(xIn, yIn) {
        const gridSQR = Sprite({
            type: '0',
            x: xIn,
            y: yIn,
            color: '#999999',
            width: gDim - pixThic,
            height: gDim - pixThic,

            // text properties
            text: {
                text: '0',
                color: 'black',
                font: '0px Arial, sans-serif',
                anchor: {x: 0.5, y: 0.5}
            },
            onDown() {
                GetColourValue();
                if(colCurrent == null) {
                    this.color = '#999999';
                    this.type = 0;
                } else {
                    this.color = colCurrent;
                    this.type = 1;
                }
                //send to render Canvas
                ReBuildSprite();
                
            },
            onUp() {
                //this.color = 'grey'
                //this.y -=2;
            },
            onOver() {
                if(this.type == 0) {
                    this.color = '#AAAAAA'
                }
            },
            onOut: function() {
                if(this.type == 0) {
                    //this.color = 'rgb(153,153,153)';
                    this.color = '#999999'
                }
            }
        });
    
        track(gridSQR);
        cells.push(gridSQR);

        Area1.addChild(gridSQR);
}

//Removes all pixel-art grid data
function CleanUpGrid() {
    if(cells.length > 0) {
        //cleanup grid
        for (var i = 0; i <= cells.length - 1; i++) {
            cells[i].isActive = false;
        }
        cells.length = 0;
        cells = [];
    
        Area1 = null;
        Area1Col = null;
    }

}

//create pixel-art grid object
function BuildPixelGrid() {

    //grid area container
    Area1 = Sprite({
        type: 'obj',
        x: 8,
        y: 8,
        width: areaX,
        height: areaY,
        
        render() {
            //this.context.setLineDash([20,10]);
            this.context.lineWidth = 4;
            this.context.strokeStyle = 'black';
            this.context.strokeRect(0, 0, this.width, this.height);
        }
    });

    //block fill colour since render() somehow breaks it
    Area1Col = Sprite({
        x: 0,
        y: 0,
        color: 'black',
        width: Area1.width,
        height: Area1.height,
    });
    Area1.addChild(Area1Col);

    
    for (let i=0; i < gridX; i++) {
        for (let j=0; j < gridY; j++) {
            CreateGrid(i*gDim,j*gDim);
        }
    }

    RecalcByteEstimate();

}

//Grid X or Y expand/shrink after button press
function UpdateGridX(i, pos) {
    if(pos) {
        //increment value
        gridX++;
        areaX += 16;
        renderIMG.width = gridX;        
        //console.log(uiTexts_01[0]);
        uiTexts_01[i].text = `${gridX}`;
    } else if (!pos) {
        //increment value
        gridX--;
        areaX -= 16;
        renderIMG.width = gridX;
        //console.log(uiTexts_01[0]);
        uiTexts_01[i].text = `${gridX}`;
    }
    
    ReSetSprite();
    //trigger grid redraw
    redraw = true;
    return;
}
function UpdateGridY(i, pos) {
    if(pos) {
        //increment value
        gridY++;
        areaY += 16;
        renderIMG.height = gridY;
        //console.log(uiTexts_01[0]);
        uiTexts_01[i].text = `${gridY}`;
    } else if (!pos) {
        //increment value
        gridY--;
        areaY -= 16;
        renderIMG.height = gridY;
        //console.log(uiTexts_01[0]);
        uiTexts_01[i].text = `${gridY}`;
        
    }
    
    ReSetSprite();
    //trigger grid redraw
    redraw = true;
    return;
}

//Get currently selected colour
function GetColourValue() {
    if(val == null) { //handle transparency
        colCurrent = null;
    } else {
        colCurrent = colSelect.style.backgroundColor;
    }
    //console.log('selected colour: ' + colCurrent);  
}

function GenerateString(str) {
    var s = 0;

    //get string
    for(var i=0; i<str.length;i++) {
        var n = str.charCodeAt(i) - 96;

        if(imageArray[n]) { //check letter exists
            //console.log("Letter " + str[i] + " pos in alphabet: " + n);
            
            s += imageArray[n].width + 6;
            console.log("Rendering " + str[i] 
                + " width is " + imageArray[n].width + " position: " + s);
    
            CreateLetter(n-1, s, 0);
        }
        else {
            s += 10;//space
        }
    }
}
function CreateLetter(i, xIn, yIn) {
    
    const ASpt = Sprite({
        x: xIn,
        y: yIn,
        width: 32,
        height: 32,
        image: imageArray[i],
    });

    testObj.addChild(ASpt);
}

//Build anything that has to wait for pixel objects to generate
function InitPixelObjects() {
        
    //test string hosting object
    testObj = Sprite({
        x: 40,
        y: 280,
        width: 400,
        height: 32,
        //image: imageArray[0],

        render: function() {
            this.draw();
            this.context.strokeStyle = 'red';
            this.context.lineWidth = 1;
            this.context.strokeRect(0, 0, this.width, this.height);
        }
    });

    //img2.src = URL.createObjectURL(blobArr[28]);
    GenerateString("subspace zero");
    
}

//Main Loops
const loop = GameLoop({
    update: () => {

        if(initProcessing && !initSetup) {
            //ProcessTestLetterImages();
            InitPixelObjects();
            initSetup = true;
        }

        //for(var i=0; i< tl.length; i++) {
            //img2.src = URL.createObjectURL(blobArr[5]);
          //  this.image = img2;
        //}

        if(redraw) {
            redraw = false;
            CleanUpGrid();
            BuildPixelGrid()
        }

        cells.map(gridSQR => {
            gridSQR.update();
        });


    },
    render: () => {
        if(Area1) {
            Area1.render();
        }

        //render out each object in the render queue
        renderQueue.ui.forEach(element => {
            element.obj.render();
        });


        if(timerTog > 0) {
            timerTog-=0.1;
            if(timerTog <= 0) {
                //toggle to 1bit mode on start    
                OneBit.color = '#FFFFFF';
                OneBit.type = 1;
                MultiCol.color = '#999999';
                MultiCol.type = '0';
                DisableArea2();
                ToggleColourMode(false);
            }
        }

        if(testObj) {
            testObj.render();
        }

    },
});

//Kick off the gameloop
loop.start();

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
var colIndex = [];

//Grid Calcs / variables
var gridX = 4; //number of grid spaces, from 2 - 32
var gridY = 4; //number of grid spaces, from 2 - 32
var gridPix = 16; //number of pixels in each grid space
var areaX = gridPix * gridX; //size of grid area 
var areaY = gridPix * gridY;

var gDim = areaX / gridX;
var pixThic = 1;

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
const testImg = new Image();
//canvas for rendering
var renderIMG = document.getElementById('renderIMG');
var rdctx = renderIMG.getContext("2d");
renderIMG.width = gridX;
renderIMG.height = gridY;
var resize = 16;
var tempCanvas=document.createElement("canvas");
var tctx=tempCanvas.getContext("2d");

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

var testData = "3,5,56,7D"; //sprite data test
//DecompileSprite(testData);

function DecompileSprite(data) {
    console.log("Decompiling and rendering: " + data);
    const spitData = data.split(",");

    //1 bit for now
    context.fillStyle = 'black';  
    
    //get dimensions 
    //var w = splitData[0];
    //var h = splitData[1];
    
    for(var i=2; i< splitData.length; i++) {
        var hex = ''; //starting at [4]
        //each hex, turn into binary (array)
    }

    //build sprite from binary (basically format of previous stuff)
    var currX = 0;
    for (var i = 0; i < needed.length; i++) {
        var letter = needed[i];
        var addX = 0;
        var currY = 0;

        for (var y = 0; y < letter.length; y++) {
            var row = letter[y];
            //console.log("Drawing row: " + row);
            for (var x = 0; x < row.length; x++) {
                if (row[x]) {
                    context.fillRect(currX + x * size, currY, size, size);
                }
            }
            addX = Math.max(addX, row.length * size);
            currY += size;
        }
        currX += size + addX;
    }
    //console.log('Drew ' + string + ' at size ' + size);
}

//test data reconstruct 
let testObj = GameObject({
    x: 8,
    y: 324,
    width: 200,
    height: 30,
   
    render: function() {
      // draw the game object normally (perform rotation and other transforms)
      this.draw();      
      // outline the game object
      this.context.strokeStyle = 'red';
      this.context.lineWidth = 1;
      this.context.strokeRect(0, 0, this.width, this.height);

      DrawText(4, this.x, this.y);
    }
});


function DrawRenderPixel(col, x, y) {
    rdctx.fillStyle = col;
    rdctx.fillRect( (x/(gridPix/resize)), (y/(gridPix/resize)), resize, resize );
    //console.log(x + ", " + y);
}

function ReBuildSprite() {
    //set back to 1-1 scale 
    //ResizeTo(renderIMG, 1/resize);
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

function BlankSprite() {
    rdctx.clearRect(0, 0, renderIMG.width, renderIMG.height);
}

function ReSetSprite() {
    //set back to 1-1 scale
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

function ConvertCanvastoImageData() {
    imageData = rdctx.getImageData(0, 0, renderIMG.width, renderIMG.height);
    imageDataByteLen.textContent = imageData.data.byteLength + ' bytes.';
    //console.log(imageData);

    // Convert canvas to Blob, then Blob to ArrayBuffer.
    renderIMG.toBlob((blob) => {
    const reader = new FileReader();

    reader.addEventListener('loadend', () => {
        const arrayBuffer = reader.result;
        bufferByteLen.textContent = arrayBuffer.byteLength + ' bytes.';
            // Dispay Blob content in an Image.
            const blob = new Blob([arrayBuffer], {type: mimeType});
            imageOut.src = URL.createObjectURL(blob);
            //console.log("height: " + imageOut.style.height.value);
            imageOut.style.width = gridX*8 + 'px';
            imageOut.style.height = gridY*8 + 'px';
            //console.log(arrayBuffer);

            //var bufView = new Uint8Array(arrayBuffer);
            var bufViewID = new Uint8Array(imageData.data);
            //output to webpage
            //textOutputBin.innerHTML = "[binary output]\n" + bufViewID;

            SliceData(bufViewID);

            //run export text gen 
            //has to run in here, at the end of 'loadend'
            GenerateExportText();

        });

        reader.readAsArrayBuffer(blob);
    }, mimeType);
    
}

//run through arrayIN
//checking colours col
//output unique colours to arrayOut
function CheckCol(arrayIn, arrayGen, arrayCol) {
    var addCol = true;
    var it = 0; //iterator
    
    //Transcribe colour data
    //Remove alpha
    //Detect colours
    for(var i=0; i<arrayIn.length; i++) {
        //for every new R-G-B, check colour 
        if(it == 0) {     
            if(arrayIn[i] >= 0) { //just check for number 0-inf 
                var rgb = arrayIn[i] + ',' + arrayIn[i+1] + ',' + arrayIn[i+2];
                var a = arrayIn[i+3]; //alpha 
            
                //console.log("rgb: " + rgb + " a: " + a);
                var rgbHEX = rgbToHex(rgb);
                //cheap/quick cut down, omits rounding
                var rgbHEXm = rgbHEX.charAt(1) + rgbHEX.charAt(3) + rgbHEX.charAt(5);
                //console.log(rgbHEX); 
                //console.log(rgbHEXm); 

                if(a != 0) {    //alpha > 0     (yes colour)
                    //alpha skip (empty cell)
                    //add first colour 
                    if(arrayCol.length == 0) {
                        arrayCol[arrayCol.length] = rgb;
                        console.log("first new colour detected: " + rgb); 
                    } else {
                        //check if new colour is a previous colour?
                        for(var j=0; j<arrayCol.length; j++) {
                            if(rgb.toString() == arrayCol[j].toString()) {
                                addCol = false;
                            }
                        }
                        
                        if(addCol) {
                            arrayCol[arrayCol.length] = rgb;
                            console.log("new colour detected: " + rgb);
                        }
                
                        addCol = true;
                    }

                    //change to given register value
                    //raw pixel value
                    if(arrayIn[i] >= 0) { 
                        //get the colour index of the pixel
                        if(multiMode) {
                            arrayGen[arrayGen.length] = rgbHEXm;

                        } else {
                            arrayGen[arrayGen.length] = 1;                         
                        }

                    }

                } else {        //alpha = 0  (no colour)
                    //handle no colour
                    if(arrayIn[i] == 0) { 
                        if(multiMode) {
                            arrayGen[arrayGen.length] = '';

                        } else {
                            arrayGen[arrayGen.length] = 0;
                        }
                    }
                }
            }
        }

        //skip to next RGB
        if(it >= 3) {
            //arrayGen.splice(i, 1); //remove alpha value
            it = 0; //reset
        } else {
            it++; //increment
        }
    
    }

    //console.log("FINISHED processing colour array, number of colours: " + arrayCol.length);
}

//Operate on image data
//Build final output hex array
function SliceData(da) {
    const myArr = da.toString().split(",");
    
    //var pxASCII = '';
    
    //reset arrays
    charsArr.length = 0;
    charsArr = [];    
    hexArr.length = 0;
    hexArr = [];    
    colArr.length = 0;
    colArr = [];
    genArr.length = 0;
    genArr = [];
    
    CheckCol(myArr, genArr, colArr);
    console.log("number of colours detected: " + colArr.length);

    if(multiMode) {
        ProcessMultiColourData();
    } else {
        ProcessOneBitData();
    }
    //console.log(myArr);
    console.log(genArr);
    
    //Convert to unicode
    // var b = parseInt( bytes[0], 2 );
    // var c = parseInt( bytes[1], 2 );
    // console.log(b);
    // console.log(c);

    //console.log(String.fromCharCode(b));
    //console.log(String.fromCharCode(c));
    
    //output to webpage
    var bufViewID = new Uint8Array(myArr.data);
    if(multiMode) {
        textOutputBin.innerHTML = "[Pixel Data Output]\n" + genArr;
        textOutputCmp.innerHTML = "[Compressed Data Output]\n" + charsArr;
        
    } else {
        textOutputBin.innerHTML = "[Pixel Data Output]\n" + genArr;
        textOutputCmp.innerHTML = "[Compressed Data Output]\n" + hexArr;
        
    }
}

function ProcessOneBitData() {
    //old binary compress method
    var bytes = [];
    var BIstr = '';
    var it = 0; //iterator
    //Convert generated array to binary, remove RGB
    for(var i=0; i<genArr.length; i++) {
        if(it <= 8) {
            if(genArr[i] == 1) {
                BIstr += genArr[i].toString();
            } else if(genArr[i] == 0) {
                BIstr += '0';
            } else {
                it--;
            }
            it++;
        } 
        if(it == 8) {
            console.log("byte generated: " + BIstr);
            it = 0;
            bytes[bytes.length] = BIstr;
            BIstr = '';
        } else { //at the end without a full byte
            if(i == genArr.length-1) { //save anyway
                //expand to full byte
                console.log("byte generated: " + BIstr);
                bytes[bytes.length] = BIstr;
                BIstr = '';
            }
        }
    }
    //convert byte array values into hex
    for(var i=0; i<bytes.length; i++) {
        var hexa = parseInt(bytes[i], 2).toString(16).toUpperCase();
        console.log("HEX: " + hexa);
        hexArr[hexArr.length] = hexa;
    }
}

function ProcessMultiColourData() {
    //old binary compress method
    var bytes = [];
    var BIstr = '';
    var it = 0; //iterator

    //update colour registers
    colIndex = GetColourRegs(); //refresh
    
    //iterate through array, 2 pixels at a time
    for(var i=0; i<genArr.length; i+=2) {
        //pxASCII += String.fromCharCode(0b1000000 + 
            //(genArr[i] || 0) + ((genArr[i+1] || 0) << 3));
        var reg = GetColorIndex(genArr[i]);
        console.log("Register for colour detected: " + reg);        
        
        if(reg != -1) {
            charsArr[charsArr.length] = reg;
        } else {
            charsArr[charsArr.length] = '';
        }

        //charsArr[charsArr.length] = pxASCII;

        console.log("adding together " + genArr[i] + " & " + genArr[i+1]);
    }
    
}

function GetColorIndex(cIn) {
    //console.log("col reg: " + colIndex[1]);
    for (var i=0; i < colIndex.length; i++) {
        
        console.log("Comparing: " + colIndex[i] + " with: " + cIn);
        if(colIndex[i] == cIn) {
            console.log("Colour index of input " + cIn + " is: " + i);
            return i; //return index
        }
    }
    return -1;
}

function ToggleColourMode(tog) {
    if(tog != multiMode) {
        multiMode = tog;
        ReSetSprite();
        CleanUpGrid();
        BuildPixelGrid();
    }
}


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

function createGrid(xIn, yIn) {
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
                //colHEX = rgbToHex(colRGB);
                //console.log("col in HEX: " + colCurrent);
                this.color = colCurrent;
                this.type = 1;

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

function componentToHex(comp) {
    var hex = comp.toString(16); 

    return hex.length == 1 ? "0" + hex : hex;

}

function rgbToHex(rgb) {
    var a = rgb.split(",");
    
    var b = a.map(function(x){                      //For each array element
        x = parseInt(x).toString(16);      //Convert to a base16 string
        return (x.length==1) ? "0"+x : x; //Add zero if we get only one character
    });
    //b = "0x"+b.join("");
    b = "#"+b.join("");
        
    return b;
}

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
            createGrid(i*gDim,j*gDim);
        }
    }

    RecalcByteEstimate();

}

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

function GetColourValue() { 
    colCurrent = colSelect.style.backgroundColor;
    //console.log('selected colour: ' + colCurrent);  
}

//Main Loops
const loop = GameLoop({
    update: () => {
        
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

    },
});

//Kick off the gameloop
loop.start();
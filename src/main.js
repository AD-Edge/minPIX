
const { init, GameLoop, Text, load, setImagePath, Sprite, 
    initPointer, imageAssets, track, pointer, Button} = kontra;

//get components from index
const { canvas, context } = init();

//console.log(canvas);
console.log(canvas);
console.log(context);

//Initilize interactions
initPointer();

setImagePath('assets/images/');

//Initialize Keys
kontra.initKeys();

var textOutput = document.getElementById("exportText");
var textOutputByte = document.getElementById("exportText2_byt");
var textOutputBin = document.getElementById("exportText_bin");

//colour detection
var colSelect = document.getElementById('colourSelect')
var colCurrent = null; 

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

//Array for UI objs
let uiObjs_01 = [];
let uiTexts_01 = [];

//UI variables 
let buttonSet = null;
let buttonX = null;
let buttonWPlus = null;
let buttonWSub = null;
let buttonHPlus = null;
let buttonHSub = null;
let buttonY = null;

var tX = null;

var widthUIX = 60;
var heightUIX = 130;

let Area1 = null;
let Area1Col = null;

var sideUIX = canvas.width/4;


//experimental image gen
const testImg = new Image();
//canvas for rendering
var renderIMG = document.getElementById('renderIMG');
var rdctx = renderIMG.getContext("2d");
renderIMG.width = gridX;
renderIMG.height = gridY;
var resize = 1;
var tempCanvas=document.createElement("canvas");
var tctx=tempCanvas.getContext("2d");

//image to bytes
var imageData;
const imageDataByteLen = document.querySelector('#imagedata-byte-length');
const bufferByteLen = document.querySelector('#arraybuffer-byte-length');
const mimeType = 'image/png';
const imageOut = document.querySelector('#image-out');

//set background
renderIMG.setAttribute('style', 'background-color:#666666')

//initial setting of render image canvas
ResizeTo(renderIMG, resize);

function DrawRenderPixel(col, x, y) {
    rdctx.fillStyle = col;
    rdctx.fillRect( (x/(gridPix/resize)), (y/(gridPix/resize)), resize, resize );
    console.log(x + ", " + y);
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
    console.log(imageData);

    // Convert canvas to Blob, then Blob to ArrayBuffer.
    renderIMG.toBlob((blob) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
        const arrayBuffer = reader.result;
        bufferByteLen.textContent = arrayBuffer.byteLength + ' bytes.';

          // Dispay Blob content in an Image.
          const blob = new Blob([arrayBuffer], {type: mimeType});
          imageOut.src = URL.createObjectURL(blob);
          //console.log(arrayBuffer);

          //var bufView = new Uint8Array(arrayBuffer);
          var bufViewID = new Uint8Array(imageData.data);
          //output to webpage
          //textOutputBin.innerHTML = "[binary output]\n" + bufViewID;

          SliceData(bufViewID);
        });
        reader.readAsArrayBuffer(blob);
    }, mimeType);
    
}

//operate on image data
function SliceData(da) {
    const myArr = da.toString().split(",");
    const genArr = [];
    var it = 0; //iterator

    //Transcribe colour data
    //Remove alpha
    for(var i=0; i<myArr.length; i++) {
        //find first non zero 
        
        //get colour - check against colour register array
        
        //set colour in array if new
        
        //change to given register value
        //handle colour value
        if((myArr[i] != 0) && (it <=3)) { 
            genArr[i] = 1;
        }
        //handle no colour
        if(myArr[i] == 0) { 
            genArr[i] = 0;
            //myArr[i] = '';   //undefined
        }
        
        //handle alpha-skip
        if(it >= 3) {
            genArr.splice(i, 1); //remove alpha value
            //i--;
            it = 0; //reset
        } else {
            it++    //increment
        }
    }

    it=0 //reset iterator
    var BIstr = '';
    var bytes = [];
    //Convert generated array to binary, remove RGB
    for(var i=0; i<genArr.length; i++) {
        
        if(it <= 8) {
            if(genArr[i] == 1) {
                BIstr += genArr[i].toString();
            } else {
                BIstr += '0';
            }
            it++;

            i+=2;
        } 
        
        if(it == 8) {
            console.log("byte generated: " + BIstr);
            it = 0;

            bytes[bytes.length] = BIstr;
            BIstr = '';
        }


    }
    //Convert to unicode
    var b = parseInt( bytes[0], 2 );
    var c = parseInt( bytes[1], 2 );

    console.log(b);
    console.log(c);
    console.log(String.fromCharCode(b));
    console.log(String.fromCharCode(c));
    
    //output to webpage
    //var bufViewID = new Uint8Array(myArr.data);
    console.log("bytes estimated: " + bytes.length);
    //console.log("estimated bytes: " + genArr.length);
    textOutputBin.innerHTML = "[binary output]\n" + genArr;
}


//GridSquare, sprite with click support
let gridSQR = Sprite({
    x: 200,
    y: 200,
    width: gridPix+4,
    height: gridPix+4,
    color: 'black',
    
    onDown() {
        this.color = 'red'
        this.y +=2;
    },
    onUp() {
        this.color = 'black'
        this.y -=2;
    },
    onOver() {
        this.color = 'grey'
    },
    onOut: function() {
        this.color = 'black'
    }

});
track(gridSQR);
//console.log(gridSQR);

const SideUI = Sprite({
    type: 'obj',
    x: canvas.width - sideUIX,
    color: 'grey',
    width: sideUIX,
    height: canvas.height,
});

let textW = Text({
    text: 'W:',
    font: '16px Arial bold',
    color: 'black',
    x: widthUIX - 30,
    y: 20,
    anchor: {x: 0.5, y:0.5},
    textAlign: 'center'
});
SideUI.addChild(textW);
//console.log(textGen.text);

let textH = Text({
    text: 'H:',
    font: '16px Arial bold',
    color: 'black',
    x: heightUIX - 30,
    y: 20,
    anchor: {x: 0.5, y:0.5},
    textAlign: 'center'
});
SideUI.addChild(textH);
//console.log(textGen.text);

const butGry = new Image();
const butBlu = new Image();
butGry.src = 'assets/images/button_grey.png';
butBlu.src = 'assets/images/button_blue.png';

butBlu.onload = () => {
    let buttonSet = Button({
        x: 80,
        y: 280,
        anchor: {x:0.5, y:0.5},
        image: butGry,

        text: {
            text: 'Generate',
            color: 'grey',
            font: '20px Arial, sans-serif',
            anchor: {x: 0.5, y:0.5},
        
        },

        // get text() {
        //     return this.textNode;
        // },
        // set text(s) {
        //     this.textNode = s;
        // }, ////////////////////////////////////////////////////////////////////////

        onDown() {
            this.image = butBlu
            this.y +=5;
            GenerateText();
            ConvertCanvastoImageData();
        },
        onUp() {
            this.image = butGry
            this.y -=5;
        }
    });
    
    buttonWPlus = Button({
        x: widthUIX,
        y: 50,
        width: 22,
        height: 22,
        anchor: {x:0.5, y:0.5},
        color: 'white',

        text: {
            text: '+',
            color: 'black',
            font: '16px Arial, sans-serif',
            anchor: {x: 0.5, y:0.5}
        },

        onDown() {
            UpdateGridX(0, true);
            this.color = 'grey'
            this.y +=2;
        },
        onUp() {
            this.color = 'white'
            this.y -=2;
            //regenerate grid
        }
    });
    
    buttonWSub = Button({
        x: widthUIX,
        y: 75,
        width: 22,
        height: 22,
        anchor: {x:0.5, y:0.5},
        color: 'white',

        text: {
            text: '-',
            color: 'black',
            font: '16px Arial, sans-serif',
            anchor: {x: 0.5, y:0.5}
        },

        onDown() {
            UpdateGridX(0, false);
            this.color = 'grey'
            this.y +=2;
        },
        onUp() {
            this.color = 'white'
            this.y -=2;
        }
    });

    buttonHPlus = Button({
        x: heightUIX,
        y: 50,
        width: 22,
        height: 22,
        anchor: {x:0.5, y:0.5},
        color: 'white',

        text: {
            text: '+',
            color: 'black',
            font: '16px Arial, sans-serif',
            anchor: {x: 0.5, y:0.5}
        },

        onDown() {
            UpdateGridY(1, true);
            this.color = 'grey'
            this.y +=2;
        },
        onUp() {
            this.color = 'white'
            this.y -=2;
        }
    });
    
    buttonHSub = Button({
        x: heightUIX,
        y: 75,
        width: 22,
        height: 22,
        anchor: {x:0.5, y:0.5},
        color: 'white',

        text: {
            text: '-',
            color: 'black',
            font: '16px Arial, sans-serif',
            anchor: {x: 0.5, y:0.5}
        },

        onDown() {
            UpdateGridY(1, false);
            this.color = 'grey'
            this.y +=2;
        },
        onUp() {
            this.color = 'white'
            this.y -=2;
        }
    });

    SideUI.addChild(buttonSet);
    SideUI.addChild(buttonWPlus);
    SideUI.addChild(buttonWSub);
    SideUI.addChild(buttonHPlus);
    SideUI.addChild(buttonHSub);
};

function GenerateText() {
    //debug
    //textGen.text = 'Generated (' + gridX + "," + gridY + ') data for current sprite';
    //output to html page
    textOutput.value = '~Generating Export Data~' + '\n'
    + 'Sprite dimensions: ' + gridX + "x" + gridY + '\n'
    + '\n'

    + '////////////////Copy the below data segment////////////////' + '\n'
    + '\n'

    + '~ Data ~'
    + '\n \n'
    + '////////////////          End Data         ////////////////';
}
        
//Height x Width section
createBox(32, 32, SideUI, 45, 4);
createBox(32, 32, SideUI, 115, 4);
createText(SideUI, 60, 20, gridX);
createText(SideUI, 130, 20, gridY);


function createText(par, xLoc, yLoc, i) {
        const tex = Text({
            text: i,
            font: '16px Arial bold',
            color: 'black',
            x: xLoc,
            y: yLoc,
            anchor: {x: 0.5, y:0.5},
            textAlign: 'center'
        });

    par.addChild(tex);
    uiTexts_01.push(tex);
}

function createBox(xSize, ySize, par, xLoc, yLoc) {
    const box = Sprite({
        x: xLoc,
        y: yLoc,
        color: 'white',
        width: xSize,
        height: ySize,

    });

    par.addChild(box);
    uiObjs_01.push(box);
}

function createGrid(xIn, yIn) {
        const gridSQR = Sprite({
            type: '0',
            x: xIn,
            y: yIn,
            color: 'grey',
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
                    this.color = 'grey'
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

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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
    let byteNum = area/8; //8 bits in a byte

    textOutputByte.value = '~(WIP)~ estimated bytes: ' + byteNum + '\n'


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
    console.log('areax:' + areaX);

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
        
        RemoveGridRow();
    }
    
    ReSetSprite();
    //trigger grid redraw
    redraw = true;
    return;
}

function RemoveGridRow() {
    for(let i=gridY; i > 0; i--) {
        let cell = cells[i];
        cell.ttl = 0;
    }

    console.log(cells[0]);
    //cells[0].ttl = 0;
    
    cells = cells.filter(sprite => sprite.isAlive)
}

function GetColourValue() { 
    colCurrent = colSelect.style.backgroundColor;
    console.log('selected colour: ' + colCurrent);  
    
}

//GameLoop setup
//Requires update & render functions
const loop = GameLoop({
    update: () => {
        
        if(redraw) {
            console.log("rebuilding grid");
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
        SideUI.render();
    },
});

//Kick off the gameloop
loop.start();
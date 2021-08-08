
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

//Grid Calcs / variables
var gridX = 8; //number of grid spaces, from 2 - 32
var gridY = 8; //number of grid spaces, from 2 - 32

var areaX = 16 * gridX; //size of grid area 
var areaY = 16 * gridY;

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

//GridSquare, sprite with click support
let gridSQR = Sprite({
    x: 200,
    y: 200,
    width: 20,
    height: 20,
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

//Button with text and click support
// let buttonSQR = Button({
//     x:100,
//     y:200,
//     width: 32,
//     height: 32,
//     anchor: {x:0.5, y:0.5},
//     color: 'black',

//     // text properties
//     text: {
//         text: 'X',
//         color: 'black',
//         font: '20px Arial, sans-serif',
//         anchor: {x: 0.5, y: 0.5}
//     },
//     onDown() {
//         this.color = 'red'
//         this.y +=2;
//     },
//     onUp() {
//         this.color = 'black'
//         this.y -=2;
//     },
//     onOver() {
//         this.color = 'grey'
//     },
//     onOut: function() {
//         this.color = 'black'
//     }
// });
// track(buttonSQR);
let Area1 = null;
let Area1Col = null;
//let SideUI = null;



var sideUIX = canvas.width/4;
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
            x: xIn,
            y: yIn,
            color: 'grey',
            width: gDim - pixThic,
            height: gDim - pixThic,

            // text properties
            text: {
                text: 'X',
                color: 'black',
                font: '10px Arial, sans-serif',
                anchor: {x: 0.5, y: 0.5}
            },
            onDown() {
                this.color = 'red'
                //this.y +=2;
            },
            onUp() {
                this.color = 'grey'
                //this.y -=2;
            },
            onOver() {
                this.color = '#AAAAAA'
            },
            onOut: function() {
                this.color = 'grey'
                
            }
        });
    
        track(gridSQR);
        cells.push(gridSQR);

        Area1.addChild(gridSQR);
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
            this.context.setLineDash([20,10]);
            this.context.lineWidth = 3;
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
        //console.log(uiTexts_01[0]);
        uiTexts_01[i].text = `${gridX}`;
    } else if (!pos) {
        //increment value
        gridX--;
        areaX -= 16;
        //console.log(uiTexts_01[0]);
        uiTexts_01[i].text = `${gridX}`;
    }
    
    //trigger grid redraw
    redraw = true;
    return;
}
function UpdateGridY(i, pos) {
    if(pos) {
        //increment value
        gridY++;
        areaY += 16;
        //console.log(uiTexts_01[0]);
        uiTexts_01[i].text = `${gridY}`;
    } else if (!pos) {
        //increment value
        gridY--;
        areaY -= 16;
        //console.log(uiTexts_01[0]);
        uiTexts_01[i].text = `${gridY}`;

        RemoveGridRow();
    }

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
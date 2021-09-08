//minPIX GUI Functions & Creation
const butGry = new Image();
const butBlu = new Image();
butGry.src = 'assets/images/button_grey.png';
butBlu.src = 'assets/images/button_blue.png';

let sideUIX = canvas.width/4;
var widthUIX = 50;
var heightUIX = 155;
var SideUI = null;

//Array for UI objs
let uiObjs_01 = [];
let uiTexts_01 = [];

SideUI = Sprite({
    type: 'obj',
    x: canvas.width - sideUIX,
    color: 'grey',
    width: sideUIX,
    height: canvas.height,
});
addToRenderQueueUI(SideUI);

function createText(par, xLoc, yLoc, i) {
    const tex = Text({
        text: i,
        font: '16px Arial bold',
        color: 'black',
        x: xLoc,
        y: yLoc,
        anchor: {x: 0.0, y:0.5},
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

//Height x Width section
createBox(32, 32, SideUI, widthUIX-16, heightUIX - 120);
createBox(32, 32, SideUI, widthUIX + 60, heightUIX - 120);
createText(SideUI, widthUIX - 4 , heightUIX - 104, gridX);
createText(SideUI, widthUIX + 72, heightUIX - 104, gridY);

//Generate sidebar
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

        onDown() {
            this.image = butBlu
            this.y +=5;

            //set back to 1-1 scale 
            ResizeTo(renderIMG, 1/resize);
            //process data and export
            ConvertCanvastoImageData(renderIMG);
            //clear, rescale, rebuild
            BlankSprite();
            ResizeTo(renderIMG, resize);
            ReBuildSprite();
        },
        onUp() {
            this.image = butGry
            this.y -=5;
        }
    });
    

    let textW = Text({
        text: 'W:',
        font: '16px Arial bold',
        color: 'black',
        x: widthUIX - 30,
        y: heightUIX - 104,
        anchor: {x: 0.5, y:0.5},
        textAlign: 'center'
    });
    
    let textH = Text({
        text: 'H:',
        font: '16px Arial bold',
        color: 'black',
        x: widthUIX + 45,
        y: heightUIX - 104,
        anchor: {x: 0.5, y:0.5},
        textAlign: 'center'
    });

    buttonWPlus = Button({
        x: widthUIX + 16,
        y: heightUIX - 74,
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
        x: widthUIX - 14,
        y: heightUIX - 74,
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
        x: widthUIX + 90,
        y: heightUIX - 74,
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
        x: widthUIX + 60,
        y: heightUIX - 74,
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

    const OneBit = Button({
        type: '0',
        x: 10,
        y: 100,
        color: '#999999',
        width: 64,
        height: 32,

        // text properties
        text: {
            text: '1BIT',
            color: 'black',
            font: '20px Arial, sans-serif',
            anchor: {x: -0.25, y: -0.35}
        },
        onDown() {
            this.color = '#FFFFFF';
            MultiCol.color = '#999999';
            MultiCol.type = '0';
            this.type = 1;

            DisableArea2();
            ToggleColourMode(false);
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
            } else {
                this.color = '#FFFFFF'
            }
        }
    });
    const MultiCol = Button({
        type: '1',
        x: 85,
        y: 100,
        color: '#FFFFFF',
        width: 64,
        height: 32,

        // text properties
        text: {
            text: 'MULTI',
            color: 'black',
            font: '20px Arial, sans-serif',
            anchor: {x: -0.05, y: -0.35}
        },
        onDown() {
            this.color = '#FFFFFF';
            OneBit.color = '#999999';
            OneBit.type = '0';
            this.type = 1;
            
            EnableArea2();
            ToggleColourMode(true);
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
            } else {
                this.color = '#FFFFFF'
            }
        }
    });
    const Reset = Button({
        x: 40,
        y: 5,
        color: '#999999',
        width: 84,
        height: 20,

        // text properties
        text: {
            text: 'RESET',
            color: 'black',
            font: '16px Arial, sans-serif',
            anchor: {x: -0.3, y: -0.2}
        },
        onDown() {
            this.color = '#FFFFFF';
            CleanUpGrid();
            BuildPixelGrid();
            ReSetSprite();
        },
        onUp() {
            this.color = '#999999'
            //this.y -=2;
        },
        onOver() {
                this.color = '#AAAAAA'
        },
        onOut: function() {
                this.color = '#999999'
        }
    });

    track(Reset);
    SideUI.addChild(Reset);
    track(OneBit);
    SideUI.addChild(OneBit);
    track(MultiCol);
    SideUI.addChild(MultiCol);

    SideUI.addChild(textW);
    SideUI.addChild(textH);
    SideUI.addChild(buttonSet);
    SideUI.addChild(buttonWPlus);
    SideUI.addChild(buttonWSub);
    SideUI.addChild(buttonHPlus);
    SideUI.addChild(buttonHSub);
};

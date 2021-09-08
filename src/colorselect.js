//Functions for colour registers 
//Interacting between HTML registers and kontraJS
var colSelect = document.getElementById("colourSelect");
var colorTxt = document.getElementById("color");
var val = null;
var colIndex = []; // current index

//set to white to start with
ClickSelect(1);

//Disable multi colours
function DisableArea2() {
    // This will disable all the children of the div
    var nodes = document.getElementById("area2").getElementsByTagName('*');
    for(var i = 0; i < nodes.length; i++){
        nodes[i].disabled = true;
    }

    $('#area2').fadeTo('slow',.2);

    ClickSelect(1);
    document.getElementById('radio1').checked = true;
}
function EnableArea2() {
    // This will disable all the children of the div
    var nodes = document.getElementById("area2").getElementsByTagName('*');
    for(var i = 0; i < nodes.length; i++){
        nodes[i].disabled = false;
    }
    
    $('#area2').fadeTo('slow', 1);
}


function UpdateColour(num) {
    console.log('colour updated: ' + num);
    ClickSelect(num);
    
    return false;
}   

function SetColourText(x) {
    if(x == null) {
        colorTxt.innerHTML = "TRANSPARENT";
    } else {
        colorTxt.innerHTML = x.toString().toUpperCase();
    }
}

function UpdateColourReg() {
    colIndex[0] = 'null';
    
    colIndex[1] = document.getElementById("html5colorpicker1").value;
    colIndex[1] = colIndex[1].charAt(1) 
                        + colIndex[1].charAt(3) 
                            + colIndex[1].charAt(5);
    colIndex[2] = document.getElementById("html5colorpicker2").value;
    colIndex[2] = colIndex[2].charAt(1) 
                        + colIndex[2].charAt(3) 
                            + colIndex[2].charAt(5);
    colIndex[3] = document.getElementById("html5colorpicker3").value;
    colIndex[3] = colIndex[3].charAt(1) 
                        + colIndex[3].charAt(3) 
                            + colIndex[3].charAt(5);
    colIndex[4] = document.getElementById("html5colorpicker4").value;
    colIndex[4] = colIndex[4].charAt(1) 
                        + colIndex[4].charAt(3) 
                            + colIndex[4].charAt(5);
    
    colIndex[5] = document.getElementById("html5colorpicker5").value;
    colIndex[5] = colIndex[5].charAt(1) 
                        + colIndex[5].charAt(3) 
                            + colIndex[5].charAt(5);
    
    colIndex[6] = document.getElementById("html5colorpicker6").value;
    colIndex[6] = colIndex[6].charAt(1) 
                        + colIndex[6].charAt(3) 
                            + colIndex[6].charAt(5);

    colIndex[7] = document.getElementById("html5colorpicker7").value;
    colIndex[7] = colIndex[7].charAt(1) 
                        + colIndex[7].charAt(3) 
                            + colIndex[7].charAt(5);

    for(var i=0; i< colIndex.length; i++) {
        console.log("Register " + i + ": " + colIndex[i]);
    }

}

function ClickSelect(num) {

    if(num == 0) {
        //var val = document.getElementById("html5colorpicker0").value;
        val = null;
        SetColourText(val);
        console.log("Colour of new selected: TRANSPARENT");
    } 
    else if (num == 1) {
        val = document.getElementById("html5colorpicker1").value;
        SetColourText(val);
        console.log("Colour of new selected: " + val);
    } 
    else if (num == 2) {
        val = document.getElementById("html5colorpicker2").value;
        SetColourText(val);
        console.log("Colour of new selected: " + val);
    }
    else if (num == 3) {
        val = document.getElementById("html5colorpicker3").value;
        SetColourText(val);
        console.log("Colour of new selected: " + val);
    }
    else if (num == 4) {
        val = document.getElementById("html5colorpicker4").value;
        SetColourText(val);
        console.log("Colour of new selected: " + val);
    }
    else if (num == 5) {
        val = document.getElementById("html5colorpicker5").value;
        SetColourText(val);
        console.log("Colour of new selected: " + val);
    }
    else if (num == 6) {
        val = document.getElementById("html5colorpicker6").value;
        SetColourText(val);
        console.log("Colour of new selected: " + val);
    }
    else if (num == 7) {
        val = document.getElementById("html5colorpicker7").value;
        SetColourText(val);
        console.log("Colour of new selected: " + val);
    }


    if(val != null) {
        //set colour background
        colSelect.style.backgroundColor = val;

        //recolour text if black //could do for any dark colours also
        if(val == "#000000") {
            colorTxt.style.color = '#FFFFFF'
            colSelect.style.color = '#FFFFFF'
        } else {
            colorTxt.style.color = '#000000'
            colSelect.style.color = '#000000'
        }
    }
}
var colSelect = document.getElementById("colourSelect");
var colorTxt = document.getElementById("color");
var val = null;
var colIndexGrab = []; // current index

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

function GetColourRegs() {
    UpdateColourReg();
    for(var i=0; i< colIndexGrab.length; i++) {
        console.log("Register " + i + ": " + colIndexGrab[i]);
    }
    return colIndexGrab; 
}

function UpdateColourReg() {
    colIndexGrab[0] = 'null';
    
    colIndexGrab[1] = document.getElementById("html5colorpicker1").value;
    colIndexGrab[1] = colIndexGrab[1].charAt(1) 
                        + colIndexGrab[1].charAt(3) 
                            + colIndexGrab[1].charAt(5);
    colIndexGrab[2] = document.getElementById("html5colorpicker2").value;
    colIndexGrab[2] = colIndexGrab[2].charAt(1) 
                        + colIndexGrab[2].charAt(3) 
                            + colIndexGrab[2].charAt(5);
    colIndexGrab[3] = document.getElementById("html5colorpicker3").value;
    colIndexGrab[3] = colIndexGrab[3].charAt(1) 
                        + colIndexGrab[3].charAt(3) 
                            + colIndexGrab[3].charAt(5);
    colIndexGrab[4] = document.getElementById("html5colorpicker4").value;
    colIndexGrab[4] = colIndexGrab[4].charAt(1) 
                        + colIndexGrab[4].charAt(3) 
                            + colIndexGrab[4].charAt(5);
    
    colIndexGrab[5] = document.getElementById("html5colorpicker5").value;
    colIndexGrab[5] = colIndexGrab[5].charAt(1) 
                        + colIndexGrab[5].charAt(3) 
                            + colIndexGrab[5].charAt(5);
    
    colIndexGrab[6] = document.getElementById("html5colorpicker6").value;
    colIndexGrab[6] = colIndexGrab[6].charAt(1) 
                        + colIndexGrab[6].charAt(3) 
                            + colIndexGrab[6].charAt(5);

    colIndexGrab[7] = document.getElementById("html5colorpicker7").value;
    colIndexGrab[7] = colIndexGrab[7].charAt(1) 
                        + colIndexGrab[7].charAt(3) 
                            + colIndexGrab[7].charAt(5);

}

function ClickSelect(num) {

    if(num == 0) {
        //var val = document.getElementById("html5colorpicker0").value;
        val = null;
        SetColourText(val);
        console.log("Colour of new selected: trasparent");
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
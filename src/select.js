var colSelect = document.getElementById("colourSelect");
var colorTxt = document.getElementById("color");

var val = null;

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
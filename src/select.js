
var colSelect = document.getElementById("colourSelect");

function UpdateColour(num) {
    console.log('colour updated: ' + num);
    ClickSelect(num);
    
    return false;
}   

function ClickSelect(num) {

    if(num == 0) {
        var val = document.getElementById("html5colorpicker0").value;
        console.log("Colour of new selected: " + val);
    } 
    else if (num == 1) {
        var val = document.getElementById("html5colorpicker1").value;
        console.log("Colour of new selected: " + val);
    } 
    else if (num == 2) {
        var val = document.getElementById("html5colorpicker2").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 3) {
        var val = document.getElementById("html5colorpicker3").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 4) {
        var val = document.getElementById("html5colorpicker4").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 5) {
        var val = document.getElementById("html5colorpicker5").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 6) {
        var val = document.getElementById("html5colorpicker6").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 7) {
        var val = document.getElementById("html5colorpicker7").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 8) {
        var val = document.getElementById("html5colorpicker8").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 9) {
        var val = document.getElementById("html5colorpicker9").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 'A') {
        var val = document.getElementById("html5colorpickerA").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 'B') {
        var val = document.getElementById("html5colorpickerB").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 'C') {
        var val = document.getElementById("html5colorpickerC").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 'D') {
        var val = document.getElementById("html5colorpickerD").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 'E') {
        var val = document.getElementById("html5colorpickerE").value;
        console.log("Colour of new selected: " + val);
    }
    else if (num == 'F') {
        var val = document.getElementById("html5colorpickerF").value;
        console.log("Colour of new selected: " + val);
    }

    if(val != null) {
        colSelect.style.backgroundColor = val;
    }
}
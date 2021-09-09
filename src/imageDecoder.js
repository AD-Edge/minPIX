//Decoder functions, for decoding compressed pixel art image data

//Decompiles sprite data (HEX compress)
//renders in compile canvas
function DecompileDrawSprite(data, x, y, size, cvs) {
    console.log("Decompiling: " + data);
    var splitData = data.split(",");

    //1 bit for now
    context.fillStyle = 'black';
    
    //get dimensions 
    w = splitData[0];
    h = splitData[1];

    var bin = [];
    var rows = [];
    var br ='';
    //convert each hex element into binary
    for(var i=2; i< splitData.length; i++) {
        var hex = hexToBinary(splitData[i]);
        bin[bin.length] = hex;
        //console.log("Hex to Binary: " + hex);
    }

    //convert each binary number into rows
    for(var j=0; j < bin.length; j++) { //loop all binary strings
        var bstr = bin[j];
        for(var k=0; k<bstr.length; k++) { //loop binary string
            br += bstr.charAt(k);
            //slice n dice
            if(br.length == w) {
                //console.log("Binary section added to rows: " + br);
                rows.push(br);
                br = '' //reset
            }
        }
    }
    //reset canvas and draw
    cvs.width = w * size;
    cvs.height = h * size;
    DrawBinaryToCavas(cvs.getContext("2d"), size, rows);

}

//draws decompiled sprite to canvas
//to be saved as image
function DrawBinaryToCavas(ctx, size, rows) {
    //build sprite from binary (~format of previous stuff)
    context.fillStyle = 'black';
    var currX = 0;
    //loop through all pixel row strings
    //needed = [1,0,1][1,1,1]... (previous setup)
    for (var i = 0; i < rows.length; i++) { //each row element
        var pixels = rows[i]; //
        var currY = 0;
        //console.log("pixels: " + pixels);
        for (var y = 0; y < pixels.length; y++) {
            var row = pixels[y];
            //console.log("Drawing row: " + row);
            for (var x = 0; x < row.length; x++) {
                if (row[x]==1) {
                    //console.log("Drawing row[x]: " + row[x]);
                    ctx.fillRect(currY + y * size, currX, size, size);
                }
            }
        }
        currY += size;
        currX += size;
    }
    //console.log('Drew ' + string + ' at size ' + size);
}

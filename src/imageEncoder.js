//Encoder functions, for compressing pixel art image data

//First step in converting renderImage canvas to image data/compressed
//Calls CheckCol and SliceData
function ConvertCanvastoImageData(cnv, de) {
    let cntxt = cnv.getContext("2d");
    imageData = cntxt.getImageData(0, 0, cnv.width, cnv.height);
    //console.log(imageData);
    
    // Convert canvas to Blob, then Blob to ArrayBuffer.
    cnv.toBlob((blob) => {
        const reader = new FileReader();
        
        reader.addEventListener('loadend', () => {
            //Set array buffer
            const arrayBuffer = reader.result;
            
            //delimiter true == compressing image usage (used during encoding)
            //delimiter false == set array buffer (used during decoding)
            if(de) {    
                imageDataByteLen.textContent = imageData.data.byteLength + ' bytes.';
                bufferByteLen.textContent = arrayBuffer.byteLength + ' bytes.';
                //Blob content -> Image & URL
                const blob = new Blob([arrayBuffer], {type: mimeType});        
                imageOut.src = URL.createObjectURL(blob);

                //console.log("height: " + imageOut.style.height.value);
                imageOut.style.width = gridX*8 + 'px';
                imageOut.style.height = gridY*8 + 'px';
                console.log(arrayBuffer);
    
                //var bufView = new Uint8Array(arrayBuffer);
                var bufViewID = new Uint8Array(imageData.data);
                //output to webpage
                //textOutputBin.innerHTML = "[binary output]\n" + bufViewID;    

                //slice and process drawn pixel art on canvas
                SliceData(bufViewID);
                //run export text gen 
                //has to run in here, at the end of 'loadend'
                GenerateExportText();
                //return 0;

            } else {
                //set data for usage external to this function
                var img = new Image();

                //console.log(arrayBuffer);
                //console.log(arrayBuffOut);
                
                //Blob content -> Image & URL
                const blob = new Blob([arrayBuffer], {type: mimeType});        
                blobArr.push(blob);
                //img.src = URL.createObjectURL(blob);
                // //console.log("height: " + imageOut.style.height.value);
                //img.style.width = 32 + 'px';
                //img.style.height = 32 + 'px';
                
                // tstIMG.src = URL.createObjectURL(blob);
                // tstIMG.style.width = 32 + 'px';
                // tstIMG.style.height = 32 + 'px';
                //console.log(tstIMG);
                
                //save
                imageArray.push(img);
                urlArray.push(img.src);

                //find out when processing is done
                if(imageArray.length == proccessNum) {
                    console.log("Letters actually generated: " + imageArray.length);
                    console.log("Blobs actually generated: " + blobArr.length);
                    initProcessing = true;


                }

                //return arrayBuffer;
            }
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
    //console.log(genArr);
    
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

//Process gathered image data, in One-Bit mode
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
                for(var j=BIstr.length; j<8; j++) { 
                    BIstr += '0';//add zeros (waste)
                }
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

//Process gathered image data, in Multi-Colour mode
function ProcessMultiColourData() {
    //old binary compress method
    var bytes = [];
    var BIstr = '';
    var it = 0; //iterator

    UpdateColourReg(); //get latest colours

    //iterate through array, 2 pixels at a time
    for(var i=0; i<genArr.length; i+=2) {
        //pxASCII += String.fromCharCode(0b1000000 + 
            //(genArr[i] || 0) + ((genArr[i+1] || 0) << 3));
        var regA = GetColorIndex(genArr[i]);
        var regB = GetColorIndex(genArr[i+1]);
        
        if(regA == -1) {
            regA = 0;
        }
        if(regB == -1) {
            regB = 0;
        }
        console.log("Register for colour detected: " + regA.toString() + regB.toString());        
        
        var rtoHex = componentToHex(regA.toString() + regB.toString());

        if(rtoHex != 0) {

            charsArr[charsArr.length] = rtoHex;
            //console.log("adding together " + genArr[i] + " & " + genArr[i+1]);
            console.log("adding together " + regA + " & " + regB);
            console.log("which makes " + rtoHex);
            
            //need to make this hex value and add it to charsArr instead of register num
        } else {
            charsArr[charsArr.length] = '';
        }
        //charsArr[charsArr.length] = pxASCII;
    }
}

//Finds the register of a colour, if one of that colour exists
function GetColorIndex(cIn) {
    //console.log("col reg: " + colIndex[1]);
    for (var i=0; i < colIndex.length; i++) {
        //console.log("Comparing: " + colIndex[i] + " with: " + cIn);
        if(colIndex[i] == cIn) {
            console.log("Colour index of input " + cIn + " is: " + i);
            return i; //return index
        }
    }
    return -1;
}
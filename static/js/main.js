var originalImage;
var isMainImage = true;

window.onload = function() {
    document.getElementById("upload-button").onclick = function() {
        console.log("upload button clicked");

        document.getElementById("fileInput").click();
    };
  };

function ELAAlgorithm(src, err) {
    let diff = src.clone();
    // Calculate difference between mainImage and errorImage
    cv.addWeighted(src, 1, err, -1, 0, diff);
    let tempImg = diff.clone();
    cv.multiply(diff, diff, tempImg);
    diff = tempImg.clone();
    tempImg.delete();

   
    cv.addWeighted(src, 1, diff, 1, 0, diff);

    return diff
}


function DoELA(canvas, image, elaLevel = 0.3) {
    console.log("ELA button clicked");

    let errorImage = new cv.Mat();
    
    // Write to canvas and dump canvas content to a JPEG
    cv.imshow("mainCanvas", image);
    let jpeg = canvas.toDataURL("image/jpeg", elaLevel);

    // Read dumped JPEG
    let jpegImg = new Image();
    jpegImg.src = jpeg;
    jpegImg.onload = function() {
        
        errorImage = cv.imread(jpegImg);

        let outImg = ELAAlgorithm(image, errorImage);
        
        cv.imshow("mainCanvas", outImg);
        errorImage.delete();
    }
}

function GetLowQImg() {
    let jpeg = canvas.toDataURL("image/jpeg", 0.5);
    let jpegImg = new Image();
    jpegImg.src = jpeg;
    jpegImg.onload = function() {

    };
}

function ELALevelCallback() {
    let ELAValue = document.getElementById('ELAValue');
    let trackbar = document.getElementById("trackbar");
    ELAValue.setAttribute('value', trackbar.value);

    let alpha = trackbar.value / trackbar.max;

    let canvas = document.getElementById('mainCanvas');
    let image = originalImage.clone();

    DoELA(canvas, image, alpha);
}

function DrawOnCanvas(dataURL) {
    var canvas = document.getElementById('mainCanvas');    
    var context = canvas.getContext('2d');
    var imageObj = new Image();
    imageObj.onload = function() {
        console.log("Drawcanvas")
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0, this.width, this.height);

        let src = cv.imread("mainCanvas");
        originalImage = src.clone();

        cv.imshow("rawCanvas", originalImage);

        DoELA(canvas, src);
    };
    imageObj.src = dataURL;
}

var openFile = function(file) {
    var input = file.target;

    var reader = new FileReader();
    reader.onload = function(){
        // var dataURL = reader.result;
        // var output = document.getElementById('output');
        // output.src = dataURL;
        DrawOnCanvas(reader.result);
    };
    reader.readAsDataURL(input.files[0]);
};

function FlipCanvas() {
    if (isMainImage) {
        isMainImage = false;
        cv.imshow("mainCanvas", diffImage);
    }
    else {
        isMainImage = true;
        cv.imshow("mainCanvas", mainImage);
    }
}

var canvasClick = function(e) {
    FlipCanvas();
}

var canvasMouseOver = function(e) {
    FlipCanvas();
}

// Show mainImage if mouse pointer is over the canvas, otherwise show errorImage
var bodyMouseMove = function(e) {
    // if (e.target.id == 'mainCanvas') {
    //     cv.imshow("mainCanvas", mainImage);
    // } else {
    //     cv.imshow("mainCanvas", diffImage);
    // }

}
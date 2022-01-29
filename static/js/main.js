var mainImage;
var errorImage;
var diffImage;
var isMainImage = true;

window.onload = function() {
    document.getElementById("upload-button").onclick = function() {
        console.log("upload button clicked");

        document.getElementById("fileInput").click();
    };
  };

function ELAAlgorithm(src, err, diff) {
    // Calculate difference between mainImage and errorImage
    cv.addWeighted(src, 1, err, -1, 0, diff);

    // Calculate adaptive threshold of the JPEG error difference
    let diffThresh = new cv.Mat();
    cv.cvtColor(diff, diffThresh, cv.COLOR_RGBA2GRAY, 0);
    cv.adaptiveThreshold(diffThresh, diffThresh, 252, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 7, 5);

    // let ones = new cv.Mat(diffImage.rows, diffImage.cols, diffImage.type(), [0, 0, 0, 0]);
    // Invert the thresholded image so when added to the main image, the "valid" pixels will be darker
    cv.bitwise_not(diffThresh, diffThresh);

    // Prepare threshold to add to main image
    cv.GaussianBlur(diffThresh, diffThresh, {width: 3, height: 3}, 0);
    cv.cvtColor(diffThresh, diffThresh, cv.COLOR_GRAY2RGBA, 0);
    
    cv.addWeighted(src, 0.6, diffThresh, 0.6, 0, diff);

    // console.log("diffImage", diffImage);

    // cv.imshow("mainCanvas", diffImage);
    diffThresh.delete();
    return diff
}


function DoELA() {
    console.log("ELA button clicked");

    mainImage = new cv.Mat();
    errorImage = new cv.Mat();
    diffImage = new cv.Mat();

    let canvas = document.getElementById('mainCanvas');    
    mainImage = cv.imread("mainCanvas");

    // Write to canvas and dump canvas content to a JPEG
    cv.imshow("mainCanvas", mainImage);
    let jpeg = canvas.toDataURL("image/jpeg", 0.1);

    // Read dumped JPEG
    let jpegImg = new Image();
    jpegImg.src = jpeg;
    jpegImg.onload = function() {
        
        errorImage = cv.imread(jpegImg);
        ELAAlgorithm(mainImage, errorImage, diffImage);
        
        cv.imshow("mainCanvas", diffImage);
    }
}

function GetLowQImg() {
    let jpeg = canvas.toDataURL("image/jpeg", 0.5);
    let jpegImg = new Image();
    jpegImg.src = jpeg;
    jpegImg.onload = function() {

    };
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

        DoELA();
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
        // DrawOnCanvasCV();
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
    if (e.target.id == 'mainCanvas') {
        cv.imshow("mainCanvas", mainImage);
    } else {
        cv.imshow("mainCanvas", diffImage);
    }

}
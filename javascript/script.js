const uploadImageInput  = document.getElementById('inputfile');
const brightnessSlider  = document.getElementById('brightness-slider');
const contrastSlider    = document.getElementById('contrast-slider');
const redSlider         = document.getElementById('red-slider');
const greenSlider       = document.getElementById('green-slider');
const blueSlider        = document.getElementById('blue-slider');
const brightnessValue   = document.getElementById('brightness-value');
const contrastValue     = document.getElementById('contrast-value');
const redValue          = document.getElementById('red-value');
const greenValue        = document.getElementById('green-value');
const blueValue         = document.getElementById('blue-value');

const canvas = document.getElementById('canva');
const context = canvas.getContext('2d', { willReadFrequently: true });

const maxColorValue = 255;

let imageData;
let modifiedImageData = [];
let horizontalOffset = 0;
let canvasImageWidth = 0;
let canvasImageHeight = 0;

uploadImageInput.addEventListener('change', () => {
    const file = uploadImageInput.files[0];

    if(!file) {
        console.log("Arquivo não encontrado");
        return true;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const image = new Image();
        image.onload = function() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            const divider = Math.max(image.naturalWidth / canvas.width, image.naturalHeight / canvas.height);
            canvasImageWidth = image.naturalWidth / divider;
            horizontalOffset = (canvas.width - canvasImageWidth) / 2;
            canvasImageHeight = image.naturalHeight / divider;
            context.drawImage(image, horizontalOffset, 0, canvasImageWidth, canvasImageHeight);

            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            modifiedImageData = context.getImageData(0, 0, canvas.width, canvas.height)
        }
        image.src = event.target.result;
    }

    reader.readAsDataURL(file);

});

brightnessSlider.addEventListener('change', applySliderChanges);
contrastSlider.addEventListener('change', applySliderChanges);
redSlider.addEventListener('change', applySliderChanges);
greenSlider.addEventListener('change', applySliderChanges);
blueSlider.addEventListener('change', applySliderChanges);

function applyRedChanges(red, iteration) {
    const redColor = redValue.innerText;
    if(redColor == 50) { return red; }
    if(redColor > 50) {
        const distance = 255 - red;
        return red + (distance * (redColor - 50) / 50);
    }
    const average = (iteration[0] + iteration[1] + iteration[2]) / 3;
    const averageDistance = red - average;
    return red - (averageDistance * (1 - redColor / 50));
}

function applyGreenChanges(green, iteration) {
    const greenColor = greenValue.innerText;
    if(greenColor == 50) { return green; }
    if(greenColor > 50) {
        const distance = 255 - green;
        return green + (distance * (greenColor - 50) / 50);
    }
    const average = (iteration[0] + iteration[1] + iteration[2]) / 3;
    const averageDistance = green - average;
    return green - (averageDistance * (1 - greenColor / 50));
}

function applyBlueChanges(blue, iteration) {
    const blueColor = blueValue.innerText;
    if(blueColor == 50) { return blue; }
    if(blueColor > 50) {
        const distance = 255 - blue;
        return blue + (distance * (blueColor - 50) / 50);
    }
    const average = (iteration[0] + iteration[1] + iteration[2]) / 3;
    const averageDistance = blue - average;
    return blue - (averageDistance * (1 - blueColor / 50));
}

function applySliderChanges(event) {
    if(imageData === undefined) {
        brightnessSlider.value = brightnessValue.innerText;
        contrastSlider.value = contrastValue.innerText;
        redSlider.value = redValue.innerText;
        greenSlider.value = greenValue.innerText;
        blueSlider.value = blueValue.innerText;
        return true;
    }

    brightnessValue.innerText = brightnessSlider.value;
    contrastValue.innerText = contrastSlider.value;
    redValue.innerText = redSlider.value;
    greenValue.innerText = greenSlider.value;
    blueValue.innerText = blueSlider.value;


    let array = imageData.data;
    for(let i = 0; i < array.length; i = i+4) {
        const iteration = [
            array[i], array[i + 1], array[i + 2]
        ]
        modifiedImageData.data[i]       = applyRedChanges(array[i],         iteration);
        modifiedImageData.data[i + 1]   = applyGreenChanges(array[i + 1],   iteration);
        modifiedImageData.data[i + 2]   = applyBlueChanges(array[i + 2],    iteration);
        
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.putImageData(modifiedImageData, 0, 0);

}
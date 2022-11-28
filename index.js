const flagFile = document.getElementById("flagFile")

const image_size = 128;

const canvas1 = document.getElementById('canvas1');
const context1 = canvas1.getContext('2d');
const blobcat = new Image(); blobcat.onload = function() {blobcat.crossOrigin = "Anonymous";}; blobcat.src = "blobcat.png";
const blobcatoverlay = new Image(); blobcatoverlay.onload = function() {blobcatoverlay.crossOrigin = "Anonymous";}; blobcatoverlay.src = "blobcatoverlay.png";

const canvas2 = document.getElementById('canvas2');
const context2 = canvas2.getContext('2d');
const blobfox = new Image(); blobfox.onload = function() {blobfox.crossOrigin = "Anonymous";}; blobfox.src = "blobfox.png";
const blobfoxoverlay = new Image(); blobfoxoverlay.onload = function() {blobfoxoverlay.crossOrigin = "Anonymous";}; blobfoxoverlay.src = "blobfoxoverlay.png";

const canvas3 = document.getElementById('canvas3');
const context3 = canvas3.getContext('2d');
const blobfox2 = new Image(); blobfox2.onload = function() {blobfox.crossOrigin = "Anonymous";}; blobfox2.src = "blobfox2.png";
const blobfox2overlay = new Image(); blobfox2overlay.onload = function() {blobfox2overlay.crossOrigin = "Anonymous";}; blobfox2overlay.src = "blobfox2overlay.png";


function flagSelected() {
    const file = flagFile.files[0];
    if (file == null) {
        return;
    }

    
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function() {
        const img = new Image();

        img.src = URL.createObjectURL(file);

        img.addEventListener('load', () => {
            drawEmoji(blobcat, blobcatoverlay, img, context1)
            drawEmoji(blobfox, blobfoxoverlay, img, context2)
            drawEmoji(blobfox2, blobfox2overlay, img, context3)
        }, false);
    }
}

flagFile.addEventListener("change", flagSelected, false);

function lerpColor(a, b, t) {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
        a[3] + (b[3] - a[3]) * t,
    ];
}

function drawEmoji(background, overlay, flag, ctx) {
    const pixelImageData = ctx.createImageData(128, 128);

    ctx.clearRect(0, 0, image_size, image_size);

    console.log("creating image data");
    const backgroundImageData = imageToCanvas(background).getImageData(0, 0, background.width, background.height).data;
    const overlayImageData = imageToCanvas(overlay).getImageData(0, 0, overlay.width, overlay.height).data;
    const flagImageData = imageToCanvas(flag).getImageData(0, 0, flag.width, flag.height);
    console.log("generating image");
    
    const flagSize = Math.min(flag.width, flag.height);

    for (let x = 0; x <= image_size-1; x++) {
        for (let y = 0; y <= image_size-1; y++) {
        	const i = (x + y * image_size) * 4;
            let backgroundPixel = backgroundImageData.slice(i, i + 4);
            let overlayPixel = overlayImageData.slice(i, i + 4);
            let dx = Math.floor((flag.width - flagSize) + overlayPixel[0] / 255 * flagSize);
            let dy = Math.floor(overlayPixel[1] / 255 * flagSize);
            const iFlag = (dx + dy * flagImageData.width) * 4;
            let flagPixel = flagImageData.data.slice(iFlag, iFlag + 4); flagPixel[3] = 255;
            let pixel = lerpColor(backgroundPixel, flagPixel, overlayPixel[3]/255);
            if (backgroundPixel < 250) {
                pixel = flagPixel;
                pixel[3] = overlayPixel[3];
            }
            pixelImageData.data[i] = pixel[0];
            pixelImageData.data[i+1] = pixel[1];
            pixelImageData.data[i+2] = pixel[2];
            pixelImageData.data[i+3] = pixel[3];
        }
    }
    
    ctx.putImageData(pixelImageData, 0, 0);
    console.log("done");
}

function imageToCanvas(image) {
    const canvas = document.createElement("CANVAS");
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d', {willReadFrequently: true});

    ctx.drawImage(image, 0, 0);

    return ctx;
}

function saveCanvas(name, canvas) {
    const link = document.createElement('a');
    link.download = name + '.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
}
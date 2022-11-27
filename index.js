const flagFile = document.getElementById("flagFile")
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const context1 = canvas1.getContext('2d');
const context2 = canvas2.getContext('2d');

const rootContext = document.body.getAttribute("data-root");
const blobcat = new Image(); blobcat.onload = function() {blobcat.crossOrigin = "Anonymous";}; blobcat.src = "blobcat.png";
const blobfox = new Image(); blobfox.onload = function() {blobfox.crossOrigin = "Anonymous";}; blobfox.src = "blobfox.png";
const blobcatoverlay = new Image(); blobcatoverlay.onload = function() {blobcatoverlay.crossOrigin = "Anonymous";}; blobcatoverlay.src = "blobcatoverlay.png";
const blobfoxoverlay = new Image(); blobfoxoverlay.onload = function() {blobfoxoverlay.crossOrigin = "Anonymous";}; blobfoxoverlay.src = "blobfoxoverlay.png";

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
    const pixelImageData = ctx.createImageData(1, 1);

    ctx.clearRect(0, 0, 128, 128);

    const backgroundCanvas = imageToCanvas(background);
    const overlayCanvas = imageToCanvas(overlay);
    const flagCanvas = imageToCanvas(flag);

    const flagSize = Math.min(flag.width, flag.height);

    for (let x = 0; x < 127; x++) {
        for (let y = 0; y < 127; y++) {
            let backgroundPixel = backgroundCanvas.getImageData(x, y, 1, 1).data;
            let overlayPixel = overlayCanvas.getImageData(x, y, 1, 1).data;
            let dx = (flag.width - flagSize) + overlayPixel[0] / 255 * flagSize;
            let dy = overlayPixel[1] / 255 * flagSize;
            let flagPixel = flagCanvas.getImageData(dx, dy, 1, 1).data; flagPixel[3] = 255;
            let pixel = lerpColor(backgroundPixel, flagPixel, overlayPixel[3]/255);
            if (backgroundPixel < 250) {
                pixel = flagPixel;
                pixel[3] = overlayPixel[3];
            }
            pixelImageData.data[0] = pixel[0];
            pixelImageData.data[1] = pixel[1];
            pixelImageData.data[2] = pixel[2];
            pixelImageData.data[3] = pixel[3];

            ctx.putImageData(pixelImageData, x, y);
        }
    }
}

function imageToCanvas(image) {
    const canvas = document.createElement("CANVAS");
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');

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
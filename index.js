const flagFile = document.getElementById("flagFile")

const image_size = 128;

const canvas1 = document.getElementById('canvas1');
const context1 = canvas1.getContext('2d');
const blobcat = new Image(); blobcat.onload = function() {blobcat.crossOrigin = "Anonymous";}; blobcat.src = "emojis/blobcat.png";
const blobcatoverlay = new Image(); blobcatoverlay.onload = function() {blobcatoverlay.crossOrigin = "Anonymous";}; blobcatoverlay.src = "emojis/blobcatoverlay.png";

const canvas2 = document.getElementById('canvas2');
const context2 = canvas2.getContext('2d');
const blobfox = new Image(); blobfox.onload = function() {blobfox.crossOrigin = "Anonymous";}; blobfox.src = "emojis/blobfox.png";
const blobfoxoverlay = new Image(); blobfoxoverlay.onload = function() {blobfoxoverlay.crossOrigin = "Anonymous";}; blobfoxoverlay.src = "emojis/blobfoxoverlay.png";

const canvas3 = document.getElementById('canvas3');
const context3 = canvas3.getContext('2d');
const blobfox2 = new Image(); blobfox2.onload = function() {blobfox.crossOrigin = "Anonymous";}; blobfox2.src = "emojis/blobfox2.png";
const blobfox2overlay = new Image(); blobfox2overlay.onload = function() {blobfox2overlay.crossOrigin = "Anonymous";}; blobfox2overlay.src = "emojis/blobfox2overlay.png";

const canvas4 = document.getElementById('canvas4');
const context4 = canvas4.getContext('2d');
const blobfoxsign = new Image(); blobfoxsign.onload = function() {blobfoxsign.crossOrigin = "Anonymous";}; blobfoxsign.src = "emojis/blobfoxsign.png";
const blobfoxsignoverlay = new Image(); blobfoxsignoverlay.onload = function() {blobfoxsignoverlay.crossOrigin = "Anonymous";}; blobfoxsignoverlay.src = "emojis/blobfoxsignoverlay.png";


function flagSelected() {
    const file = flagFile.files[0];
    if (file == null) {
        return;
    }

    
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function() {
        const img = new Image();

        img.src = URL.createObjectURL(file);

        img.addEventListener('load', () => {
            drawEmoji(blobcat, blobcatoverlay, img, context1, false)
            drawEmoji(blobfox, blobfoxoverlay, img, context2, false)
            drawEmoji(blobfox2, blobfox2overlay, img, context3, false)
            drawEmoji(blobfoxsign, blobfoxsignoverlay, img, context4, true)
        }, false);
    }
}

flagFile.addEventListener("change", flagSelected, false);

function blendColor(color1, color2) {
    const r1 = color2[0] / 255, g1 = color2[1] / 255, b1 = color2[2] / 255, a1 = color2[3] / 255;
    const r2 = color1[0] / 255, g2 = color1[1] / 255, b2 = color1[2] / 255, a2 = color1[3] / 255;
    const alpha = a1 + a2 * (1 - a1);
    return [
        (r1 * a1 + r2 * a2 * (1 - a1)) / alpha * 255,
        (g1 * a1 + g2 * a2 * (1 - a1)) / alpha * 255,
        (b1 * a1 + b2 * a2 * (1 - a1)) / alpha * 255,
        alpha * 255
    ];
}

function drawEmoji(background, overlay, flag, ctx, scale_flag) {
    const pixelImageData = ctx.createImageData(128, 128);

    ctx.clearRect(0, 0, image_size, image_size);

    const backgroundImageData = imageToCanvas(background).getImageData(0, 0, background.width, background.height).data;
    const overlayImageData = imageToCanvas(overlay).getImageData(0, 0, overlay.width, overlay.height).data;
    const flagImageData = imageToCanvas(flag).getImageData(0, 0, flag.width, flag.height);
    
    const flagSize = Math.min(flag.width, flag.height);

    for (let x = 0; x <= image_size-1; x++) {
        for (let y = 0; y <= image_size-1; y++) {
        	const i = (x + y * image_size) * 4;
            const backgroundPixel = backgroundImageData.slice(i, i + 4);
            const overlayPixel = overlayImageData.slice(i, i + 4);

            let dx;
            let dy;
            if (scale_flag) {
                dx = Math.floor(overlayPixel[0] / 255 * flag.width);
                dy = Math.floor(overlayPixel[1] / 255 * flag.height);
            } else {
                dx = Math.floor((flag.width - flagSize) + overlayPixel[0] / 255 * flagSize);
                dy = Math.floor(overlayPixel[1] / 255 * flagSize);
            }
            const iFlag = (dx + dy * flagImageData.width) * 4;

            const flagPixel = flagImageData.data.slice(iFlag, iFlag + 4); flagPixel[3] = overlayPixel[3];

            const pixel = blendColor(backgroundPixel, flagPixel);
            pixelImageData.data[i] = pixel[0];
            pixelImageData.data[i+1] = pixel[1];
            pixelImageData.data[i+2] = pixel[2];
            pixelImageData.data[i+3] = pixel[3];
        }
    }
    
    ctx.putImageData(pixelImageData, 0, 0);
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
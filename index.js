const flagFile = document.getElementById("flagFile")
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const context1 = canvas1.getContext('2d');
const context2 = canvas2.getContext('2d');

const blobcat = new Image(); blobcat.src = "blobcat.png";
const blobfox = new Image(); blobfox.src = "blobfox.png";

function flagSelected() {
    const file = flagFile.files[0];
    if (file == null) {
        return;
    }

    
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function() {
        const img = new Image();

        img.src = URL.createObjectURL(file);

        img.addEventListener('load', () => {
            drawEmoji(blobcat, null, img, context1)
            drawEmoji(blobfox, null, img, context2)
        }, false);
    }
         

    /*
    img.addEventListener('load', () => {
        context.drawImage(img, 0, 0);
        context.beginPath();
        context.rect(5, 5, 100, 80);
        context.stroke();
        console.log("drawed");
    }, false);
    
    img.scr = URL.createObjectURL(file);

    console.log(img);
    */
    
}

flagFile.addEventListener("change", flagSelected, false);

function drawEmoji(background, overlay, flag, ctx) {
    ctx.clearRect(0, 0, 128, 128);
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(flag, 0, 0)
}
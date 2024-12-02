const form = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const pixelInput = document.getElementById('pixelInput');
const imageContainer = document.getElementById('imageContainer');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const revealMoreBtn = document.getElementById('revealMore');
const resetBtn = document.getElementById('reset');

let originalImage;
let revealedPixels = new Set();

form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.onload = function() {
                initializeCanvas();
                revealPixels(parseInt(pixelInput.value));
                imageContainer.classList.remove('hidden');
                controls.classList.remove('hidden');
                form.classList.add('hidden');
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
});

function initializeCanvas() {
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function revealPixels(numPixels) {
    ctx.drawImage(originalImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numPixels; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        } while (revealedPixels.has(`${x},${y}`));

        revealedPixels.add(`${x},${y}`);
        const index = (y * canvas.width + x) * 4;
        ctx.fillStyle = `rgb(${imageData.data[index]}, ${imageData.data[index + 1]}, ${imageData.data[index + 2]})`;
        ctx.fillRect(x, y, 1, 1);
    }
}

revealMoreBtn.addEventListener('click', function() {
    revealPixels(parseInt(pixelInput.value));
});

resetBtn.addEventListener('click', function() {
    revealedPixels.clear();
    initializeCanvas();
});

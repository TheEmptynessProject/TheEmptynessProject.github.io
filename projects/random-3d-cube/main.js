function generateRandomGradient() {
    const timestamp = new Date().getTime();

    const color1Red = Math.floor(255 * (timestamp % 128) / 128);
    const color1Green = Math.floor(255 * (Math.floor(timestamp / 128) % 128) / 128);
    const color1Blue = Math.floor(255 * (Math.floor(timestamp / 128 / 128) % 128) / 128);

    const color2Red = Math.floor(255 * (Math.floor(Math.random() * timestamp) % 128) / 128);
    const color2Green = Math.floor(255 * (Math.floor(Math.random() * timestamp / 128) % 128) / 128);
    const color2Blue = Math.floor(255 * (Math.floor(Math.random() * timestamp / 128 / 128) % 128) / 128);

    const gradient = `linear-gradient(to bottom, #000, rgba(${color2Red}, ${color2Green}, ${color2Blue}, 0.4))`;
	
	  document.body.style.setProperty('--cubeColor', `rgba(${color2Red}, ${color2Green}, ${color2Blue}, 0.4)`);

    return gradient;
}

const gradient = generateRandomGradient();

document.body.style.setProperty('--grid-lines-grid-before-background-image', gradient);

function generateTextColor(gradient) {
  const regex = /rgba\((\d+), (\d+), (\d+),/;
  const matches = gradient.match(regex);
  const color2Red = parseInt(matches[1]);
  const color2Green = parseInt(matches[2]);
  const color2Blue = parseInt(matches[3]);

  const luminance = (0.299 * color2Red + 0.587 * color2Green + 0.114 * color2Blue) / 255;
	console.log(luminance)
  const textColor = luminance > 0.95 ? '#000' : '#fff';

  return textColor;
}

const textColor = generateTextColor(gradient);

document.body.style.setProperty('--txtColor', textColor);

const cube = document.querySelector(".cube");

for (let i = 0; i < 6; i++) {
  const elem = document.createElement('div');
  elem.className = `faces face_index${i}`;
  cube.appendChild(elem);
}

function generateIllusionTexture(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  function aux(x, y) {
    const squareSize = 19
    const isDarkSquare = (Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 === 0;
    const color = isDarkSquare ? 0 : 255;
    return color;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const grayscale = aux(x, y);

      const index = (y * width + x) * 4;
      data[index] = grayscale; 
      data[index + 1] = grayscale; 
      data[index + 2] = grayscale; 
      data[index + 3] = 255; 
    }
  }

  context.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

const largeTexture = generateIllusionTexture(1024, 1024);

const cubeFaces = document.querySelectorAll('.faces');

cubeFaces.forEach(face => {
    face.style.backgroundImage = `url(${largeTexture})`;
    face.style.backgroundSize = '1024px 1024px';
});

let currentComplex = {
    real: 0,
    imaginary: 0,
    magnitude: 0,
    angle: 0
};

function checkEnter(event, type) {
    if (event.key === 'Enter') {
        event.preventDefault();
        convertAll();
    }
}

function convertAll() {
    const polarInput = document.getElementById('polarInput').value.trim();
    const rectangularInput = document.getElementById('rectangularInput').value.trim();
    const exponentialInput = document.getElementById('exponentialInput').value.trim();
    let result;
    if (polarInput) result = convertFromPolar(polarInput);
    else if (rectangularInput) result = convertFromRectangular(rectangularInput);
    else if (exponentialInput) result = convertFromExponential(exponentialInput);
    if (result) {
        currentComplex = result;
        updateFields(result.real, result.imaginary, result.magnitude, result.angle);
        updateAdditionalCalc(result);
        drawComplex(result);
    }
}

function convertFromPolar(input) {
    const polarRegex = /^(\d+(?:\.\d+)?)\s*arg\s*\(\s*(-?\d+(?:\.\d+)?)\s*(deg|rad|°)?\s*\)$/i;
    if (polarRegex.test(input)) {
        const match = input.match(polarRegex);
        const magnitude = parseFloat(match[1]);
        let angle = parseFloat(match[2]);
        const unit = match[3] ? match[3].toLowerCase() : 'deg';
        if (unit === 'deg' || unit === '°') {
            angle = angle * Math.PI / 180;
        }
        const real = magnitude * Math.cos(angle);
        const imaginary = magnitude * Math.sin(angle);
        return {
            real,
            imaginary,
            magnitude,
            angle
        };
    }
    alert("Invalid polar format. Please use '60 arg(45deg)', '60 arg(-30°)', or '60arg(0.26rad)'.");
    return null;
}

function convertFromRectangular(input) {
    const rectRegex = /^(-?\d+(?:\.\d+)?)?\s*([+-]?\s*\d+(?:\.\d+)?)?\s*i?$/;
    if (rectRegex.test(input)) {
        const match = input.match(rectRegex);
        const real = match[1] ? parseFloat(match[1].replace(/\s+/g, '')) : 0;
        const imaginary = match[2] ? parseFloat(match[2].replace(/\s+|i/g, '')) : 0;
        const magnitude = Math.sqrt(real * real + imaginary * imaginary);
        const angle = Math.atan2(imaginary, real);
        return {
            real,
            imaginary,
            magnitude,
            angle
        };
    }
    alert("Invalid rectangular format. Please use '3+4i', '3 - 4i', or '30i'.");
    return null;
}

function convertFromExponential(input) {
    const expRegex = /^(\d+(?:\.\d+)?)e\^\(i(-?\d+(?:\.\d+)?)(deg|rad)?\)$/i;
    if (expRegex.test(input)) {
        const match = input.match(expRegex);
        const magnitude = parseFloat(match[1]);
        let angle = parseFloat(match[2]);
        const unit = match[3] ? match[3].toLowerCase() : 'rad';

        if (unit === 'deg') {
            angle = angle * Math.PI / 180;
        }
        const real = magnitude * Math.cos(angle);
        const imaginary = magnitude * Math.sin(angle);
        return {
            real,
            imaginary,
            magnitude,
            angle
        };
    }
    alert("Invalid exponential format. Please use '10e^(i90deg)' or '10e^(i1.57rad)'");
    return null;
}

function formatNumber(num) {
    return Number.isInteger(num) ? num.toString() : num.toFixed(6);
}

function updateFields(real, imaginary, magnitude, angle) {
    const angleDeg = angle * (180 / Math.PI);
    document.getElementById('polarInput').value = `${formatNumber(magnitude)} arg(${formatNumber(angleDeg)}°)`;
    document.getElementById('rectangularInput').value = `${formatNumber(real)} ${imaginary >= 0 ? '+' : '-'} ${formatNumber(Math.abs(imaginary))}i`;
    document.getElementById('exponentialInput').value = `${formatNumber(magnitude)}e^(${formatNumber(angle)}i)`;
}

function clearAll() {
    document.getElementById('polarInput').value = '';
    document.getElementById('rectangularInput').value = '';
    document.getElementById('exponentialInput').value = '';
    document.getElementById('additionalCalc').innerHTML = '';
    clearCanvas();
}

function updateAdditionalCalc(result) {
    const {
        real,
        imaginary,
        magnitude,
        angle
    } = result;
    const angleDeg = angle * (180 / Math.PI);
    document.getElementById('additionalCalc').innerHTML = `
               <h3>Additional Calculations:</h3>
               <p>Magnitude |z| : ${formatNumber(magnitude)}</p>
               <p>Phase Z : ${formatNumber(angleDeg)}° (${formatNumber(angle)} rad)</p>
               <p>Re(z): ${formatNumber(real)}</p>
               <p>Im(z): ${formatNumber(imaginary)}</p>
           `;
    calculateAdditionalProperties(result)
}

function drawComplex(complex) {
    const canvas = document.getElementById('complexPlane');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    clearCanvas();

    const centerX = width / 2;
    const centerY = height / 2;

    const scaleFactor = (Math.min(width / (2 * Math.max(Math.abs(complex.real), Math.abs(complex.imaginary), complex.magnitude)), height / (2 * Math.max(Math.abs(complex.real), Math.abs(complex.imaginary), complex.magnitude))) * 0.8);

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.strokeStyle = '#888';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + complex.real * scaleFactor, centerY - complex.imaginary * scaleFactor);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, complex.magnitude * scaleFactor, -Math.PI / 2, -Math.PI / 2 + complex.angle);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'green';
    ctx.fillText(`Re(z):${formatNumber(complex.real)}`, centerX + complex.real * scaleFactor + 5, centerY + 15);
    ctx.fillText(`Im(z):${formatNumber(complex.imaginary)}i`, centerX - 30, centerY - complex.imaginary * scaleFactor - 5);

    ctx.fillStyle = 'purple';
    const midX = centerX + (complex.real * scaleFactor) / 2;
    const midY = centerY - (complex.imaginary * scaleFactor) / 2;
    ctx.fillText(`|z|:${formatNumber(complex.magnitude)}`, midX, midY);
    ctx.fillText(`θ:${formatNumber(complex.angle)} rad`, centerX + 20, centerY - 20);
}

function clearCanvas() {
    const canvas = document.getElementById('complexPlane');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function calculateAdditionalProperties(result) {
    const {
        real,
        imaginary,
        magnitude,
        angle
    } = result;

    const admittanceMagnitude = 1 / magnitude;
    const admittanceAngle = -angle;
    const admittanceReal = admittanceMagnitude * Math.cos(admittanceAngle);
    const admittanceImaginary = admittanceMagnitude * Math.sin(admittanceAngle);

    const conjugateReal = real;
    const conjugateImaginary = -imaginary;

    const additionalHTML = `
        <h3>Additional Properties:</h3>
        <h4>Admittance (Y = 1/Z):</h4>
        <p>Magnitude |Y|: ${formatNumber(admittanceMagnitude)} S</p>
        <p>Phase Y: ${formatNumber(admittanceAngle * 180 / Math.PI)}° (${formatNumber(admittanceAngle)} rad)</p>
        <p>Y = G + jB: ${formatNumber(admittanceReal)} ${admittanceImaginary >= 0 ? '+' : '-'} ${formatNumber(Math.abs(admittanceImaginary))}j S</p>

        <h4>Conjugate (Z*):</h4>
        <p>Z* = ${formatNumber(conjugateReal)} ${conjugateImaginary >= 0 ? '+' : '-'} ${formatNumber(Math.abs(conjugateImaginary))}j</p>
    `;

    document.getElementById('additionalCalc').innerHTML += additionalHTML;
}

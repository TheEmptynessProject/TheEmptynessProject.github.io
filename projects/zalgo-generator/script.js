function generateCombiningMarks(numEntries) {
    const combiningMarks = [];
    for (let i = 0x0300; i < 0x0370; i++) {
        combiningMarks.push(String.fromCodePoint(i));
    }
    return shuffleArray(combiningMarks).slice(0, numEntries);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function corruptText() {
    const inputText = document.getElementById('inputText').value;
    const iterations = parseInt(document.getElementById('iterations').value);
    const combiningMarks = generateCombiningMarks(250);
    
    let corruptedText = '';
    for (let char of inputText) {
        corruptedText += char;
        for (let i = 0; i < iterations; i++) {
            corruptedText += combiningMarks[Math.floor(Math.random() * combiningMarks.length)];
        }
    }
    
    document.getElementById('result').textContent = corruptedText;
    document.getElementById('copyButton').style.display = 'block';
}


function copyToClipboard() {
    const resultText = document.getElementById('result').textContent;
    navigator.clipboard.writeText(resultText).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

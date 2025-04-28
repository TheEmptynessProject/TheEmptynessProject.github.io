document.addEventListener('DOMContentLoaded', () => {
    
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');
    const startBtn = document.getElementById('start-button');
    const overText = document.getElementById('over-text');
    const coverScreen = document.querySelector('.cover-screen');
    
    
    const gameHeader = document.querySelector('.heading');
    
    
    const bestScoreContainer = document.createElement('div');
    bestScoreContainer.className = 'score-container';
    bestScoreContainer.innerHTML = 'Best: <span id="best-score">0</span>';
    gameHeader.appendChild(bestScoreContainer);
    const bestScoreDisplay = document.getElementById('best-score');
    
    
    const resetBtn = document.createElement('button');
    resetBtn.id = 'reset-button';
    resetBtn.innerText = 'Reset Game';
    resetBtn.style.marginLeft = '10px';
    resetBtn.style.backgroundColor = '#8f7a66';
    resetBtn.style.color = 'white';
    resetBtn.style.border = 'none';
    resetBtn.style.padding = '8px 15px';
    resetBtn.style.borderRadius = '5px';
    resetBtn.style.cursor = 'pointer';
    gameHeader.appendChild(resetBtn);
    
    
    const width = 4;
    let squares = [];
    let score = 0;
    let bestScore = 0;
    let gameStarted = false;
    window.gameStarted = gameStarted;
    let wonGame = false;
    
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const minSwipeDistance = 30;
    
    
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.classList.add('box');
            square.innerHTML = '';
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generateRandom();
        generateRandom();
        updateTileClasses();
    }
    
    
    function generateRandom() {
        if (!hasEmptySquare()) return;
        
        let randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].innerHTML === '') {
            squares[randomNumber].innerHTML = Math.random() < 0.9 ? 2 : 4;
            updateTileClasses();
            checkForGameOver();
        } else {
            generateRandom();
        }
    }
    
    
    function hasEmptySquare() {
        return squares.some(square => square.innerHTML === '');
    }
    
    
    function updateTileClasses() {
        for (let i = 0; i < squares.length; i++) {
            const value = squares[i].innerHTML;
            squares[i].className = 'box';
            if (value !== '') {
                squares[i].classList.add('box-' + value);
            }
        }
    }
    
    
    function moveRight() {
        let hasMoved = false;
        
        
        for (let i = 0; i < width; i++) {
            
            for (let j = width - 1; j >= 0; j--) {
                if (squares[i * width + j].innerHTML === '') {
                    
                    for (let k = j - 1; k >= 0; k--) {
                        if (squares[i * width + k].innerHTML !== '') {
                            
                            squares[i * width + j].innerHTML = squares[i * width + k].innerHTML;
                            squares[i * width + k].innerHTML = '';
                            hasMoved = true;
                            break;
                        }
                    }
                }
            }
            
            
            for (let j = width - 1; j > 0; j--) {
                const currentPos = i * width + j;
                const leftPos = i * width + (j - 1);
                
                if (squares[currentPos].innerHTML !== '' && 
                    squares[currentPos].innerHTML === squares[leftPos].innerHTML) {
                    
                    const value = parseInt(squares[currentPos].innerHTML);
                    squares[currentPos].innerHTML = (value * 2).toString();
                    squares[leftPos].innerHTML = '';
                    score += value * 2;
                    scoreDisplay.innerHTML = score;
                    hasMoved = true;
                    
                    
                    if (value * 2 === 2048 && !wonGame) {
                        resultDisplay.innerHTML = 'You reached 2048! Continue playing?';
                        wonGame = true;
                        
                    }
                }
            }
            
            
            for (let j = width - 1; j >= 0; j--) {
                if (squares[i * width + j].innerHTML === '') {
                    
                    for (let k = j - 1; k >= 0; k--) {
                        if (squares[i * width + k].innerHTML !== '') {
                            
                            squares[i * width + j].innerHTML = squares[i * width + k].innerHTML;
                            squares[i * width + k].innerHTML = '';
                            hasMoved = true;
                            break;
                        }
                    }
                }
            }
        }
        
        return hasMoved;
    }
    
    
    function moveLeft() {
        let hasMoved = false;
        
        
        for (let i = 0; i < width; i++) {
            
            for (let j = 0; j < width; j++) {
                if (squares[i * width + j].innerHTML === '') {
                    
                    for (let k = j + 1; k < width; k++) {
                        if (squares[i * width + k].innerHTML !== '') {
                            
                            squares[i * width + j].innerHTML = squares[i * width + k].innerHTML;
                            squares[i * width + k].innerHTML = '';
                            hasMoved = true;
                            break;
                        }
                    }
                }
            }
            
            
            for (let j = 0; j < width - 1; j++) {
                const currentPos = i * width + j;
                const rightPos = i * width + (j + 1);
                
                if (squares[currentPos].innerHTML !== '' && 
                    squares[currentPos].innerHTML === squares[rightPos].innerHTML) {
                    
                    const value = parseInt(squares[currentPos].innerHTML);
                    squares[currentPos].innerHTML = (value * 2).toString();
                    squares[rightPos].innerHTML = '';
                    score += value * 2;
                    scoreDisplay.innerHTML = score;
                    hasMoved = true;
                    
                    
                    if (value * 2 === 2048 && !wonGame) {
                        resultDisplay.innerHTML = 'You reached 2048! Continue playing?';
                        wonGame = true;
                        
                    }
                }
            }
            
            
            for (let j = 0; j < width; j++) {
                if (squares[i * width + j].innerHTML === '') {
                    
                    for (let k = j + 1; k < width; k++) {
                        if (squares[i * width + k].innerHTML !== '') {
                            
                            squares[i * width + j].innerHTML = squares[i * width + k].innerHTML;
                            squares[i * width + k].innerHTML = '';
                            hasMoved = true;
                            break;
                        }
                    }
                }
            }
        }
        
        return hasMoved;
    }
    
    
    function moveUp() {
        let hasMoved = false;
        
        
        for (let j = 0; j < width; j++) {
            
            for (let i = 0; i < width; i++) {
                if (squares[i * width + j].innerHTML === '') {
                    
                    for (let k = i + 1; k < width; k++) {
                        if (squares[k * width + j].innerHTML !== '') {
                            
                            squares[i * width + j].innerHTML = squares[k * width + j].innerHTML;
                            squares[k * width + j].innerHTML = '';
                            hasMoved = true;
                            break;
                        }
                    }
                }
            }
            
            
            for (let i = 0; i < width - 1; i++) {
                const currentPos = i * width + j;
                const belowPos = (i + 1) * width + j;
                
                if (squares[currentPos].innerHTML !== '' && 
                    squares[currentPos].innerHTML === squares[belowPos].innerHTML) {
                    
                    const value = parseInt(squares[currentPos].innerHTML);
                    squares[currentPos].innerHTML = (value * 2).toString();
                    squares[belowPos].innerHTML = '';
                    score += value * 2;
                    scoreDisplay.innerHTML = score;
                    hasMoved = true;
                    
                    
                    if (value * 2 === 2048 && !wonGame) {
                        resultDisplay.innerHTML = 'You reached 2048! Continue playing?';
                        wonGame = true;
                        
                    }
                }
            }
            
            
            for (let i = 0; i < width; i++) {
                if (squares[i * width + j].innerHTML === '') {
                    
                    for (let k = i + 1; k < width; k++) {
                        if (squares[k * width + j].innerHTML !== '') {
                            
                            squares[i * width + j].innerHTML = squares[k * width + j].innerHTML;
                            squares[k * width + j].innerHTML = '';
                            hasMoved = true;
                            break;
                        }
                    }
                }
            }
        }
        
        return hasMoved;
    }
    
    
    function moveDown() {
        let hasMoved = false;
        
        
        for (let j = 0; j < width; j++) {
            
            for (let i = width - 1; i >= 0; i--) {
                if (squares[i * width + j].innerHTML === '') {
                    
                    for (let k = i - 1; k >= 0; k--) {
                        if (squares[k * width + j].innerHTML !== '') {
                            
                            squares[i * width + j].innerHTML = squares[k * width + j].innerHTML;
                            squares[k * width + j].innerHTML = '';
                            hasMoved = true;
                            break;
                        }
                    }
                }
            }
            
            
            for (let i = width - 1; i > 0; i--) {
                const currentPos = i * width + j;
                const abovePos = (i - 1) * width + j;
                
                if (squares[currentPos].innerHTML !== '' && 
                    squares[currentPos].innerHTML === squares[abovePos].innerHTML) {
                    
                    const value = parseInt(squares[currentPos].innerHTML);
                    squares[currentPos].innerHTML = (value * 2).toString();
                    squares[abovePos].innerHTML = '';
                    score += value * 2;
                    scoreDisplay.innerHTML = score;
                    hasMoved = true;
                    
                    
                    if (value * 2 === 2048 && !wonGame) {
                        resultDisplay.innerHTML = 'You reached 2048! Continue playing?';
                        wonGame = true;
                        
                    }
                }
            }
            
            
            for (let i = width - 1; i >= 0; i--) {
                if (squares[i * width + j].innerHTML === '') {
                    
                    for (let k = i - 1; k >= 0; k--) {
                        if (squares[k * width + j].innerHTML !== '') {
                            
                            squares[i * width + j].innerHTML = squares[k * width + j].innerHTML;
                            squares[k * width + j].innerHTML = '';
                            hasMoved = true;
                            break;
                        }
                    }
                }
            }
        }
        
        return hasMoved;
    }
    
    
    function control(e) {
        if (!window.gameStarted) return;
        
        let hasMoved = false;
        
        if (e.keyCode === 39) { 
            hasMoved = moveRight();
        } else if (e.keyCode === 37) { 
            hasMoved = moveLeft();
        } else if (e.keyCode === 38) { 
            hasMoved = moveUp();
        } else if (e.keyCode === 40) { 
            hasMoved = moveDown();
        }
        
        if (hasMoved) {
            generateRandom();
            updateTileClasses();
            updateBestScore();
            saveGameState();
        }
    }
    
    
    function checkForGameOver() {
        let zeros = 0;
        
        
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML === '') {
                zeros++;
            }
        }
        
        
        if (zeros === 0 && !canMoveHorizontally() && !canMoveVertically()) {
            overText.innerHTML = 'Game Over';
            overText.classList.remove('hide');
            coverScreen.style.display = 'flex';
            window.gameStarted = false;
            saveGameState(); 
        }
    }
    
    
    function canMoveHorizontally() {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width - 1; j++) {
                if (squares[i * width + j].innerHTML === squares[i * width + j + 1].innerHTML) {
                    return true;
                }
            }
        }
        return false;
    }
    
    
    function canMoveVertically() {
        for (let j = 0; j < width; j++) {
            for (let i = 0; i < width - 1; i++) {
                if (squares[i * width + j].innerHTML === squares[(i + 1) * width + j].innerHTML) {
                    return true;
                }
            }
        }
        return false;
    }
    
    
    function updateBestScore() {
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            bestScoreDisplay.innerHTML = bestScore;
        }
    }
    
    
    function saveGameState() {
        let gameState = {
            board: [],
            score: score,
            gameStarted: window.gameStarted,
            wonGame: wonGame
        };
        
        
        for (let i = 0; i < squares.length; i++) {
            gameState.board.push(squares[i].innerHTML);
        }
        
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }
    
    
    function loadGameState() {
        const savedState = localStorage.getItem('gameState');
        
        if (savedState) {
            const gameState = JSON.parse(savedState);
            
            
            if (gameState.board && gameState.board.length === squares.length) {
                for (let i = 0; i < squares.length; i++) {
                    squares[i].innerHTML = gameState.board[i];
                }
                
                score = gameState.score;
                scoreDisplay.innerHTML = score;
                gameStarted = gameState.gameStarted;
                wonGame = gameState.wonGame || false;
                
                if (window.gameStarted) {
                    coverScreen.style.display = 'none';
                }
                
                updateTileClasses();
                updateBestScore();
            }
        }
    }
    
    
    function loadBestScore() {
        const savedBestScore = localStorage.getItem('bestScore');
        
        if (savedBestScore) {
            bestScore = parseInt(savedBestScore);
            bestScoreDisplay.innerHTML = bestScore;
        }
    }
    
    
    function resetGame() {
        score = 0;
        scoreDisplay.innerHTML = score;
        resultDisplay.innerHTML = 'Join the numbers and get to the <b>2048</b> tile!';
        overText.classList.add('hide');
        coverScreen.style.display = 'none';
        wonGame = false;
        
        
        gridDisplay.innerHTML = '';
        squares = [];
        
        
        window.gameStarted = true;
        createBoard();
        saveGameState();
    }
    
    
    function startNewGame() {
        
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            if (gameState.gameStarted) {
                
                if (confirm('Would you like to continue your previous game?')) {
                    loadGameState();
                    
                    window.gameStarted = true;
                    coverScreen.style.display = 'none';
                    overText.classList.add('hide');
                    resultDisplay.innerHTML = 'Join the numbers and get to the <b>2048</b> tile!';
                    return;
                }
            }
        }
        
        resetGame();
    }
    
    
    function handleTouchStart(e) {
        if (!window.gameStarted) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
    
    function handleTouchMove(e) {
        if (!window.gameStarted) return;
        e.preventDefault();
    }
    
    function handleTouchEnd(e) {
        if (!window.gameStarted) return;
        
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    
                    simulateKeyPress(39);
                } else {
                    
                    simulateKeyPress(37);
                }
            }
        } else {
            
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    
                    simulateKeyPress(40);
                } else {
                    
                    simulateKeyPress(38);
                }
            }
        }
    }
    
    function simulateKeyPress(keyCode) {
        const event = new KeyboardEvent('keydown', { keyCode: keyCode, which: keyCode });
        document.dispatchEvent(event);
    }
    
    
    document.addEventListener('keydown', control);
    startBtn.addEventListener('click', startNewGame);
    resetBtn.addEventListener('click', resetGame);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    
    loadBestScore();
    
    
    
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.classList.add('box');
        square.innerHTML = '';
        gridDisplay.appendChild(square);
        squares.push(square);
    }
    
    
    loadGameState();
});

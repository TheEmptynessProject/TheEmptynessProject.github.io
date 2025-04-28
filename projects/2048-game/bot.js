document.addEventListener('DOMContentLoaded', () => {
    
    const gameHeader = document.querySelector('.heading');
    
    const botToggleContainer = document.createElement('div');
    botToggleContainer.className = 'bot-toggle-container';
    botToggleContainer.style.display = 'flex';
    botToggleContainer.style.alignItems = 'center';
    botToggleContainer.style.marginLeft = '10px';
    
    const botToggle = document.createElement('button');
    botToggle.id = 'bot-toggle';
    botToggle.innerText = 'Start Bot';
    botToggle.style.backgroundColor = '#8f7a66';
    botToggle.style.color = 'white';
    botToggle.style.border = 'none';
    botToggle.style.padding = '8px 15px';
    botToggle.style.borderRadius = '5px';
    botToggle.style.cursor = 'pointer';
    
    botToggleContainer.appendChild(botToggle);
    gameHeader.appendChild(botToggleContainer);

    let botActive = false;
    let botInterval;
    const botMoveDelay = 150; 
    
    
    const weights = {
        
        pattern: [
            [  4,   8,  16,  32768],
            [  2,  16,  64,  16384],
            [  1,   8, 128,   8192],
            [  0.5, 2, 256,   4096]
        ],
        emptyCellWeight: 100,
        mergePossibilityWeight: 50,
        monotonicityWeight: 100,
        smoothnessWeight: 10,
        cornerWeight: 1000
    };

    
    const SEARCH_DEPTH = 5;

    
    function toggleBot() {
        botActive = !botActive;
        if (botActive) {
            botToggle.innerText = 'Stop Bot';
            botToggle.style.backgroundColor = '#e74c3c';
            startBot();
        } else {
            botToggle.innerText = 'Start Bot';
            botToggle.style.backgroundColor = '#8f7a66';
            stopBot();
        }
    }

    
    function startBot() {
        if (!window.gameStarted) {
            
            document.getElementById('start-button').click();
        }
        
        botInterval = setInterval(() => {
            if (!window.gameStarted) {
                
                toggleBot();
                return;
            }
            
            const squares = Array.from(document.querySelectorAll('div.box'));
            const bestMove = findBestMove(squares);
            makeMove(bestMove);
        }, botMoveDelay);
    }
    
    
    function stopBot() {
        clearInterval(botInterval);
    }
    
    
    function findBestMove(squares) {
        const moves = [
            { direction: 'up', keyCode: 38 },
            { direction: 'right', keyCode: 39 },
            { direction: 'down', keyCode: 40 },
            { direction: 'left', keyCode: 37 }
        ];
        
        let bestScore = -Infinity;
        let bestMove = null;
        const board = getBoardClone(squares);
        
        for (const move of moves) {
            
            const moveResult = simulateMove(cloneBoard(board), move.direction);
            
            if (moveResult.changed) {
                const score = expectimax(moveResult.board, SEARCH_DEPTH - 1, false);
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = move;
                }
            }
        }
        
        
        if (!bestMove) {
            for (const move of moves) {
                const moveResult = simulateMove(cloneBoard(board), move.direction);
                
                if (moveResult.changed) {
                    return move;
                }
            }
        }
        
        return bestMove || moves[0]; 
    }
    
    
    function expectimax(board, depth, isPlayerTurn) {
        if (depth === 0 || isGameOver(board)) {
            return evaluateBoard(board);
        }
        if (isPlayerTurn) {
            
            let maxScore = -Infinity;
            for (const dir of ['up', 'right', 'down', 'left']) {
                const moveResult = simulateMove(cloneBoard(board), dir);
                
                if (moveResult.changed) {
                    const score = expectimax(moveResult.board, depth - 1, false);
                    
                    if (score > maxScore) {
                        maxScore = score;
                    }
                }
            }
            return maxScore;
        } else {
            
            let empty = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (board[i][j] === 0) empty.push([i, j]);
                }
            }
            if (empty.length === 0) return evaluateBoard(board);
            let total = 0;
            for (const [i, j] of empty) {
                
                for (const [val, prob] of [[2, 0.9], [4, 0.1]]) {
                    const newBoard = cloneBoard(board);
                    newBoard[i][j] = val;
                    total += prob * expectimax(newBoard, depth - 1, true);
                }
            }
            return total / empty.length;
        }
    }

    function isGameOver(board) {
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) return false;
                if (j < 3 && board[i][j] === board[i][j + 1]) return false;
                if (i < 3 && board[i][j] === board[i + 1][j]) return false;
            }
        }
        return true;
    }

    function cloneBoard(board) {
        return board.map(row => row.slice());
    }

    
    function getBoardClone(squares) {
        const board = [];
        const width = 4;
        
        for (let i = 0; i < width; i++) {
            board.push([]);
            for (let j = 0; j < width; j++) {
                const value = squares[i * width + j].innerHTML;
                board[i].push(value === '' ? 0 : parseInt(value));
            }
        }
        
        return board;
    }
    
    
    function simulateMove(board, direction) {
        const width = 4;
        let changed = false;
        
        
        const originalBoard = JSON.stringify(board);
        
        
        switch (direction) {
            case 'up':
                
                for (let j = 0; j < width; j++) {
                    
                    let column = [];
                    for (let i = 0; i < width; i++) {
                        if (board[i][j] !== 0) {
                            column.push(board[i][j]);
                        }
                    }
                    
                    
                    for (let i = 0; i < column.length - 1; i++) {
                        if (column[i] === column[i + 1]) {
                            column[i] *= 2;
                            column.splice(i + 1, 1);
                        }
                    }
                    
                    
                    while (column.length < width) {
                        column.push(0);
                    }
                    
                    
                    for (let i = 0; i < width; i++) {
                        board[i][j] = column[i];
                    }
                }
                break;
                
            case 'right':
                
                for (let i = 0; i < width; i++) {
                    
                    let row = [];
                    for (let j = width - 1; j >= 0; j--) {
                        if (board[i][j] !== 0) {
                            row.push(board[i][j]);
                        }
                    }
                    
                    
                    for (let j = 0; j < row.length - 1; j++) {
                        if (row[j] === row[j + 1]) {
                            row[j] *= 2;
                            row.splice(j + 1, 1);
                        }
                    }
                    
                    
                    while (row.length < width) {
                        row.push(0);
                    }
                    
                    
                    for (let j = 0; j < width; j++) {
                        board[i][width - 1 - j] = row[j];
                    }
                }
                break;
                
            case 'down':
                
                for (let j = 0; j < width; j++) {
                    
                    let column = [];
                    for (let i = width - 1; i >= 0; i--) {
                        if (board[i][j] !== 0) {
                            column.push(board[i][j]);
                        }
                    }
                    
                    
                    for (let i = 0; i < column.length - 1; i++) {
                        if (column[i] === column[i + 1]) {
                            column[i] *= 2;
                            column.splice(i + 1, 1);
                        }
                    }
                    
                    
                    while (column.length < width) {
                        column.push(0);
                    }
                    
                    
                    for (let i = 0; i < width; i++) {
                        board[width - 1 - i][j] = column[i];
                    }
                }
                break;
                
            case 'left':
                
                for (let i = 0; i < width; i++) {
                    
                    let row = [];
                    for (let j = 0; j < width; j++) {
                        if (board[i][j] !== 0) {
                            row.push(board[i][j]);
                        }
                    }
                    
                    
                    for (let j = 0; j < row.length - 1; j++) {
                        if (row[j] === row[j + 1]) {
                            row[j] *= 2;
                            row.splice(j + 1, 1);
                        }
                    }
                    
                    
                    while (row.length < width) {
                        row.push(0);
                    }
                    
                    
                    for (let j = 0; j < width; j++) {
                        board[i][j] = row[j];
                    }
                }
                break;
        }
        
        
        changed = originalBoard !== JSON.stringify(board);
        
        return { board, changed };
    }
    
    
    function evaluateBoard(board) {
        return (
            calculatePatternScore(board) +
            calculateEmptyCellScore(board) +
            calculateMergePossibilityScore(board) +
            calculateMonotonicityScore(board) +
            calculateSmoothnessScore(board) +
            calculateCornerScore(board)
        );
    }
    
    
    function calculatePatternScore(board) {
        let score = 0;
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                score += board[i][j] * weights.pattern[i][j];
            }
        }
        
        return score;
    }
    
    
    function calculateEmptyCellScore(board) {
        let emptyCells = 0;
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    emptyCells++;
                }
            }
        }
        
        return emptyCells * weights.emptyCellWeight;
    }
    
    
    function calculateMergePossibilityScore(board) {
        let merges = 0;
        
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] !== 0 && board[i][j] === board[i][j + 1]) {
                    merges++;
                }
            }
        }
        
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] !== 0 && board[i][j] === board[i + 1][j]) {
                    merges++;
                }
            }
        }
        
        return merges * weights.mergePossibilityWeight;
    }
    
    
    function calculateMonotonicityScore(board) {
        let totals = [0, 0, 0, 0];
        
        
        for (let i = 0; i < 4; i++) {
            let inc = 0, dec = 0;
            for (let j = 0; j < 3; j++) {
                if (board[i][j] > board[i][j + 1]) {
                    inc += Math.log2(board[i][j] || 1) - Math.log2(board[i][j + 1] || 1);
                } else {
                    dec += Math.log2(board[i][j + 1] || 1) - Math.log2(board[i][j] || 1);
                }
            }
            totals[0] += inc;
            totals[1] += dec;
        }
        
        
        for (let j = 0; j < 4; j++) {
            let inc = 0, dec = 0;
            for (let i = 0; i < 3; i++) {
                if (board[i][j] > board[i + 1][j]) {
                    inc += Math.log2(board[i][j] || 1) - Math.log2(board[i + 1][j] || 1);
                } else {
                    dec += Math.log2(board[i + 1][j] || 1) - Math.log2(board[i][j] || 1);
                }
            }
            totals[2] += inc;
            totals[3] += dec;
        }
        
        return -Math.min(totals[0], totals[1]) * weights.monotonicityWeight
             -Math.min(totals[2], totals[3]) * weights.monotonicityWeight;
    }
    
    
    function calculateSmoothnessScore(board) {
        let score = 0;
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] !== 0) {
                    
                    if (j < 3 && board[i][j + 1] !== 0) {
                        score -= Math.abs(Math.log2(board[i][j]) - Math.log2(board[i][j + 1]));
                    }
                    
                    
                    if (i < 3 && board[i + 1][j] !== 0) {
                        score -= Math.abs(Math.log2(board[i][j]) - Math.log2(board[i + 1][j]));
                    }
                }
            }
        }
        
        return score * weights.smoothnessWeight;
    }
    
    
    function calculateCornerScore(board) {
        let max = 0, maxPos = [0, 0];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] > max) {
                    max = board[i][j];
                    maxPos = [i, j];
                }
            }
        }
        
        return (maxPos[0] === 3 && maxPos[1] === 3 ? 1 : 0) * weights.cornerWeight * Math.log2(max || 1);
    }
    
    
    function makeMove(move) {
        if (move) {
            simulateKeyPress(move.keyCode);
        }
    }
    
    
    function simulateKeyPress(keyCode) {
        const event = new KeyboardEvent('keydown', { keyCode: keyCode, which: keyCode });
        document.dispatchEvent(event);
    }
    
    
    botToggle.addEventListener('click', toggleBot);
    
    
    const resetBtn = document.getElementById('reset-button');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (botActive) {
                toggleBot();
            }
        });
    }
});

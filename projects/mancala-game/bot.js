


MancalaGame.prototype.aiMove = function() {
    if (this.gameOver) return;
    
    const startTime = Date.now();
    
    const maxDepth = 32; 
    
    
    const result = this.minimaxRoot(maxDepth, true);
    
    
    if (result.move !== null) {
        setTimeout(() => {
            const moveResult = this.makeMove('ai', result.move);
            
            if (moveResult.extraTurn && !moveResult.gameOver) {
                setTimeout(() => {
                    this.aiMove();
                }, 500);
            }
        }, 500); 
    }
    
    console.log(`AI thought for ${Date.now() - startTime}ms and chose pit ${result.move}`);
};


MancalaGame.prototype.minimaxRoot = function(depth, isMaximizing) {
    const moves = [];
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove = null;
    
    
    for (let i = 0; i < 6; i++) {
        if (this.board.ai[i] > 0) {
            moves.push(i);
        }
    }
    
    
    moves.sort(() => Math.random() - 0.5);
    
    
    for (const move of moves) {
        
        const clonedBoard = this.cloneBoard();
        const result = this.simulateMove(clonedBoard, 'ai', move);
        
        
        let score;
        if (result.extraTurn) {
            
            score = this.minimax(result.board, depth - 1, isMaximizing, -Infinity, Infinity);
        } else {
            
            score = this.minimax(result.board, depth - 1, !isMaximizing, -Infinity, Infinity);
        }
        
        
        if (isMaximizing) {
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        } else {
            if (score < bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
    }
    
    return { move: bestMove, score: bestScore };
};


MancalaGame.prototype.minimax = function(board, depth, isMaximizing, alpha, beta) {
    
    if (depth === 0 || this.isGameOverState(board)) {
        return this.evaluateBoard(board);
    }
    
    const side = isMaximizing ? 'ai' : 'player';
    
    
    const moves = [];
    for (let i = 0; i < 6; i++) {
        if (board[side][i] > 0) {
            moves.push(i);
        }
    }
    
    
    if (moves.length === 0) {
        return this.evaluateBoard(board);
    }
    
    if (isMaximizing) {
        let maxEval = -Infinity;
        
        for (const move of moves) {
            const result = this.simulateMove({ ...board }, side, move);
            
            let evalScore;
            if (result.extraTurn) {
                
                evalScore = this.minimax(result.board, depth - 1, true, alpha, beta);
            } else {
                
                evalScore = this.minimax(result.board, depth - 1, false, alpha, beta);
            }
            
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            
            
            if (beta <= alpha) {
                break;
            }
        }
        
        return maxEval;
    } else {
        let minEval = Infinity;
        
        for (const move of moves) {
            const result = this.simulateMove({ ...board }, side, move);
            
            let evalScore;
            if (result.extraTurn) {
                
                evalScore = this.minimax(result.board, depth - 1, false, alpha, beta);
            } else {
                
                evalScore = this.minimax(result.board, depth - 1, true, alpha, beta);
            }
            
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            
            
            if (beta <= alpha) {
                break;
            }
        }
        
        return minEval;
    }
};


MancalaGame.prototype.simulateMove = function(board, side, pitIndex) {
    if (board[side][pitIndex] === 0) {
        return { board, extraTurn: false };
    }
    
    
    let stones = board[side][pitIndex];
    board[side][pitIndex] = 0;
    
    let currentSide = side;
    let currentIndex = pitIndex;
    
    
    while (stones > 0) {
        currentIndex++;
        
        
        if (currentIndex > 6) {
            currentSide = currentSide === 'player' ? 'ai' : 'player';
            currentIndex = 0;
        }
        
        
        if (currentSide !== side && currentIndex === 6) {
            currentSide = currentSide === 'player' ? 'ai' : 'player';
            currentIndex = 0;
        }
        
        
        board[currentSide][currentIndex]++;
        stones--;
    }
    
    
    if (currentSide === side && currentIndex < 6 && board[currentSide][currentIndex] === 1) {
        const oppositeSide = currentSide === 'player' ? 'ai' : 'player';
        const oppositeIndex = 5 - currentIndex;
        
        if (board[oppositeSide][oppositeIndex] > 0) {
            
            board[side][6] += board[oppositeSide][oppositeIndex] + 1;
            board[oppositeSide][oppositeIndex] = 0;
            board[currentSide][currentIndex] = 0;
        }
    }
    
    
    const extraTurn = currentSide === side && currentIndex === 6;
    
    return { board, extraTurn };
};


MancalaGame.prototype.isGameOverState = function(board) {
    let playerEmpty = true;
    let aiEmpty = true;
    
    for (let i = 0; i < 6; i++) {
        if (board.player[i] > 0) playerEmpty = false;
        if (board.ai[i] > 0) aiEmpty = false;
    }
    
    return playerEmpty || aiEmpty;
};


MancalaGame.prototype.evaluateBoard = function(board) {
    
    const scoreDifference = board.ai[6] - board.player[6];
    
    
    let aiStones = 0;
    let playerStones = 0;
    
    for (let i = 0; i < 6; i++) {
        aiStones += board.ai[i];
        playerStones += board.player[i];
    }
    
    
    
    
    const stonesDifference = aiStones - playerStones;
    
    
    let capturePotential = 0;
    for (let i = 0; i < 6; i++) {
        if (board.ai[i] === 0) {
            
            const opposite = 5 - i;
            if (board.player[opposite] > 0) {
                
                capturePotential += board.player[opposite];
            }
        }
    }
    
    
    let extraTurnPotential = 0;
    for (let i = 0; i < 6; i++) {
        
        if (board.ai[i] === 6 - i) {
            extraTurnPotential += 3;
        }
    }
    
    
    return scoreDifference * 3 + stonesDifference * 0.5 + capturePotential * 1.5 + extraTurnPotential * 2;
};

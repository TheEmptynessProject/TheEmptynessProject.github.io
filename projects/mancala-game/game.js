class MancalaGame {
    constructor() {
        this.board = {
            player: [4, 4, 4, 4, 4, 4, 0],  
            ai: [4, 4, 4, 4, 4, 4, 0]       
        };
        this.currentTurn = 'player';  
        this.gameOver = false;
        
        this.setupEventListeners();
        this.updateBoard();
    }
    
    setupEventListeners() {
        
        for (let i = 0; i < 6; i++) {
            const pit = document.getElementById(`pit-player-${i}`);
            pit.addEventListener('click', () => {
                if (this.currentTurn === 'player' && !this.gameOver) {
                    this.makeMove('player', i);
                }
            });
        }
        
        
        document.getElementById('new-game').addEventListener('click', () => {
            this.resetGame();
        });
        
        
        document.getElementById('play-again').addEventListener('click', () => {
            document.getElementById('game-over').classList.add('hidden');
            this.resetGame();
        });
    }
    
    resetGame() {
        this.board = {
            player: [4, 4, 4, 4, 4, 4, 0],
            ai: [4, 4, 4, 4, 4, 4, 0]
        };
        this.currentTurn = 'player';
        this.gameOver = false;
        this.updateBoard();
        document.getElementById('current-player').textContent = 'Your Turn';
    }
    
    makeMove(side, pitIndex) {
        if (this.board[side][pitIndex] === 0) return { extraTurn: false, gameOver: false };
        
        
        let stones = this.board[side][pitIndex];
        this.board[side][pitIndex] = 0;
        
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
            
            
            this.board[currentSide][currentIndex]++;
            stones--;
        }
        
        
        if (currentSide === side && currentIndex < 6 && this.board[currentSide][currentIndex] === 1) {
            const oppositeSide = currentSide === 'player' ? 'ai' : 'player';
            const oppositeIndex = 5 - currentIndex;
            
            if (this.board[oppositeSide][oppositeIndex] > 0) {
                
                this.board[side][6] += this.board[oppositeSide][oppositeIndex] + 1;
                this.board[oppositeSide][oppositeIndex] = 0;
                this.board[currentSide][currentIndex] = 0;
            }
        }
        
        this.updateBoard();
        
        
        if (this.checkGameOver()) {
            return { extraTurn: false, gameOver: true };
        }
        
        
        const hasExtraTurn = currentSide === side && currentIndex === 6;
        
        
        if (!hasExtraTurn) {
            this.currentTurn = this.currentTurn === 'player' ? 'ai' : 'player';
            document.getElementById('current-player').textContent = 
                this.currentTurn === 'player' ? 'Your Turn' : 'AI Thinking...';
            
            
            if (this.currentTurn === 'ai') {
                setTimeout(() => {
                    this.aiMove();
                }, 500); 
            }
        }
        
        return { extraTurn: hasExtraTurn, gameOver: false };
    }
    
    aiMove() {
        
        
    }
    
    checkGameOver() {
        let playerEmpty = true;
        let aiEmpty = true;
        
        
        for (let i = 0; i < 6; i++) {
            if (this.board.player[i] > 0) playerEmpty = false;
            if (this.board.ai[i] > 0) aiEmpty = false;
        }
        
        if (playerEmpty || aiEmpty) {
            
            let playerSum = 0;
            let aiSum = 0;
            
            for (let i = 0; i < 6; i++) {
                playerSum += this.board.player[i];
                aiSum += this.board.ai[i];
                this.board.player[i] = 0;
                this.board.ai[i] = 0;
            }
            
            
            this.board.player[6] += playerSum;
            this.board.ai[6] += aiSum;
            
            this.updateBoard();
            this.endGame();
            return true;
        }
        
        return false;
    }
    
    endGame() {
        this.gameOver = true;
        const playerScore = this.board.player[6];
        const aiScore = this.board.ai[6];
        
        let message;
        if (playerScore > aiScore) {
            message = `You win! ${playerScore} - ${aiScore}`;
        } else if (aiScore > playerScore) {
            message = `AI wins! ${aiScore} - ${playerScore}`;
        } else {
            message = `It's a tie! ${playerScore} - ${aiScore}`;
        }
        
        document.getElementById('winner-message').textContent = message;
        document.getElementById('game-over').classList.remove('hidden');
    }
    
    updateBoard() {
        
        for (let i = 0; i < 6; i++) {
            document.getElementById(`pit-player-${i}`).querySelector('.stones').textContent = this.board.player[i];
            document.getElementById(`pit-ai-${i}`).querySelector('.stones').textContent = this.board.ai[i];
        }
        
        
        document.getElementById('store-player').textContent = this.board.player[6];
        document.getElementById('store-ai').textContent = this.board.ai[6];
    }
    
    
    cloneBoard() {
        return {
            player: [...this.board.player],
            ai: [...this.board.ai]
        };
    }
    
    
    isValidMove(side, index) {
        return index >= 0 && index < 6 && this.board[side][index] > 0;
    }
}


const game = new MancalaGame();

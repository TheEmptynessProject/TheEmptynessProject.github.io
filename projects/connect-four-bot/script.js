class ConnectFour {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.board = this.createEmptyBoard();
        this.currentPlayer = 1; // 1: Human, 2: AI
        this.gameOver = false;

        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');
        this.resetButton = document.getElementById('reset-button');

        this.initializeGame();
    }

    createEmptyBoard() {
        return Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    initializeGame() {
        this.createBoardUI();
        this.addEventListeners();
        this.updateStatus();
    }

    createBoardUI() {
        this.boardElement.innerHTML = '';
        for (let col = 0; col < this.cols; col++) {
            const columnElement = this.createColumn(col);
            this.boardElement.appendChild(columnElement);
        }
    }

    createColumn(col) {
        const columnElement = document.createElement('div');
        columnElement.className = 'column';
        columnElement.dataset.col = col;
        for (let row = this.rows - 1; row >= 0; row--) {
            const cellElement = this.createCell(row, col);
            columnElement.appendChild(cellElement);
        }
        return columnElement;
    }

    createCell(row, col) {
        const cellElement = document.createElement('div');
        cellElement.className = 'cell';
        cellElement.dataset.row = row;
        cellElement.dataset.col = col;
        return cellElement;
    }

    addEventListeners() {
        this.boardElement.addEventListener('click', this.handleBoardClick.bind(this));
        this.resetButton.addEventListener('click', this.resetGame.bind(this));
    }

    handleBoardClick(event) {
        if (this.gameOver || this.currentPlayer !== 1) return;
        const column = event.target.closest('.column');
        if (!column) return;
        const col = parseInt(column.dataset.col);
        this.makeMove(col);
    }

    makeMove(col) {
        const row = this.getLowestEmptyRow(col);
        if (row === -1) return;
        this.updateBoardState(row, col);

        if (this.checkWin(row, col)) {
            this.endGame(this.currentPlayer === 1 ? 'You win!' : 'AI wins!');
            return;
        }

        if (this.isBoardFull()) {
            this.endGame("It's a draw!");
            return;
        }

        this.switchPlayer();
        this.updateStatus();

        if (this.currentPlayer === 2) {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    updateBoardState(row, col) {
        this.board[row][col] = this.currentPlayer;
        this.updateCellUI(row, col);
    }

    updateCellUI(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(this.currentPlayer === 1 ? 'red' : 'yellow');
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    makeAIMove() {
        const bestMove = this.findBestMove();
        if (bestMove !== -1) {
            this.makeMove(bestMove);
        }
    }

    findBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;
        const depth = 6;
        for (let col = 0; col < this.cols; col++) {
            const row = this.getLowestEmptyRow(col);
            if (row !== -1) {
                this.board[row][col] = 2;
                const score = this.minimax(depth, -Infinity, Infinity, false);
                this.board[row][col] = 0;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = col;
                }
            }
        }
        return bestMove;
    }

    minimax(depth, alpha, beta, isMaximizing) {
        if (
            depth === 0 ||
            this.isBoardFull() ||
            this.isWinningBoard(2) ||
            this.isWinningBoard(1)
        ) {
            return this.evaluateBoard();
        }

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (let col = 0; col < this.cols; col++) {
                const row = this.getLowestEmptyRow(col);
                if (row !== -1) {
                    this.board[row][col] = 2;
                    maxScore = Math.max(maxScore, this.minimax(depth - 1, alpha, beta, false));
                    this.board[row][col] = 0;
                    alpha = Math.max(alpha, maxScore);
                    if (alpha >= beta) break;
                }
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (let col = 0; col < this.cols; col++) {
                const row = this.getLowestEmptyRow(col);
                if (row !== -1) {
                    this.board[row][col] = 1;
                    minScore = Math.min(minScore, this.minimax(depth - 1, alpha, beta, true));
                    this.board[row][col] = 0;
                    beta = Math.min(beta, minScore);
                    if (alpha >= beta) break;
                }
            }
            return minScore;
        }
    }

    evaluateBoard() {
        if (this.isWinningBoard(2)) return 1000000;
        if (this.isWinningBoard(1)) return -1000000;

        let score = 0;

        const centerCol = Math.floor(this.cols / 2);
        let centerArray = [];
        for (let row = 0; row < this.rows; row++) {
            centerArray.push(this.board[row][centerCol]);
        }
        const centerCount = centerArray.filter(cell => cell === 2).length;
        score += centerCount * 3;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols - 3; col++) {
                let window = [
                    this.board[row][col],
                    this.board[row][col + 1],
                    this.board[row][col + 2],
                    this.board[row][col + 3]
                ];
                score += this.evaluateWindow(window, 2);
            }
        }

        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows - 3; row++) {
                let window = [
                    this.board[row][col],
                    this.board[row + 1][col],
                    this.board[row + 2][col],
                    this.board[row + 3][col]
                ];
                score += this.evaluateWindow(window, 2);
            }
        }

        for (let row = 0; row < this.rows - 3; row++) {
            for (let col = 0; col < this.cols - 3; col++) {
                let window = [
                    this.board[row][col],
                    this.board[row + 1][col + 1],
                    this.board[row + 2][col + 2],
                    this.board[row + 3][col + 3]
                ];
                score += this.evaluateWindow(window, 2);
            }
        }

        for (let row = 3; row < this.rows; row++) {
            for (let col = 0; col < this.cols - 3; col++) {
                let window = [
                    this.board[row][col],
                    this.board[row - 1][col + 1],
                    this.board[row - 2][col + 2],
                    this.board[row - 3][col + 3]
                ];
                score += this.evaluateWindow(window, 2);
            }
        }

        return score;
    }

    isWinningBoard(piece) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols - 3; col++) {
                if (
                    this.board[row][col] === piece &&
                    this.board[row][col + 1] === piece &&
                    this.board[row][col + 2] === piece &&
                    this.board[row][col + 3] === piece
                ) {
                    return true;
                }
            }
        }
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows - 3; row++) {
                if (
                    this.board[row][col] === piece &&
                    this.board[row + 1][col] === piece &&
                    this.board[row + 2][col] === piece &&
                    this.board[row + 3][col] === piece
                ) {
                    return true;
                }
            }
        }
        for (let row = 0; row < this.rows - 3; row++) {
            for (let col = 0; col < this.cols - 3; col++) {
                if (
                    this.board[row][col] === piece &&
                    this.board[row + 1][col + 1] === piece &&
                    this.board[row + 2][col + 2] === piece &&
                    this.board[row + 3][col + 3] === piece
                ) {
                    return true;
                }
            }
        }
        for (let row = 3; row < this.rows; row++) {
            for (let col = 0; col < this.cols - 3; col++) {
                if (
                    this.board[row][col] === piece &&
                    this.board[row - 1][col + 1] === piece &&
                    this.board[row - 2][col + 2] === piece &&
                    this.board[row - 3][col + 3] === piece
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    evaluateWindow(window, piece) {
        let score = 0;
        const opp_piece = piece === 2 ? 1 : 2;
        const countPiece = window.filter(cell => cell === piece).length;
        const countOpp = window.filter(cell => cell === opp_piece).length;
        const countEmpty = window.filter(cell => cell === 0).length;

        if (countPiece === 4) {
            score += 100;
        } else if (countPiece === 3 && countEmpty === 1) {
            score += 5;
        } else if (countPiece === 2 && countEmpty === 2) {
            score += 2;
        }

        if (countOpp === 3 && countEmpty === 1) {
            score -= 4;
        }

        return score;
    }

    getLowestEmptyRow(col) {
        for (let row = 0; row < this.rows; row++) {
            if (this.board[row][col] === 0) {
                return row;
            }
        }
        return -1;
    }

    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [[0, 1], [0, -1]], // Horizontal
            [[1, 0], [-1, 0]], // Vertical
            [[1, 1], [-1, -1]], // Diagonal \
            [[1, -1], [-1, 1]]  // Diagonal /
            ];
        for (const [dir1, dir2] of directions) {
            let count = 1;
            count += this.countInDirection(row, col, dir1, player);
            count += this.countInDirection(row, col, dir2, player);
            if (count >= 4) return true;
        }
        return false;
    }

    countInDirection(row, col, direction, player) {
        let count = 0;
        let r = row + direction[0];
        let c = col + direction[1];
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === player) {
            count++;
            r += direction[0];
            c += direction[1];
        }
        return count;
    }

    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== 0));
    }

    updateStatus() {
        this.statusElement.textContent = this.currentPlayer === 1 ? 'Your turn! (Red)' : 'AI thinking... (Yellow)';
    }

    endGame(message) {
        this.gameOver = true;
        this.statusElement.textContent = message;
    }

    resetGame() {
        this.board = this.createEmptyBoard();
        this.currentPlayer = 1;
        this.gameOver = false;
        this.createBoardUI();
        this.updateStatus();
    }
}

const game = new ConnectFour();

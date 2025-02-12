let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function checkWinner(board, player) {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
}

function emptySpots(board) {
  return board.reduce((spots, cell, index) => {
    if (cell === '') spots.push(index);
    return spots;
  }, []);
}

function minimax(board, player, depth, alpha, beta) {
  if (checkWinner(board, 'X')) {
    return { score: -10-depth };
  } else if (checkWinner(board, 'O')) {
    return { score: 10-depth };
  } else if (emptySpots(board).length === 0) {
    return { score: 0 };
  }

  let moves = [];
  emptySpots(board).forEach(index => {
    let move = {};
    move.index = index;
    board[index] = player;

	if (player === 'O' && move.score <= alpha) return;
    if (player === 'X' && move.score >= beta) return;

    if (player === 'O') {
      let result = minimax(board, 'X', depth+1, alpha, beta);
      move.score = result.score;
	  beta = Math.min(beta, move.score);
    } else {
      let result = minimax(board, 'O', depth+1, alpha, beta);
      move.score = result.score;
	  alpha = Math.max(alpha, move.score);
    }

    board[index] = '';
    moves.push(move);
  });

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    moves.forEach((move, index) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = index;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((move, index) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = index;
      }
    });
  }

  return moves[bestMove];
}

function playerMove(index) {
  if (gameBoard[index] === '' && gameActive) {
    gameBoard[index] = currentPlayer;
    document.getElementsByClassName('cell')[index].innerText = currentPlayer;
    if (checkWinner(gameBoard, currentPlayer)) {
      gameActive = false;
      document.getElementById('status').innerText = `${currentPlayer} wins!`;
    } else if (emptySpots(gameBoard).length === 0) {
      gameActive = false;
      document.getElementById('status').innerText = 'It\'s a tie!';
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (currentPlayer === 'O') {
        aiMove();
      }
    }
  }
}

function aiMove() {
  const bestMove = minimax(gameBoard, 'O', 0, Infinity, -Infinity);
  playerMove(bestMove.index);
}
function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  document.getElementById('status').innerText = '';
  const cells = document.getElementsByClassName('cell');
  for (let cell of cells) {
    cell.innerText = '';
  }
}

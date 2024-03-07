document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const cells = document.querySelectorAll('.cell');
  const restartButton = document.getElementById('restart-button');
  const resultDisplay = document.getElementById('result');

  let currentPlayer = 'X';
  let gameActive = true;
  let boardState = ['', '', '', '', '', '', '', '', ''];

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = () => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    if (boardState.includes('')) return null;
    return 'T';
  };

  const botTurn = () => {
    let bestMove;
    let bestScore = -Infinity;

    for (let i = 0; i < boardState.length; i++) {
      if (!boardState[i]) {
        boardState[i] = 'O';
        let score = minimax(boardState, 0, false);
        boardState[i] = '';
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    setTimeout(() => {
      boardState[bestMove] = 'O';
      cells[bestMove].textContent = 'O';
      currentPlayer = 'X';

      const winner = checkWinner();
      if (winner) {
        gameActive = false;
        if (winner === 'T') {
          resultDisplay.textContent = 'It\'s a tie!';
        } else {
          resultDisplay.textContent = `${winner} wins!`;
        }
      }
    }, 1300); // Delay of 1.3 seconds (1300 milliseconds)
  };

  const minimax = (board, depth, isMaximizing) => {
    let result = checkWinner();
    if (result !== null) {
      if (result === 'O') {
        return 10 - depth;
      } else if (result === 'X') {
        return depth - 10;
      } else {
        return 0;
      }
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  };

  const restartGame = () => {
    currentPlayer = 'X';
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
      cell.textContent = '';
    });
    resultDisplay.textContent = '';
  };

  const handleCellClick = (e) => {
    const cellIndex = e.target.dataset.cellIndex;
    if (boardState[cellIndex] || !gameActive) return;

    boardState[cellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;

    const winner = checkWinner();
    if (winner) {
      gameActive = false;
      if (winner === 'T') {
        resultDisplay.textContent = 'It\'s a tie!';
      } else {
        resultDisplay.textContent = `${winner} wins!`;
      }
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (currentPlayer === 'O') {
        botTurn();
      }
    }
  };

  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });

  restartButton.addEventListener('click', restartGame);
});

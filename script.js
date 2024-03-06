document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const cells = document.querySelectorAll('.cell');
  const restartButton = document.getElementById('restart-button');
  const resultDisplay = document.getElementById('result');
  const modeToggle = document.getElementById('mode-toggle');
  const playIntermediateButton = document.getElementById('play-intermediate');

  let currentPlayer = 'X';
  let gameActive = true;
  let boardState = ['', '', '', '', '', '', '', '', ''];
  let againstBot = false; // Flag to indicate if playing against bot

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
    if (!boardState.includes('')) return 'T'; // Tie
    return null;
  };

  const displayResult = (winner) => {
    gameActive = false;
    if (winner === 'X') {
      resultDisplay.textContent = 'Player X wins!';
    } else if (winner === 'O') {
      if (againstBot) {
        resultDisplay.textContent = 'You Lost😂!';
        playIntermediateButton.style.display = 'inline-block';
      } else {
        resultDisplay.textContent = 'Player O wins!';
      }
    } else {
      resultDisplay.textContent = 'It\'s a tie!';
    }
  };

  const restartGame = () => {
    currentPlayer = 'X';
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
      cell.textContent = '';
    });
    resultDisplay.textContent = ''; // Clear result display
    playIntermediateButton.style.display = 'none'; // Hide the intermediate button
  };

  const handleCellClick = (e) => {
    const cellIndex = e.target.dataset.cellIndex;
    if (boardState[cellIndex] || !gameActive) return;

    boardState[cellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;

    const winner = checkWinner();
    if (winner) {
      displayResult(winner);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (againstBot && currentPlayer === 'O') {
        setTimeout(botTurn, 500); // Introduce a slight delay for visual effect
      }
    }
  };

  const botTurn = () => {
    const emptyCells = boardState.reduce((acc, cell, index) => {
      if (!cell) acc.push(index);
      return acc;
    }, []);

    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < emptyCells.length; i++) {
      let move = emptyCells[i];
      boardState[move] = 'O';
      let score = minimax(boardState, 0, false);
      boardState[move] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    boardState[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    currentPlayer = 'X';
    const winner = checkWinner();
    if (winner) displayResult(winner);
  };

  const minimax = (board, depth, isMaximizing) => {
    const result = checkWinner();
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
        if (board[i] === '') {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // Event listener for mode toggle
  modeToggle.addEventListener('change', () => {
    againstBot = modeToggle.checked;
    restartGame();
  });

  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });
  restartButton.addEventListener('click', restartGame);

  playIntermediateButton.addEventListener('click', () => {
    window.location.href = 'intermediate_page.html';
  });
});

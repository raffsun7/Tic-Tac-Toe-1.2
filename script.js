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
    const emptyCells = boardState.reduce((acc, cell, index) => {
      if (!cell) acc.push(index);
      return acc;
    }, []);

    // Check for winning moves
    for (let index of emptyCells) {
      boardState[index] = 'O';
      if (checkWinner() === 'O') {
        cells[index].textContent = 'O';
        currentPlayer = 'X';
        return;
      }
      boardState[index] = '';
    }

    // Check for player's winning moves
    for (let index of emptyCells) {
      boardState[index] = 'X';
      if (checkWinner() === 'X') {
        boardState[index] = 'O';
        cells[index].textContent = 'O';
        currentPlayer = 'X';
        return;
      }
      boardState[index] = '';
    }

    // Choose a random available cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cellIndex = emptyCells[randomIndex];
    boardState[cellIndex] = 'O';
    cells[cellIndex].textContent = 'O';

    currentPlayer = 'X';
  };

  const handleBotTurn = () => {
    setTimeout(botTurn, 650); // Delay of 0.65 seconds (650 milliseconds)
  };

  const restartGame = () => {
    currentPlayer = 'X';
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
      cell.textContent = '';
    });
    resultDisplay.textContent = ''; // Clear result display
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
        handleBotTurn();
      }
    }
  };

  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });

  restartButton.addEventListener('click', restartGame);
});

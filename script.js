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
        if (!boardState.includes('')) return 'T'; // Tie
        return null;
    };

    const displayResult = (winner) => {
        gameActive = false;
        if (winner === 'X') {
            resultDisplay.textContent = 'Congratulate, You Win! 🥳';
        } else if (winner === 'O') {
            resultDisplay.textContent = 'HaHa, You Lost! 😂';
        } else {
            resultDisplay.textContent = 'We All Are Ass 😑';
        }
    };

    const botTurn = () => {
        const emptyCells = boardState.reduce((acc, cell, index) => {
            if (!cell) acc.push(index);
            return acc;
        }, []);

        // Bot's logic for making a move
        let bestScore = -Infinity;
        let bestMove;
        for (let index of emptyCells) {
            boardState[index] = 'O';
            let score = minimax(boardState, 0, false);
            boardState[index] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
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
            if (result === 'X') {
                return -10 + depth;
            } else if (result === 'O') {
                return 10 - depth;
            } else {
                return 0;
            }
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
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
            for (let i = 0; i < 9; i++) {
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
            displayResult(winner);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                setTimeout(botTurn, 800); // Change the delay to 800 milliseconds
            }
        }
    };

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', restartGame);
});

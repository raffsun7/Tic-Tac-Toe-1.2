document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('mode-toggle');
    const robotIcon = document.querySelector('.material-symbols-outlined');

    modeToggle.addEventListener('change', () => {
        if (modeToggle.checked) {
            // Bot mode is active, change the color of the robot icon
            robotIcon.style.color = '#007BFF';
        } else {
            // Bot mode is inactive, reset the color of the robot icon to default
            robotIcon.style.color = ''; // This resets the color to the default or any other style sheet defined color
        }
    });

    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart-button');
    const resultDisplay = document.getElementById('result');
    const playHardButton = document.getElementById('play-hard'); // New button for playing hard

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
            resultDisplay.textContent = 'Congrats! You won!🎉 Get ready for the next challenge. (The Horror Edition ☠️)';
        } else if (winner === 'O') {
            if (againstBot) {
                resultDisplay.textContent = 'You Lost😂!';
            } else {
                resultDisplay.textContent = 'Hoore! Player O Won!🤩';
            }
        } else {
            resultDisplay.textContent = 'It\'s a tie!';
        }

        if (winner === 'X' && againstBot) {
            playHardButton.style.display = 'inline-block';
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
        playHardButton.style.display = 'none'; // Hide the play hard button
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

        // Check if the bot can win in the next move
        for (let i = 0; i < emptyCells.length; i++) {
            const index = emptyCells[i];
            boardState[index] = 'O';
            if (checkWinner() === 'O') {
                // If the bot wins, make the move
                cells[index].textContent = 'O';
                boardState[index] = 'O';
                currentPlayer = 'X';
                const winner = checkWinner();
                if (winner) displayResult(winner);
                return;
            }
            // If the bot doesn't win, undo the move
            boardState[index] = '';
        }

        // Check if the player can win in the next move and block it
        for (let i = 0; i < emptyCells.length; i++) {
            const index = emptyCells[i];
            boardState[index] = 'X';
            if (checkWinner() === 'X') {
                // If the player wins, block the winning move
                cells[index].textContent = 'O';
                boardState[index] = 'O';
                currentPlayer = 'X';
                const winner = checkWinner();
                if (winner) displayResult(winner);
                return;
            }
            // If the player doesn't win, undo the move
            boardState[index] = '';
        }

        // If neither the player nor the bot can win in the next move, pick a random empty cell
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const selectedCell = emptyCells[randomIndex];

        // Make the move
        cells[selectedCell].textContent = 'O';
        boardState[selectedCell] = 'O';
        currentPlayer = 'X';

        // Check for winner
        const winner = checkWinner();
        if (winner) displayResult(winner);
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

    // Handle click event for the "Play Hard" button
    playHardButton.addEventListener('click', () => {
        window.location.href = 'hard_page.html';
    });
});

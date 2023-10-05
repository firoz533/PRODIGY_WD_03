document.addEventListener('DOMContentLoaded', function () {
    const boxes = document.querySelectorAll('.box');
    const xScoreElement = document.querySelector('.xScore');
    const oScoreElement = document.querySelector('.oScore');
    const modeSelect = document.getElementById('modeS');

    let currentPlayer = 'X';
    let xScore = 0;
    let oScore = 0;
    let mode = 2; // Default mode is 2 player

    function checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (boxes[a].textContent && boxes[a].textContent === boxes[b].textContent && boxes[a].textContent === boxes[c].textContent) {
                return boxes[a].textContent;
            }
        }

        if (![...boxes].some(box => box.textContent === '')) {
            return 'draw';
        }

        return null;
    }

    function showAlert(winner) {
        const alertElement = document.createElement('div');
        alertElement.className = 'alert';
        alertElement.textContent = winner === 'draw' ? 'It\'s a draw!' : `${winner} wins!`;
        document.body.appendChild(alertElement);

        setTimeout(() => {
            alertElement.remove();
        }, 1600);
    }

    function vibrateWinner(winner) {
        const winningPlayer = winner === 'X' ? 'x' : 'o';
        const winningElement = document.querySelector(`.${winningPlayer}Score`);
        winningElement.classList.add('vibrate');
        setTimeout(() => {
            winningElement.classList.remove('vibrate');
        }, 1000);
    }

    function makeBotMove() {
        const emptyBoxes = [...boxes].filter(box => !box.textContent);

        for (const box of emptyBoxes) {
            box.textContent = 'O';
            if (checkWinner() === 'O') {
                showAlert('O');
                setTimeout(() => {
                    resetBoard();
                }, 1700);
                oScore++;
                oScoreElement.textContent = ` O:${oScore}`;
                return;
            }
            box.textContent = '';
        }

        for (const box of emptyBoxes) {
            box.textContent = 'X';
            if (checkWinner() === 'X') {
                box.textContent = '';
                box.click();
                return;
            }
            box.textContent = '';
        }

        const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
        emptyBoxes[randomIndex].click();
    }



    boxes.forEach(box => {
        box.addEventListener('click', () => {
            if (!box.textContent) {
                box.textContent = currentPlayer;
                const winner = checkWinner();

                if (winner) {
                    if (winner !== 'draw') {
                        if (winner === 'X') {
                            xScore++;
                            xScoreElement.textContent = `X:${xScore} `;
                        } else {
                            oScore++;
                            oScoreElement.textContent = ` O:${oScore}`;
                        }
                        vibrateWinner(winner);
                    }
                    showAlert(winner);

                    setTimeout(() => {
                        resetBoard();
                    }, 1700);
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

                    if (mode === 1 && currentPlayer === 'O') {
                        setTimeout(makeBotMove, 500);
                    }
                }
            }
        });
    });

    modeSelect.addEventListener('change', function () {
        mode = parseInt(this.value);
        if (mode === 1) {
            // Logic for 1 player mode (against bot)
            resetBoard();

        } else if (mode === 2) {
            // Logic for 2 player mode
            resetBoard();

        }
    });



    function resetBoard() {
        boxes.forEach(box => {
            box.textContent = '';
        });
        currentPlayer = 'X';
    }
});

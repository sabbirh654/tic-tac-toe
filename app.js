const GameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    const reset = function () {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let col = 0; col < columns; col++) {
                board[i][col] = null; //here null represent empty cell
            }
        }
    }

    const getBoard = () => board;

    const isCellEmpty = (row, col) => board[row][col] === null;

    const updateBoard = function (row, col, value) {
        if (isCellEmpty(row, col)) {
            board[row][col] = value;
        }
    }

    const isNoEmptyCellInBoard = function () {
        for (let i = 0; i < rows; i++) {
            for (let col = 0; col < columns; col++) {
                if (board[i][col] === null) {
                    return false;
                }
            }
        }

        return true;
    }

    reset();

    return {
        getBoard, updateBoard,
        isCellEmpty,
        isNoEmptyCellInBoard,
        reset
    };

})();


const Player = function (name, marker) {
    this.name = name;
    this.marker = marker;
    return { name, marker };
}

const GameState = (function () {
    const firstPlayer = Player('player-one', 'X');
    const secondPlayer = Player('player-two', 'O');
    let currentPlayer = firstPlayer;
    let isWin = false;
    let isDraw = false;

    const board = GameBoard.getBoard();

    const getCurrentPlayer = () => currentPlayer;

    const isMatchRow = function (row, col) {
        for (let i = 0; i < 3; i++) {
            if (board[row][i] !== board[row][col]) {
                return false;
            }
        }

        return true;
    }

    const isMatchColumn = function (row, col) {
        for (let i = 0; i < 3; i++) {
            if (board[i][col] !== board[row][col]) {
                return false;
            }
        }

        return true;
    }

    const isMatchLeftDiagonal = function () {
        for (let i = 0; i < 3; i++) {
            if (board[i][i] !== board[0][0]) {
                return false;
            }
        }

        return true;
    }

    const isMatchRightDiagonal = function () {
        for (let i = 0; i < 3; i++) {
            if (board[i][2 - i] !== board[0][2]) {
                return false
            }
        }

        return true;
    }

    const checkWinCondition = function (row, col) {

        if (isMatchRow(row, col) || isMatchColumn(row, col)) {
            return true;
        }

        if (row == 1 && col == 1) {
            if (isMatchLeftDiagonal() || isMatchRightDiagonal()) {
                return true;
            }
        }

        if ((row == 0 && col == 0) || (row == 2 && col == 2)) {
            if (isMatchLeftDiagonal()) {
                return true;
            }
        }

        if ((row == 0 && col == 2) || (row == 2 && col == 0)) {
            if (isMatchRightDiagonal()) {
                return true;
            }
        }

        return false;
    }

    const switchPlayer = function () {
        currentPlayer = currentPlayer == firstPlayer ? secondPlayer : firstPlayer;
    }

    const getWinState = () => isWin;

    const getDrawState = () => isDraw;

    const setWinState = function (state) {
        isWin = state;
    }

    const setDrawState = function (state) {
        isDraw = state;
    }

    const reset = function () {
        currentPlayer = firstPlayer;
        isWin = false;
        isDraw = false;
    }

    return {
        getCurrentPlayer,
        switchPlayer,
        checkWinCondition,
        getWinState,
        setWinState,
        getDrawState,
        setDrawState,
        reset
    };
})();


const GameController = (function () {

    let winState = false;
    let drawState = false;

    const playRound = function (row, col) {

        winState = GameState.getWinState();
        drawState = GameState.getDrawState();

        if (!GameBoard.isCellEmpty(row, col)) {
            return;
        }
        if (winState || drawState) {
            return;
        }

        const currentPlayer = GameState.getCurrentPlayer();
        GameBoard.updateBoard(row, col, currentPlayer.marker);

        const isWin = GameState.checkWinCondition(row, col);
        GameState.setWinState(isWin);

        if (!isWin) {
            GameState.switchPlayer();
        }

        isDraw = !isWin && GameBoard.isNoEmptyCellInBoard();
        GameState.setDrawState(isDraw);
    }

    return {playRound};
})();

const ScreenController = (function () {

    const board = document.querySelector('.container');

    const initializeBoardUI = function () {
        let cellId = 0;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement('div');
                cell.className = 'box';
                cell.id = `${cellId}`;
                if (row == 2) {
                    cell.style.borderBottom = 'none';
                }
                if (col == 2) {
                    cell.style.borderRight = 'none';
                }

                board.appendChild(cell);
                cellId++;
            }
        }
    }

    const updateScreen = function () {
        //update game board
        const board = GameBoard.getBoard();

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.querySelector(`[id='${row * 3 + col}']`);
                if (cell !== null) {
                    cell.textContent = board[row][col];
                }
            }
        }

        //update player info
        const playerElement = document.querySelector('.player');

        if (GameState.getWinState()) {
            playerElement.textContent = `${GameState.getCurrentPlayer().name} wins!`;
        }

        else if (GameState.getDrawState()) {
            playerElement.textContent = 'Game is draw!';
        }
        else {
            playerElement.textContent = `${GameState.getCurrentPlayer().name}'s turn!`;
        }
    }

    const cellClickHandler = function (e) {

        if (GameState.getWinState() || GameState.getDrawState()) {
            return;
        }
        const cellId = e.target.id;
        const row = Math.floor(+cellId / 3);
        const col = +cellId % 3;
        GameController.playRound(row, col);
        updateScreen();
    }

    const restartButton = document.querySelector('.restart-button');

    const restartButtonClickEventHandler = function () {
        GameBoard.reset();
        GameState.reset();
        updateScreen();
    }

    restartButton.addEventListener('click', restartButtonClickEventHandler);
    board.addEventListener('click', cellClickHandler);
    initializeBoardUI();
    updateScreen();
})();

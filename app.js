const GameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    const createBoard = function () {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let col = 0; col < columns; col++) {
                board[i][col] = null; //here null represent empty cell
            }
        }
    }

    const getBoard = () => board;

    const isValidCell = (row, col) => {
        return row >= 0 && row < 3 && col >= 0 && col < 3;
    }

    const isCellEmpty = (row, col) => board[row][col] === null;

    const updateBoard = function (row, col, value) {
        if (isValidCell(row, col) && isCellEmpty(row, col)) {
            board[row][col] = value;
        }
    }

    const displayBoard = function () {
        console.log(board);
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

    createBoard();

    return {
        getBoard, updateBoard,
        isValidCell, isCellEmpty,
        displayBoard,
        isNoEmptyCellInBoard
    };

})();


const Player = function (name, marker) {
    this.name = name;
    this.marker = marker;
    return { name, marker };
}

const PlayingState = (function () {
    const firstPlayer = Player('player1', 'X');
    const secondPlayer = Player('player2', 'O');
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

    const checkForWinner = function (row, col) {

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

    return { getCurrentPlayer, switchPlayer, checkForWinner, getWinState, setWinState, getDrawState, setDrawState};
})();


const GameController = (function () {

    let winState = false;
    let drawState = false;

    const playRound = function (row, col) {

        winState = PlayingState.getWinState();
        drawState = PlayingState.getDrawState();
        
        if (!GameBoard.isCellEmpty(row, col)) {
            return;
        }
        if (winState || drawState) {
            return;
        }

        const currentPlayer = PlayingState.getCurrentPlayer();
        GameBoard.updateBoard(row, col, currentPlayer.marker);

        const isWin = PlayingState.checkForWinner(row, col);
        PlayingState.setWinState(isWin);
        console.log(PlayingState.getWinState());

        if(!isWin) {
            PlayingState.switchPlayer();
        }

        isDraw = !isWin && GameBoard.isNoEmptyCellInBoard();
        PlayingState.setDrawState(isDraw);
    }

    const getWinState = () => winState;
    const getDrawState = () => drawState;
    return { playRound, getWinState, getDrawState };
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

    const updateScreen = function (row, col) {
        //update game board
        const board = GameBoard.getBoard();
        const cell = document.querySelector(`[id='${row * 3 + col}']`);
        cell.textContent = board[row][col];
    }

    const cellClickHandler = function (e) {

        if (GameController.getWinState() || GameController.getDrawState()) {
            return;
        }
        const cellId = e.target.id;
        const row = Math.floor(+cellId / 3);
        const col = +cellId % 3;
        GameController.playRound(row, col);
        updateScreen(row, col);

        if(PlayingState.getWinState()) {
            console.log(`${PlayingState.getCurrentPlayer().name} wins!`);
        }

        if(PlayingState.getDrawState()) {
            console.log('Draw')
        }
    }

    board.addEventListener('click', cellClickHandler);
    initializeBoardUI();
})();

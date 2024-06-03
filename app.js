const GameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    const createBoard = function () {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = null; //here null represent empty cell
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
            for (let j = 0; j < columns; j++) {
                if (board[i][j] === null) {
                    return false;
                }
            }
        }

        return true;
    }

    createBoard();

    return { getBoard, updateBoard, 
            isValidCell, isCellEmpty, 
            displayBoard, 
            isNoEmptyCellInBoard};

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
    const board = GameBoard.getBoard();

    const getCurrentPlayer = () => currentPlayer;
    const checkForGameEnd = () => GameBoard.isNoEmptyCellInBoard();

    const isMatchRow = function (row, col) {
        for(let i = 0; i < 3; i++) {
            if(board[row][i] !== board[row][col]) {
                return false;
            }
        }

        return true;
    }

    const isMatchColumn = function(row, col) {
        for(let i = 0; i < 3; i++) {
            if(board[i][col] !== board[row][col]) {
                return false;
            }
        }

        return true;
    }

    const isMatchLeftDiagonal = function() {
        for (let i = 0; i < 3; i++) {
            if (board[i][i] !== board[0][0]) {
                return false;
            }
        }

        return true;
    }

    const isMatchRightDiagonal = function() {
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

        if(row == 1 && col == 1) {
            if(isMatchLeftDiagonal() || isMatchRightDiagonal()) {
                return true;
            }
        }

        if((row == 0 && col == 0) || (row == 2 && col == 2)) {
            if(isMatchLeftDiagonal()) {
                return true;
            }
        }

        if((row == 0 && col == 2) || (row == 2 && col == 0)) {
            if(isMatchRightDiagonal()) {
                return true;
            }
        }

        return false;
    }

    const switchPlayer = function () {
        currentPlayer = currentPlayer == firstPlayer ? secondPlayer : firstPlayer;
    }

    return { getCurrentPlayer, switchPlayer, checkForWinner };
})();


const GameController = (function () {

    const takeCellInput = function () {
        const row = +prompt('Enter a row value between 1-3');
        const col = +prompt('Enter a column value between 1-3');

        return { row, col };
    }

    const playRound = function (row, col) {

        if(!GameBoard.isCellEmpty(row, col)) {
            return;
        }
        const currentPlayer = PlayingState.getCurrentPlayer();
        GameBoard.updateBoard(row, col, currentPlayer.marker);
        GameBoard.displayBoard();
        const isWinner = PlayingState.checkForWinner(row, col);
        if(!isWinner) {
            PlayingState.switchPlayer();
        }
    }
})();

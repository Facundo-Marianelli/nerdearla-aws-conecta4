class ConnectFour {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.currentPlayer = 1;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.gameOver = false;
        
        this.boardElement = document.getElementById('board');
        this.playerTurnElement = document.getElementById('player-turn');
        this.winnerMessageElement = document.getElementById('winner-message');
        this.resetButton = document.getElementById('reset-btn');
        
        this.initializeBoard();
        this.resetButton.addEventListener('click', () => this.resetGame());
    }
    
    initializeBoard() {
        this.boardElement.innerHTML = '';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.handleCellClick(col));
                this.boardElement.appendChild(cell);
            }
        }
    }
    
    handleCellClick(col) {
        if (this.gameOver) return;
        
        const row = this.getLowestEmptyRow(col);
        if (row === -1) return; // Columna llena
        
        this.board[row][col] = this.currentPlayer;
        this.updateCell(row, col);
        
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.highlightWinningCells();
            this.winnerMessageElement.textContent = `¡Jugador ${this.currentPlayer} gana!`;
        } else if (this.isBoardFull()) {
            this.gameOver = true;
            this.winnerMessageElement.textContent = '¡Empate!';
        } else {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            this.playerTurnElement.textContent = this.currentPlayer;
        }
    }
    
    getLowestEmptyRow(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][col] === 0) {
                return row;
            }
        }
        return -1;
    }
    
    updateCell(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(`player${this.currentPlayer}`);
    }
    
    checkWin(row, col) {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal /
            [1, -1]   // diagonal \
        ];
        
        for (let [deltaRow, deltaCol] of directions) {
            let count = 1;
            let winningCells = [[row, col]];
            
            // Verificar en una dirección
            for (let i = 1; i < 4; i++) {
                const newRow = row + deltaRow * i;
                const newCol = col + deltaCol * i;
                
                if (this.isValidPosition(newRow, newCol) && 
                    this.board[newRow][newCol] === this.currentPlayer) {
                    count++;
                    winningCells.push([newRow, newCol]);
                } else {
                    break;
                }
            }
            
            // Verificar en la dirección opuesta
            for (let i = 1; i < 4; i++) {
                const newRow = row - deltaRow * i;
                const newCol = col - deltaCol * i;
                
                if (this.isValidPosition(newRow, newCol) && 
                    this.board[newRow][newCol] === this.currentPlayer) {
                    count++;
                    winningCells.push([newRow, newCol]);
                } else {
                    break;
                }
            }
            
            if (count >= 4) {
                this.winningCells = winningCells;
                return true;
            }
        }
        
        return false;
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    highlightWinningCells() {
        this.winningCells.forEach(([row, col]) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add('winning');
        });
    }
    
    isBoardFull() {
        return this.board[0].every(cell => cell !== 0);
    }
    
    resetGame() {
        this.currentPlayer = 1;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.gameOver = false;
        this.winningCells = [];
        
        this.playerTurnElement.textContent = '1';
        this.winnerMessageElement.textContent = '';
        
        // Limpiar todas las celdas
        document.querySelectorAll('.cell').forEach(cell => {
            cell.className = 'cell';
        });
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new ConnectFour();
});
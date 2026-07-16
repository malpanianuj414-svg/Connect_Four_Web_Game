const playerRed = "R";
const playerYellow = "Y";
let currPlayer = playerRed; 

let gameOver = false;
let board;
const rows = 6;
const columns = 7;
let currColumns = []; 

let gameStats = {
    total: 0,
    redWins: 0,
    yellowWins: 0,
    draws: 0
};

window.onload = function() 
{
    loadStats();
    initializeGame();
};

function initializeGame() 
{
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5]; 
    gameOver = false;
    currPlayer = playerRed;
    
    const banner = document.getElementById("status-banner");
    banner.innerHTML = `Current Turn: <span id="current-player" class="red-turn">Red</span>`;
    
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; 

    for (let r = 0; r < rows; r++) 
    {
        let row = [];
        for (let c = 0; c < columns; c++) 
        {
            row.push(' '); 
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            boardElement.appendChild(tile);
        }
        board.push(row);
    }
}

function setPiece() 
{
    if (gameOver) return;

    let coords = this.id.split("-");
    let c = parseInt(coords[1]);

    let r = currColumns[c];
    if (r < 0) return; 

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());

    if (currPlayer === playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow;
        updateTurnBanner("Yellow", "yellow-turn");
    } else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
        updateTurnBanner("Red", "red-turn");
    }

    r -= 1;
    currColumns[c] = r;

    checkWinOrDraw();
}

function updateTurnBanner(name, styleClass) {
    document.getElementById("status-banner").innerHTML = `Current Turn: <span id="current-player" class="${styleClass}">${name}</span>`;
}

function checkWinOrDraw() {
    // 1. Horizontal verification sequence loop
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== ' ') {
                if (board[r][c] === board[r][c+1] && board[r][c+1] === board[r][c+2] && board[r][c+2] === board[r][c+3]) {
                    declareWinner(board[r][c]);
                    return;
                }
            }
        }
    }

    // 2. Vertical verification sequence matrix loop
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] !== ' ') {
                if (board[r][c] === board[r+1][c] && board[r+1][c] === board[r+2][c] && board[r+2][c] === board[r+3][c]) {
                    declareWinner(board[r][c]);
                    return;
                }
            }
        }
    }

    // 3. Anti-Diagonal down-right linear validation sequence
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== ' ') {
                if (board[r][c] === board[r+1][c+1] && board[r+1][c+1] === board[r+2][c+2] && board[r+2][c+2] === board[r+3][c+3]) {
                    declareWinner(board[r][c]);
                    return;
                }
            }
        }
    }

    // 4. Diagonal up-right validation sequences checking loop
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== ' ') {
                if (board[r][c] === board[r-1][c+1] && board[r-1][c+1] === board[r-2][c+2] && board[r-2][c+2] === board[r-3][c+3]) {
                    declareWinner(board[r][c]);
                    return;
                }
            }
        }
    }

    // 5. Draw confirmation parsing algorithm checking for any empty spot spaces remaining
    let isDraw = true;
    for (let c = 0; c < columns; c++) {
        if (currColumns[c] >= 0) {
            isDraw = false; 
            break;
        }
    }

    if (isDraw) {
        gameOver = true;
        document.getElementById("status-banner").innerHTML = `<span style="color: #6c757d;">Game Ended in a Draw!</span>`;
        gameStats.total++;
        gameStats.draws++;
        saveStats();
    }
}

function declareWinner(winnerToken) {
    gameOver = true;
    const banner = document.getElementById("status-banner");
    gameStats.total++;

    if (winnerToken === playerRed) {
        banner.innerHTML = `<span class="red-turn">Red Wins the Game! 🎉</span>`;
        gameStats.redWins++;
    } else {
        banner.innerHTML = `<span class="yellow-turn">Yellow Wins the Game! 🎉</span>`;
        gameStats.yellowWins++;
    }
    saveStats();
}

function saveStats() {
    localStorage.setItem("internpe_c4_stats", JSON.stringify(gameStats));
    updateStatsDOM();
}

function loadStats() {
    let stored = localStorage.getItem("internpe_c4_stats");
    if (stored) {
        gameStats = JSON.parse(stored);
    }
    updateStatsDOM();
}

function updateStatsDOM() {
    document.getElementById("stat-total").innerText = gameStats.total;
    document.getElementById("stat-red").innerText = gameStats.redWins;
    document.getElementById("stat-yellow").innerText = gameStats.yellowWins;
    document.getElementById("stat-draws").innerText = gameStats.draws;
    document.getElementById("redline").style.width=(((gameStats.redWins)/(gameStats.total))*100).toFixed(2)+"%";
    document.getElementById("yellowline").style.width=(((gameStats.yellowWins)/(gameStats.total))*100).toFixed(2)+"%";
    document.getElementById("drawline").style.width=(((gameStats.draws)/(gameStats.total))*100).toFixed(2)+"%";
    document.getElementById("redboard").innerText=(((gameStats.redWins)/(gameStats.total))*100).toFixed(2)+"%";
    document.getElementById("yellowboard").innerText=(((gameStats.yellowWins)/(gameStats.total))*100).toFixed(2)+"%";
    document.getElementById("drawboard").innerText=(((gameStats.draws)/(gameStats.total))*100).toFixed(2)+"%";
}

function clearStats() {
    if(confirm("Are you sure you want to reset all data records?")) {
        gameStats = { total: 0, redWins: 0, yellowWins: 0, draws: 0 };
        document.getElementById("redline").style.width="0%";
        document.getElementById("yellowline").style.width="0%";
        document.getElementById("drawline").style.width="0%";
        saveStats();
    }
}

function toggleStatsModal(show) {
    document.getElementById("stats-modal").style.display = show ? "block" : "none";
}

function resetGame() {
    initializeGame();
}
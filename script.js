const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

let score = 0;
const colors = [
    null,
    'red',
    'blue',
    'green',
    'purple',
    'orange',
    'cyan',
    'yellow'
];

const pieces = [
    [],
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // J
    [[0, 0, 1], [1, 1, 1]]  // L
];

let board = Array.from({ length: 20 }, () => Array(12).fill(0));
let currentPiece = getRandomPiece();
let piecePosition = { x: 4, y: 0 };

function getRandomPiece() {
    const index = Math.floor(Math.random() * (pieces.length - 1)) + 1;
    return pieces[index];
}

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = colors[value];
                context.fillRect(x, y, 1, 1);
            }
        });
    });
}

function drawPiece() {
    currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = colors[value];
                context.fillRect(piecePosition.x + x, piecePosition.y + y, 1, 1);
            }
        });
    });
}

function collide() {
    return currentPiece.some((row, y) => {
        return row.some((value, x) => {
            if (value) {
                const newX = piecePosition.x + x;
                const newY = piecePosition.y + y;
                return newY >= board.length || newX < 0 || newX >= board[0].length || board[newY] && board[newY][newX];
            }
            return false;
        });
    });
}

function merge() {
    currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[piecePosition.y + y][piecePosition.x + x] = value;
            }
        });
    });
}

function rotatePiece() {
    const rotated = currentPiece[0].map((_, index) => currentPiece.map(row => row[index]).reverse());
    const originalPiece = currentPiece;
    currentPiece = rotated;
    if (collide()) {
        currentPiece = originalPiece;
    }
}

function movePiece(direction) {
    piecePosition.x += direction;
    if (collide()) {
        piecePosition.x -= direction;
    }
}

function dropPiece() {
    piecePosition.y++;
    if (collide()) {
        piecePosition.y--;
        merge();
        clearLines();
        currentPiece = getRandomPiece();
        piecePosition = { x: 4, y: 0 };
        if (collide()) {
            alert('Game Over! Your score: ' + score);
            resetGame();
        }
    }
}

function clearLines() {
    for (let y = board.length - 1; y >= 0; y--) {
        if (board[y].every(value => value !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(12).fill(0));
            score += 10;
            document.getElementById('score').innerText = score;
            y++; // Check the same line again
        }
    }
}

function resetGame() {
    board = Array.from({ length: 20 }, () => Array(12).fill(0));
    score = 0;
    document.getElementById('score').innerText = score;
    currentPiece = getRandomPiece();
    piecePosition = { x: 4, y: 0 };
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        movePiece(-1);
    } else if (event.key === 'ArrowRight') {
        movePiece(1);
    } else if (event.key === 'ArrowDown') {
        dropPiece();
    } else if (event.key === 'ArrowUp') {
        rotatePiece();
    }
});

function update() {
    dropPiece();
    drawBoard();
    drawPiece();
    requestAnimationFrame(update);
}

update();
var canvas = document.getElementById('GameCanvas');
var context = canvas.getContext('2d');
var gameStarted;

var img = new Image();
img.src = 'bg.jpg';

var ballX, ballY, ballVx, ballVy;
const BALL_RADIUS = 10;

const BOARD_WIDTH = 13;
const BOARD_HEIGHT = 85;
var boardAY, boardBY;

var downArrowAPressed = false;
var upArrowAPressed = false;
var downArrowBPressed = false;
var upArrowBPressed = false;

var livesPlayerA = 3;
var livesPlayerB = 3;

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_W = 87;
const KEY_S = 83;

function onKeyDown(event) {
    if (!gameStarted) {
        if (~[KEY_UP, KEY_DOWN, KEY_S, KEY_W].indexOf(event.keyCode)) {
            gameStarted = true;
        }
    }

    if (event.keyCode === KEY_S) {
        downArrowAPressed = true;
    }
    else if (event.keyCode === KEY_DOWN) {
        downArrowBPressed = true;
    }
    else if (event.keyCode === KEY_W) {
        upArrowAPressed = true;
    }
    else if (event.keyCode === KEY_UP) {
        upArrowBPressed = true;
    }
}

function onKeyUp(event) {
    if (event.keyCode === KEY_S) {
        downArrowAPressed = false;
    }
    else if (event.keyCode === KEY_DOWN) {
        downArrowBPressed = false;
    }
    else if (event.keyCode === KEY_W) {
        upArrowAPressed = false;
    }
    else if (event.keyCode === KEY_UP) {
        upArrowBPressed = false;
    }
}

function drawBall() {
    context.beginPath();
    context.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    context.fillStyle = 'orange';
    context.fill();
    context.closePath();
}

function drawBoard(x, y) {
    context.beginPath();
    context.rect(x, y, BOARD_WIDTH, BOARD_HEIGHT);
    context.fillStyle = '#0095DD';
    context.fill();
    context.closePath();
}

function drawLives() {
    context.font = '16px Arial';
    context.fillStyle = 'yellow';
    context.fillText('Игрок A: ' + livesPlayerA + ' lives', 5, 20);
    context.fillText('Игрок B: ' + livesPlayerB + ' lives', canvas.width - 115, 20);
}

function drawGameField() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, canvas.width, canvas.height);
    context.fillStyle = context.createPattern(img, 'repeat');
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
}

function resetBallPos() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballVx = 2;
    ballVy = -2;
}

function resetBoardsPos() {
    boardBY = boardAY = (canvas.height - BOARD_HEIGHT) / 2;
}

function startGameLevel() {
    resetBallPos();
    resetBoardsPos();
    gameStarted = false;
}

function processGameWin(playerName) {
    drawGameField();
    drawLives();
    alert('Поздравляем!\n' + playerName + ', вы выиграли!');
    location.reload();
}

function moveBallWithCollisionDetection() {
    if (ballX + BALL_RADIUS + ballVx + BOARD_WIDTH > canvas.width) {
        if (ballY > boardBY && ballY < boardBY + BOARD_HEIGHT) {
            ballVx = -ballVx;
        }
        else {
            livesPlayerB--;
            if (!livesPlayerB) {
                processGameWin('Игрок A');
            } else {
                startGameLevel();
            }
        }
    }
    else if (ballX - BALL_RADIUS + ballVx - BOARD_WIDTH < 0) {
        if (ballY > boardAY && ballY < boardAY + BOARD_HEIGHT) {
            ballVx = -ballVx;
        }
        else {
            livesPlayerA--;
            if (!livesPlayerA) {
                processGameWin('Игрок B');
            } else {
                startGameLevel();
            }
        }
    }
    if (ballY + BALL_RADIUS + ballVy > canvas.height || ballY - BALL_RADIUS + ballVy < 0) {
        ballVy = -ballVy;
    }
    ballX += gameStarted * ballVx;
    ballY += gameStarted * ballVy;
}

function moveBoardsWithCollisionDetection() {
    const STEP = 5;
    if (downArrowAPressed && boardAY < canvas.height - BOARD_HEIGHT) {
        boardAY += STEP;
    }
    else if (upArrowAPressed && boardAY > 0) {
        boardAY -= STEP;
    }
    if (downArrowBPressed && boardBY < canvas.height - BOARD_HEIGHT) {
        boardBY += STEP;
    }
    else if (upArrowBPressed && boardBY > 0) {
        boardBY -= STEP;
    }
}

function drawScene() {
    drawGameField();
    drawLives();
    drawBall();
    drawBoard(0, boardAY);
    drawBoard(canvas.width - BOARD_WIDTH, boardBY);

    moveBallWithCollisionDetection();
    moveBoardsWithCollisionDetection();
}

startGameLevel();
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);
setInterval(drawScene, 10);

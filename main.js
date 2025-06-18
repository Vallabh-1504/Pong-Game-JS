const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ball position & speed
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 10;
let ballSpeedY = 7;

// Paddles
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 12;
let paddle1Y = canvas.height / 2 - PADDLE_HEIGHT / 2;
let paddle2Y = canvas.height / 2 - PADDLE_HEIGHT / 2;

// Scores
let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 5;
let showingWinScreen = false;

// Game loop
setInterval(()=>{
    moveEverything();
    drawEverything();
}, 1000 / 60);

// Mouse controls
canvas.addEventListener("mousemove", (evt)=>{
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseY = evt.clientY - rect.top - root.scrollTop;
    paddle1Y = mouseY - PADDLE_HEIGHT / 2;
});

canvas.addEventListener("mousedown", ()=>{
    if(showingWinScreen){
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
});

function ballReset(){
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 5;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function computerMovement(){
    paddle2Y = ballY - PADDLE_HEIGHT / 2;
}

function moveEverything(){
    if(showingWinScreen) return;

    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Left paddle
    if(ballX < PADDLE_WIDTH){
        if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
            let xVariation = (Math.random() - 0.5) * 5;
            ballSpeedX = -ballSpeedX + xVariation;

            let variation = (Math.random() - 0.5) * 5;
            ballSpeedY += variation;
            ballSpeedY = Math.max(5, Math.min(10, ballSpeedY));
        } 
        else{
            player2Score++;
            ballReset();
        }
    }

    // Right paddle
    if(ballX > canvas.width - PADDLE_WIDTH){
        if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
            let xVariation = (Math.random() - 0.5) * 5;
            ballSpeedX = -ballSpeedX + xVariation;

            let variation = (Math.random() - 0.5) * 4;
            ballSpeedY += variation;
            ballSpeedY = Math.max(5, Math.min(10, ballSpeedY));
        }
        else{
            player1Score++;
            ballReset();
        }
    }

    if(ballY < 0 || ballY > canvas.height){
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet(){
    for(let i = 0; i < canvas.height; i += 30){
        colorRect(canvas.width / 2 - 1, i, 2, 15, "#00ffcc");
    }
}

function drawEverything(){
    // Clear screen
    colorRect(0, 0, canvas.width, canvas.height, "#1e1e1e");

    if(showingWinScreen){
        ctx.fillStyle = "#ffffff";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            player1Score >= WINNING_SCORE ? "You Win!" : "Computer Wins!",
            canvas.width / 2,
            canvas.height / 2
        );
        ctx.font = "20px Arial";
        ctx.fillText("Click to play again", canvas.width / 2, canvas.height / 2 + 40);
        return;
    }

    drawNet();

    // Paddles
    colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, "#ffffff");
    colorRect(canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, "#ffffff");

    // Ball
    colorCircle(ballX, ballY, 10, "#00ffcc");

    // Scores
    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Consolas";
    ctx.fillText(player1Score, 100, 50);
    ctx.fillText(player2Score, canvas.width - 100, 50);
}

function colorRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function colorCircle(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
}
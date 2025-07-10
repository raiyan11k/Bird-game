const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Settings
canvas.width = 320;
canvas.height = 480;

let birdY = canvas.height / 2;
let birdVelocity = 0;
const birdWidth = 20;
const birdHeight = 20;
const gravity = 0.4;  // Moderate gravity for natural fall
const lift = -6;  // Lower lift for more controlled rise
const birdColor = "#FFFF00";  // Yellow

let pipes = [];
const pipeWidth = 40;
const pipeGap = 120;  // Bigger gap between pipes
let pipeSpeed = 1.5;  // Slower pipes

let score = 0;
let gameOver = false;
let gameStarted = false;

function drawBird() {
    ctx.fillStyle = birdColor;
    ctx.fillRect(50, birdY, birdWidth, birdHeight);
}

function createPipe() {
    const gap = Math.floor(Math.random() * (canvas.height - pipeGap));
    const topPipeHeight = gap;
    const bottomPipeHeight = canvas.height - (gap + pipeGap);
    pipes.push({
        x: canvas.width,
        topHeight: topPipeHeight,
        bottomHeight: bottomPipeHeight,
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "#00FF00";  // Green pipes
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    });
}

function movePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    // Remove pipes that are off-screen
    if (pipes[0] && pipes[0].x + pipeWidth <= 0) {
        pipes.shift();
        score++;
    }
}

function checkCollisions() {
    // Check if bird hits the ground or top of the canvas
    if (birdY + birdHeight >= canvas.height || birdY <= 0) {
        gameOver = true;
    }

    // Check if bird collides with pipes
    pipes.forEach(pipe => {
        if (pipe.x <= 50 + birdWidth && pipe.x + pipeWidth >= 50) {
            if (birdY <= pipe.topHeight || birdY + birdHeight >= canvas.height - pipe.bottomHeight) {
                gameOver = true;
            }
        }
    });
}

function updateGame() {
    if (gameOver) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#FF0000";
        ctx.fillText("Game Over", 90, canvas.height / 2);
        ctx.fillText("Score: " + score, 110, canvas.height / 2 + 40);
        return;
    }

    birdVelocity += gravity;
    birdY += birdVelocity;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    movePipes();
    drawPipes();
    checkCollisions();

    // Display the score
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Score: " + score, 10, 30);

    requestAnimationFrame(updateGame);
}

function flap() {
    if (!gameOver) {
        birdVelocity = lift;  // Lower lift for more controlled rise
    }
}

// Event listener for bird flap
document.addEventListener("click", flap);

// Start game when the start button is clicked
document.getElementById("startButton").addEventListener("click", function() {
    gameStarted = true;
    document.getElementById("startScreen").style.display = "none";  // Hide the start screen
    setInterval(createPipe, 1500);  // Creates new pipes every 1.5 seconds
    updateGame();
});

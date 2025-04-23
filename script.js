// game logic for snake game v3
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("theScore");
const gameOverMessage = document.getElementById("gameOver");

// settings
const gridSize = 20; // size of each cell on gameboard
const tileCount = 20; // 400/20 = 20 tiles per row/column

// Velocity
let velocityX = 0;
let velocityY = 0;

// For easy re-initialization
let snakeBody, food, gameLoop;
let gameRunning = false;

// Initialize the game
initGame();

document.addEventListener('keydown', function(e) {
    if(!gameRunning && e.code === 'Space') {
        // Restart on SPACE if game over
        initGame();
    } else {
        keyDown(e);
    }
});

function initGame() {
    // snake body (array of x,y objects)
    snakeBody = [
        {x: 10, y: 10} // initial position near the center
    ];

    velocityX = 0;
    velocityY = 0;
    
    // Initial Food position
    food = {x: 5, y: 10};

    // Initial Score
    updateScore();

    // Hide the game over message
    gameOverMessage.style.display = 'none';

    // Start the game loop
    gameLoop = setInterval(game, 100);
    gameRunning = true;
}

function game() {
    // Update snake's head based on velocity
    let headX = snakeBody[0].x + velocityX;
    let headY = snakeBody[0].y + velocityY;

    // Wrap Around the game board boundaries
    if(headX < 0) headX = tileCount - 1;
    if(headX > tileCount - 1) headX = 0;
    if(headY < 0) headY = tileCount - 1;
    if(headY > tileCount - 1) headY = 0;

    // Check for self-collision
    for(let i = 1; i < snakeBody.length; i++) {
        if(snakeBody[i].x === headX && snakeBody[i].y === headY) {
            // Game over
            endGame();
            return;
        }
    }

    // Add the new head to the front of snakeBody
    snakeBody.unshift({x: headX, y: headY});

    // if snake eats he food, don't remove the tail
    if(headX === food.x && headY === food.y) {
        // Reposition the food
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);

        // Update the score
        updateScore();
    } else {
        // Remove tail
        snakeBody.pop();
    }

    // Draw everything
    drawGame();
}

function drawGame() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // draw the snake
    ctx.fillStyle = 'green';
    snakeBody.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}


// key listener
// document.addEventListener('keydown', keyDown);

function keyDown(e) {
    switch(e.key) {
        case 'ArrowLeft':
            // Prevent reversing directly
            if(velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'ArrowRight':
            if(velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
        case 'ArrowUp':
            // Prevent reversing directly
            if(velocityY !== 1) {
                velocityY = -1;
                velocityX = 0;
            }
            break;
        case 'ArrowDown':
            if(velocityY !== -1) {
                velocityY = 1;
                velocityX = 0;
            }
            break;
    }
}

function updateScore() {
    scoreDisplay.textContent = 'Score: ' + snakeBody.length;
}

function endGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    gameOverMessage.style.display = 'block';
}
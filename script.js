const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 7;

const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 5,
    dy: 5,
    radius: ballSize,
    speed: 5
};

let playerScore = 0;
let computerScore = 0;

// Keyboard input
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Mouse input
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const paddleCenter = player.y + player.height / 2;
    
    if (mouseY < paddleCenter - 5) {
        player.dy = -player.speed;
    } else if (mouseY > paddleCenter + 5) {
        player.dy = player.speed;
    } else {
        player.dy = 0;
    }
});

// Update player paddle with arrow keys
function updatePlayer() {
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        player.dy = -player.speed;
    } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        player.dy = player.speed;
    }
    
    player.y += player.dy;
    
    // Keep paddle in bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Update computer AI
function updateComputer() {
    const computerCenter = computer.y + computer.height / 2;
    
    if (computerCenter < ball.y - 35) {
        computer.dy = computer.speed;
    } else if (computerCenter > ball.y + 35) {
        computer.dy = -computer.speed;
    } else {
        computer.dy = computer.speed * 0.5;
    }
    
    computer.y += computer.dy;
    
    // Keep paddle in bounds
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }
    
    // Ball collision with paddles
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = Math.abs(ball.dx);
        ball.x = player.x + player.width + ball.radius;
        
        // Add spin based on paddle hit location
        const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        ball.dy += hitPos * 3;
        ball.speed += 0.5;
        ball.dx = Math.min(ball.speed, 8);
    }
    
    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -Math.abs(ball.dx);
        ball.x = computer.x - ball.radius;
        
        // Add spin based on paddle hit location
        const hitPos = (ball.y - (computer.y + computer.height / 2)) / (computer.height / 2);
        ball.dy += hitPos * 3;
        ball.speed += 0.5;
        ball.dx = -Math.min(ball.speed, 8);
    }
    
    // Score points
    if (ball.x < 0) {
        computerScore++;
        resetBall();
        computerScoreDisplay.textContent = computerScore;
    }
    
    if (ball.x > canvas.width) {
        playerScore++;
        resetBall();
        playerScoreDisplay.textContent = playerScore;
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() * 2 - 1) * 5;
    ball.speed = 5;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#16c784';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowColor = 'rgba(22, 199, 132, 0.8)';
    ctx.shadowBlur = 10;
}

function drawBall() {
    ctx.fillStyle = '#ff006e';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'rgba(255, 0, 110, 0.8)';
    ctx.shadowBlur = 10;
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(22, 199, 132, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = 'transparent';
    
    // Draw center line
    drawCenterLine();
    
    // Update game state
    updatePlayer();
    updateComputer();
    updateBall();
    
    // Draw game objects
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
    
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
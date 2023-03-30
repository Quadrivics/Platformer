import { player } from './objects/player.js';
import { platforms } from './objects/level.js';
import { keys } from './helpers/controls.js';

// Define canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const goal = {
    x: 725,
    y: 75,
    width: 50,
    height: 50,
};

// Define score
let score = 0;

function checkCollision(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        return true;
    } else {
        return false;
    }
}

function handleCollisions() {
    // Check for collision between player and platforms
    for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {
            // If collision detected, adjust player position
            if (player.y + player.height > platform.y &&
                player.y < platform.y) {
                // Player is on top of platform
                player.y = platform.y - player.height;
                player.jumping = false;
                player.gravity = 0;
            } else if (player.y < platform.y + platform.height &&
                player.y + player.height > platform.y + platform.height) {
                // Player is below platform
                player.y = platform.y + platform.height;
                player.gravity = 1;
            } else if (player.x + player.width > platform.x &&
                player.x < platform.x) {
                // Player is to the left of platform
                player.x = platform.x - player.width;
            } else if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x + platform.width) {
                // Player is to the right of platform
                player.x = platform.x + platform.width;
            }
        }
    }
    
    // Check for collision between player and goal
    if (checkCollision(player, goal)) {
        score++;
        player.x = 10;
        player.y = 500;
    }
}



// Update game state
function update() {
    handleCollisions();

    // Move player left and right
    if (keys[37]) {
        player.x -= player.speed;
    } else if (keys[39]) {
        player.x += player.speed;
    }

    // Make player jump
    if (keys[32] | keys[38] && !player.jumping) {
        player.jumping = true;
        player.gravity = -player.jumpSpeed;
    }

    // Apply gravity to player
    player.gravity += 1;
    player.y += player.gravity;

    // Keep player inside the canvas
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.jumping = false;
        player.gravity = 0;
    }
}

// Draw game objects
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        ctx.fillStyle = "#005C53";
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // Draw player
    ctx.fillStyle = "#9FC131";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw goal
    ctx.fillStyle = "#F27405";
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

    // Draw score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Arial";
    ctx.fillText("SCORE: " + score, 10, 30);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game loop
requestAnimationFrame(gameLoop);
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const levelCompleteScreen = document.getElementById('level-complete');
const restartButton = document.getElementById('restart-button');
const nextLevelButton = document.getElementById('next-level-button');
const finalScoreElement = document.getElementById('final-score');
const levelScoreElement = document.getElementById('level-score');

let score = 0;
let lives = 3;
let gameRunning = true;
let currentLevel = 1;
let coinsCollected = 0;
let coinsToCollect = 5;
let obstacles = [];
let coins = [];
let animationId;
let keys = {};
let gameCompleted = false;

class Mario {
    constructor() {
        this.width = 50;
        this.height = 70;
        this.x = 100;
        this.y = canvas.height - 120;
        this.speed = 12;
        this.velocityX = 0;
        this.velocityY = 0;
        this.jumping = false;
        this.onGround = true;
        this.facingRight = true;
        
        this.img = new Image();
        this.img.src = 'mario.png';
        this.img.onerror = () => {
            this.createFallbackImage();
        };
    }

    createFallbackImage() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#E52521';
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.fillStyle = '#FFC0CB';
        ctx.fillRect(10, 15, 30, 20);
        
        ctx.fillStyle = '#E52521';
        ctx.fillRect(15, 5, 20, 15);
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(20, 25, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(35, 25, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillRect(20, 32, 20, 3);
        
        this.img.src = canvas.toDataURL();
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        if (keys[37] || keys[65]) {
            this.velocityX = -this.speed;
            this.facingRight = false;
        } else if (keys[39] || keys[68]) {
            this.velocityX = this.speed;
            this.facingRight = true;
        } else {
            this.velocityX *= 0.8;
            if (Math.abs(this.velocityX) < 0.5) this.velocityX = 0;
        }

        this.velocityY += 0.8;
        
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
        
        if (this.y >= canvas.height - 120) {
            this.y = canvas.height - 120;
            this.velocityY = 0;
            this.onGround = true;
            this.jumping = false;
        }
        
        if (this.y < 0) {
            this.y = 0;
            this.velocityY = 0;
        }
    }

    jump() {
        if (this.onGround && !this.jumping) {
            this.velocityY = -18;
            this.onGround = false;
            this.jumping = true;
        }
    }

    getBounds() {
        return {
            x: this.x + 5,
            y: this.y + 5,
            width: this.width - 10,
            height: this.height - 10
        };
    }
}

class Obstacle {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        
        this.img = new Image();
        if (type === 'block') {
            this.img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '"><rect width="' + width + '" height="' + height + '" fill="%238B4513" stroke="%23452A0D" stroke-width="2"/><rect x="5" y="5" width="' + (width-10) + '" height="' + (height-10) + '" fill="%23A0522D" stroke="%23452A0D" stroke-width="1"/></svg>';
        } else if (type === 'pipe') {
            this.img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '"><rect width="' + width + '" height="' + height + '" fill="%23008000"/><rect x="5" y="5" width="' + (width-10) + '" height="' + (height-10) + '" fill="%2300AA00"/></svg>';
        }
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.collected = false;
        this.animationFrame = 0;
        
        this.img = new Image();
        this.img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><circle cx="12.5" cy="12.5" r="10" fill="%23FFD700" stroke="%23FFA500" stroke-width="2"/><circle cx="12.5" cy="12.5" r="6" fill="%23FFF8DC"/></svg>';
    }

    draw() {
        if (!this.collected) {
            const bounceOffset = Math.sin(this.animationFrame * 0.1) * 3;
            ctx.drawImage(this.img, this.x, this.y + bounceOffset, this.width, this.height);
            this.animationFrame++;
        }
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function initLevel(level) {
    obstacles = [];
    coins = [];
    coinsCollected = 0;
    
    if (level === 1) {
        coinsToCollect = 4;
        obstacles.push(new Obstacle(0, canvas.height - 50, canvas.width, 50, 'block'));
        obstacles.push(new Obstacle(300, canvas.height - 100, 60, 50, 'block'));
        obstacles.push(new Obstacle(500, canvas.height - 120, 60, 70, 'block'));
        obstacles.push(new Obstacle(700, canvas.height - 150, 80, 100, 'pipe'));
        obstacles.push(new Obstacle(900, canvas.height - 100, 60, 50, 'block'));
        
        coins.push(new Coin(320, canvas.height - 150));
        coins.push(new Coin(520, canvas.height - 170));
        coins.push(new Coin(720, canvas.height - 200));
        coins.push(new Coin(920, canvas.height - 150));
    } else if (level === 2) {
        coinsToCollect = 5;
        obstacles.push(new Obstacle(0, canvas.height - 50, canvas.width, 50, 'block'));
        obstacles.push(new Obstacle(250, canvas.height - 100, 60, 50, 'block'));
        obstacles.push(new Obstacle(400, canvas.height - 130, 60, 80, 'block'));
        obstacles.push(new Obstacle(600, canvas.height - 160, 80, 110, 'pipe'));
        obstacles.push(new Obstacle(800, canvas.height - 130, 60, 80, 'block'));
        obstacles.push(new Obstacle(1000, canvas.height - 100, 60, 50, 'block'));
        
        coins.push(new Coin(270, canvas.height - 150));
        coins.push(new Coin(420, canvas.height - 180));
        coins.push(new Coin(620, canvas.height - 210));
        coins.push(new Coin(820, canvas.height - 180));
        coins.push(new Coin(1020, canvas.height - 150));
    } else if (level === 3) {
        coinsToCollect = 6;
        obstacles.push(new Obstacle(0, canvas.height - 50, canvas.width, 50, 'block'));
        obstacles.push(new Obstacle(200, canvas.height - 100, 60, 50, 'block'));
        obstacles.push(new Obstacle(350, canvas.height - 140, 60, 90, 'block'));
        obstacles.push(new Obstacle(500, canvas.height - 180, 80, 130, 'pipe'));
        obstacles.push(new Obstacle(650, canvas.height - 140, 60, 90, 'block'));
        obstacles.push(new Obstacle(800, canvas.height - 100, 60, 50, 'block'));
        obstacles.push(new Obstacle(950, canvas.height - 140, 60, 90, 'block'));
        
        coins.push(new Coin(220, canvas.height - 150));
        coins.push(new Coin(370, canvas.height - 190));
        coins.push(new Coin(520, canvas.height - 230));
        coins.push(new Coin(670, canvas.height - 190));
        coins.push(new Coin(820, canvas.height - 150));
        coins.push(new Coin(970, canvas.height - 190));
    }
    
    mario.x = 100;
    mario.y = canvas.height - 120;
    mario.velocityX = 0;
    mario.velocityY = 0;
    mario.onGround = true;
    mario.jumping = false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(200, 80, 30, 0, Math.PI * 2);
    ctx.arc(230, 70, 40, 0, Math.PI * 2);
    ctx.arc(260, 80, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(600, 120, 30, 0, Math.PI * 2);
    ctx.arc(630, 110, 40, 0, Math.PI * 2);
    ctx.arc(660, 120, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(1000, 90, 30, 0, Math.PI * 2);
    ctx.arc(1030, 80, 40, 0, Math.PI * 2);
    ctx.arc(1060, 90, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(canvas.width - 150, 20, 130, 40);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Level: ' + currentLevel, canvas.width - 140, 45);
    
    obstacles.forEach(obstacle => obstacle.draw());
    coins.forEach(coin => coin.draw());
    mario.draw();
}

function update() {
    if (!gameRunning) return;
    
    mario.update();
    
    coins.forEach(coin => {
        if (!coin.collected && checkCollision(mario.getBounds(), coin.getBounds())) {
            coin.collected = true;
            coinsCollected++;
            score += 100;
            scoreElement.textContent = 'Score: ' + score;
            
            if (coinsCollected >= coinsToCollect) {
                if (currentLevel === 3) {
                    gameComplete();
                } else {
                    levelComplete();
                }
            }
        }
    });
    
    let collisionOccurred = false;
    
    for (let obstacle of obstacles) {
        if (checkCollision(mario.getBounds(), obstacle.getBounds())) {
            collisionOccurred = true;
            
            const marioBottom = mario.y + mario.height;
            const obstacleTop = obstacle.y;
            const marioTop = mario.y;
            const obstacleBottom = obstacle.y + obstacle.height;
            const marioRight = mario.x + mario.width;
            const obstacleLeft = obstacle.x;
            const marioLeft = mario.x;
            const obstacleRight = obstacle.x + obstacle.width;
            
            if (marioBottom > obstacleTop && 
                mario.velocityY > 0 && 
                marioBottom - mario.velocityY <= obstacleTop + 10) {
                mario.y = obstacleTop - mario.height;
                mario.velocityY = 0;
                mario.onGround = true;
                mario.jumping = false;
            } 
            else if (marioTop < obstacleBottom && mario.velocityY < 0) {
                mario.y = obstacleBottom;
                mario.velocityY = 0;
            }
            else if (marioRight > obstacleLeft && marioLeft < obstacleLeft) {
                mario.x = obstacleLeft - mario.width;
            }
            else if (marioLeft < obstacleRight && marioRight > obstacleRight) {
                mario.x = obstacleRight;
            }
            else {
                loseLife();
                return;
            }
        }
    }
}

function loseLife() {
    lives--;
    livesElement.textContent = 'Lives: ' + lives;
    
    if (lives <= 0) {
        gameOver();
    } else {
        mario.x = 100;
        mario.y = canvas.height - 120;
        mario.velocityX = 0;
        mario.velocityY = 0;
        mario.onGround = true;
        mario.jumping = false;
    }
}

function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = 'Your score: ' + score;
    gameOverScreen.style.display = 'block';
    cancelAnimationFrame(animationId);
}

function levelComplete() {
    gameRunning = false;
    levelScoreElement.textContent = 'Your score: ' + score;
    levelCompleteScreen.style.display = 'block';
    cancelAnimationFrame(animationId);
}

function gameComplete() {
    gameRunning = false;
    gameCompleted = true;
    
    const gameCompleteScreen = document.createElement('div');
    gameCompleteScreen.id = 'game-complete';
    gameCompleteScreen.style.position = 'absolute';
    gameCompleteScreen.style.top = '50%';
    gameCompleteScreen.style.left = '50%';
    gameCompleteScreen.style.transform = 'translate(-50%, -50%)';
    gameCompleteScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameCompleteScreen.style.color = 'white';
    gameCompleteScreen.style.padding = '30px';
    gameCompleteScreen.style.borderRadius = '15px';
    gameCompleteScreen.style.textAlign = 'center';
    gameCompleteScreen.style.zIndex = '10';
    
    gameCompleteScreen.innerHTML = `
        <h2>Felicitări! Ai terminat jocul!</h2>
        <p>Scorul tău final: ${score}</p>
        <p>Ai completat toate nivelurile!</p>
        <button id="play-again-button">Joacă din nou</button>
    `;
    
    document.getElementById('game-container').appendChild(gameCompleteScreen);
    
    document.getElementById('play-again-button').addEventListener('click', () => {
        gameCompleteScreen.remove();
        resetGame();
    });
    
    cancelAnimationFrame(animationId);
}

function resetGame() {
    gameRunning = true;
    gameCompleted = false;
    score = 0;
    lives = 3;
    currentLevel = 1;
    scoreElement.textContent = 'Score: 0';
    livesElement.textContent = 'Lives: 3';
    gameOverScreen.style.display = 'none';
    levelCompleteScreen.style.display = 'none';
    initLevel(currentLevel);
    gameLoop();
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
    
    if (e.keyCode === 32) {
        e.preventDefault();
        mario.jump();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false;
});

restartButton.addEventListener('click', () => {
    resetGame();
});

nextLevelButton.addEventListener('click', () => {
    gameRunning = true;
    currentLevel++;
    levelCompleteScreen.style.display = 'none';
    initLevel(currentLevel);
    gameLoop();
});

const mario = new Mario();
initLevel(currentLevel);
gameLoop();
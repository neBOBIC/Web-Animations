document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');
    const shootBtn = document.getElementById('shootBtn');
    const celebrateBtn = document.getElementById('celebrateBtn');
    
    canvas.width = 1920;
    canvas.height = 1080;
    
    const character = {
        x: 300,
        y: 700,
        bodyRadius: 50,
        headRadius: 35,
        legAngle: 0,
        armAngle: 0,
        celebration: false,
        celebrationCounter: 0,
        legDirection: 1,
        armDirection: 1
    };
    
    const ball = {
        x: 450,
        y: 650,
        radius: 25,
        targetX: 1750,
        targetY: 600,
        isMoving: false,
        progress: 0,
        speed: 0.02,
        scored: false
    };
    
    const goal = {
        x: 1720,
        y: 550,
        width: 120,
        height: 300
    };
    
    let animationId = null;
    let isShooting = false;
    let isCelebrating = false;
    
    const crowd = [];
    for (let i = 0; i < 80; i++) {
        const row = Math.floor(i / 10);
        const col = i % 10;
        crowd.push({
            x: 1300 + col * 50,
            y: 100 + row * 40,
            size: Math.random() * 8 + 10,
            color: `hsl(${Math.random() * 60 + 200}, 70%, 50%)`,
            movement: Math.random() * 0.1,
            chairColor: `hsl(${Math.random() * 30}, 60%, 30%)`
        });
    }
    
    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawBackground();
        drawStadium();
        drawCrowd();
        drawGoal();
        drawCharacter();
        drawBall();
        
        if (isCelebrating) {
            drawCelebration();
        }
    }
    
    function drawBackground() {
        ctx.fillStyle = '#67a6e8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#3a9e3a';
        ctx.fillRect(0, canvas.height - 300, canvas.width, 300);
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.strokeRect(100, canvas.height - 280, canvas.width - 200, 200);
        
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height - 180, 70, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height - 280);
        ctx.lineTo(canvas.width / 2, canvas.height - 80);
        ctx.stroke();
    }
    
    function drawStadium() {
        ctx.fillStyle = '#555';
        ctx.fillRect(1200, 80, 700, 400);
        
        for (let i = 0; i < 8; i++) {
            ctx.fillStyle = '#777';
            ctx.fillRect(1200, 80 + i * 50, 700, 5);
        }
    }
    
    function drawCrowd() {
        crowd.forEach(person => {
            ctx.fillStyle = person.chairColor;
            ctx.fillRect(person.x - 10, person.y + 15, 20, 25);
            
            ctx.fillStyle = person.color;
            ctx.beginPath();
            ctx.arc(person.x, person.y, person.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffccbc';
            ctx.beginPath();
            ctx.arc(person.x, person.y - person.size/2, person.size/2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(person.x - 3, person.y - person.size/2 - 2, 2, 0, Math.PI * 2);
            ctx.arc(person.x + 3, person.y - person.size/2 - 2, 2, 0, Math.PI * 2);
            ctx.fill();
            
            if (isCelebrating) {
                ctx.fillStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(person.x, person.y - person.size/2, person.size/3, 0, Math.PI);
                ctx.fill();
                
                person.y += Math.sin(Date.now() * person.movement) * 2;
            } else {
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(person.x, person.y - person.size/2, person.size/3, 0, Math.PI);
                ctx.stroke();
            }
        });
    }
    
    function drawGoal() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.strokeRect(goal.x, goal.y, goal.width, goal.height);
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.moveTo(goal.x, goal.y + (i * 25));
            ctx.lineTo(goal.x + goal.width, goal.y + (i * 25));
            ctx.stroke();
        }
        
        for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.moveTo(goal.x + (i * 10), goal.y);
            ctx.lineTo(goal.x + (i * 10), goal.y + goal.height);
            ctx.stroke();
        }
    }
    
    function drawCharacter() {
        const bodyX = character.x + character.bodyRadius;
        const bodyY = character.y + character.bodyRadius;
        
        ctx.fillStyle = '#2c5aa0';
        ctx.beginPath();
        ctx.arc(bodyX, bodyY, character.bodyRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffccbc';
        ctx.beginPath();
        ctx.arc(bodyX, bodyY - character.bodyRadius - 10, character.headRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(bodyX - 10, bodyY - character.bodyRadius - 15, 6, 0, Math.PI * 2);
        ctx.arc(bodyX + 10, bodyY - character.bodyRadius - 15, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(bodyX - 10, bodyY - character.bodyRadius - 15, 3, 0, Math.PI * 2);
        ctx.arc(bodyX + 10, bodyY - character.bodyRadius - 15, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(bodyX, bodyY - character.bodyRadius, 8, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.arc(bodyX, bodyY, character.bodyRadius - 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#2c5aa0';
        
        const leftArmX = bodyX - character.bodyRadius;
        const leftArmY = bodyY;
        ctx.save();
        ctx.translate(leftArmX, leftArmY);
        ctx.rotate(character.armAngle);
        ctx.beginPath();
        ctx.ellipse(10, 0, 15, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        const rightArmX = bodyX + character.bodyRadius;
        const rightArmY = bodyY;
        ctx.save();
        ctx.translate(rightArmX, rightArmY);
        ctx.rotate(-character.armAngle);
        ctx.beginPath();
        ctx.ellipse(-10, 0, 15, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.fillStyle = '#1a1a1a';
        
        const leftLegX = bodyX - 15;
        const leftLegY = bodyY + character.bodyRadius;
        ctx.save();
        ctx.translate(leftLegX, leftLegY);
        ctx.rotate(character.legAngle);
        ctx.beginPath();
        ctx.ellipse(0, 50, 12, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        const rightLegX = bodyX + 15;
        const rightLegY = bodyY + character.bodyRadius;
        ctx.save();
        ctx.translate(rightLegX, rightLegY);
        ctx.rotate(-character.legAngle);
        ctx.beginPath();
        ctx.ellipse(0, 50, 12, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    function drawBall() {
        const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#e0e0e0');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y - ball.radius + 5);
        ctx.lineTo(ball.x - 8, ball.y - 3);
        ctx.lineTo(ball.x - 4, ball.y + 8);
        ctx.lineTo(ball.x + 4, ball.y + 8);
        ctx.lineTo(ball.x + 8, ball.y - 3);
        ctx.closePath();
        ctx.stroke();
    }
    
    function drawCelebration() {
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 12 + 3;
            const hue = Math.random() * 360;
            
            ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
            
            if (Math.random() > 0.5) {
                ctx.fillRect(x, y, size, size);
            } else {
                ctx.beginPath();
                ctx.arc(x, y, size/2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.font = 'bold 120px Arial';
        ctx.fillStyle = 'gold';
        ctx.strokeStyle = 'darkorange';
        ctx.lineWidth = 8;
        ctx.textAlign = 'center';
        ctx.strokeText('GOAL!', canvas.width / 2, 200);
        ctx.fillText('GOAL!', canvas.width / 2, 200);
        
        if (character.celebration) {
            character.celebrationCounter++;
            
            character.armAngle = Math.sin(character.celebrationCounter / 8) * 0.8;
            character.legAngle = Math.sin(character.celebrationCounter / 6) * 0.5;
            
            character.y = 700 + Math.sin(character.celebrationCounter / 5) * 40;
        }
    }
    
    function update() {
        if (isShooting) {
            character.armAngle += 0.05 * character.armDirection;
            character.legAngle += 0.03 * character.legDirection;
            
            if (character.armAngle > 1 || character.armAngle < -0.2) {
                character.armDirection *= -1;
            }
            if (character.legAngle > 0.5 || character.legAngle < -0.3) {
                character.legDirection *= -1;
            }
            
            if (ball.isMoving) {
                ball.progress += ball.speed;
                
                const t = ball.progress;
                ball.x = 450 + (ball.targetX - 450) * t;
                ball.y = 650 - 180 * t * (1 - t);
                
                if (ball.progress >= 1) {
                    ball.isMoving = false;
                    ball.scored = true;
                    isShooting = false;
                    
                    setTimeout(() => {
                        character.armAngle = 0;
                        character.legAngle = 0;
                    }, 500);
                }
            }
        }
        
        drawScene();
        animationId = requestAnimationFrame(update);
    }
    
    function startShooting() {
        if (isShooting || isCelebrating) return;
        
        isShooting = true;
        ball.isMoving = true;
        ball.progress = 0;
        ball.scored = false;
        
        isCelebrating = false;
        character.celebration = false;
        character.y = 700;
        character.armDirection = 1;
        character.legDirection = 1;
    }
    
    function startCelebration() {
        if (!ball.scored || isCelebrating) return;
        
        isCelebrating = true;
        character.celebration = true;
        character.celebrationCounter = 0;
        
        setTimeout(() => {
            isCelebrating = false;
            character.celebration = false;
            character.y = 700;
            character.armAngle = 0;
            character.legAngle = 0;
        }, 5000);
    }
    
    shootBtn.addEventListener('click', startShooting);
    celebrateBtn.addEventListener('click', startCelebration);
    
    update();
});
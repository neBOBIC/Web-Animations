const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const particle = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentColor = '#ff6b6b';
let currentShape = 'circle';
let maxSize = 40;
let trailEffect = true;

document.getElementById('colorPicker').addEventListener('input', function(e) {
    currentColor = e.target.value;
});

document.getElementById('shapePicker').addEventListener('change', function(e) {
    currentShape = e.target.value;
});

document.getElementById('sizeSlider').addEventListener('input', function(e) {
    maxSize = parseInt(e.target.value);
});

document.getElementById('trailToggle').addEventListener('change', function(e) {
    trailEffect = e.target.checked;
});

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const mouse = {
    x: undefined,
    y: undefined,
}

canvas.addEventListener('click', function(mouseclick){
    mouse.x = mouseclick.x;
    mouse.y = mouseclick.y;
    for (let j = 0; j<15; j++){
        particle.push(new Particle('triangle'));
    }
})

canvas.addEventListener('mousemove', function(mouseclick){
    mouse.x = mouseclick.x;
    mouse.y = mouseclick.y;
    for (let j = 0; j<3; j++){
        particle.push(new Particle('square'));
    }
})

class Particle{
    constructor(shapeType){
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * maxSize + 10;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.color = this.getRandomColor();
        this.shape = shapeType || currentShape;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
        this.glow = Math.random() > 0.3;
    }
    
    getRandomColor() {
        const colors = [currentColor, '#667eea', '#f093fb', '#4ecdc4', '#ffd166', '#ff6b6b', '#45b7d1', '#96ceb4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if(this.size > 0.2) this.size -= 0.15;
    }
    
    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        if(this.glow) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
        }
        
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = this.size / maxSize;
        
        switch(this.shape){
            case 'square':
                ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
                break;
            case 'triangle':
                ctx.moveTo(0, -this.size/2);
                ctx.lineTo(-this.size/2, this.size/2);
                ctx.lineTo(this.size/2, this.size/2);
                ctx.closePath();
                break;
            case 'star':
                this.drawStar(0, 0, 5, this.size/2, this.size/4);
                break;
            case 'hexagon':
                this.drawHexagon(0, 0, this.size/2);
                break;
            default:
                ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.restore();
    }
    
    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        
        ctx.moveTo(cx, cy - outerRadius);
        for(let i = 0; i < spikes; i++){
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }
    
    drawHexagon(cx, cy, radius) {
        for(let i = 0; i < 6; i++) {
            let angle = Math.PI / 3 * i;
            let x = cx + radius * Math.cos(angle);
            let y = cy + radius * Math.sin(angle);
            if(i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
    }
}

function init(){
    for (let i = 0; i < 25; i++){
        particle.push(new Particle());
    }
}
init();

function drawParticle(){
    if(!trailEffect) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    for (let i = 0; i < particle.length; i++){
        particle[i].update();
        particle[i].draw();
        if(particle[i].size <= 0.2){
            particle.splice(i, 1);
            i--;
        }
    }
}

function animate(){
    drawParticle();
    requestAnimationFrame(animate);
}

animate();
let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");

let sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
sky.addColorStop(0, "#87CEEB");
sky.addColorStop(1, "#bde0fe");
ctx.fillStyle = sky;
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "green";
ctx.fillRect(0, 500, canvas.width, canvas.height);
ctx.strokeStyle = "black";
ctx.strokeRect(0, 500, canvas.width, canvas.height);

ctx.fillStyle = "#f2d702";
ctx.fillRect(560, 270, 300, 300);
ctx.strokeStyle = "black";
ctx.strokeRect(560, 270, 300, 300);

ctx.fillStyle = "#ee8104";
ctx.fillRect(680, 470, 70, 100);
ctx.strokeStyle = "black";
ctx.strokeRect(680, 470, 70, 100);

ctx.beginPath();
ctx.arc(745, 520, 6, 0, 2 * Math.PI);
ctx.fillStyle = "#f2d702";
ctx.fill();
ctx.stroke();

ctx.fillStyle = "#03a5fd";
ctx.fillRect(600, 340, 70, 70);
ctx.strokeRect(600, 340, 70, 70);

ctx.fillRect(750, 340, 70, 70);
ctx.strokeRect(750, 340, 70, 70);

ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(635, 340); ctx.lineTo(635, 410);
ctx.moveTo(600, 375); ctx.lineTo(670, 375);
ctx.moveTo(785, 340); ctx.lineTo(785, 410);
ctx.moveTo(750, 375); ctx.lineTo(820, 375);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(520, 300);
ctx.lineTo(710, 120);
ctx.lineTo(900, 300);
ctx.closePath();
ctx.fillStyle = "#cc391b";
ctx.fill();
ctx.stroke();

ctx.fillStyle = "#8B0000";
ctx.fillRect(790, 160, 30, 80);
ctx.strokeRect(790, 160, 30, 80);

for (let i = 0; i < 3; i++) {
  ctx.beginPath();
  ctx.arc(805 + i * 10, 140 - i * 30, 15 + i * 5, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(200,200,200,0.6)";
  ctx.fill();
}

function drawCloud(x, y, scale = 1) {
  ctx.beginPath();
  ctx.arc(x, y, 30 * scale, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(x + 40 * scale, y, 40 * scale, Math.PI * 1, Math.PI * 2);
  ctx.arc(x + 80 * scale, y + 10 * scale, 30 * scale, Math.PI * 1.2, Math.PI * 1.85);
  ctx.arc(x + 50 * scale, y + 20 * scale, 35 * scale, Math.PI * 1.37, Math.PI * 0.37, true);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#cccccc";
  ctx.stroke();
}
drawCloud(400, 150, 1);
drawCloud(1000, 120, 1.2);
drawCloud(200, 100, 0.8);

ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.fillStyle = "yellow";
ctx.fill();
ctx.strokeStyle = "orange";
ctx.stroke();

for (let i = 0; i < 12; i++) {
  let angle = (i * Math.PI) / 6;
  let x1 = 100 + Math.cos(angle) * 60;
  let y1 = 100 + Math.sin(angle) * 60;
  let x2 = 100 + Math.cos(angle) * 80;
  let y2 = 100 + Math.sin(angle) * 80;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawTree(x, y, scale = 1) {
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(x, y, 20 * scale, 60 * scale);
  ctx.beginPath();
  ctx.arc(x + 10 * scale, y - 20 * scale, 35 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "#228B22";
  ctx.fill();
  ctx.stroke();
}
drawTree(400, 440, 1);
drawTree(1000, 430, 1.2);

for (let i = 0; i < 15; i++) {
  let x = 200 + Math.random() * 800;
  let y = 550 + Math.random() * 50;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = ["#ff1493", "#ffa500", "#ff0000", "#ffff00"][Math.floor(Math.random() * 4)];
  ctx.fill();
}

for (let i = 0; i < 15; i++) {
  let x = 400 + i * 40;
  ctx.fillStyle = "#deb887";
  ctx.fillRect(x, 530, 20, 70);
  ctx.strokeRect(x, 530, 20, 70);
}
ctx.beginPath();
ctx.moveTo(400, 540);
ctx.lineTo(980, 540);
ctx.moveTo(400, 570);
ctx.lineTo(980  , 570);
ctx.strokeStyle = "#654321";
ctx.stroke();

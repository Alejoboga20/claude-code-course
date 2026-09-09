const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = {
  phase: 'waiting', // 'waiting' | 'playing' | 'game-over' | 'win'
  score: 0,
  lives: 3,
};

const paddle = { x: canvas.width / 2 - 81, y: canvas.height - 30, width: 162, height: 14, speed: 6 };

const ball = { x: 0, y: 0, radius: 8, dx: 0, dy: 0, speed: 4 };

function resetBallOnPaddle() {
  ball.x = paddle.x + paddle.width / 2;
  ball.y = paddle.y - ball.radius;
  ball.dx = 0;
  ball.dy = 0;
}

const keys = { left: false, right: false };

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  paddle.x = clamp(mouseX - paddle.width / 2, 0, canvas.width - paddle.width);
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updatePaddle() {
  if (keys.left) paddle.x -= paddle.speed;
  if (keys.right) paddle.x += paddle.speed;
  paddle.x = clamp(paddle.x, 0, canvas.width - paddle.width);

  if (state.phase === 'waiting') resetBallOnPaddle();
}

function drawStartMessage() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Click or press a key to start', canvas.width / 2, canvas.height / 2);
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawSprite(ctx, 'paddle', paddle.x, paddle.y, paddle.width, paddle.height);
  drawSprite(ctx, 'ball', ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
  if (state.phase === 'waiting') drawStartMessage();
}

function loop() {
  updatePaddle();
  draw();
  requestAnimationFrame(loop);
}

loadSpritesheet(() => {
  resetBallOnPaddle();
  requestAnimationFrame(loop);
});

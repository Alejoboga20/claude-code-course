const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = {
  phase: 'waiting', // 'waiting' | 'playing' | 'game-over' | 'win'
  score: 0,
  lives: 3,
};

const paddle = { x: canvas.width / 2 - 81, y: canvas.height - 30, width: 162, height: 14, speed: 6 };

const ball = { x: 0, y: 0, radius: 8, dx: 0, dy: 0, speed: 4 };

const bounceSound = new Audio('assets/sounds/ball-bounce.mp3');

function playBounceSound() {
  bounceSound.currentTime = 0;
  bounceSound.play();
}

function resetBallOnPaddle() {
  ball.x = paddle.x + paddle.width / 2;
  ball.y = paddle.y - ball.radius;
  ball.dx = 0;
  ball.dy = 0;
}

function launch() {
  if (state.phase !== 'waiting') return;
  state.phase = 'playing';
  ball.dx = ball.speed * 0.5;
  ball.dy = -ball.speed;
}

const keys = { left: false, right: false };

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
  launch();
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

canvas.addEventListener('click', launch);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updatePaddle() {
  if (keys.left) paddle.x -= paddle.speed;
  if (keys.right) paddle.x += paddle.speed;
  paddle.x = clamp(paddle.x, 0, canvas.width - paddle.width);

  if (state.phase === 'waiting') resetBallOnPaddle();
}

function updateBall() {
  if (state.phase !== 'playing') return;

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius;
    ball.dx = -ball.dx;
    playBounceSound();
  } else if (ball.x + ball.radius >= canvas.width) {
    ball.x = canvas.width - ball.radius;
    ball.dx = -ball.dx;
    playBounceSound();
  }

  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.dy = -ball.dy;
    playBounceSound();
  }

  const hitsPaddle =
    ball.dy > 0 &&
    ball.y + ball.radius >= paddle.y &&
    ball.y + ball.radius <= paddle.y + paddle.height &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width;

  if (hitsPaddle) {
    ball.y = paddle.y - ball.radius;
    const offset = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    ball.dx = offset * ball.speed;
    ball.dy = -Math.sqrt(Math.max(0.1, ball.speed * ball.speed - ball.dx * ball.dx));
    playBounceSound();
  }
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
  updateBall();
  draw();
  requestAnimationFrame(loop);
}

loadSpritesheet(() => {
  resetBallOnPaddle();
  requestAnimationFrame(loop);
});

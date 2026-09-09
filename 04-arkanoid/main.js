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
const breakSound = new Audio('assets/sounds/break-sound.mp3');

function playBounceSound() {
  bounceSound.currentTime = 0;
  bounceSound.play();
}

function playBreakSound() {
  breakSound.currentTime = 0;
  breakSound.play();
}

const BLOCK_WIDTH = 54;
const BLOCK_HEIGHT = 20;
const BLOCK_GAP = 6;
const BLOCK_TOP = 60;
const BLOCK_LEFT = 3;

const BLOCK_LAYOUT = [
  'red',
  'yellow',
  'cyan',
  'magenta',
  'green',
].map((color) => new Array(8).fill(color));

function createBlocks() {
  return BLOCK_LAYOUT.map((row) => row.slice());
}

const blocks = createBlocks();

function blockRect(row, col) {
  return {
    x: BLOCK_LEFT + col * (BLOCK_WIDTH + BLOCK_GAP),
    y: BLOCK_TOP + row * (BLOCK_HEIGHT + BLOCK_GAP),
    width: BLOCK_WIDTH,
    height: BLOCK_HEIGHT,
  };
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

const restartButton = { x: canvas.width / 2 - 60, y: canvas.height / 2 + 20, width: 120, height: 40 };

function restart() {
  state.score = 0;
  state.lives = 3;
  blocks.splice(0, blocks.length, ...createBlocks());
  paddle.x = canvas.width / 2 - paddle.width / 2;
  state.phase = 'waiting';
  resetBallOnPaddle();
}

function isInsideRestartButton(x, y) {
  return (
    x >= restartButton.x &&
    x <= restartButton.x + restartButton.width &&
    y >= restartButton.y &&
    y <= restartButton.y + restartButton.height
  );
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

canvas.addEventListener('click', (e) => {
  if (state.phase === 'game-over' || state.phase === 'win') {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (isInsideRestartButton(clickX, clickY)) restart();
    return;
  }
  launch();
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

  checkBlockCollision();

  if (ball.y - ball.radius > canvas.height) {
    loseLife();
  }
}

function loseLife() {
  state.lives -= 1;
  if (state.lives <= 0) {
    state.phase = 'game-over';
  } else {
    state.phase = 'waiting';
    resetBallOnPaddle();
  }
}

function checkBlockCollision() {
  for (let row = 0; row < blocks.length; row++) {
    for (let col = 0; col < blocks[row].length; col++) {
      if (!blocks[row][col]) continue;

      const rect = blockRect(row, col);
      const closestX = clamp(ball.x, rect.x, rect.x + rect.width);
      const closestY = clamp(ball.y, rect.y, rect.y + rect.height);
      const dx = ball.x - closestX;
      const dy = ball.y - closestY;

      if (dx * dx + dy * dy <= ball.radius * ball.radius) {
        blocks[row][col] = null;
        state.score += 10;
        ball.dy = -ball.dy;
        playBreakSound();
        checkWin();
        return;
      }
    }
  }
}

function checkWin() {
  const cleared = blocks.every((row) => row.every((cell) => cell === null));
  if (cleared) state.phase = 'win';
}

function drawStartMessage() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Click or press a key to start', canvas.width / 2, canvas.height / 2);
}

function drawBlocks() {
  for (let row = 0; row < blocks.length; row++) {
    for (let col = 0; col < blocks[row].length; col++) {
      const color = blocks[row][col];
      if (!color) continue;
      const rect = blockRect(row, col);
      drawSprite(ctx, 'block_' + color, rect.x, rect.y, rect.width, rect.height);
    }
  }
}

function drawHud() {
  ctx.fillStyle = '#fff';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + state.score, 10, 20);
  ctx.textAlign = 'right';
  ctx.fillText('Lives: ' + state.lives, canvas.width - 10, 20);
}

function drawOverlay(title) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 30);

  ctx.fillStyle = '#444';
  ctx.fillRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);
  ctx.fillStyle = '#fff';
  ctx.font = '16px sans-serif';
  ctx.fillText('Restart', canvas.width / 2, restartButton.y + restartButton.height / 2 + 5);
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawBlocks();
  drawSprite(ctx, 'paddle', paddle.x, paddle.y, paddle.width, paddle.height);
  drawSprite(ctx, 'ball', ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
  drawHud();
  if (state.phase === 'waiting') drawStartMessage();
  if (state.phase === 'game-over') drawOverlay('Game Over');
  if (state.phase === 'win') drawOverlay('You Win!');
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

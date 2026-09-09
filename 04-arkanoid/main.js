const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function drawStartMessage() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Click or press a key to start', canvas.width / 2, canvas.height / 2);
}

function loop() {
  drawStartMessage();
  requestAnimationFrame(loop);
}

loadSpritesheet(() => {
  requestAnimationFrame(loop);
});

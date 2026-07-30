const canvas = document.getElementById('game-board');

if (canvas) {
  console.log('Infinite Arcade Pong initialized');

  const ctx = canvas.getContext('2d');
  const styles = getComputedStyle(document.documentElement);
  const COLOR_BG = styles.getPropertyValue('--color-bg').trim();
  const COLOR_NEON_GREEN = styles.getPropertyValue('--color-neon-green').trim();

  function drawCenterLine() {
    ctx.save();
    ctx.strokeStyle = COLOR_NEON_GREEN;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.restore();
  }

  function render() {
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawCenterLine();
  }

  function gameLoop() {
    render();
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
} else {
  console.error('Infinite Arcade Pong: canvas not found');
}

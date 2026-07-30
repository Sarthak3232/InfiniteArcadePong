const canvas = document.getElementById('game-board');

if (canvas) {
  console.log('Infinite Arcade Pong initialized');

  const ctx = canvas.getContext('2d');
  const styles = getComputedStyle(document.documentElement);
  const COLOR_BG = styles.getPropertyValue('--color-bg').trim();
  const COLOR_NEON_GREEN = styles.getPropertyValue('--color-neon-green').trim();
  const COLOR_BALL = styles.getPropertyValue('--color-ball').trim();

  const BALL_RADIUS = 7;
  const BALL_SPEED = 5;
  const BALL_MAX_ANGLE = Math.PI / 4; // 45 degrees off horizontal

  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
  };

  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    const angle = (Math.random() * 2 - 1) * BALL_MAX_ANGLE;
    const direction = Math.random() < 0.5 ? -1 : 1;
    ball.vx = direction * BALL_SPEED * Math.cos(angle);
    ball.vy = BALL_SPEED * Math.sin(angle);
  }

  function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
      ball.vy *= -1;
      ball.y = Math.min(Math.max(ball.y, ball.radius), canvas.height - ball.radius);
    }

    if (ball.x + ball.radius < 0 || ball.x - ball.radius > canvas.width) {
      resetBall();
    }
  }

  resetBall();

  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 70;
  const PADDLE_MARGIN = 20;

  const leftPaddle = {
    x: PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  };

  const rightPaddle = {
    x: canvas.width - PADDLE_MARGIN - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  };

  function drawPaddle(paddle) {
    ctx.save();
    ctx.strokeStyle = COLOR_NEON_GREEN;
    ctx.lineWidth = 2;
    ctx.shadowColor = COLOR_NEON_GREEN;
    ctx.shadowBlur = 8;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.restore();
  }

  function drawBall() {
    ctx.save();
    ctx.fillStyle = COLOR_BALL;
    ctx.shadowColor = COLOR_NEON_GREEN;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

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
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
  }

  function update() {
    updateBall();
  }

  function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
} else {
  console.error('Infinite Arcade Pong: canvas not found');
}

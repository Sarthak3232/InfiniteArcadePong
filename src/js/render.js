import { canvas, ctx, COLOR_BG, COLOR_NEON_GREEN, COLOR_BALL } from './canvas.js';
import { ball } from './ball.js';
import { leftPaddle, rightPaddle } from './paddles.js';

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

export function render() {
  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCenterLine();
  drawPaddle(leftPaddle);
  drawPaddle(rightPaddle);
  drawBall();
}

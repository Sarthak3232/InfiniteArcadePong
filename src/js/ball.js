import { canvas } from './canvas.js';
import { clamp } from './utils.js';
import { leftPaddle, rightPaddle } from './paddles.js';
import { getCurrentBallSpeed } from './difficulty.js';
import { awardPoint } from './score.js';

const BALL_RADIUS = 7;
const BALL_MAX_ANGLE = Math.PI / 4; // 45 degrees off horizontal
const MAX_BOUNCE_ANGLE = Math.PI / 4; // 45 degrees, edge of paddle vs center

export const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 0,
  vy: 0,
  radius: BALL_RADIUS,
};

export function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  const angle = (Math.random() * 2 - 1) * BALL_MAX_ANGLE;
  const direction = Math.random() < 0.5 ? -1 : 1;
  const speed = getCurrentBallSpeed();
  ball.vx = direction * speed * Math.cos(angle);
  ball.vy = speed * Math.sin(angle);
}

function ballHitsPaddle(paddle) {
  const closestX = clamp(ball.x, paddle.x, paddle.x + paddle.width);
  const closestY = clamp(ball.y, paddle.y, paddle.y + paddle.height);
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  return dx * dx + dy * dy <= ball.radius * ball.radius;
}

function reflectOffPaddle(paddle, direction) {
  const paddleCenterY = paddle.y + paddle.height / 2;
  const relativeIntersectY = (ball.y - paddleCenterY) / (paddle.height / 2);
  const bounceAngle = relativeIntersectY * MAX_BOUNCE_ANGLE;
  const speed = getCurrentBallSpeed();

  ball.vx = direction * speed * Math.cos(bounceAngle);
  ball.vy = speed * Math.sin(bounceAngle);
}

// Unfolds wall bounces to find the ball's y-position when it reaches targetX,
// used by the infinite AI tier's perfect-intercept tracking.
export function predictBallInterceptY(targetX) {
  if (ball.vx <= 0 || targetX <= ball.x) {
    return ball.y;
  }

  const timeToReach = (targetX - ball.x) / ball.vx;
  const rawY = ball.y + ball.vy * timeToReach;

  const minY = ball.radius;
  const maxY = canvas.height - ball.radius;
  const range = maxY - minY;
  if (range <= 0) {
    return clamp(rawY, minY, maxY);
  }

  let relative = (rawY - minY) % (2 * range);
  if (relative < 0) {
    relative += 2 * range;
  }
  if (relative > range) {
    relative = 2 * range - relative;
  }
  return minY + relative;
}

export function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
    ball.vy *= -1;
    ball.y = clamp(ball.y, ball.radius, canvas.height - ball.radius);
  }

  if (ball.vx < 0 && ballHitsPaddle(leftPaddle)) {
    reflectOffPaddle(leftPaddle, 1);
    ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
  } else if (ball.vx > 0 && ballHitsPaddle(rightPaddle)) {
    reflectOffPaddle(rightPaddle, -1);
    ball.x = rightPaddle.x - ball.radius;
  }

  if (ball.x + ball.radius < 0) {
    awardPoint('opponent');
    resetBall();
  } else if (ball.x - ball.radius > canvas.width) {
    awardPoint('player');
    resetBall();
  }
}

resetBall();

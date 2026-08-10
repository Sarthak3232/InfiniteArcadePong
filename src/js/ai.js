import { canvas } from './canvas.js';
import { clamp } from './utils.js';
import { rightPaddle } from './paddles.js';
import { ball, predictBallInterceptY } from './ball.js';
import { DIFFICULTY_PRESETS, getDifficulty } from './difficulty.js';

function setRightPaddleCenterY(centerY) {
  rightPaddle.y = clamp(centerY - rightPaddle.height / 2, 0, canvas.height - rightPaddle.height);
}

let previousBallVx = 0;
let aiErrorOffset = 0;

function refreshAiErrorOffset(errorMargin) {
  // Resample once per approach (when the ball starts heading toward the
  // opponent), not every frame, so the miss reads as a misjudgment
  // rather than jitter.
  if (ball.vx > 0 && previousBallVx <= 0) {
    aiErrorOffset = errorMargin === 0 ? 0 : (Math.random() * 2 - 1) * errorMargin;
  }
  previousBallVx = ball.vx;
}

const ballYHistory = [];

function getDelayedBallY(delayFrames) {
  ballYHistory.push(ball.y);
  const maxLength = delayFrames + 1;
  while (ballYHistory.length > maxLength) {
    ballYHistory.shift();
  }
  return ballYHistory[0];
}

export function updateRightPaddleAI() {
  const difficulty = getDifficulty();

  if (difficulty === 'unbeatable') {
    // Special-case tier: perfect prediction, zero delay, zero error,
    // snaps straight to the intercept instead of easing toward it.
    setRightPaddleCenterY(predictBallInterceptY(rightPaddle.x));
    return;
  }

  const preset = DIFFICULTY_PRESETS[difficulty];
  refreshAiErrorOffset(preset.errorMargin);
  const trackedBallY = getDelayedBallY(preset.reactionDelayFrames);
  const targetY = trackedBallY + aiErrorOffset;

  const paddleCenterY = rightPaddle.y + rightPaddle.height / 2;
  const diff = targetY - paddleCenterY;
  const move = clamp(diff, -preset.aiSpeed, preset.aiSpeed);
  rightPaddle.y = clamp(rightPaddle.y + move, 0, canvas.height - rightPaddle.height);
}

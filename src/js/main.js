import { updateBall } from './ball.js';
import { updateLeftPaddleFromKeyboard } from './controls.js';
import { updateRightPaddleAI } from './ai.js';
import { render } from './render.js';
import { tickSurvivalScore } from './score.js';

console.log('Infinite Arcade Pong initialized');

function update(dtSeconds) {
  updateLeftPaddleFromKeyboard();
  updateRightPaddleAI();
  updateBall();
  tickSurvivalScore(dtSeconds);
}

let lastTimestamp = null;

function gameLoop(timestamp) {
  const dtSeconds = lastTimestamp === null ? 0 : (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  update(dtSeconds);
  render();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

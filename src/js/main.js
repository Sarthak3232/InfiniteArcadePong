import { updateBall } from './ball.js';
import { updateLeftPaddleFromKeyboard } from './controls.js';
import { updateRightPaddleAI } from './ai.js';
import { render } from './render.js';

console.log('Infinite Arcade Pong initialized');

function update() {
  updateLeftPaddleFromKeyboard();
  updateRightPaddleAI();
  updateBall();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

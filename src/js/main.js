import { updateBall } from './ball.js';
import { updateLeftPaddleFromKeyboard } from './controls.js';
import { updateRightPaddleAI } from './ai.js';
import { render } from './render.js';
import { tickSurvivalScore } from './score.js';
import { isGamePlaying } from './screens.js';
import { refreshGameOverScores } from './gameOverScreen.js';
import { refreshSettingsActiveStates } from './settingsScreen.js';
import { updateStatusBar } from './statusBar.js';

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

  if (isGamePlaying()) {
    update(dtSeconds);
    render();
  }

  // Cheap to keep in sync every frame regardless of which screen is active.
  refreshGameOverScores();
  refreshSettingsActiveStates();
  updateStatusBar();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

import { getPlayerScore, resetScore } from './score.js';
import { resetBall, onPlayerMiss } from './ball.js';
import { checkAndUpdateHighscore } from './highscore.js';

const SCREENS = {
  game: $('#screen-game'),
  gameover: $('#screen-gameover'),
  settings: $('#screen-settings'),
};

let currentScreen = 'game';
let previousScreen = 'game';

function showOnly(name) {
  currentScreen = name;
  Object.entries(SCREENS).forEach(([screenName, $el]) => {
    $el.toggleClass('hidden', screenName !== name);
  });
}

export function isGamePlaying() {
  return currentScreen === 'game';
}

export function showGameScreen() {
  showOnly('game');
}

export function endGame() {
  checkAndUpdateHighscore(getPlayerScore());
  showOnly('gameover');
}

export function startNewGame() {
  resetScore();
  resetBall();
  showGameScreen();
}

export function openSettings() {
  previousScreen = currentScreen;
  showOnly('settings');
}

export function closeSettings() {
  showOnly(previousScreen);
}

onPlayerMiss(endGame);

// Debug hook until the gear icon lands: openSettings() from the console
window.openSettings = openSettings;

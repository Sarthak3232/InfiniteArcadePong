import { getPlayerScore } from './score.js';
import { getHighscore } from './highscore.js';
import { startNewGame } from './screens.js';

export function refreshGameOverScores() {
  $('#gameover-score').text(getPlayerScore());
  $('#gameover-highscore').text(getHighscore());
}

$('#play-btn').on('click', function () {
  startNewGame();
});

import { getPlayerScore } from './score.js';
import { getHighscore } from './highscore.js';
import { getControlScheme } from './controls.js';
import { getDifficulty } from './difficulty.js';

const CONTROL_LABELS = {
  mouse: 'Mouse',
  keyboard: 'Arrow Keys',
};

const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  infinite: 'Infinite',
};

export function updateStatusBar() {
  $('#score').text(`Score: ${getPlayerScore()}`);
  $('#highscore').text(`High Score: ${getHighscore()}`);
  $('#control').text(`Control: ${CONTROL_LABELS[getControlScheme()]}`);
  $('#difficulty').text(`Difficulty: ${DIFFICULTY_LABELS[getDifficulty()]}`);
}

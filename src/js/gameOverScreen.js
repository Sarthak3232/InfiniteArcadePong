import { getPlayerScore } from './score.js';
import { getHighscore } from './highscore.js';
import { startNewGame, openSettings } from './screens.js';

export function refreshGameOverScores() {
  $('#gameover-score').text(getPlayerScore());
  $('#gameover-highscore').text(getHighscore());
}

$('#play-btn').on('click', function () {
  startNewGame();
});

$('#gear-btn').on('click', function () {
  openSettings();
});

// Visual-only for now - real audio muting lands once sound effects exist (Day 6).
let muted = false;

export function isMuted() {
  return muted;
}

$('#mute-btn').on('click', function () {
  muted = !muted;
  $(this).toggleClass('muted', muted);
  console.log(`Muted: ${muted}`);
});

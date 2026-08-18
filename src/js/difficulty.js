export const DIFFICULTY_PRESETS = {
  easy: { ballSpeed: 3, aiSpeed: 1.2, reactionDelayFrames: 20, errorMargin: 60 },
  medium: { ballSpeed: 5, aiSpeed: 4.5, reactionDelayFrames: 6, errorMargin: 20 },
  hard: { ballSpeed: 8, aiSpeed: 14, reactionDelayFrames: 1, errorMargin: 3 },
};
export const INFINITE_BALL_SPEED = 11; // faster than hard, paired with perfect AI tracking
export const DIFFICULTIES = ['easy', 'medium', 'hard', 'infinite'];

let difficulty = 'medium';

export function getDifficulty() {
  return difficulty;
}

export function getCurrentBallSpeed() {
  return difficulty === 'infinite' ? INFINITE_BALL_SPEED : DIFFICULTY_PRESETS[difficulty].ballSpeed;
}

export function setDifficulty(level) {
  if (!DIFFICULTIES.includes(level)) {
    console.warn(`Unknown difficulty: ${level}`);
    return;
  }
  difficulty = level;
  console.log(`Difficulty set to: ${difficulty}`);
  chrome.storage.local.set({ difficulty: level });
}

// Debug hook until the Day 5 settings UI exists: setDifficulty('infinite') from the console
window.setDifficulty = setDifficulty;

chrome.storage.local.get(['difficulty'], function (result) {
  const stored = result.difficulty === 'unbeatable' ? 'infinite' : result.difficulty;
  difficulty = DIFFICULTIES.includes(stored) ? stored : 'medium';
  console.log(`Difficulty loaded: ${difficulty}`);

  if (stored !== result.difficulty) {
    chrome.storage.local.set({ difficulty: stored });
  }
});

let highscore = 0;

export function getHighscore() {
  return highscore;
}

chrome.storage.local.get(['highscore'], function (result) {
  highscore = typeof result.highscore === 'number' ? result.highscore : 0;
  console.log(`Highscore loaded: ${highscore}`);
});

export function checkAndUpdateHighscore(score) {
  if (score > highscore) {
    highscore = score;
    console.log(`New highscore: ${highscore}`);
    chrome.storage.local.set({ highscore });
    return true;
  }
  return false;
}

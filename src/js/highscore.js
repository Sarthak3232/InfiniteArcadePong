let highscore = 0;

export function getHighscore() {
  return highscore;
}

export function checkAndUpdateHighscore(score) {
  if (score > highscore) {
    highscore = score;
    console.log(`New highscore: ${highscore}`);
    return true;
  }
  return false;
}

import { getDifficulty } from './difficulty.js';

const SURVIVAL_POINTS_PER_SECOND = 2;

let playerScore = 0;
let opponentScore = 0;
let survivalScore = 0; // fractional accumulator backing playerScore in infinite mode

export function awardPoint(scoringSide) {
  if (getDifficulty() === 'infinite') {
    // Infinite mode scores via tickSurvivalScore() instead, so the classic
    // miss-based path doesn't apply here at all.
    return;
  }

  if (scoringSide === 'player') {
    playerScore++;
  } else {
    opponentScore++;
  }
  console.log(`Score - Player: ${playerScore}, Opponent: ${opponentScore}`);
}

export function tickSurvivalScore(dtSeconds) {
  if (getDifficulty() !== 'infinite') {
    return;
  }

  survivalScore += dtSeconds * SURVIVAL_POINTS_PER_SECOND;
  const flooredScore = Math.floor(survivalScore);
  if (flooredScore !== playerScore) {
    playerScore = flooredScore;
    console.log(`Score - Player: ${playerScore} (survival)`);
  }
}

export function getPlayerScore() {
  return playerScore;
}

export function resetScore() {
  playerScore = 0;
  opponentScore = 0;
  survivalScore = 0;
}

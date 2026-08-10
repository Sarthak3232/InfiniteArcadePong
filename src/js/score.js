let playerScore = 0;
let opponentScore = 0;

export function awardPoint(scoringSide) {
  if (scoringSide === 'player') {
    playerScore++;
  } else {
    opponentScore++;
  }
  console.log(`Score - Player: ${playerScore}, Opponent: ${opponentScore}`);
}

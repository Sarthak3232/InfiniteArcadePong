export const canvas = $('#game-board')[0];

if (!canvas) {
  console.error('Infinite Arcade Pong: canvas not found');
}

export const ctx = canvas.getContext('2d');

const styles = getComputedStyle(document.documentElement);
export const COLOR_BG = styles.getPropertyValue('--color-bg').trim();
export const COLOR_NEON_GREEN = styles.getPropertyValue('--color-neon-green').trim();
export const COLOR_BALL = styles.getPropertyValue('--color-ball').trim();

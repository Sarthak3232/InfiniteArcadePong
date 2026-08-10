import { canvas } from './canvas.js';

export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 70;
export const PADDLE_MARGIN = 20;

export const leftPaddle = {
  x: PADDLE_MARGIN,
  y: canvas.height / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};

export const rightPaddle = {
  x: canvas.width - PADDLE_MARGIN - PADDLE_WIDTH,
  y: canvas.height / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};

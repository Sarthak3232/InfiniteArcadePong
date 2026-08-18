import { canvas } from './canvas.js';
import { clamp } from './utils.js';
import { leftPaddle } from './paddles.js';

let controlScheme = 'mouse';

export function getControlScheme() {
  return controlScheme;
}

export function setControlScheme(scheme) {
  if (scheme !== 'mouse' && scheme !== 'keyboard') {
    console.warn(`Unknown control scheme: ${scheme}`);
    return;
  }
  controlScheme = scheme;
  console.log(`Control scheme set to: ${controlScheme}`);
  chrome.storage.local.set({ controlScheme: scheme });
}

// Debug hook until the Day 5 settings UI exists: setControlScheme('keyboard') from the console
window.setControlScheme = setControlScheme;

chrome.storage.local.get(['controlScheme'], function (result) {
  controlScheme = result.controlScheme === 'keyboard' ? 'keyboard' : 'mouse';
  console.log(`Control scheme loaded: ${controlScheme}`);
});

function setLeftPaddleCenterY(centerY) {
  leftPaddle.y = clamp(centerY - leftPaddle.height / 2, 0, canvas.height - leftPaddle.height);
}

$(canvas).on('mousemove', function (event) {
  if (controlScheme !== 'mouse') {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const scaleY = canvas.height / rect.height;
  const mouseY = (event.clientY - rect.top) * scaleY;
  setLeftPaddleCenterY(mouseY);
});

const PADDLE_KEY_SPEED = 6;
const heldKeys = {
  ArrowUp: false,
  ArrowDown: false,
};

$(document).on('keydown', function (event) {
  if (event.key in heldKeys) {
    heldKeys[event.key] = true;
  }
});

$(document).on('keyup', function (event) {
  if (event.key in heldKeys) {
    heldKeys[event.key] = false;
  }
});

export function updateLeftPaddleFromKeyboard() {
  if (controlScheme !== 'keyboard') {
    return;
  }
  if (heldKeys.ArrowUp) {
    leftPaddle.y -= PADDLE_KEY_SPEED;
  }
  if (heldKeys.ArrowDown) {
    leftPaddle.y += PADDLE_KEY_SPEED;
  }
  leftPaddle.y = clamp(leftPaddle.y, 0, canvas.height - leftPaddle.height);
}

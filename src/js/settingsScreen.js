import { setControlScheme, getControlScheme } from './controls.js';
import { setDifficulty, getDifficulty } from './difficulty.js';
import { resetScore } from './score.js';
import { closeSettings } from './screens.js';

export function refreshSettingsActiveStates() {
  $('.option-btn[data-control-scheme]').each(function () {
    $(this).toggleClass('active', $(this).data('control-scheme') === getControlScheme());
  });
  $('.option-btn[data-difficulty]').each(function () {
    $(this).toggleClass('active', $(this).data('difficulty') === getDifficulty());
  });
}

$('.option-btn[data-control-scheme]').on('click', function () {
  setControlScheme($(this).data('control-scheme'));
});

$('.option-btn[data-difficulty]').on('click', function () {
  setDifficulty($(this).data('difficulty'));
  resetScore();
});

$('#back-btn').on('click', function () {
  closeSettings();
});

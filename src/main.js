$(document).ready(function () {
  const canvas = $('#game-board')[0];

  if (canvas) {
    console.log('Infinite Arcade Pong initialized');

    const ctx = canvas.getContext('2d');
    const styles = getComputedStyle(document.documentElement);
    const COLOR_BG = styles.getPropertyValue('--color-bg').trim();
    const COLOR_NEON_GREEN = styles.getPropertyValue('--color-neon-green').trim();
    const COLOR_BALL = styles.getPropertyValue('--color-ball').trim();

    const BALL_RADIUS = 7;
    const BALL_SPEED = 5;
    const BALL_MAX_ANGLE = Math.PI / 4; // 45 degrees off horizontal

    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
    };

    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;

      const angle = (Math.random() * 2 - 1) * BALL_MAX_ANGLE;
      const direction = Math.random() < 0.5 ? -1 : 1;
      ball.vx = direction * BALL_SPEED * Math.cos(angle);
      ball.vy = BALL_SPEED * Math.sin(angle);
    }

    const MAX_BOUNCE_ANGLE = Math.PI / 4; // 45 degrees, edge of paddle vs center

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function ballHitsPaddle(paddle) {
      const closestX = clamp(ball.x, paddle.x, paddle.x + paddle.width);
      const closestY = clamp(ball.y, paddle.y, paddle.y + paddle.height);
      const dx = ball.x - closestX;
      const dy = ball.y - closestY;
      return dx * dx + dy * dy <= ball.radius * ball.radius;
    }

    function reflectOffPaddle(paddle, direction) {
      const paddleCenterY = paddle.y + paddle.height / 2;
      const relativeIntersectY = (ball.y - paddleCenterY) / (paddle.height / 2);
      const bounceAngle = relativeIntersectY * MAX_BOUNCE_ANGLE;
      const speed = Math.hypot(ball.vx, ball.vy) || BALL_SPEED;

      ball.vx = direction * speed * Math.cos(bounceAngle);
      ball.vy = speed * Math.sin(bounceAngle);
    }

    function updateBall() {
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.vy *= -1;
        ball.y = Math.min(Math.max(ball.y, ball.radius), canvas.height - ball.radius);
      }

      if (ball.vx < 0 && ballHitsPaddle(leftPaddle)) {
        reflectOffPaddle(leftPaddle, 1);
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
      } else if (ball.vx > 0 && ballHitsPaddle(rightPaddle)) {
        reflectOffPaddle(rightPaddle, -1);
        ball.x = rightPaddle.x - ball.radius;
      }

      if (ball.x + ball.radius < 0) {
        awardPoint('opponent');
        resetBall();
      } else if (ball.x - ball.radius > canvas.width) {
        awardPoint('player');
        resetBall();
      }
    }

    resetBall();

    let playerScore = 0;
    let opponentScore = 0;

    function awardPoint(scoringSide) {
      if (scoringSide === 'player') {
        playerScore++;
      } else {
        opponentScore++;
      }
      console.log(`Score - Player: ${playerScore}, Opponent: ${opponentScore}`);
    }

    const PADDLE_WIDTH = 10;
    const PADDLE_HEIGHT = 70;
    const PADDLE_MARGIN = 20;

    const leftPaddle = {
      x: PADDLE_MARGIN,
      y: canvas.height / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    };

    const rightPaddle = {
      x: canvas.width - PADDLE_MARGIN - PADDLE_WIDTH,
      y: canvas.height / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    };

    let controlScheme = 'mouse';

    function setControlScheme(scheme) {
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

    function updateLeftPaddleFromKeyboard() {
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

    const DIFFICULTY_PRESETS = {
      easy: { speed: 2.5, reactionDelayFrames: 14, errorMargin: 45 },
      medium: { speed: 4.5, reactionDelayFrames: 6, errorMargin: 20 },
      hard: { speed: 7, reactionDelayFrames: 1, errorMargin: 5 },
    };

    let difficulty = 'medium';

    function setRightPaddleCenterY(centerY) {
      rightPaddle.y = clamp(centerY - rightPaddle.height / 2, 0, canvas.height - rightPaddle.height);
    }

    // Unfolds wall bounces to find the ball's y-position when it reaches targetX,
    // used only by the unbeatable tier's perfect-intercept tracking.
    function predictBallInterceptY(targetX) {
      if (ball.vx <= 0 || targetX <= ball.x) {
        return ball.y;
      }

      const timeToReach = (targetX - ball.x) / ball.vx;
      const rawY = ball.y + ball.vy * timeToReach;

      const minY = ball.radius;
      const maxY = canvas.height - ball.radius;
      const range = maxY - minY;
      if (range <= 0) {
        return clamp(rawY, minY, maxY);
      }

      let relative = (rawY - minY) % (2 * range);
      if (relative < 0) {
        relative += 2 * range;
      }
      if (relative > range) {
        relative = 2 * range - relative;
      }
      return minY + relative;
    }

    let previousBallVx = 0;
    let aiErrorOffset = 0;

    function refreshAiErrorOffset(errorMargin) {
      // Resample once per approach (when the ball starts heading toward the
      // opponent), not every frame, so the miss reads as a misjudgment
      // rather than jitter.
      if (ball.vx > 0 && previousBallVx <= 0) {
        aiErrorOffset = errorMargin === 0 ? 0 : (Math.random() * 2 - 1) * errorMargin;
      }
      previousBallVx = ball.vx;
    }

    const ballYHistory = [];

    function getDelayedBallY(delayFrames) {
      ballYHistory.push(ball.y);
      const maxLength = delayFrames + 1;
      while (ballYHistory.length > maxLength) {
        ballYHistory.shift();
      }
      return ballYHistory[0];
    }

    function updateRightPaddleAI() {
      if (difficulty === 'unbeatable') {
        // Special-case tier: perfect prediction, zero delay, zero error,
        // snaps straight to the intercept instead of easing toward it.
        setRightPaddleCenterY(predictBallInterceptY(rightPaddle.x));
        return;
      }

      const preset = DIFFICULTY_PRESETS[difficulty];
      refreshAiErrorOffset(preset.errorMargin);
      const trackedBallY = getDelayedBallY(preset.reactionDelayFrames);
      const targetY = trackedBallY + aiErrorOffset;

      const paddleCenterY = rightPaddle.y + rightPaddle.height / 2;
      const diff = targetY - paddleCenterY;
      const move = clamp(diff, -preset.speed, preset.speed);
      rightPaddle.y = clamp(rightPaddle.y + move, 0, canvas.height - rightPaddle.height);
    }

    function drawPaddle(paddle) {
      ctx.save();
      ctx.strokeStyle = COLOR_NEON_GREEN;
      ctx.lineWidth = 2;
      ctx.shadowColor = COLOR_NEON_GREEN;
      ctx.shadowBlur = 8;
      ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.restore();
    }

    function drawBall() {
      ctx.save();
      ctx.fillStyle = COLOR_BALL;
      ctx.shadowColor = COLOR_NEON_GREEN;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawCenterLine() {
      ctx.save();
      ctx.strokeStyle = COLOR_NEON_GREEN;
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.restore();
    }

    function render() {
      ctx.fillStyle = COLOR_BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawCenterLine();
      drawPaddle(leftPaddle);
      drawPaddle(rightPaddle);
      drawBall();
    }

    function update() {
      updateLeftPaddleFromKeyboard();
      updateRightPaddleAI();
      updateBall();
    }

    function gameLoop() {
      update();
      render();
      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
  } else {
    console.error('Infinite Arcade Pong: canvas not found');
  }
});

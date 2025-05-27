document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("scoreDisplay");

  const TILE_SIZE = 20;
  const CANVAS_WIDTH_TILES = 20;
  const CANVAS_HEIGHT_TILES = 20;

  canvas.width = TILE_SIZE * CANVAS_WIDTH_TILES;
  canvas.height = TILE_SIZE * CANVAS_HEIGHT_TILES;

  const SNAKE_SPEED_MS = 120; // Lower is faster

  let snake = [
    { x: 10 * TILE_SIZE, y: 10 * TILE_SIZE }, // Start in the middle
  ];
  let food = getRandomFoodPosition();
  let score = 0;
  let dx = TILE_SIZE; // Initial direction: right
  let dy = 0;

  let gameInterval;
  let isGameOver = false;
  let gameStarted = false;

  function getRandomFoodPosition() {
    let newFoodPosition;
    while (true) {
      newFoodPosition = {
        x: Math.floor(Math.random() * CANVAS_WIDTH_TILES) * TILE_SIZE,
        y: Math.floor(Math.random() * CANVAS_HEIGHT_TILES) * TILE_SIZE,
      };
      // Ensure food doesn't spawn on the snake
      let collisionWithSnake = false;
      for (const segment of snake) {
        if (
          segment.x === newFoodPosition.x &&
          segment.y === newFoodPosition.y
        ) {
          collisionWithSnake = true;
          break;
        }
      }
      if (!collisionWithSnake) break;
    }
    return newFoodPosition;
  }

  function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "#444"; // Border for segments
    ctx.strokeRect(x, y, width, height);
  }

  function drawSnake() {
    snake.forEach((segment, index) => {
      drawRect(
        segment.x,
        segment.y,
        TILE_SIZE,
        TILE_SIZE,
        index === 0 ? "#2c5282" : "#38a169"
      ); // Dark blue head, green body
    });
  }

  function drawFood() {
    drawRect(food.x, food.y, TILE_SIZE, TILE_SIZE, "#e53e3e"); // Red food
  }

  function clearCanvas() {
    ctx.fillStyle = "#f7fafc"; // Light gray background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function updateScoreDisplay() {
    scoreDisplay.textContent = "Score: " + score;
  }

  function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Add new head

    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
      score++;
      updateScoreDisplay();
      food = getRandomFoodPosition();
      // Don't pop tail, snake grows
    } else {
      snake.pop(); // Remove tail
    }
  }

  function checkCollisions() {
    const head = snake[0];

    // Wall collision
    if (
      head.x < 0 ||
      head.x >= canvas.width ||
      head.y < 0 ||
      head.y >= canvas.height
    ) {
      isGameOver = true;
      return;
    }

    // Self-collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        isGameOver = true;
        return;
      }
    }
  }

  function displayGameOver() {
    clearInterval(gameInterval);
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = "24px Arial";
    ctx.fillText(
      "Final Score: " + score,
      canvas.width / 2,
      canvas.height / 2 + 15
    );

    ctx.font = "16px Arial";
    ctx.fillText(
      "Refresh to play again.",
      canvas.width / 2,
      canvas.height / 2 + 50
    );
  }

  function gameTick() {
    if (isGameOver) {
      displayGameOver();
      return;
    }

    clearCanvas();
    moveSnake();
    checkCollisions(); // Check collisions after moving

    // If collision occurred, isGameOver will be true, and next tick will handle it
    if (!isGameOver) {
      drawFood();
      drawSnake();
    } else {
      displayGameOver(); // Display immediately if game over this tick
    }
  }

  document.addEventListener("keydown", (event) => {
    if (!gameStarted) {
      gameStarted = true;
      gameInterval = setInterval(gameTick, SNAKE_SPEED_MS);
      // Hide initial instructions
      const instructionsElement = document.querySelector(".instructions");
      if (instructionsElement) instructionsElement.style.display = "none";
    }

    if (isGameOver) return;

    const keyPressed = event.key;
    const goingUp = dy === -TILE_SIZE;
    const goingDown = dy === TILE_SIZE;
    const goingLeft = dx === -TILE_SIZE;
    const goingRight = dx === TILE_SIZE;

    // Allow WASD or Arrow Keys
    if (
      (keyPressed === "ArrowUp" || keyPressed.toLowerCase() === "w") &&
      !goingDown
    ) {
      dx = 0;
      dy = -TILE_SIZE;
    } else if (
      (keyPressed === "ArrowDown" || keyPressed.toLowerCase() === "s") &&
      !goingUp
    ) {
      dx = 0;
      dy = TILE_SIZE;
    } else if (
      (keyPressed === "ArrowLeft" || keyPressed.toLowerCase() === "a") &&
      !goingRight
    ) {
      dx = -TILE_SIZE;
      dy = 0;
    } else if (
      (keyPressed === "ArrowRight" || keyPressed.toLowerCase() === "d") &&
      !goingLeft
    ) {
      dx = TILE_SIZE;
      dy = 0;
    }
  });

  // Initial render before game starts
  clearCanvas();
  drawSnake();
  drawFood();
  updateScoreDisplay();
});

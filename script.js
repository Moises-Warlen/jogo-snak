// Captura os elementos principais do HTML
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');

// Variáveis do jogo
let snake = [{ x: 200, y: 200 }];
let fruit = { x: 100, y: 100 };
let direction = 'right';
let interval;
let score = 0;

// Modal de Game Over
const modal = document.getElementById('gameOverModal');
const finalScore = document.getElementById('finalScore');
const closeModalButton = document.getElementById('closeModal');

// Função para desenhar a cobrinha
function drawSnake() {
  // Remove segmentos anteriores
  document.querySelectorAll('.snakeSegment').forEach(seg => seg.remove());

  // Cria e posiciona cada segmento da cobra
  snake.forEach(segment => {
    const div = document.createElement('div');
    div.classList.add('snakeSegment');
    div.style.left = segment.x + 'px';
    div.style.top = segment.y + 'px';
    gameArea.appendChild(div);
  });
}

// Função para desenhar a fruta
function drawFruit() {
  let fruitEl = document.getElementById('fruit');

  // Se ainda não existir, cria o elemento da fruta
  if (!fruitEl) {
    fruitEl = document.createElement('div');
    fruitEl.id = 'fruit';
    gameArea.appendChild(fruitEl);
  }

  // Posiciona a fruta no local atual
  fruitEl.style.left = fruit.x + 'px';
  fruitEl.style.top = fruit.y + 'px';
}

// Função para mover a cobrinha
function moveSnake() {
  // Cria nova cabeça com base na direção
  const head = { ...snake[0] };

  if (direction === 'right') head.x += 20;
  if (direction === 'left') head.x -= 20;
  if (direction === 'up') head.y -= 20;
  if (direction === 'down') head.y += 20;

  // Adiciona a nova cabeça
  snake.unshift(head);

  // Verifica se a fruta foi comida
  if (head.x === fruit.x && head.y === fruit.y) {
    score += 10; // Aumenta a pontuação
    scoreDisplay.textContent = 'Pontos: ' + score;

    // Efeito de "pop" na fruta
    const fruitEl = document.getElementById('fruit');
    fruitEl.classList.add('pop');
    setTimeout(() => fruitEl.classList.remove('pop'), 200);

    generateFruit(); // Gera uma nova fruta
  } else {
    snake.pop(); // Se não comeu, remove o último segmento
  }

  // Verifica colisões com a borda ou o corpo da cobra
  if (checkCollision()) {
    clearInterval(interval);
    showGameOver(); // Exibe a tela de Game Over
  }

  // Redesenha a cobrinha e a fruta
  drawSnake();
  drawFruit();
}

// Gera uma nova fruta em uma posição aleatória
function generateFruit() {
  fruit.x = Math.floor(Math.random() * 20) * 20;
  fruit.y = Math.floor(Math.random() * 20) * 20;
}

// Verifica colisões com borda ou corpo
function checkCollision() {
  const head = snake[0];

  // Colisão com as bordas do jogo
  if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) return true;

  // Colisão com o corpo
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) return true;
  }

  return false;
}

// Muda a direção quando uma tecla é pressionada
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

// Exibe a modal de Game Over
function showGameOver() {
  finalScore.textContent = score; // Mostra a pontuação final
  modal.style.display = 'flex'; // Exibe a modal
}

// Fecha a modal
closeModalButton.addEventListener('click', () => {
  modal.style.display = 'none';
  startGame(); // Reinicia o jogo
});

// Função para iniciar o jogo
function startGame() {
  snake = [{ x: 200, y: 200 }];
  direction = 'right';
  score = 0;
  scoreDisplay.textContent = 'Pontos: 0';
  generateFruit();
  interval = setInterval(moveSnake, 300); // Controla a velocidade
}

// Configura o botão de início
startButton.addEventListener('click', () => {
  startButton.style.display = 'none'; // Esconde o botão após iniciar
  startGame();
});

// Configurações do jogo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRAVITY = 0.6;
const FLAP = -6;
const SPAWN_RATE = 90; // A cada 90 quadros, gerar um novo cano

let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    velocity: 0,
    jump() {
        this.velocity = FLAP;
    },
    update() {
        this.velocity += GRAVITY;
        this.y += this.velocity;

        // Impedir que o pássaro saia da tela para cima e para baixo
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
    },
    draw() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

let pipes = [];
let score = 0;
let gameOver = false;

// Configurações do canvas
canvas.width = 400;
canvas.height = 600;

// Função para criar novos canos
function createPipe() {
    const gap = 150; // Espaço entre os canos
    const pipeHeight = Math.floor(Math.random() * (canvas.height - gap));
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: pipeHeight + gap,
        width: 50,
        passed: false
    });
}

// Função para atualizar a posição dos canos
function updatePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        let pipe = pipes[i];
        pipe.x -= 2;

        if (pipe.x + pipe.width < 0) {
            pipes.splice(i, 1);
        }

        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            score++;
        }
    }
}

// Função para desenhar os canos
function drawPipes() {
    for (let pipe of pipes) {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top); // Canos superiores
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom); // Canos inferiores
    }
}

// Função para desenhar o placar
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 20, 40);
}

// Função de game over
function gameOverScreen() {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over!", 120, 250);
    ctx.font = "20px Arial";
    ctx.fillText("Pressione F5 para jogar novamente", 100, 300);
}

// Função principal do jogo
function gameLoop() {
    if (gameOver) {
        gameOverScreen();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.update();
    bird.draw();

    updatePipes();
    drawPipes();
    drawScore();

    // Criar canos periodicamente
    if (Math.random() < 1 / SPAWN_RATE) {
        createPipe();
    }

    // Checar colisões
    for (let pipe of pipes) {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)) {
            gameOver = true;
        }
    }

    requestAnimationFrame(gameLoop);
}

// Iniciar o jogo
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !gameOver) {
        bird.jump();
    }
});

gameLoop();

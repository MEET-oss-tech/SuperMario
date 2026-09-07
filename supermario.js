// Accessing assets

let game_container = document.querySelector(".game-container");
let score = document.querySelector(".score h1");
let pipe = document.querySelector(".obstacle");
let mario = document.querySelector(".mario");

let gameContainerWidth = game_container.offsetWidth;

let isJumping = false;
let isMovingLeft = false;
let isMovingRight = false;
let gameScore = 0;

let marioPosition = 0;
let gameEnded = false;


// Jump
function jump() {

    if (isJumping || gameEnded) return;

    isJumping = true;

    let startPosition = 58;
    let endPosition = 358;
    let velocity = 12;

    let jumpInterval = setInterval(() => {

        if (startPosition <= endPosition) {

            startPosition += velocity;

            mario.style.bottom = startPosition + "px";

        } else {

            clearInterval(jumpInterval);

            fall();

            isJumping = false;
        }

    }, 20);
}


// fall

function fall() {

    let startPosition = 358;
    let endPosition = 58;
    let velocity = 12;

    let fallInterval = setInterval(() => {

        if (startPosition > endPosition) {

            startPosition -= velocity;

            mario.style.bottom = startPosition + "px";

        } else {

            mario.style.bottom = endPosition + "px";

            clearInterval(fallInterval);
        }

    }, 20);
}


// Move Mario Player

function moveMario(direction) {

    if (gameEnded) return;

    let movement = 20;
    let position;

    if (direction === "right") {

        position = marioPosition + movement;

        mario.classList.remove("flipped");

    } else {

        position = marioPosition - movement;

        mario.classList.add("flipped");
    }

    let maxPosition = gameContainerWidth - mario.offsetWidth;

    if (position >= 0 && position <= maxPosition) {

        marioPosition = position;

        mario.style.left = marioPosition + "px";
    }
}


// Move Obstacle

function moveObstacle() {

    let obstaclePosition = gameContainerWidth + 50;

    pipe.style.left = obstaclePosition + "px";

    let movement = 10;

    let obstacleInterval = setInterval(() => {

        if (checkCollision(obstaclePosition)) {

            clearInterval(obstacleInterval);

            gameOver();

            return;
        }

        pipe.style.display = "block";

        obstaclePosition -= movement;

        pipe.style.left = obstaclePosition + "px";


        // Pipe Reset Logic

        if (obstaclePosition <= -100) {

            obstaclePosition =
                gameContainerWidth + Math.random() * 500 + 20;

            pipe.style.left = obstaclePosition + "px";

            gameScore++;

            score.textContent = `Score : ${gameScore}`;
        }

    }, 20);
}


// Collision Condition

function checkCollision(obstaclePosition) {

    let marioLeft = mario.getBoundingClientRect().left;
    let marioRight = mario.getBoundingClientRect().right;

    let marioTop = mario.getBoundingClientRect().top;
    let marioBottom = mario.getBoundingClientRect().bottom;

    let pipeLeft = pipe.getBoundingClientRect().left;
    let pipeRight = pipe.getBoundingClientRect().right;

    let pipeTop = pipe.getBoundingClientRect().top;
    let pipeBottom = pipe.getBoundingClientRect().bottom;

    let xCollision =
        marioRight >= pipeLeft &&
        marioLeft <= pipeRight;

    let yCollision =
        marioBottom >= pipeTop &&
        marioTop <= pipeBottom;

    return xCollision && yCollision;
}


// Game Over

function gameOver() {

    gameEnded = true;

    pipe.style.display = "none";

    score.textContent =
        `Game Over! Final Score: ${gameScore}`;

    score.classList.add("game-over");
}


// Window Events

window.addEventListener("keydown", (e) => {

    switch (e.key) {

        case " ":
            e.preventDefault();
            jump();
            break;

        case "ArrowLeft":
        case "a":
        case "A":
            moveMario("left");
            break;

        case "ArrowRight":
        case "d":
        case "D":
            moveMario("right");
            break;
    }
});


setTimeout(() => {
    moveObstacle();
}, 1000);

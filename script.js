const colors = ["red", "green", "blue", "yellow"];
let gameSequence = [];
let playerSequence = [];
let score = 0;
let playerTurn = false;

const redButton = document.getElementById("red");
const greenButton = document.getElementById("green");
const blueButton = document.getElementById("blue");
const yellowButton = document.getElementById("yellow");
const startButton = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");

const buttons = {
    red: redButton,
    green: greenButton,
    blue: blueButton,
    yellow: yellowButton,
};

function nextSequence() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);
    playerSequence = [];
    playSequence();
}


function playSequence() {
    playerTurn = false;
    setButtonsInactive(true); 
    let delay = 700;

    gameSequence.forEach((color, index) => {
        setTimeout(() => {
            flashButton(color);
        }, delay * (index + 1));
    });

    setTimeout(() => {
        playerTurn = true;
        setButtonsInactive(false); 
    }, delay * (gameSequence.length + 1));
}

function flashButton(color) {
    const button = buttons[color];
    button.classList.add("active");
    setTimeout(() => {
        button.classList.remove("active");
    }, 500); 
}

function setButtonsInactive(state) {
    Object.values(buttons).forEach(button => {
        if (state) {
            button.classList.add("inactive");
        } else {
            button.classList.remove("inactive");
        }
    });
}

function checkPlayerSequence() {
    const currentMove = playerSequence.length - 1;

    if (playerSequence[currentMove] !== gameSequence[currentMove]) {
        resetGame();
        return;
    }

    if (playerSequence.length === gameSequence.length) {
        score++;
        updateScore();
        setTimeout(() => {
            nextSequence();
        }, 1000);
    }
}

function startGame() {
    score = 0;
    gameSequence = [];
    playerSequence = [];
    updateScore();
    nextSequence();
}

function resetGame() {
    alert("Você errou! Tente novamente.");
    score = 0;
    gameSequence = [];
    playerSequence = [];
    playerTurn = false;
    updateScore();
}

function updateScore() {
    scoreDisplay.innerText = `Pontuação: ${score}`;
}

document.querySelectorAll(".color-button").forEach(button => {
    button.addEventListener("click", (e) => {
        if (!playerTurn) return;

        const clickedColor = e.target.id;
        playerSequence.push(clickedColor);
        flashButton(clickedColor);
        checkPlayerSequence();
    });
});

startButton.addEventListener("click", startGame);

function showErrorMessage() {
    const message = document.createElement('div');
    message.id = 'error-message';
    message.innerText = "Você errou! Tente novamente.";
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 3000);  
}


function resetGame() {
    showErrorMessage();  
    score = 0;
    gameSequence = [];
    playerSequence = [];
    playerTurn = false;
    updateScore();
}



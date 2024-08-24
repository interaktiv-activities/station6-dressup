// The following variables below are all the sound variables and mute/unmute functions 
let backgroundMusic = new Audio();
backgroundMusic.src = "sounds/bg-music.mp3";
let backgroundMusicStatus = 0;
let backgroundMusicInterval;

function playBackgroundMusic() {
    backgroundMusic.play();
    if (backgroundMusicStatus == 1) {
        backgroundMusic.volume = 0;
    } else {
        backgroundMusic.volume = 0.5;
    }
}

function muteBackgroundMusic() {
    const muteBtnImg = document.getElementById("mute-btn-img");
    if (backgroundMusicStatus == 0) {
        muteBtnImg.setAttribute("src", "assets/header/mute.png");
        backgroundMusic.volume = 0;
        backgroundMusicStatus++;
    } else {
        muteBtnImg.setAttribute("src", "assets/header/unmute.png");
        backgroundMusic.volume = 0.5;
        backgroundMusicStatus--;
    }
}

document.getElementById("mute-header-btn").addEventListener("click", muteBackgroundMusic);
// END HERE

// Card Slot and Swipe Handling
const cardSlot = document.querySelector('.card-slot');
const swipeCard = document.getElementById('swipe-card');
let startX = 0;
let currentX = 0;
let isSwiping = false;
let cardSlotWidth = cardSlot.offsetWidth; 

// Event Listeners for Swipe Actions
swipeCard.addEventListener('mousedown', startSwipe);
swipeCard.addEventListener('touchstart', startSwipe);
swipeCard.addEventListener('mousemove', swipeMove);
window.addEventListener('touchmove', swipeMove);
window.addEventListener('mouseup', endSwipe);
swipeCard.addEventListener('touchend', endSwipe);
window.addEventListener('resize', updateCardSlotWidth);

// Swipe Functions
function updateCardSlotWidth() {
    cardSlotWidth = cardSlot.offsetWidth;
}

function startSwipe(event) {
    isSwiping = true;
    startX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
}

function swipeMove(event) {
    if (!isSwiping) return;

    currentX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    const deltaX = currentX - startX;

    if (deltaX > 1) {
        swipeCard.style.transform = `translateX(${deltaX}px)`;
    }

    if (Math.abs(deltaX) > (cardSlotWidth/1.3) && isSwiping == true) {
        isSwiping = false;
        startCardInterval();
    }
    
}

function endSwipe() {
    if (isSwiping) {
        isSwiping = false;
        swipeCard.style.transform = 'translateX(0)';
    }
}

// END HERE

// The following lines of code include all of the functions and variables needed for you to transition from the start screen to the game board
let startScreenTimer;
let timer;
let timeRemaining = 20;

function startCardInterval() {
    hideStartScreen();
    randomizeOutfits();
    updatePrompt(); // Ensure the prompt is updated when the game starts
}

function hideStartScreen() {
    document.getElementById("start-screen").style.display = "none";
    playBackgroundMusic();
    backgroundMusicInterval = setInterval(playBackgroundMusic, 120000);
    clearInterval(startScreenTimer);
}
// END HERE

// The following lines of code hide all the header and gameboard elements, and show the end message
function endGame() {
    document.getElementById("game-board").style.display = "none";
    document.getElementById("header").style.display = "none";
    clearInterval(timer);
    clearInterval(backgroundMusicInterval);
    backgroundMusic.volume = 0;
    backgroundMusicStatus = 1;
    if (scoreCounter >= 7) {
        document.getElementById("pass-end-screen").style.display = "flex";
    } else {
        document.getElementById("fail-end-screen").style.display = "flex";
    }
}
// END HERE

// QUESTION BANK

const rounds = 10;
let currentRound = 1;
let scoreCounter = 0;

const leftBtnGrp = document.getElementById('left-btn-grp');
const rightBtnGrp = document.getElementById('right-btn-grp');

function getOutfitPaths(round, isCorrect) {
    const prefix = `game assets/${round}-`;
    const suffix = isCorrect ? 'n' : 'a';
    return [
        `${prefix}${suffix}-1.png`,
        `${prefix}${suffix}-2.png`,
        `${prefix}${suffix}-3.png`
    ];
}

function randomizeOutfits() {
    resetTimer();
    const isCorrectOnLeft = Math.random() < 0.5;

    const correctOutfitPaths = getOutfitPaths(currentRound, true);
    const wrongOutfitPaths = getOutfitPaths(currentRound, false);

    if (isCorrectOnLeft) {
        displayOutfit(leftBtnGrp, correctOutfitPaths);
        displayOutfit(rightBtnGrp, wrongOutfitPaths);

        leftBtnGrp.onclick = handleCorrectSelection;
        rightBtnGrp.onclick = handleIncorrectSelection;
    } else {
        displayOutfit(leftBtnGrp, wrongOutfitPaths);
        displayOutfit(rightBtnGrp, correctOutfitPaths);

        leftBtnGrp.onclick = handleIncorrectSelection;
        rightBtnGrp.onclick = handleCorrectSelection;
    }
}

function displayOutfit(buttonGroup, outfitPaths) {
    const images = buttonGroup.getElementsByClassName('game-btn-img');
    for (let i = 0; i < images.length; i++) {
        images[i].src = outfitPaths[i];
    }
}

function handleCorrectSelection() {
    const gameBoard = document.getElementById("game-btn-grp");

    gameBoard.classList.add('fade-out');

    setTimeout(() => {
        scoreCounter++;
        document.getElementById("game-level-score").innerText = "SCORE: " + scoreCounter;
        if (currentRound < rounds) {
            currentRound++;
            randomizeOutfits();
            resetTimer();
            updatePrompt(); // Update the prompt on correct selection
            gameBoard.classList.remove('fade-out');
            gameBoard.classList.add('fade-in');

            setTimeout(() => {
                gameBoard.classList.remove('fade-in');
            }, 500);
        } else {
            endGame();
        }
    }, 500);
}

function handleIncorrectSelection() {
    const gameBoard = document.getElementById("game-btn-grp");

    gameBoard.classList.add('fade-out');

    setTimeout(() => {
        if (currentRound < rounds) {
            currentRound++;
            randomizeOutfits();
            resetTimer();
            updatePrompt(); // Update the prompt on incorrect selection
            gameBoard.classList.remove('fade-out');
            gameBoard.classList.add('fade-in');

            setTimeout(() => {
                gameBoard.classList.remove('fade-in');
            }, 500);
        } else {
            endGame();
        }
    }, 500);
}

function resetTimer() {
    clearInterval(timer); 
    timeRemaining = 20;    
    document.getElementById("game-level-time").innerText = "TIME: " + timeRemaining;
    startTimer();         
}

function startTimer() {
    timer = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            document.getElementById("game-level-time").innerText = "TIME: " + timeRemaining;
        } else {
            clearInterval(timer);
            alert("Time's up! Moving to the next round.");
            nextRound();
        }
    }, 1000);
}

function nextRound() {
    if (currentRound < rounds) {
        currentRound++;
        randomizeOutfits();
        resetTimer();
        updatePrompt();  // Update the prompt for the new round
    } else {
        endGame();
    }
}

const prompts = [
    "General Dress Code",
    "General Dress Code",
    "General Dress Code",
    "General Dress Code",
    "SHRM Attire",
    "SHRM Attire",
    "Extraordinary Mondays",
    "Extraordinary Mondays",
    "Extraordinary Mondays",
    "Extraordinary Mondays"
];

function updatePrompt() {
    console.log("Updating prompt for round: " + currentRound); // Debugging line
    if (currentRound <= prompts.length) {
        document.getElementById("level-prompt").innerText = prompts[currentRound - 1];
    } else {
        document.getElementById("level-prompt").innerText = "No more prompts available.";
    }
}

// GAME FUNCTIONS PROPER

function startGame() {
    hideStartScreen();
    updatePrompt(); // Update the prompt when the game starts
}

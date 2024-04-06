const boxes = Array.from(document.querySelectorAll("#memory-game, #form, #info, #teams"));
const scoreTexts = Array.from(document.getElementsByClassName("score"));
const scoreTextRed = scoreTexts[0]
const scoreTextBlue = scoreTexts[1]
const winTitle = Array.from(document.querySelectorAll("#win-screen .title"))[0];
const container = Array.from(document.getElementsByClassName("container-multiplayer"))[0]

const FIRST_TURN = "red"

let scoreRed = 0;
let scoreBlue = 0;
let gameTurn = FIRST_TURN


function checkForMatch() {
    let isMatch = firstCard.dataset.content === secondCard.dataset.content;

    if (isMatch) {
        disableCards();
        cardsLeft -= 2;
        cardsLeftText.innerHTML = cardsLeft;
        switch (gameTurn) {
            case "red":
                scoreRed += POINTS_PER_CORRECT_ANSWER
                scoreTextRed.innerHTML = scoreRed
                break;
            case "blue":
                scoreBlue += POINTS_PER_CORRECT_ANSWER
                scoreTextBlue.innerHTML = scoreBlue
                break;
        }

        checkWin();
        resetBoard();
    } else {
        unflipCards();
    }
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
    const lastGameTurn = gameTurn
    gameTurn = lastGameTurn === "red" ? "blue" : "red"
    boxes.forEach((box) => {
        box.classList.remove(lastGameTurn)
        box.classList.add(gameTurn)
    })
}

function checkWin() {
    if (cardsLeft <= 0) {
        isGameStopped = true;
        displayWinningScreen()
    }
}

function displayWinningScreen() {
    if (scoreRed === scoreBlue) {
        winTitle.innerHTML = "TIE"
    } else if (scoreRed > scoreBlue) {
        winTitle.innerHTML = "TEAM RED WON"
    } else if (scoreRed < scoreBlue) {
        winTitle.innerHTML = "TEAM BLUE WON"
    }
    
    winScreen.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

boxes.forEach((box) => {
    box.classList.add(FIRST_TURN)
})

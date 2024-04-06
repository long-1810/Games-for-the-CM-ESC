const cardList = document.getElementById("memory-game");
const cardsLeftText = document.getElementById("cards-left");
const timeElapsedText = document.getElementById("time-elapsed");
const roundText = document.getElementById("round");
const winScreen = document.getElementById("win-screen");
const overlay = document.getElementById("overlay");
const resetButton = document.getElementById("reset");

const NUMBER_OF_CARDS = 16;
const POINTS_PER_CORRECT_ANSWER = 2;
const CARD_SHOW_UP_DURATION = 500;
const imageCardURL = "../img/esc-logo.jpg"
const wordListURL = "../words.json"

let TIME_START = Date.now();
let timePassed = 0;
let round = 1;
let cardsLeft = NUMBER_OF_CARDS;
let isGameStopped = false;

let words;
let cards;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function calculateTimeElapsed() {
  const TIME_NOW = Date.now();
  let elapsed = TIME_NOW - TIME_START;
  return Math.floor(elapsed / 1000);
}

async function importWords() {
  const res = await fetch(wordListURL);
  const json_data = await res.json();

  words = chooseRandomSet(json_data, NUMBER_OF_CARDS);
}

function chooseRandomSet(setList, quantity) {
  let wordsObj = {};

  while (Object.keys(wordsObj).length < quantity / 2) {
    const keys = Object.keys(setList)
    const randomIndex = (keys.length * Math.random()) << 0;
    const setName = keys[randomIndex];
    const setContent = setList[setName];

    wordsObj = {
      ...wordsObj,
      [setName]: setContent,
    };
  }
  return wordsObj;
}

function generateCards(quantity) {
  const wordArray = Object.keys(words).map((key) => [key, words[key]]);

  for (let i = 0; i < quantity / 2; i++) {
    const wordSet = wordArray[i][1];
    const wordSetName = wordArray[i][0];
    const [firstWord, secondWord] = wordSet;

    const firstCard = `<div class="memory-card" data-content="${wordSetName}"><div class="front-face"><p class="front-face--text">${firstWord}</p></div><img class="back-face" src=${imageCardURL} alt="Memory Card"></div>`;
    const secondCard = `<div class="memory-card" data-content="${wordSetName}"><div class="front-face"><p class="front-face--text">${secondWord}</p></div><img class="back-face" src=${imageCardURL} alt="Memory Card"></div>`;
    cardList.innerHTML += firstCard;
    cardList.innerHTML += secondCard;
  }
  cards = document.querySelectorAll(".memory-card");
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.content === secondCard.dataset.content;
  if (isMatch) {
    disableCards();
    cardsLeft -= 2;
    cardsLeftText.innerHTML = cardsLeft;
    checkWin();
    resetBoard();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, CARD_SHOW_UP_DURATION);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}

function displayWinningScreen() {
  winScreen.classList.remove("hidden");
  overlay.classList.remove("hidden");
}



async function resetGame() {
  cardList.innerHTML = "";

  // OPTIONAL: if you want to count time elapsed for each round only
  // TIME_START = Date.now();

  cardsLeft = NUMBER_OF_CARDS;
  round += 1;

  winScreen.classList.add("hidden");
  overlay.classList.add("hidden");
  isGameStopped = false;
  scoreRed = 0
  scoreBlue = 0
  scoreTextRed.innerText = scoreRed
  scoreTextBlue.innterText = scoreBlue

  main();
}

async function main() {
  await importWords();
  generateCards(NUMBER_OF_CARDS);
  shuffle();
  cards.forEach((card) => card.addEventListener("click", flipCard));
  resetButton.addEventListener("click", resetGame);
  // winScreen.classList.add("hidden")
  // overlay.classList.add("hidden")

  cardsLeftText.innerHTML = cardsLeft;
  roundText.innerHTML = round;

  // Time elapsed
  setInterval(() => {
    timePassed = !isGameStopped ? calculateTimeElapsed() : timePassed;
    timeElapsedText.innerHTML = timePassed;
  }, 1000);
}

main();

const scoreTexts = Array.from(document.getElementsByClassName("score"))[0];
let score = 0;

function checkForMatch() {
  let isMatch = firstCard.dataset.content === secondCard.dataset.content;
  if (isMatch) {
    disableCards();
    cardsLeft -= 2;
    cardsLeftText.innerHTML = cardsLeft;
    score += POINTS_PER_CORRECT_ANSWER
    scoreTexts.innerHTML = score;
    resetBoard()
    checkWin();
  } else {
    unflipCards();
  }
}
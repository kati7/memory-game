/*
 * Create a list that holds all of your cards
 */
const cards = [
    'fa fa-diamond', 'fa fa-diamond',
    'fa fa-paper-plane-o','fa fa-paper-plane-o',
    'fa fa-anchor', 'fa fa-anchor',
    'fa fa-bolt', 'fa fa-bolt',
    'fa fa-cube', 'fa fa-cube',
    'fa fa-leaf', 'fa fa-leaf',
    'fa fa-bicycle', 'fa fa-bicycle',
    'fa fa-bomb', 'fa fa-bomb',
];
const noOfPairs = cards.length / 2;

const deck = document.querySelector('.deck');

const movesElement = document.querySelector('.moves');

const starsList = document.querySelector('.stars');
const initialNoOfStars =starsList.childElementCount;

const restart = document.querySelector('.restart');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function addCardsToTheList(cards) {
    const fragment = document.createDocumentFragment();
    for (const card of cards) {
        const cardElement = createCard(card);
        fragment.appendChild(cardElement);
    }
    deck.appendChild(fragment);
}

function createCard(card) {
    const cardElement = document.createElement('li');
    cardElement.className = 'card';
    cardElement.innerHTML = `<i class="${card}"></i>`;
    return cardElement;
}

function createCards() {
    shuffle(cards);
    addCardsToTheList(cards);
}

createCards();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let openCardsList = [];
const initialNoOfMoves = parseInt(movesElement.textContent);
let movesLeft = initialNoOfMoves;
const movesPerStar = initialNoOfMoves / initialNoOfStars;
let starsLeft = initialNoOfStars;
let starsIndex = 0;
let deckOnClickFunction = null;
let matchingPairs = 0;

deck.addEventListener('click', deckOnClickFunction = handleCardClick());

function handleCardClick() {
    return function (evt) {
        if (evt.target.nodeName === 'LI') {
            const card = evt.target;
            if (isCardClosed(card)) {
                showCard(card);
                if (isFirstClickedCardInPair()) {
                    addToOpenCardsList(card);
                } else if (isNotTheSameOpenCardClicked(card)) {
                    decreaseMovesCounter();
                    
                    checkPairMatchingConditions(card);
                    
                    handleStarsRemoval();
                    handleEndOfGame();
                }
            }
        }
    };
}

function isNotTheSameOpenCardClicked(card) {
    const firstCard = openCardsList[0];
    return firstCard != card;
}

function handleEndOfGame() {
    if (matchingPairs == noOfPairs) {
        stopTimer();
        displayWinningMessage();
    } else if (noMoreMovesLeft()) {
        disableClickingOnCards();
        changeCardsCursorToDefault();
        displayLosingMessage();
    }
}

function displayLosingMessage() {
    losingModal.style.display = 'block';
}

function displayWinningMessage() {
    prepareWinningText();
    winningModal.style.display = 'block';
}

function prepareWinningText() {
    const usedMoves = initialNoOfMoves - movesLeft;
    const usedTime = timerElement.textContent;
    const movesInfoElement = document.querySelector('.modal--moves-info');
    movesInfoElement.textContent = `With ${usedMoves} moves and ${starsLeft} stars in ${usedTime} seconds`;
}

function noMoreMovesLeft() {
    return movesLeft == 0;
}

function disableClickingOnCards() {
    deck.removeEventListener('click', deckOnClickFunction);
}

function changeCardsCursorToDefault() {
    const cardElements = deck.children;
    for (const cardElement of cardElements) {
        cardElement.style.cursor = 'default';
    }
}

function handleStarsRemoval() {
    starsIndex++;
    if (starsIndex == movesPerStar) {
        starsList.removeChild(starsList.lastElementChild);
        starsIndex = 0;
        starsLeft--;
    }
}

function decreaseMovesCounter() {
    movesLeft--;
    movesElement.textContent = movesLeft;
}

function checkPairMatchingConditions(card) {
    const previousCard = openCardsList.pop();
    if (areCardsSymbolsMatching(previousCard, card)) {
        lockCardsInOpenPosition(previousCard, card);
        matchingPairs++;
    } else {
        addNoMatchingPairAnimation(previousCard, card);
        closeCards(card, previousCard);
        removeNoMatchingPairAnimation(previousCard, card);
    }
}

function removeNoMatchingPairAnimation(previousCard, card) {
    setTimeout(function () {
        previousCard.style.removeProperty('animation');
        card.style.removeProperty('animation');
    }, 1000);
}

function addNoMatchingPairAnimation(previousCard, card) {
    previousCard.style.animation = 'background-change 1s';
    card.style.animation = 'background-change 1s';
}

function areCardsSymbolsMatching(previousCard, card) {
    const previousCardSymbol = previousCard.innerHTML;
    const currentCardSymbol = card.innerHTML;
    return previousCardSymbol === currentCardSymbol;
}

function closeCards(card, previousCard) {
    setTimeout(function () {
        card.classList.remove('open', 'show');
        previousCard.classList.remove('open', 'show');
    }, 1000);
}

function lockCardsInOpenPosition(previousCard, card) {
    previousCard.classList.add('match');
    card.classList.add('match');
}

function addToOpenCardsList(card) {
    openCardsList.push(card);
}

function isFirstClickedCardInPair() {
    return openCardsList.length == 0;
}

function isCardClosed(card) {
    return !card.classList.contains('match');
}

function showCard(card) {
    card.classList.add('open', 'show');
}

/*
 * Functionality for handling modals
 */
// Get the modals
const winningModal = document.getElementById('winning-modal');
const losingModal = document.getElementById('losing-modal');

// Get the <span> element that closes the modal
const winningSpan = document.getElementById('winning-modal__close');
const losingSpan = document.getElementById('losing-modal__close');

// Get the 'playing again' buttons
const winningButton =  document.getElementById('winning-modal__button');
const losingButton =  document.getElementById('losing-modal__button');

// When the user clicks on <span> (x), close the modal
winningSpan.onclick = function() {
    closeWinningModal();
}

losingSpan.onclick = function() {
    closeLosingModal();
}

// When the user clicks on 'play again' button, restart the game
winningButton.onclick = function() {
    closeWinningModal();
    restartGame();
}

losingButton.onclick = function() {
    closeLosingModal();
    restartGame();
}

function closeWinningModal() {
    winningModal.style.display = 'none';
}

function closeLosingModal() {
    losingModal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
    if (event.target == winningModal) {
        winningModal.style.display = 'none';
    } else if (event.target == losingModal) {
        losingModal.style.display = 'none';
    }
});

/*
 * Restart functionality
 */
function restartGame() {
    location.reload(true);
}

restart.onclick = restartGame;

/*
 * Timer functionality
 */
const timerElement = document.querySelector('.timer');
const id = setInterval(handleTimer, 1000);
let timeCounter = 0;

function handleTimer() {
    timerElement.textContent = timeCounter;
    timeCounter++;
}

function stopTimer() {
    clearInterval(id);
}

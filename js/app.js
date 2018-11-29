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

const deck = document.querySelector('.deck');

const movesElement = document.querySelector('.moves');

const starsList = document.querySelector('.stars');
const initialNoOfStars =starsList.childElementCount;

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
let movesLeft = parseInt(movesElement.textContent);
const movesPerStar = movesLeft / initialNoOfStars;
let starsIndex = 0;

let deckOnClickFunction = null;

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
    if (noMoreMovesLeft()) {
        disableClickingOnCards();
        changeCardsCursorToDefault();
    }
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
    } else {
        closeCards(card, previousCard);
    }
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
    }, 2000);
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


const addCards = function(cardsData) {
  const { cards, isTradable, isCurrentPlayer, isValidPhase } = cardsData;
  setElementDisplay(document.getElementById('tradeBtn'), DISPLAY_NONE);

  if (cards.length > 0) {
    setElementInnerHTML(document.getElementById('playerCards'), EMPTY_STRING);
    if (isCurrentPlayer && isValidPhase && isTradable) {
      setElementDisplay(document.getElementById('tradeBtn'), DISPLAY_BLOCK);
    }
    cards.forEach(card => {
      const cardView = createElement(document, 'div');
      cardView.innerText = card;
      cardView.className = 'card';
      document.getElementById('playerCards').appendChild(cardView);
    });
  }
};

const addNoCardFoundMessage = function() {
  setElementInnerHTML(document.getElementById('playerCards'), EMPTY_STRING);
  const cardView = createElement(document, 'div');
  cardView.innerText = INSUFFICIENT_CARDS;
  document.getElementById('playerCards').appendChild(cardView);
};

const displayCards = function() {
  setElementDisplay(
    document.getElementById('playerDetailsPopup'),
    DISPLAY_BLOCK
  );
  fetch('/getCards')
    .then(res => res.json())
    .then(cardsData => {
      addNoCardFoundMessage();
      addCards(cardsData);
    });
};

const tradeCards = function() {
  fetch('/tradeCards');
  displayCards();
};

const addCards = function (cards) {
  if (cards.length > 0) {
    setElementInnerHTML(document.getElementById('playerCards'), EMPTY_STRING);
    cards.forEach(card => {
      const cardView = createElement(document, 'div');
      cardView.innerText = card;
      cardView.className = 'card';
      document.getElementById('playerCards').appendChild(cardView);
    });
  }
}

const addNoCardFoundMessage = function () {
  setElementInnerHTML(document.getElementById('playerCards'), EMPTY_STRING);
  const cardView = createElement(document, 'div');
  cardView.innerText = INSUFFICIENT_CARDS;
  document.getElementById('playerCards').appendChild(cardView);
}

const displayCards = function () {
  setElementDisplay(document.getElementById('playerDetailsPopup'), DISPLAY_BLOCK);
  fetch('/getCards')
    .then(res => res.json())
    .then(cards => {
      addNoCardFoundMessage();
      addCards(cards);
    })
}

const tradeCards = function () {
  fetch('/tradeCards');
  displayCards();
}
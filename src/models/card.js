class Cards {
  constructor() {
    this.cards = [];
  }

  addCard() {
    const cardIndex = Math.floor(Math.random() * 4);
    const cards = ['Infantry', 'Cavalry', 'Artillery', 'Wildcard'];

    this.cards.push(cards[cardIndex]);
  }

  hasThreeSameCard() {
    let cardToRemove = '';
    let isExists = false;

    ['Infantry', 'Cavalry', 'Artillery', 'Wildcard'].forEach(cardType => {
      if (this.cards.filter(card => card == cardType).length >= 3) {
        isExists = true;
        cardToRemove = cardType;
        return;
      }
    });
    return { cardToRemove, isExists };
  }

  hasThreeDifferentCard() {
    const isInfantryCardExists = this.cards.includes('Infantry');
    const isCavalryCardExists = this.cards.includes('Cavalry');
    const isArtilleryCardExists = this.cards.includes('Artillery');
    return isInfantryCardExists && isCavalryCardExists && isArtilleryCardExists;
  }

  hasThreeCards() {
    return this.cards.length >= 3;
  }

  hasWildCard() {
    return this.cards.includes('WildCard');
  }

  removeWhenWildCardPresent() {
    const wildCardIndex = this.cards.indexOf('WildCard');
    this.cards.splice(wildCardIndex, 1);
    this.cards.splice(0, 2);
  }

  removeCards(cardsSet) {
    cardsSet.forEach(cardSet => {
      let cardSetIndex = this.cards.indexOf(cardSet);
      this.cards.splice(cardSetIndex, 1);
    });
  }

  canTrade() {
    if (this.hasThreeCards()) {
      const { cardToRemove, isExists } = this.hasThreeSameCard();
      if (isExists) {
        this.removeCards([cardToRemove, cardToRemove, cardToRemove]);
        return true;
      }
      if (this.hasThreeDifferentCard()) {
        this.removeCards(['Artillery', 'Cavalry', 'Infantry']);
        return true;
      }
      if (this.hasWildCard()) {
        this.removeWhenWildCardPresent();
        return true;
      }
    }
    return false;
  }
}


module.exports = Cards
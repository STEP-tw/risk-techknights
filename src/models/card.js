class Cards {
  constructor() {
    this.cards = [];
  }

  addCard( random) {
    const cardIndex = Math.floor(random() * 4);
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

  hasWildcard() {
    return this.cards.includes('Wildcard');
  }

  removeWhenWildcardPresent() {
    const wildcardIndex = this.cards.indexOf('Wildcard');
    this.cards.splice(wildcardIndex, 1);
    this.cards.splice(0, 2);
  }

  removeCards(cardsSet) {
    cardsSet.forEach(cardSet => {
      let cardSetIndex = this.cards.indexOf(cardSet);
      this.cards.splice(cardSetIndex, 1);
    });
  }

  startTrade() {
    const { cardToRemove, isExists } = this.hasThreeSameCard();
    if (isExists) {
      this.removeCards([cardToRemove, cardToRemove, cardToRemove]);
    }
    if (this.hasThreeDifferentCard()) {
      this.removeCards(['Artillery', 'Cavalry', 'Infantry']);
    }
    if (this.hasWildcard()) {
      this.removeWhenWildcardPresent();
    }
  }

  canTrade() {
    if (this.hasThreeCards()) {
      this.startTrade();
      return true;
    }
    return false;
  }
}


module.exports = Cards
const Cards = require("./card");

class Player {
  constructor(id, name, militaryUnits) {
    this.id = id;
    this.name = name;
    this.color;
    this.militaryUnits = militaryUnits;
    this.phase = 1;
    this.isActive = false;
    this.receivedCards = new Cards();
    this.hasWonAttack = false;
    this.wantsToContinue = false;
  }

  getId() {
    return this.id;
  }

  setColor(color) {
    this.color = color;
  }

  removeAllMilitaryUnits() {
    this.militaryUnits = 0;
  }

  removeMilitaryUnits(numberOfUnits) {
    this.militaryUnits -= numberOfUnits;
  }

  addMilitaryUnits(numberOfUnits) {
    this.militaryUnits += numberOfUnits;
  }

  showCards() {
    return this.receivedCards.cards;
  }

  getCard(random) {
    if (this.hasWonAttack && this.receivedCards.cards.length < 5) {
      this.receivedCards.addCard(random);
      this.hasWonAttack = false;
    }
  }
}

module.exports = Player;

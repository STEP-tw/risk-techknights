const Cards = require('./card')

class Player {
  constructor(id, name, militaryUnits) {
    this.id = id;
    this.name = name;
    this.color;
    this.militaryUnits = militaryUnits;
    this.phase = 1;
    this.instruction ='Please wait for your turn';
    this.isActive = false;
    this.receivedCards = new Cards();
    this.hasWonAttack  = false;
  }

  getId() {
    return this.id;
  }

  setColor(color) {
    this.color = color;
  }

  removeMilitaryUnits(numberOfUnits) {
    this.militaryUnits -= numberOfUnits;
  }

  addMilitaryUnits(numberOfUnits) {
    this.militaryUnits += numberOfUnits;
  }

  setInstruction(instruction) {
    this.instruction = instruction;
  }

  getCard() {
    if (this.hasWonAttack) {
      this.receivedCards.addCard();
      this.hasWonAttack = false;
    }
  }
}

module.exports = Player;

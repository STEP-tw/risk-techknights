class Territory {
  constructor(name, neighbours, numberOfMilitaryUnits = 0) {
    this.name = name;
    this.neighbours = neighbours;
    this.numberOfMilitaryUnits = numberOfMilitaryUnits;
    this.ruler = undefined;
  }

  isOccupied() {
    return this.ruler != undefined;
  }

  addRuler(ruler) {
    this.ruler = ruler;
  }
  // changeNumberOfMilitaryUnits() {}
  // addMilitaryUnits() {}
  // removeMilitaryUnits() {}
}

module.exports = Territory;

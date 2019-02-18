class Territory {
  constructor(name, neighbours, militaryUnits) {
    this.name = name;
    this.neighbours = neighbours;
    this.militaryUnits = militaryUnits;
    this.ruler = undefined;
  }

  isOccupied() {
    return this.ruler != undefined;
  }

  addRuler(ruler) {
    this.ruler = ruler;
  }
  // changeNumberOfMilitaryUnits() {}
  addMilitaryUnits(numberOfMilitaryUnits) {
    this.militaryUnits += numberOfMilitaryUnits;
  }
  // removeMilitaryUnits() {}
}

module.exports = Territory;

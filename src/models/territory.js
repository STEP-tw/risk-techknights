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

  setRuler(ruler) {
    this.ruler = ruler;
  }

  addMilitaryUnits(unit) {
    this.numberOfMilitaryUnits = this.numberOfMilitaryUnits + unit;
  }

  removeMilitaryUnits(unit) {
    this.numberOfMilitaryUnits = this.numberOfMilitaryUnits - unit;
  }
}

module.exports = Territory;

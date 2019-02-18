class Territory {
  constructor(name, neighbours, numberOfMilitaryUnits = 0) {
    this.name = name;
    this.neighbours = neighbours;
    this.numberOfMilitaryUnits = numberOfMilitaryUnits;
    this.ruler;
  }
  changeRuler() {}
  changeNumberOfMilitaryUnits() {}
  addMilitaryUnits() {}
  removeMilitaryUnits() {}
}

module.exports = Territory;

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
    this.militaryUnits = this.militaryUnits + unit;
  }

  removeMilitaryUnits(unit) {
    this.militaryUnits = this.militaryUnits - unit;
  }

  isOccupiedBy(ruler) {
    if (this.ruler == undefined) return false;
    return this.ruler.id == ruler.id;
  }

  hasMilitaryUnits() {
    return this.militaryUnits > 1;
  }

  getNeighbours() {
    return this.neighbours;
  }

  hasNeighbour(territory) {
    return this.neighbours.includes(territory);
  }
}

module.exports = Territory;

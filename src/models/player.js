class Player {
  constructor(id, name, color, militaryUnits) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.territories = {};
    this.militaryUnits = militaryUnits;
  }

  getId() {
    return this.id;
  }

  addTerritory(territory) {
    this.territories[territory] = territory;
  }
  removeMilitaryUnits(numberOfUnits) {
    this.militaryUnits -= numberOfUnits;
  }

  // removeTerritory(territory) {}
}

module.exports = Player;

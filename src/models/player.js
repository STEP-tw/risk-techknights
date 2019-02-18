class Player {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.territories = {};
    this.militaryUnits = 0;
  }

  getId() {
    return this.id;
  }

  addTerritory(territory) {
    this.territories[territory] = territory;
  }

  // removeTerritory(territory) {}
  // assignMilitaryUnits(numberOfUnits) {}
  // removeMilitaryUnits(numberOfUnits) {}
}

module.exports = Player;

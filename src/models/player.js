class Player {
  constructor(id, name, militaryUnits) {
    this.id = id;
    this.name = name;
    this.color;
    this.territories = {};
    this.militaryUnits = militaryUnits;
  }

  getId() {
    return this.id;
  }

  addTerritory(territory) {
    this.territories[territory] = territory;
  }

  setColor(color) {
    this.color = color;
  }

  removeMilitaryUnits(numberOfUnits) {
    this.militaryUnits -= numberOfUnits;
  }

  // removeTerritory(territory) {}
}

module.exports = Player;

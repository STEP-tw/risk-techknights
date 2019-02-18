class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.territories = [];
    this.militaryUnits = 0;
  }

  getId() {
    return this.id;
  }

  // addTerritory(territory) {
  //   this.territories.push(territory);
  // }
  // removeTerritory(territory) {}
  // assignMilitaryUnits(numberOfUnits) {}
  // removeMilitaryUnits(numberOfUnits) {}
}

module.exports = Player;

class Fortify {
  constructor(player) {
    this.player = player;
    this.sourceTerritory;
    this.destinationTerritory;
  }

  setSourceTerritory(territory) {
    this.sourceTerritory = territory;
  }
  
  setDestinationTerritory(territory) {
    this.destinationTerritory = territory;
  }

  fortifyMilitaryUnits(militaryUnits) {
    this.sourceTerritory.removeMilitaryUnits(militaryUnits);
    this.destinationTerritory.addMilitaryUnits(militaryUnits);
  }
}

module.exports = Fortify;
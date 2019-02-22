class Reinforcement {
  constructor(player) {
    this.player = player;
    this.territory;
  }

  setTerritory(territory) {
    this.territory = territory;
  }

  reinforceMilitaryUnits(militaryUnits) {
    this.territory.addMilitaryUnits(militaryUnits);
    this.player.removeMilitaryUnits(militaryUnits);
  }
}

module.exports = Reinforcement;
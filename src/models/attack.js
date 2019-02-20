class Attack {
  constructor(attacker) {
    this.attacker = attacker;
    this.defender = '';
    this.attackingTerritory = '';
    this.defendingTerritory = '';
    this.won;
  }

  updateBattleResult(unitAttackerLost, unitDefenderLost) {
    this.attackingTerritory.removeMilitaryUnits(unitAttackerLost);
    this.defendingTerritory.removeMilitaryUnits(unitDefenderLost);
  }

  isTerritoryConquered() {
    if (this.won) {
      this.attackingTerritory.removeMilitaryUnits(1);
      this.defendingTerritory.addMilitaryUnits(1);
    }
  }

  getCurrentAttackDetails() {
    return {
      startBattle: true,
      attackerName: this.attacker,
      defenderName: this.defender,
      attackingTerritory: this.attackingTerritory.name,
      defendingTerritory: this.defendingTerritory.name,
      attackerMilitary: this.attackingTerritory.militaryUnits,
      defendingMilitary: this.defendingTerritory.militaryUnits
    }
  }
}

module.exports = Attack
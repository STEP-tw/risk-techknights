class Attack {
  constructor(attacker) {
    this.attacker = attacker;
    this.defender = '';
    this.attackingTerritory = '';
    this.defendingTerritory = '';
    this.won;
  }

  updateMilitary(unitAttackerLost, unitDefenderLost) {
    this.attackingTerritory.removeMilitaryUnits(unitAttackerLost);
    this.defendingTerritory.removeMilitaryUnits(unitDefenderLost);
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

  isWon() {
    if(this.defendingTerritory.militaryUnits < 1) {
      this.won = true;
      this.setDefendingTerritoryRuler();
      this.attackingTerritory.removeMilitaryUnits(1);
      this.defendingTerritory.addMilitaryUnits(1);
      return true;
    }
    return false;
  }

  setDefendingTerritoryRuler() {
    this.defendingTerritory.setRuler(this.attacker);
  }
}

module.exports = Attack
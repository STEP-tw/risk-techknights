class Attack {
  constructor(attacker) {
    this.attacker = attacker;
    this.defender = '';
    this.attackingTerritory = '';
    this.defendingTerritory = '';
    this.won='';
  }

  updateMilitary(unitAttackerLost, unitDefenderLost) {
    this.attackingTerritory.removeMilitaryUnits(unitAttackerLost);
    this.defendingTerritory.removeMilitaryUnits(unitDefenderLost);
  }

  getCurrentAttackDetails() {
    return {
      startBattle: true,
      won:this.won,
      attackerName: this.attacker.name,
      attackerColor : this.attacker.color,
      defenderName: this.defender.name,
      attackingTerritory: this.attackingTerritory.name,
      defendingTerritory: this.defendingTerritory.name,
      attackerMilitary: this.attackingTerritory.militaryUnits,
      defendingMilitary: this.defendingTerritory.militaryUnits
    }
  }

  isWon() {
    if(this.defendingTerritory.militaryUnits < 1) {
      this.won = true;
      return true;
    }
    return false;
  }

  conquerTerritory() {
    this.setDefendingTerritoryRuler();
    this.attackingTerritory.removeMilitaryUnits(1);
    this.defendingTerritory.addMilitaryUnits(1);
  }

  setDefendingTerritoryRuler() {
    this.defendingTerritory.setRuler(this.attacker);
  }
}

module.exports = Attack
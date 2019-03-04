class ActivityLog {
  constructor() {
    this.logs = [];
  }
  changeTurn(player) {
    const time = this.getTime();
    const message = `${time}  It's ${player.name}'s turn`;
    this.logs.unshift(message);
  }
  claimTerritory(territory, player) {
    const time = this.getTime();
    const message = `${time}  ${player.name} has claimed ${territory.name}`;
    this.logs.unshift(message);
  }

  reinforceTerritory(territory, player) {
    const time = this.getTime();
    const message = `${time}  ${player.name} has reinforced ${territory.name}`;
    this.logs.unshift(message);
  }

  receiveArmy(player, militaryUnits) {
    const time = this.getTime();
    const message = `${time}  ${
      player.name
    } has received ${militaryUnits} Military Units`;
    this.logs.unshift(message);
  }

  placeMilitaryUnits(territory, player, militaryUnits) {
    const time = this.getTime();
    const message = `${time}  ${
      player.name
    } has placed ${militaryUnits} military units in ${territory.name}`;
    this.logs.unshift(message);
  }

  attack(attack) {
    const time = this.getTime();
    const attacking = attack.attackingTerritory.name;
    const defending = attack.defendingTerritory.name;
    const message = `${time}  ${
      attack.attacker.name
    } is attacking from  ${attacking} on ${defending}`;
    this.logs.unshift(message);
  }

  conquerTerritory(attack) {
    const time = this.getTime();
    const defending = attack.defendingTerritory.name;
    const message = `${time}  ${
      attack.attacker.name
    } has conquored ${defending}`;
    this.logs.unshift(message);
  }

  fortify(fortify, militaryUnits) {
    const source = fortify.sourceTerritory.name;
    const destination = fortify.destinationTerritory.name;
    const time = this.getTime();
    const message = `${time}  ${
      fortify.player.name
    } has reinforced ${militaryUnits} military units from  ${source} to ${destination}`;
    this.logs.unshift(message);
  }

  eliminate(player) {
    const time = this.getTime();
    const message = `${time} ${player.name} is eliminated!`;
    this.logs.unshift(message);
  }
  getTime() {
    const time = new Date().toLocaleTimeString('en-us');
    return time;
  }

  getLogs() {
    return this.logs.join('\n');
  }
}
module.exports = { ActivityLog };

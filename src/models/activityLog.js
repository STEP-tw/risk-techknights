class ActivityLog {
  constructor() {
    this.logs = {};
    this.logId = 0;
    this.currentLog = { playerName: "", log: "" };
  }

  addLogHeader(msg) {
    const logId = this.getNewLogId();
    this.logs[logId] = { header: msg, events: [] };
  }

  addPlayerLog(playerName, log) {
    this.currentLog.playerName = playerName;
    this.currentLog.log = log;
    this.logs[this.logId].events.push(log);
  }

  getNewLogId() {
    this.logId = this.logId + 1;
    return this.logId;
  }

  changeTurn(player) {
    const time = this.getTime();
    const message = `${time}  It's ${player.name}'s turn`;
    this.addLogHeader(message);
  }

  claimTerritory(territory, player) {
    const message = `<img src="/images/conquer.png" style="width:25px;height:25px;"> Claimed ${
      territory.name
    }`;
    this.addPlayerLog(player.name, message);
  }

  reinforceTerritory(territory, player) {
    const message = `<img src="/images/placeMilitary.png" style="width:25px;height:25px;"> Reinforced ${
      territory.name
    }`;
    this.addPlayerLog(player.name, message);
  }

  receiveArmy(player, militaryUnits) {
    const message = `<img src="/images/receiveMilitary.png" style="width:25px;height:25px;"> Received ${militaryUnits} Military Units`;
    this.addPlayerLog(player.name, message);
  }

  placeMilitaryUnits(territory, player, militaryUnits) {
    const message = `<img src="/images/placeMilitary.png" style="width:25px;height:25px;"> Placed ${militaryUnits} military units in ${
      territory.name
    }`;
    this.addPlayerLog(player.name, message);
  }

  attack(attack) {
    const attacking = attack.attackingTerritory.name;
    const defending = attack.defendingTerritory.name;

    const message = `<img src="/images/attack.png" style="width:25px;height:25px;"> Attacking from ${attacking} on ${defending}`;
    this.addPlayerLog(this.currentLog.playerName, message);
  }

  conquerTerritory(attack) {
    const defending = attack.defendingTerritory.name;
    const attackingTerritory = attack.attackingTerritory.name;
    const message = `<img src="/images/conquer.png" style="width:25px;height:25px;"> Conquered ${defending} from ${attackingTerritory}`;
    this.addPlayerLog(this.currentLog.playerName, message);
  }

  fortify(fortify, militaryUnits) {
    const source = fortify.sourceTerritory.name;
    const destination = fortify.destinationTerritory.name;
    const message = `<img src="/images/placeMilitary.png" style="width:25px;height:25px;"> Reinforced ${militaryUnits} military units from  ${source} to ${destination}`;
    this.addPlayerLog(this.currentLog.playerName, message);
  }

  eliminate(player) {
    const message = `<img src="/images/conquer.png" style="width:25px;height:25px;"> Eliminated ${
      player.name
    }`;
    this.addPlayerLog(this.currentLog.playerName, message);
  }

  getTime() {
    const time = new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false
    });
    return time;
  }

  getLogs() {
    return this.logs;
  }
}
module.exports = { ActivityLog };

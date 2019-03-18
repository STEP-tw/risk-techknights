const { expect } = require("chai");
const { ActivityLog } = require("../../src/models/activityLog");
let activityLog = new ActivityLog();

describe("getLogs()", function() {
  it("should return logs with new line", function() {
    activityLog.logId = 1;
    activityLog.logs[1] = { header: "", events: [] };
    activityLog.addPlayerLog("player1", "Some activity");
    expect(activityLog.logs["1"]).to.eql({
      header: "",
      events: ["Some activity"]
    });
  });

  it("should return logs with new line", function() {
    activityLog.getLogs();
    expect(activityLog.logs).to.eql({
      "1": { header: "", events: ["Some activity"] }
    });
  });

  it("should add a log for attack", function() {
    attack = {};
    attack.attackingTerritory = { name: "India" };
    attack.defendingTerritory = { name: "China" };
    activityLog.attack(attack);
    expect(activityLog.logs).to.eql({
      "1": {
        header: "",
        events: ["Some activity", "Attacking from India on China"]
      }
    });
  });

  it("should add a log for reinforceTerritory", function() {
    let territory = { name: "India" };
    let player = { name: "player1" };
    activityLog.reinforceTerritory(territory, player);
    expect(activityLog.logs).to.eql({
      "1": {
        header: "",
        events: [
          "Some activity",
          "Attacking from India on China",
          "Reinforced India"
        ]
      }
    });
  });
});

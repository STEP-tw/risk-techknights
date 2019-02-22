const assert = require("assert");
const Player = require("../../src/models/player");

describe("Player", function() {
  describe("getId", function() {
    it("should give the id of player", function() {
      let player = new Player(123, "abc");
      assert.deepEqual(player.getId(), 123);
    });
  });

  describe("setColor", function() {
    it("should set the color to the player", function() {
      let player = new Player(123, "abc", 0);
      player.setColor("red");
      let expected = {
        color: "red",
        "instruction": "Please wait for your turn",
        id: 123,
        militaryUnits: 0,
        name: "abc",
        phase:1
      };
      assert.deepEqual(player, expected);
    });
  });

  describe("removeMilitaryUnits", function() {
    it("should remove the given militaryUnits from player", function() {
      let player = new Player(123, "abc", 10);
      player.removeMilitaryUnits(4);
      let expected = {
        id: 123,
        militaryUnits: 6,
        "instruction": "Please wait for your turn",
        name: "abc",
        phase:1
      };
      assert.deepEqual(player, expected);
    });
  });
});

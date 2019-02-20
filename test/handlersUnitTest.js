const { addNewPlayer } = require("../src/handlers/handlers");
const assert = require("assert");

describe("addNewPlayer", () => {
  it("should return ", () => {
    let game = { addPlayer: () => {} };
    let playerName = "abc";
    let totalPlayer = 5;
    let actual = addNewPlayer(game, playerName, totalPlayer);
    let expected = 6;
    assert.equal(actual, expected);
  });
});

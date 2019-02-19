const { Game, Games } = require("../../src/models/game");
const Player = require("../../src/models/player");
const assert = require("assert");

describe("Games", function() {
  describe("addGame", function() {
    it("should add new game object to games with given ID", function() {
      let games = new Games();
      games.addGame(new Game(123, []));
      let expected = {
        games: {
          "123": {
            colors: ["aqua", "#98fb98", "#d9ff00", "#f08080"],
            id: 123,
            order: [],
            players: [],
            territories: []
          }
        }
      };
      assert.deepEqual(games, expected);
    });

    it("should not add game object to games if ID is undefined ", function() {
      let games = new Games();
      games.addGame(new Game());
      let expected = { games: {} };
      assert.deepEqual(games, expected);
    });
  });
  describe("getGame", function() {
    let games = new Games();
    beforeEach(() => {
      games.addGame(new Game(123));
    });

    it("should return the game object of specified ID", function() {
      games.getGame(123);
      let expected = {
        games: {
          "123": {
            colors: ["aqua", "#98fb98", "#d9ff00", "#f08080"],
            id: 123,
            order: [],
            players: [],
            territories: undefined
          }
        }
      };
      assert.deepEqual(games, expected);
    });
  });
});

describe("Game", function() {
  describe("addPlayer", function() {
    it("should add player to game object", function() {
      let game = new Game(456);
      game.addPlayer(new Player(123, "abc", 30));
      let expected = {
        colors: ["#98fb98", "#d9ff00", "#f08080"],

        id: 456,
        order: [123],
        players: [
          {
            color: "aqua",
            id: 123,
            militaryUnits: 30,
            name: "abc"
          }
        ],
        territories: undefined
      };
      assert.deepEqual(game, expected);
    });
  });
});

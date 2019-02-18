const { Game, Games } = require("../../src/models/game");
const Player = require("../../src/models/player");
const assert = require("assert");

describe("Games", function() {
  describe("addGame", function() {
    it("should add new game object to games with given ID", function() {
      let games = new Games();
      games.addGame(new Game(123));
      let expected = {
        games: {
          "123": {
            id: 123,
            order: [],
            players: []
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
            id: 123,
            order: [],
            players: []
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
      game.addPlayer({ id: 123, name: "xyz" });
      let expected = {
        id: 456,
        order: [123],
        players: [
          {
            id: 123,
            name: "xyz"
          }
        ]
      };
      assert.deepEqual(game, expected);
    });
  });
});

describe("Player", function() {
  describe("getId", function() {
    it("should give the id of player", function() {
      let player = new Player(123, "abc");
      assert.deepEqual(player.getId(), 123);
    });
  });
});

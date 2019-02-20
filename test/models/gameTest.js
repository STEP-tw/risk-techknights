const { Game, Games } = require("../../src/models/game");
const Player = require("../../src/models/player");
const sinon = require('sinon');
const assert = require("assert");
const { expect } = require('chai');

const Player1 = new Player(1, 'Player 1');
const currentGame = new Game(123, []);
currentGame.totalPlayerCount = 4;
currentGame.order = [1, 2, 3, 4];
currentGame.phase = 1;
currentGame.territories = [];
currentGame.players.push(Player1);

describe('Game Model', () => {
  it('should return total number of players playing the game', () => {
    const result = currentGame.getTotalPlayerCount();
    expect(result).to.equal(4);
  });

  it('should change the players turn', () => {
    let result = currentGame.order;
    expect(result).to.eql([1, 2, 3, 4]);
    currentGame.changeTurn();
    result = currentGame.order;
    expect(result).to.eql([2, 3, 4, 1]);
  });

  it('should return phase of the current game', () => {
    const result = currentGame.getPhase();
    expect(result).to.equal(1);
  });

  it('should change phase of the current game', () => {
    currentGame.changePhase();
    const result = currentGame.getPhase();
    expect(result).to.equal(2);
  });

  it('should check if all the territories are occupied', () => {
    const result = currentGame.isAllTerritoriesOccupied();
    expect(result).to.equal(false);
  });

  it('should return details of a player playing a game', () => {
    const result = currentGame.getPlayerDetailsById(1);
    expect(result).to.equal(Player1);
  });

  it("should return random order of the players", () => {
    const game = new Game("12345", []);
    game.order = [1, 2, 3];
    const Math = {};
    Math.random = sinon.stub();
    Math.random.returns(0);
    game.decideOrder(Math.random);
    assert.deepEqual(game.order, [1, 2, 3]);
  });
  it("should return array of players", () => {
    const game = new Game("12345", []);
    game.players = [{ id: 1, name: "durga" }, { id: 2, name: "mahesh" }];
    assert.deepEqual(game.getPlayers(), [
      { id: 1, name: "durga" },
      { id: 2, name: "mahesh" }
    ]);
  });
});

describe("Games", function () {
  describe("addGame", function () {
    it("should add new game object to games with given ID", function () {
      let games = new Games();
      games.addGame(new Game(123, []));
      let expected = {
        games: {
          "123": {
            colors: ["aqua", "#98fb98", "#d9ff00", "#f08080"],
            id: 123,
            phase: 1,
            order: [],
            players: [],
            territories: []
          }
        }
      };
      assert.deepEqual(games, expected);
    });

    it("should not add game object to games if ID is undefined ", function () {
      let games = new Games();
      games.addGame(new Game());
      let expected = { games: {} };
      assert.deepEqual(games, expected);
    });
  });
  describe("getGame", function () {
    let games = new Games();
    beforeEach(() => {
      games.addGame(new Game(123));
    });

    it("should return the game object of specified ID", function () {
      games.getGame(123);
      let expected = {
        games: {
          "123": {
            colors: ["aqua", "#98fb98", "#d9ff00", "#f08080"],
            id: 123,
            phase: 1,
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

describe("Game", function () {
  describe("addPlayer", function () {
    it("should add player to game object", function () {
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
        territories: undefined,
        phase: 1
      };
      assert.deepEqual(game, expected);
    });
  });
});

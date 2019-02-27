const { Game, Games } = require('../../src/models/game');
const Player = require('../../src/models/player');
const sinon = require('sinon');
const assert = require('assert');
const { expect } = require('chai');

const Player1 = new Player(1, 'Player 1');
const Player2 = new Player(2, 'Player 2');
const currentGame = new Game(123, []);
currentGame.totalPlayerCount = 4;
currentGame.phase = 1;
currentGame.territories = [];
currentGame.addPlayer(Player1);
currentGame.addPlayer(Player2);

describe('Game Model', () => {
  it('should return total number of players playing the game', () => {
    const result = currentGame.getTotalPlayerCount();
    expect(result).to.equal(4);
  });

  it('should change the players turn', () => {
    let result = currentGame.order;
    expect(result).to.eql([1, 2]);
    currentGame.changeTurn();
    result = currentGame.order;
    expect(result).to.eql([2, 1]);
  });

  it('should check if all the territories are occupied and return false', () => {
    const result = currentGame.isAllTerritoriesOccupied();
    expect(result).to.equal(false);
  });

  it('should check if all the territories are occupied and return true', () => {
    const territories = new Array(42).fill(1).map(x => {
      return {
        ruler: true
      };
    });
    currentGame.territories = territories;
    const result = currentGame.isAllTerritoriesOccupied();
    expect(result).to.equal(true);
  });

  it('should return details of a player playing a game', () => {
    const result = currentGame.getPlayerDetailsById(1);
    expect(result).to.equal(Player1);
  });

  it('should return random order of the players', () => {
    const game = new Game('12345', []);
    game.order = [1, 2, 3];
    const Math = {};
    Math.random = sinon.stub();
    Math.random.returns(0);
    game.decideOrder(Math.random);
    assert.deepEqual(game.order, [1, 2, 3]);
  });
  it('should return array of players', () => {
    const game = new Game('12345', []);
    game.players = [{ id: 1, name: 'durga' }, { id: 2, name: 'mahesh' }];
    assert.deepEqual(game.getPlayers(), [
      { id: 1, name: 'durga' },
      { id: 2, name: 'mahesh' }
    ]);
  });

  it('changePlayerPhase', () => {
    const game = new Game('12345', []);
    game.order = [1, 2];
    game.players = [
      { id: 1, name: 'durga', phase: 4 },
      { id: 2, name: 'mahesh', phase: 3 }
    ];
    game.changePlayerPhase();
    expect(game.getCurrentPlayer())
      .has.property('phase')
      .to.equal(5);
    expect(game.order).to.eql([1, 2]);
  });
});

describe('Games', function() {
  describe('addGame', function() {
    it('should add new game object to games with given ID', function() {
      let games = new Games();
      games.addGame(new Game(123, [], 2));
      let expected = {
        games: {
          '123': {
            colors: [
              '#964c1',
              '#60e886',
              '#efce3b',
              '#e2615c',
              '#2ecac8',
              '#e06t0fc7'
            ],
            id: 123,
            phase: 1,
            order: [],
            players: [],
            territories: [],
            totalPlayerCount: 2,
            originalOrder: [],
            horsePosition: [
              2,
              4,
              6,
              8,
              10,
              15,
              20,
              25,
              30,
              35,
              40,
              45,
              50,
              55,
              60
            ],
            currentHorseIndex: 0
          }
        }
      };
      assert.deepEqual(games, expected);
    });

    it('should not add game object to games if ID is undefined ', function() {
      let games = new Games();
      games.addGame(new Game());
      let expected = { games: {} };
      assert.deepEqual(games, expected);
    });
  });
  describe('getGame', function() {
    let games = new Games();
    beforeEach(() => {
      games.addGame(new Game(123));
    });

    it('should return the game object of specified ID', function() {
      games.getGame(123);
      let expected = {
        games: {
          '123': {
            colors: [
              '#964c1',
              '#60e886',
              '#efce3b',
              '#e2615c',
              '#2ecac8',
              '#e06t0fc7'
            ],
            id: 123,
            phase: 1,
            order: [],
            players: [],
            territories: undefined,
            totalPlayerCount: undefined,
            originalOrder: [],
            horsePosition: [
              2,
              4,
              6,
              8,
              10,
              15,
              20,
              25,
              30,
              35,
              40,
              45,
              50,
              55,
              60
            ],
            currentHorseIndex: 0
          }
        }
      };
      assert.deepEqual(games, expected);
    });
  });
});

describe('Game', function() {
  describe('addPlayer', function() {
    it('should add player to game object', function() {
      let game = new Game(456);
      game.addPlayer(new Player(123, 'abc', 30));
      let expected = {
        colors: ['#60e886', '#efce3b', '#e2615c', '#2ecac8', '#e06t0fc7'],

        id: 456,
        order: [123],
        players: [
          {
            color: '#964c1',
            id: 123,
            militaryUnits: 30,
            name: 'abc',
            phase: 1,
            isActive: false,
            hasWonAttack: false,
            receivedCards: { cards: [] }
          }
        ],
        territories: undefined,
        totalPlayerCount: undefined,
        phase: 1,
        originalOrder: [],
        horsePosition: [2, 4, 6, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
        currentHorseIndex: 0
      };
      assert.deepEqual(game, expected);
    });
  });
});

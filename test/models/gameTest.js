const { Game, Games } = require('../../src/models/game');
const Player = require('../../src/models/player');
const sinon = require('sinon');
const assert = require('assert');
const { expect } = require('chai');
const { ActivityLog } = require('../../src/models/activityLog');
const { Continent } = require('./../../src/models/continent');

const Player1 = new Player(1, 'Player 1');
const Player2 = new Player(2, 'Player 2');
const currentGame = new Game(123, []);
currentGame.totalPlayerCount = 4;
currentGame.phase = 1;
currentGame.activityLog = new ActivityLog();
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

describe('Games', function () {
  describe('addGame', function () {
    it('should add new game object to games with given ID', function () {
      let games = new Games();
      games.addGame(new Game(123, [], 2));
      let expected = {
        games: { '123': { colors: ['#ecec6c', '#de9e30', '#b0de92', '#bdd3e6', '#dc7272', '#b7a7e0'], id: 123, order: [], players: [], territories: [], totalPlayerCount: 2, originalOrder: [], horsePosition: [4, 6, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65], currentHorseIndex: 0 } }
      };
      assert.deepEqual(games, expected);
    });

    it('should not add game object to games if ID is undefined ', function () {
      let games = new Games();
      games.addGame(new Game());
      let expected = { games: {} };
      assert.deepEqual(games, expected);
    });
  });
  describe('getGame', function () {
    let games = new Games();
    beforeEach(() => {
      games.addGame(new Game(123));
    });

    it('should return the game object of specified ID', function () {
      games.getGame(123);
      let expected = {
        games: { '123': { colors: ['#ecec6c', '#de9e30', '#b0de92', '#bdd3e6', '#dc7272', '#b7a7e0'], id: 123, order: [], players: [], territories: undefined, totalPlayerCount: undefined, originalOrder: [], horsePosition: [4, 6, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65], currentHorseIndex: 0 } }
      };
      assert.deepEqual(games, expected);
    });
  });
});

describe('Game', function () {
  describe('addPlayer', function () {
    it('should add player to game object', function () {
      let game = new Game(456);
      game.addPlayer(new Player(123, 'abc', 30));
      let expected = {
        colors: ['#de9e30', '#b0de92', '#bdd3e6', '#dc7272', '#b7a7e0'],
        id: 456,
        order: [123],
        players: [{ color: '#ecec6c', id: 123, militaryUnits: 30, name: 'abc', phase: 1, isActive: false, hasWonAttack: false, receivedCards: { cards: [] }, wantsToContinue: false }],
        territories: undefined,
        totalPlayerCount: undefined,
        originalOrder: [],
        horsePosition: [4, 6, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
        currentHorseIndex: 0
      };
      assert.deepEqual(game, expected);
    });
  });
});

describe('change Player Phase', () => {
  it('should change the phase of current player', () => {
    let game = new Game(456);
    game.activityLog = new ActivityLog();
    let player = new Player(1, 'abc', 30);
    player.phase = 5;
    game.addPlayer(player);
    game.changePlayerPhase();
    expect(player).to.has.property('phase').to.equal(3);
  });
});

describe('removeEliminatedPlayerTurn', () => {
  it('should remove a player if eliminated', () => {
    let game = new Game(456);
    game.activityLog = new ActivityLog();
    let player1 = new Player(1, 'abc', 30);
    let player2 = new Player(2, 'abc', 30);
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.removeEliminatedPlayerTurn(player1);
    expect(game.order.length).to.equal(1);
  });
  it('should remove a player if eliminated', () => {
    let game = new Game(456);
    game.activityLog = new ActivityLog();
    let player1 = new Player(1, 'abc', 30);
    let player2 = new Player(2, 'abc', 30);
    game.addPlayer(player1);
    game.removeEliminatedPlayerTurn(player2);
    expect(game.order.length).to.equal(1);
  });
});

describe('tradeCards', () => {
  it('should trade cards', () => {
    let game = new Game(456);
    game.activityLog = new ActivityLog();
    let player1 = new Player(1, 'abc', 30);
    player1.receivedCards.cards = ['Wildcard', 'Wildcard', 'Wildcard', 'Wildcard']
    game.addPlayer(player1);
    game.tradeCards();
    expect(player1).has.property('receivedCards').to.eql({ cards: ['Wildcard'] })
  });
});

describe('getHorsePosition', () => {
  it('should return the current horse position', () => {
    let game = new Game(456);
    game.activityLog = new ActivityLog();
    game.currentHorseIndex = 16;
    game.getHorsePosition();
    expect(game).has.property('currentHorseIndex').to.equal(16)
  });
});

describe('calculateTotalConinentBonus', () => {
  it('should return the bonus for a continent', () => {
    let game = new Game(456);
    game.activityLog = new ActivityLog();
    let player1 = new Player(1, 'abc', 30);
    player1.receivedCards.cards = ['Wildcard', 'Wildcard', 'Wildcard', 'Wildcard']

    const territories = [
      { name: 'India', ruler: { id: 1 } },
      { name: 'China', ruler: { id: 1 } },
      { name: 'Middle East', ruler: { id: 1 } }
    ]
    const continent1 = new Continent('Asia', territories, 10);
    const continent2 = new Continent('Africa', territories, 10);
    game.continents = { continent1, continent2 };
    game.addPlayer(player1);
    game.calculateTotalConinentBonus(player1.id);
  });
});
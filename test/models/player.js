const assert = require('assert');
const Player = require('../../src/models/player');
const sinon = require('sinon');

describe('Player', function () {
  describe('getId', function () {
    it('should give the id of player', function () {
      let player = new Player(123, 'abc');
      assert.deepEqual(player.getId(), 123);
    });
  });

  describe('setColor', function () {
    it('should set the color to the player', function () {
      let player = new Player(123, 'abc', 0);
      player.setColor('red');
      let expected = {
        color: 'red',
        id: 123,
        militaryUnits: 0,
        name: 'abc',
        phase: 1,
        isActive: false,
        hasWonAttack: false,
        receivedCards: { cards: [] },
        wantsToContinue : false
      };
      assert.deepEqual(player, expected);
    });
  });

  describe('removeMilitaryUnits', function () {
    it('should remove the given militaryUnits from player', function () {
      let player = new Player(123, 'abc', 10);
      player.removeMilitaryUnits(4);
      let expected = {
        id: 123,
        militaryUnits: 6,
        name: 'abc',
        phase: 1,
        isActive: false,
        hasWonAttack: false,
        receivedCards: { cards: [] },
        wantsToContinue: false

      };
      assert.deepEqual(player, expected);
    });
  });

  describe('addMilitaryUnits', function () {
    it('should add the given militaryUnits to player', function () {
      let player = new Player(123, 'abc', 10);
      player.addMilitaryUnits(4);
      let expected = {
        id: 123,
        militaryUnits: 14,
        name: 'abc',
        phase: 1,
        isActive: false,
        hasWonAttack: false,
        receivedCards: { cards: [] },
        wantsToContinue: false

      };
      assert.deepEqual(player, expected);
    });
  });

  describe('show Cards', function () {
    it('should return all the received cards of player', function () {
      let player = new Player(123, 'abc', 10);
      let cards = player.showCards();
      assert.deepEqual(cards, []);
    });
  });

  describe('getCard', function () {
    it('should receive a card', function () {
      let player = new Player(123, 'abc', 10);
      player.hasWonAttack = true;
      Math.random = sinon.stub();
      Math.random.returns(0.34)
      player.getCard(Math.random);
      assert.deepEqual(player.showCards(), ['Cavalry']);
    });

    it('should receive a card', function () {
      let player = new Player(123, 'abc', 10);
      Math.random = sinon.stub();
      Math.random.returns(0.34)
      player.getCard(Math.random);
      assert.deepEqual(player.showCards(), []);
    });
  });
});

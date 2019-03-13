const { expect } = require('chai');
const Cards = require('./../../src/models/card');
const playerCards = new Cards();
const sinon = require('sinon');

describe('Cards Model', () => {
  it('should add a card', () => {
    Math.random = sinon.stub();
    Math.random.returns(0.45);
    playerCards.addCard(Math.random);
    expect(playerCards)
      .has.property('cards')
      .to.eql(['Cavalry']);
  });

  it('should check for three same cards', () => {
    playerCards.cards = ['Infantry', 'Infantry', 'Infantry'];
    let result = playerCards.hasThreeSameCard();
    expect(result)
      .has.property('isExists')
      .to.eql(true);

    playerCards.cards = ['Infantry', 'Infantry'];
    result = playerCards.hasThreeSameCard();
    expect(result)
      .has.property('isExists')
      .to.eql(false);
  });

  it('should check for three different cards', () => {
    playerCards.cards = ['Infantry', 'Cavalry', 'Artillery'];
    let result = playerCards.hasThreeDifferentCard();
    expect(result).to.equal(true);

    playerCards.cards = ['Infantry', 'Infantry', 'Wildcard'];
    result = playerCards.hasThreeDifferentCard();
    expect(result).to.equal(false);
  });

  it('should check if atleast three cards are present', () => {
    playerCards.cards = ['Infantry', 'Cavalry', 'Artillery'];
    let result = playerCards.hasThreeCards();
    expect(result).to.equal(true);

    playerCards.cards = ['Infantry', 'Infantry'];
    result = playerCards.hasThreeCards();
    expect(result).to.equal(false);
  });

  it('should check if player can trade', () => {
    playerCards.cards = ['Infantry', 'Cavalry', 'Artillery'];
    let result = playerCards.canTrade();
    expect(result).to.equal(true);

    playerCards.cards = ['Infantry', 'Infantry'];
    result = playerCards.canTrade();
    expect(result).to.equal(false);
  });

  it('should check if wildcard is present', () => {
    playerCards.cards = ['Infantry', 'Wildcard', 'Artillery'];
    let result = playerCards.hasWildcard();
    expect(result).to.equal(true);

    playerCards.cards = ['Infantry', 'Infantry'];
    result = playerCards.hasWildcard();
    expect(result).to.equal(false);
  });

  it('should check if player can trade', () => {
    playerCards.cards = ['Infantry', 'Infantry', 'Infantry'];
    let result = playerCards.canTrade();
    expect(result).to.equal(true);

    playerCards.cards = ['Infantry', 'Cavalry', 'Artillery'];
    result = playerCards.canTrade();
    expect(result).to.equal(true);

    playerCards.cards = ['Infantry', 'Cavalry', 'Wildcard'];
    result = playerCards.canTrade();
    expect(result).to.equal(true);

    playerCards.cards = ['Infantry', 'Infantry', 'Artillery'];
    result = playerCards.canTrade();
    expect(result).to.equal(false);
  });

  it('should check isTradable function', () => {
    playerCards.cards = ['Infantry', 'Wildcard', 'Artillery'];
    let result = playerCards.isTradable();
    expect(result).to.equal(true);

    playerCards.cards = ['Infantry', 'Infantry'];
    result = playerCards.isTradable();
    expect(result).to.equal(false);
  });
});

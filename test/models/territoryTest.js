const { expect } = require('chai');
const Territory = require('./../../src/models/territory');

const neighbours = ['Middle East', 'Afghanistan', 'China', 'Siam'];
const Player = { id: 1, name: 'Player 1' }

describe('Territory', () => {
  let territory;
  beforeEach(() => {
    territory = new Territory('India', neighbours, 10);
  })
  it('should set the ruler of a territory', () => {
    territory.setRuler(Player);
    expect(territory).has.property('ruler').has.property('id').to.equal(1);
    expect(territory).has.property('ruler').has.property('name').to.equal('Player 1');

  });

  it('should check if the territory is occupied or not', () => {
    let result = territory.isOccupied();
    expect(result).to.equal(false);
    territory.setRuler(Player);
    result = territory.isOccupied();
    expect(result).to.equal(true);
  })

  it('should add military to a territory', () => {
    territory.addMilitaryUnits(5);
    expect(territory).has.property('militaryUnits').to.equal(15);
  })

  it('should remove military from a territory', () => {
    territory.removeMilitaryUnits(5);
    expect(territory).has.property('militaryUnits').to.equal(5);
  })

  it('should check if the territory is occupied by a ruler', () => {
    let result = territory.isOccupiedBy(Player);
    expect(result).to.equal(false);
    territory.setRuler(Player);
    result = territory.isOccupiedBy(Player);
    expect(result).to.equal(true);
  })

  it('should check if the territory has more than one military unit', () => {
    let result = territory.hasMilitaryUnits();
    expect(result).to.equal(true);
    territory.removeMilitaryUnits(9);
    result = territory.hasMilitaryUnits();
    expect(result).to.equal(false);
  })

  it('should return all the neighbours of a territory', () => {
    const neighbours = territory.getNeighbours();
    expect(neighbours).to.eql(['Middle East', 'Afghanistan', 'China', 'Siam'])
  })

  it('should check if the given territory is a neighbour of attacking territory', () => {
    let result = territory.hasNeighbour('China');
    expect(result).to.equal(true);
    result = territory.hasNeighbour('Alaska');
    expect(result).to.equal(false);
  })
});


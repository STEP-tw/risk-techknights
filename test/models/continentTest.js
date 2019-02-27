const { expect } = require('chai');
const { Continent } = require('./../../src/models/continent');

const territories = [
  { name: 'India', ruler: { id: 1 } },
  { name: 'China', ruler: { id: 1 } },
  { name: 'Middle East', ruler: { id: 1 } }
]
const continent = new Continent('Asia', territories, 10);

describe('Continent Model', () => {
  it('should check if the continent is occupied or not', () => {
    let result = continent.isOccupied(1)
    expect(result).to.eql(true);
    result = continent.isOccupied(2)
    expect(result).to.eql(false)
  });

  it('should check if the the player can get continent bonus', () => {
    let result = continent.getContinentBonus(1)
    expect(result).to.eql(10);
    result = continent.getContinentBonus(2)
    expect(result).to.eql(0)
  });
});


const { expect } = require('chai');

const Fortify = require('../../src/models/fortify');
const Territory = require('../../src/models/territory');
const Player = require('../../src/models/player');

const player = new Player(1, 'Player 1', 10);
const fortify = new Fortify(player);
const India = new Territory('India', ['China'], 10);
const China = new Territory('China', ['India'], 10);
fortify.setSourceTerritory(India);
fortify.setDestinationTerritory(China);
describe('fortify', function() {
  it('should add and remove the military units', function() {
    fortify.fortifyMilitaryUnits(5);
    expect(fortify.sourceTerritory)
      .has.property('militaryUnits')
      .to.equal(5);
    expect(fortify.destinationTerritory)
      .has.property('militaryUnits')
      .to.equal(15);
  });
});

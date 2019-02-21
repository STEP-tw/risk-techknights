const { expect } = require('chai');
const Territory = require('./../../src/models/territory');
const Attack = require('../../src/models/attack');

const neighbours = ['Middle East', 'Afghanistan', 'China', 'Siam'];
const attacker = { id: 1, name: 'Player 1' }
const defender = { id: 2, name: 'Player 2' }

describe('Attack Model', () => {
  let attack;
  beforeEach(() => {
    attack = new Attack(attacker);
    attack.defender = defender;
    attack.attackingTerritory = new Territory('India', neighbours, 10);
  })

  it('should update military unit of attacking & defending territory', () => {
    attack.defendingTerritory = new Territory('China', neighbours, 1);
    expect(attack.attackingTerritory).has.property('militaryUnits').to.equal(10);
    expect(attack.defendingTerritory).has.property('militaryUnits').to.equal(1);

    attack.updateBattleResult(1, 1);
    expect(attack.attackingTerritory).has.property('militaryUnits').to.equal(9);
    expect(attack.defendingTerritory).has.property('militaryUnits').to.equal(0);
  });

  it('should move military unit if territory is conquered', () => {
    attack.defendingTerritory = new Territory('China', neighbours, 0);
    attack.won = true;
    attack.isTerritoryConquered();
    expect(attack.attackingTerritory).has.property('militaryUnits').to.equal(9);
    expect(attack.defendingTerritory).has.property('militaryUnits').to.equal(1);
  });

  it('should not move military unit if territory is not conquered', () => {
    attack.defendingTerritory = new Territory('China', neighbours, 1);
    attack.isTerritoryConquered();
    expect(attack.attackingTerritory).has.property('militaryUnits').to.equal(10);
    expect(attack.defendingTerritory).has.property('militaryUnits').to.equal(1);
  });

  it('should return  battle details', () => {
    const expectedOutput = {
      startBattle: true,
      attackerName: attack.attacker,
      defenderName: attack.defender,
      attackingTerritory: attack.attackingTerritory.name,
      defendingTerritory: attack.defendingTerritory.name,
      attackerMilitary: attack.attackingTerritory.militaryUnits,
      defendingMilitary: attack.defendingTerritory.militaryUnits
    }
    const actualOutput = attack.getCurrentAttackDetails();
    expect(actualOutput).to.eql(expectedOutput);
  })
});

const Attack = require('../models/attack');
const Fortify = require('../models/fortify');
const { getCurrentGame, isCurrentPlayer } = require('../handlers/util');

const isValidDefendingTerritory = function (TERRITORIES, attackingTerritory, defendingTerritory) {
  if (attackingTerritory == '') return false;
  return TERRITORIES[attackingTerritory.name].hasNeighbour(defendingTerritory);
};

const sendBattleDetails = function (attack) {
  return attack.getCurrentAttackDetails();
};

const setAttacker = function (game) {
  if (!game.attack) {
    const attacker = game.getCurrentPlayer();
    game.attack = new Attack(attacker);
  }
};

const canTerritoryAttack = function (territories, attackingTerritory, attacker) {
  if (!attackingTerritory.hasMilitaryUnits()) return false;
  const neighbours = attackingTerritory.getNeighbours();
  const hasValidNeighbour = neighbours.some(neighbour => !territories[neighbour].isOccupiedBy(attacker));
  return hasValidNeighbour;
};


const setAttackingTerritory = function (currentGame, territory) {
  const attacker = currentGame.getCurrentPlayer();
  if (territory.isOccupiedBy(attacker)) {
    if (canTerritoryAttack(currentGame.territories, territory, attacker)) {
      currentGame.attack.attackingTerritory = territory;
    }
  }
}

const setDefendingTerritory = function (currentGame, territory) {
  const attackingTerritory = currentGame.attack.attackingTerritory;
  if (isValidDefendingTerritory(currentGame.territories, attackingTerritory, territory.name)) {
    currentGame.attack.defender = territory.ruler;
    currentGame.attack.defendingTerritory = territory;
  }
}

const setTerritoriesForAttack = function (currentGame, territory) {
  setAttacker(currentGame);
  setAttackingTerritory(currentGame, territory);
  if (currentGame.attack.attackingTerritory) {
    setDefendingTerritory(currentGame, territory);
  }
}

const startAttack = function (req, res) {
  if (!isCurrentPlayer(req)) return res.send({ startBattle: false });
  const currentGame = getCurrentGame(req);
  const territoryName = req.body.territoryName;
  const selectedTerritory = currentGame.territories[territoryName];
  setTerritoriesForAttack(currentGame, selectedTerritory);
  if (currentGame.attack.defendingTerritory) {
    return res.send(sendBattleDetails(currentGame.attack));
  }
  res.send({ startBattle: false });
};

const isAttackWon = function (currentGame) {
  if (currentGame.attack.isWon()) {
    currentGame.fortify = new Fortify(currentGame.attack.attacker);
    currentGame.fortify.setSourceTerritory(currentGame.attack.attackingTerritory);
    currentGame.fortify.setDestinationTerritory(currentGame.attack.defendingTerritory);
  }
};

const updateMilitaryUnits = function (req, res) {
  const currentGame = getCurrentGame(req);
  const { attackerLostUnits, defenderLostUnits } = req.body;
  currentGame.attack.updateMilitary(attackerLostUnits, defenderLostUnits);
  isAttackWon(currentGame);
  res.send(sendBattleDetails(currentGame.attack));
};

const attackAgain = function (req, res) {
  const currentGame = getCurrentGame(req);
  res.send(sendBattleDetails(currentGame.attack));
};

const sendBattleResult = function (currentGame) {
  const currentPlayer = currentGame.getCurrentPlayer();
  currentGame.attack.conquerTerritory();
  currentGame.activityLog.conquerTerritory(currentGame.attack);
  currentPlayer.hasWonAttack = true;
  const attack = currentGame.attack;
  currentGame.attack = undefined;
  return { color: currentPlayer.color, attack };
}

const battleComplete = function (req, res) {
  const currentGame = getCurrentGame(req);
  if (currentGame.attack.won) {
    return res.send(sendBattleResult(currentGame));
  }
  currentGame.attack = undefined;
  res.send({});
};

module.exports = {
  startAttack,
  updateMilitaryUnits,
  attackAgain,
  battleComplete
};

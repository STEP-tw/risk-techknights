const Attack = require('../models/attack');
const Fortify = require('../models/fortify');
const { getCurrentGame, isCurrentPlayer } = require('../handlers/util');

const isValidDefendingTerritory = function (TERRITORIES, attackingTerritory, territoryToCheck) {
  if (attackingTerritory == '') return false;
  return TERRITORIES[attackingTerritory.name].hasNeighbour(territoryToCheck);
};

const sendBattleDetails = function (attack) {
  return attack.getCurrentAttackDetails();
};

const setAttacker = function (game, attacker) {
  if (!game.attack) {
    game.attack = new Attack(attacker);
  }
};

const canTerritoryAttack = function (TERRITORIES, attackingTerritory, attacker) {
  if (!attackingTerritory.hasMilitaryUnits()) return false;
  const neighbours = attackingTerritory.getNeighbours();
  const hasValidNeighbour = neighbours.some(neighbour => !TERRITORIES[neighbour].isOccupiedBy(attacker));
  return hasValidNeighbour;
};

const setAttackingTerritory = function (attack, territory) {
  let data = {};
  if (attack.attackingTerritory != '' && attack.attackingTerritory != territory.name) {
    data = { previousTerritory: attack.attackingTerritory };
  }
  attack.attackingTerritory = territory;
  return data;
};

const validateTerritory = function (currentGame, territory) {
  const attacker = currentGame.getCurrentPlayer();
  const isAttackingTerritorySet = true;
  let data = {};
  if (canTerritoryAttack(currentGame.territories, territory, attacker)) {
    data = setAttackingTerritory(currentGame.attack, territory);
    return { isAttackingTerritorySet, data };
  }
  data = { previousTerritory: territory.name };
  return { isAttackingTerritorySet, data };
};

const selectAttackingTerritory = function (currentGame, territory) {
  const attacker = currentGame.getCurrentPlayer();
  setAttacker(currentGame, attacker);
  let data = {};
  const isAttackingTerritorySet = false;
  if (territory.isOccupiedBy(attacker)) {
    return validateTerritory(currentGame, territory);
  }
  return { isAttackingTerritorySet, data };
};

const selectDefendingTerritory = function (currentGame, territory) {
  const attackingTerritory = currentGame.attack.attackingTerritory;
  if (isValidDefendingTerritory(currentGame.territories, attackingTerritory, territory.name)) {
    currentGame.attack.defender = territory.ruler;
    currentGame.attack.defendingTerritory = territory;
    // currentGame.activityLog.attack(currentGame.attack);
    return sendBattleDetails(currentGame.attack);
  }
  return { previousTerritory: territory.name };
};

const startAttack = function (req, res) {
  if (!isCurrentPlayer(req)) return res.send({});
  const currentGame = getCurrentGame(req);
  const territoryName = req.body.territoryName;
  const selectedTerritory = currentGame.territories[territoryName];
  let { isAttackingTerritorySet, data } = selectAttackingTerritory(currentGame, selectedTerritory);
  if (isAttackingTerritorySet) {
    return res.send(data);
  }
  data = selectDefendingTerritory(currentGame, selectedTerritory);
  res.send(data);
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

const battleComplete = function (req, res) {
  const currentGame = getCurrentGame(req);
  const currentPlayer = currentGame.getCurrentPlayer();
  const attack = currentGame.attack;
  currentGame.attack = undefined;
  if (attack.won) {
    currentGame.activityLog.conquerTerritory(attack);
    currentPlayer.hasWonAttack = true;
    res.send({ color: currentPlayer.color, attack });
    return;
  }
  res.send({ conquered: false });
};

module.exports = {
  startAttack,
  updateMilitaryUnits,
  attackAgain,
  battleComplete
};

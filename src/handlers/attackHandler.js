const Attack = require('../models/attack');

const getCurrentGame = function (req) {
  const gameID = req.cookies.game;
  const activeGames = req.app.games;
  return activeGames.getGame(gameID);
}

const isValidDefendingTerritory = function (TERRITORIES, attackingTerritory, territoryToCheck) {
  if (attackingTerritory == '') return false;
  return TERRITORIES[attackingTerritory.name].hasNeighbour(territoryToCheck);
}

const sendBattleDetails = function (attack) {
  return attack.getCurrentAttackDetails();
}

const setAttacker = function (game, attacker) {
  if (!game.attack) {
    game.attack = new Attack(attacker);
  }
}

const canTerritoryAttack = function (TERRITORIES, territory, attacker) {
  if (!territory.hasMilitaryUnits()) return false;
  const neighbours = territory.getNeighbours();
  const hasValidNeighbour = neighbours.some(neighbour => !TERRITORIES[neighbour].isOccupiedBy(attacker));
  return hasValidNeighbour;
}

const setAttackingTerritory = function (attack, territory) {
  let data = {};
  if (attack.attackingTerritory != '' && attack.attackingTerritory != territory.name) {
    data = { previousTerritory: attack.attackingTerritory }
  }
  attack.attackingTerritory = territory;
  return data;
}

const validateTerritory = function (currentGame, attacker, territory) {
  const isAttackingTerritorySet = true;
  let data = {};
  if (canTerritoryAttack(currentGame.territories, territory, attacker)) {
    data = setAttackingTerritory(currentGame.attack, territory);
    return { isAttackingTerritorySet, data };
  }
  data = { previousTerritory: territory.name }
  return { isAttackingTerritorySet, data };
}

const selectAttackingTerritory = function (currentGame, attackerID, territory) {
  const attacker = currentGame.getPlayerDetailsById(attackerID);
  setAttacker(currentGame, attacker);
  let data = {};
  const isAttackingTerritorySet = false;
  if (territory.isOccupiedBy(attacker)) {
    return validateTerritory(currentGame, attacker, territory);
  }
  return { isAttackingTerritorySet, data };
}

const selectDefendingTerritory = function (currentGame, territory) {
  const attackingTerritory = currentGame.attack.attackingTerritory;
  if (isValidDefendingTerritory(currentGame.territories, attackingTerritory, territory.name)) {
    currentGame.attack.defender = territory.ruler;
    currentGame.attack.defendingTerritory = territory;
    return sendBattleDetails(currentGame.attack);
  }
  return { previousTerritory: territory.name };
}

const startAttack = function (req, res) {
  const currentGame = getCurrentGame(req);
  const selectedTerritory = currentGame.territories[req.body.territoryName];
  const attackerID = req.cookies.playerId;
  let { isAttackingTerritorySet, data } = selectAttackingTerritory(currentGame, attackerID, selectedTerritory);
  if (isAttackingTerritorySet) {
    return res.send(data);
  }
  data = selectDefendingTerritory(currentGame, selectedTerritory);
  res.send(data);
}

const isAttackWon = function (attack) {
  if (attack.defendingTerritory.militaryUnits < 1) {
    attack.won = true;
    attack.defendingTerritory.setRuler(attack.attacker);
  }
}

const updateCount = function (req, res) {
  const attack = getCurrentGame(req).attack;
  const { attackerLostUnits, defenderLostUnits } = req.body;
  attack.updateBattleResult(attackerLostUnits, defenderLostUnits);
  isAttackWon(attack);
  res.send(sendBattleDetails(attack));
}

const attackAgain = function (req, res) {
  const currentGame = getCurrentGame(req);
  res.send(sendBattleDetails(currentGame.attack));
}

const battleComplete = function (req, res) {
  let currentGame = getCurrentGame(req);
  currentGame.attack.isTerritoryConquered();
  res.send({ attackingTerritory: currentGame.attack.attackingTerritory, defendingTerritory: currentGame.attack.defendingTerritory });
  currentGame.attack  = undefined;
}

module.exports = {
  startAttack, updateCount, attackAgain, battleComplete
}

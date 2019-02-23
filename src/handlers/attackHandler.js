const Attack = require('../models/attack');
const Fortify = require('../models/fortify');
const { INSTRUCTIONS } = require('../constants');

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

const isCurrentPlayer = function (req) {
  const currentGame = getCurrentGame(req);
  const currentPlayer = currentGame.getCurrentPlayer();
  const playerId = req.cookies.playerId;
  return currentPlayer.id == playerId;
}

const startAttack = function (req, res) {
  if (!isCurrentPlayer(req)) return res.send({});
  const currentGame = getCurrentGame(req);
  const currentPlayer = currentGame.getCurrentPlayer();
  currentPlayer.setInstruction(INSTRUCTIONS[4].defaultMsg);

  const selectedTerritory = currentGame.territories[req.body.territoryName];
  const attackerID = req.cookies.playerId;
  let { isAttackingTerritorySet, data } = selectAttackingTerritory(currentGame, attackerID, selectedTerritory);
  if (isAttackingTerritorySet) {
    return res.send(data);
  }
  data = selectDefendingTerritory(currentGame, selectedTerritory);
  res.send(data);
}

const isAttackWon = function (currentGame) {
  if (currentGame.attack.defendingTerritory.militaryUnits < 1) {
    currentGame.attack.won = true;
    currentGame.attack.defendingTerritory.setRuler(currentGame.attack.attacker);
    currentGame.fortify = new Fortify(currentGame.attack.attacker);
    currentGame.fortify.setSourceTerritory(currentGame.attack.attackingTerritory);
    currentGame.fortify.setDestinationTerritory(currentGame.attack.defendingTerritory);
  }
}

const updateCount = function (req, res) {
  const currentGame = getCurrentGame(req);
  const { attackerLostUnits, defenderLostUnits } = req.body;
  currentGame.attack.updateBattleResult(attackerLostUnits, defenderLostUnits);
  isAttackWon(currentGame);
  res.send(sendBattleDetails(currentGame.attack));
}

const attackAgain = function (req, res) {
  const currentGame = getCurrentGame(req);
  res.send(sendBattleDetails(currentGame.attack));
}

const battleComplete = function (req, res) {
  let currentGame = getCurrentGame(req);
  currentGame.attack.isTerritoryConquered();
  const color = currentGame.getCurrentPlayer().color;
  const attack = currentGame.attack;
  if (currentGame.attack.won) {
  currentGame.attack = undefined;
    res.send({ color, attack });
    return;
  }
  currentGame.attack = undefined;
  res.send({ conquered: false });
}

module.exports = {
  startAttack, updateCount, attackAgain, battleComplete
}

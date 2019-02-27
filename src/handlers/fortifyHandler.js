const Fortify = require("../models/fortify");

const getCurrentGame = function(req) {
  const gameID = req.cookies.game;
  const activeGames = req.app.games;
  return activeGames.getGame(gameID);
};

const changeCurrentPlayerPhase = function(req, res) {
  const playerId = req.cookies.playerId;
  const currentGame = getCurrentGame(req);
  const currentPlayer = currentGame.getCurrentPlayer();
  currentPlayer.getCard();
  if (currentPlayer.id == playerId) {
    currentGame.changePlayerPhase();
  }
  const player = currentGame.getCurrentPlayer();
  if (player.phase == 3) {
    const militaryCount = currentGame.calculateBonusMilitaryUnits(player.id);
    player.addMilitaryUnits(militaryCount);
  }
  currentGame.attack = undefined;
  currentGame.fortify = undefined;
  currentGame.reinforcement = undefined;
  res.end();
};

const changePhase = function(req, res) {
  const currentGame = getCurrentGame(req);
  currentGame.changePhase();
  currentGame.attack = undefined;
  currentGame.fortify = undefined;
  res.end();
};

const setFortifier = function(game, fortifier) {
  if (!game.fortify) {
    game.fortify = new Fortify(fortifier);
  }
};

const canTerritoryFortify = function(TERRITORIES, territory, fortifier) {
  const neighbours = territory.getNeighbours();
  const hasValidNeighbour = neighbours.some(neighbour =>
    TERRITORIES[neighbour].isOccupiedBy(fortifier)
  );
  return hasValidNeighbour;
};

const setFortifyingTerritories = function(fortify, territory) {
  if (fortify.sourceTerritory && fortify.sourceTerritory != territory) {
    fortify.destinationTerritory = territory;
  }
  if (territory.hasMilitaryUnits()) {
    fortify.sourceTerritory = territory;
  }
};

const validateTerritory = function(currentGame, fortifier, territory) {
  if (canTerritoryFortify(currentGame.territories, territory, fortifier)) {
    setFortifier(currentGame, fortifier);
    setFortifyingTerritories(currentGame.fortify, territory);
  }
};

const selectFortifyingTerritory = function(
  currentGame,
  fortifierID,
  territory
) {
  const fortifier = currentGame.getPlayerDetailsById(fortifierID);
  if (territory.isOccupiedBy(fortifier)) {
    validateTerritory(currentGame, fortifier, territory);
  }
};

const startFortify = function(req, res) {
  const currentGame = getCurrentGame(req);
  const selectedTerritory = currentGame.territories[req.body.territoryName];
  const fortifierId = req.cookies.playerId;
  selectFortifyingTerritory(currentGame, fortifierId, selectedTerritory);
  res.send(currentGame.fortify);
};

const fortifyComplete = function(req, res) {
  const currentGame = getCurrentGame(req);
  const currentPlayer = currentGame.getCurrentPlayer();
  const militaryUnits = +req.body.militaryUnits;
  currentGame.fortify.fortifyMilitaryUnits(militaryUnits);
  currentGame.fortify = undefined;
  if (currentPlayer.phase == 5) {
    currentGame.changePlayerPhase();
  }
  const player = currentGame.getCurrentPlayer();
  if (player.phase == 3) {
    const militaryCount = currentGame.calculateBonusMilitaryUnits(player.id);
    player.addMilitaryUnits(militaryCount);
  }
  res.end();
};

module.exports = {
  startFortify,
  fortifyComplete,
  changePhase,
  changeCurrentPlayerPhase
};

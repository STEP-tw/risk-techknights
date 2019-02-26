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
  return {
    error: true,
    data: { msg: "Please Select valid fortify source territory" }
  };
};

const validateTerritory = function(currentGame, fortifier, territory) {
  if (canTerritoryFortify(currentGame.territories, territory, fortifier)) {
    setFortifier(currentGame, fortifier);
    return setFortifyingTerritories(currentGame.fortify, territory);
  }

  if (currentGame.fortify.sourceTerritory) {
    return {
      data: { msg: "Please Select valid destinationTerritory" },
      error: true
    };
  }
  return { data: { msg: "Please Select valid sourceTerritory" }, error: true };
};

const selectFortifyingTerritory = function(
  currentGame,
  fortifierID,
  territory
) {
  const fortifier = currentGame.getPlayerDetailsById(fortifierID);
  if (territory.isOccupiedBy(fortifier)) {
    return validateTerritory(currentGame, fortifier, territory);
  }

  if (currentGame.fortify.sourceTerritory) {
    return {
      data: { msg: "Please Select valid destinationTerritory" },
      error: true
    };
  }
  return { data: { msg: "Please Select valid sourceTerritory" }, error: true };
};

const startFortify = function(req, res) {
  const currentGame = getCurrentGame(req);
  const selectedTerritory = currentGame.territories[req.body.territoryName];
  const fortifierId = req.cookies.playerId;
  let { error, data } = selectFortifyingTerritory(
    currentGame,
    fortifierId,
    selectedTerritory
  );
  if (error) {
    return res.send(data);
  }
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

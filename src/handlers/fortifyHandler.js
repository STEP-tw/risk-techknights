const Fortify = require('../models/fortify');
const { INSTRUCTIONS } = require('../constants');


const getCurrentGame = function (req) {
  const gameID = req.cookies.game;
  const activeGames = req.app.games;
  return activeGames.getGame(gameID);
}

const changeToFortifyPhase = function (req, res) {
  // const currentGame = getCurrentGame(req);
  // currentGame.changePhase(INSTRUCTIONS);
  // currentGame.changePhase(INSTRUCTIONS);
}

const changeCurrentPlayerPhase = function(req, res) {
  const currentGame = getCurrentGame(req);
  currentGame.changePlayerPhase();
  res.end();
}


const changePhase = function (req, res) {
  const currentGame = getCurrentGame(req);
  currentGame.changePhase(INSTRUCTIONS);
  currentGame.attack = undefined;
  currentGame.fortify = undefined;
}

const setFortifier = function (game, fortifier) {
  if (!game.fortify) {
    game.fortify = new Fortify(fortifier);
  }
}

const canTerritoryFortify = function (TERRITORIES, territory, fortifier) {
  const neighbours = territory.getNeighbours();
  const hasValidNeighbour = neighbours.some(neighbour => TERRITORIES[neighbour].isOccupiedBy(fortifier));
  return hasValidNeighbour;
}

const setFortifyingTerritories = function (fortify, territory) {
  if (fortify.sourceTerritory && fortify.sourceTerritory != territory) {
    fortify.destinationTerritory = territory;
    return { error: false }
  }
  if (territory.hasMilitaryUnits()) {
    fortify.sourceTerritory = territory;
    return { error: false }
  }
  return { error: true, data: { msg: 'Please Select valid fortify source territory' } }
}

const validateTerritory = function (currentGame, fortifier, territory) {
  if (canTerritoryFortify(currentGame.territories, territory, fortifier)) {
    setFortifier(currentGame, fortifier);
    return setFortifyingTerritories(currentGame.fortify, territory);
  }

  if (currentGame.fortify.sourceTerritory) {
    return { data: { msg: 'Please Select valid destinationTerritory' }, error: true }
  }
  return { data: { msg: 'Please Select valid sourceTerritory' }, error: true }
}

const selectFortifyingTerritory = function (currentGame, fortifierID, territory) {
  const fortifier = currentGame.getPlayerDetailsById(fortifierID);
  if (territory.isOccupiedBy(fortifier)) {
    return validateTerritory(currentGame, fortifier, territory);
  }

  if (currentGame.fortify.sourceTerritory) {
    return { data: { msg: 'Please Select valid destinationTerritory' }, error: true }
  }
  return { data: { msg: 'Please Select valid sourceTerritory' }, error: true }
}

const startFortify = function (req, res) {
  const currentGame = getCurrentGame(req);
  const selectedTerritory = currentGame.territories[req.body.territoryName];
  const fortifierId = req.cookies.playerId;
  let { error, data } = selectFortifyingTerritory(currentGame, fortifierId, selectedTerritory);
  if (error) {
    return res.send(data);
  }
  res.send(currentGame.fortify);
}

const fortifyComplete = function (req, res) {
  const currentGame = getCurrentGame(req);
  const militaryUnits = +req.body.militaryUnits;
  currentGame.fortify.fortifyMilitaryUnits(militaryUnits);
  currentGame.fortify = undefined;
  currentGame.changePlayerPhase();
  res.end();
}

module.exports = {
  startFortify, changeToFortifyPhase, fortifyComplete, changePhase,
  changeCurrentPlayerPhase
}

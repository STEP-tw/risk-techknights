const {
  getCurrentGame,
  isCurrentPlayer,
  getActualPlayer
} = require('../handlers/util');

const addTerritory = function(currentGame, territory) {
  const currentPlayer = currentGame.getCurrentPlayer();
  territory.setRuler(currentPlayer);
  territory.addMilitaryUnits(1);
  currentPlayer.removeMilitaryUnits(1);
  currentGame.activityLog.claimTerritory(territory, currentPlayer);
  currentGame.changeTurn();
};

const validateAndAddTerritory = function(req) {
  const territoryName = req.body.territoryName;
  const currentGame = getCurrentGame(req);
  const selectedTerritory = currentGame.territories[territoryName];
  if (!selectedTerritory.isOccupied()) {
    addTerritory(currentGame, selectedTerritory);
    return true;
  }
  return false;
};

const claimTerritory = function(req, res) {
  if (!isCurrentPlayer(req)) return res.send({ isValidTerritory: false });
  const currentGame = getCurrentGame(req);
  const color = currentGame.getCurrentPlayer().color;
  const isValidTerritory = validateAndAddTerritory(req);
  if (currentGame.isAllTerritoriesOccupied()) {
    currentGame.changePhase();
  }
  res.send({ isValidTerritory, color, militaryUnits: 1 });
};

const highlightReinforcementTerritories = function(game) {
  if (game.reinforcement) {
    return [game.reinforcement.territory.name];
  }
  return [];
};

const highlightAttackingTerritories = function(game) {
  let territories = [];
  if (game.attack && game.attack.attackingTerritory) {
    territories.push(game.attack.attackingTerritory.name);
    if (game.attack.defendingTerritory)
      territories.push(game.attack.defendingTerritory.name);
  }
  return territories;
};

const highlightFortifyTerritories = function(game) {
  let territories = [];
  if (game.fortify) {
    territories.push(game.fortify.sourceTerritory.name);
    if (game.fortify.destinationTerritory)
      territories.push(game.fortify.destinationTerritory.name);
  }
  return territories;
};

const phases = {
  2: highlightReinforcementTerritories,
  3: highlightReinforcementTerritories,
  4: highlightAttackingTerritories,
  5: highlightFortifyTerritories
};

const isAllTerritoriesConquered = function(conqueredTerritories) {
  return conqueredTerritories.length == 42;
};

const hasPlayerWon = function(currentGame, currentPlayer) {
  const territories = currentGame.territories;
  const conqueredTerritories = Object.keys(territories).filter(name =>
    territories[name].isOccupiedBy(currentPlayer)
  );
  return isAllTerritoriesConquered(conqueredTerritories);
};

const selectedTerritories = function(game) {
  const currentPlayer = game.getCurrentPlayer();
  const currentPhase = currentPlayer.phase;
  if (currentPhase >= 2) {
    return phases[currentPhase](game);
  }
  return [];
};

const sendGameStoppedDetails = function(req) {
  return {
    isGameRunning: false,
    gameId: req.cookies.game,
    playerId: req.cookies.playerId
  };
};

const hasPlayerLost = function(game, player) {
  if (!game.isAllTerritoriesOccupied()) return false;
  const territories = game.territories;
  const conqueredTerritories = Object.keys(territories).filter(name =>
    territories[name].isOccupiedBy(player)
  );
  return conqueredTerritories.length == 0;
};

const sendGameDetails = function(req) {
  const currentGame = getCurrentGame(req);
  const currentPlayer = currentGame.getCurrentPlayer();
  const highlight = selectedTerritories(currentGame);
  const horsePosition = currentGame.getHorsePosition();
  const actualPlayer = currentGame.getPlayerDetailsById(req.cookies.playerId);
  const winner = hasPlayerWon(currentGame, currentPlayer);
  const isEliminated = hasPlayerLost(currentGame, actualPlayer);
  if (isEliminated) currentGame.removeEliminatedPlayerTurn(actualPlayer);
  return {
    currentGame,
    currentPlayer,
    highlight,
    isGameRunning: true,
    horsePosition,
    player: actualPlayer,
    winner,
    isEliminated
  };
};

const sendGamePageDetails = function(req, res) {
  const gameId = req.cookies.game;
  const activeGames = req.app.games;
  if (activeGames.isRunning(gameId)) {
    res.send(sendGameDetails(req));
    return;
  }
  res.send(sendGameStoppedDetails(req));
};

const makePlayerToContinueWatching = function(req, res) {
  const actualPlayer = getActualPlayer(req);
  actualPlayer.wantsToContinue = true;
  res.end();
};

module.exports = { sendGamePageDetails, claimTerritory, makePlayerToContinueWatching };

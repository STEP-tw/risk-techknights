const { INSTRUCTIONS } = require('../constants');
const addTerritory = function (game, territory, player) {
  territory.setRuler(player);
  territory.addMilitaryUnits(1);
  player.removeMilitaryUnits(1);
  game.changeTurn(INSTRUCTIONS);
};

const sendTerritoryDetails = function (
  res,
  isValidTerritory,
  color,
  territoryMilitaryUnits,
  nextPlayer
) {
  const content = {
    isValidTerritory,
    color,
    territoryMilitaryUnits,
    nextPlayer
  };
  res.send(content);
};

const addValidTerritory = function (req, res) {
  const game = req.app.games.getGame(req.cookies.game);
  const currentPlayer = game.getCurrentPlayer();
  const nextPlayer = game.getNextPlayer();
  const territory = game.territories[req.body.territoryName];
  const isValidTerritory =
    !territory.isOccupied() && currentPlayer.id == req.cookies.playerId;

  if (isValidTerritory) {
    addTerritory(game, territory, currentPlayer);
  }

  if (game.isAllTerritoriesOccupied()) {
    game.changePhase(INSTRUCTIONS);
  }

  sendTerritoryDetails(
    res,
    isValidTerritory,
    currentPlayer.color,
    territory.militaryUnits,
    nextPlayer
  );
};

const selectedTerritories = function (game) {
  let highlight = [];
  if (game.attack) {
    highlight.push(game.attack.attackingTerritory.name);
    if (game.attack.defendingTerritory)
      highlight.push(game.attack.defendingTerritory.name);
  }

  if (game.fortify) {
    highlight.push(game.fortify.sourceTerritory.name);
    if (game.fortify.destinationTerritory)
      highlight.push(game.fortify.destinationTerritory.name);
  }

  if (game.reinforcement) {
    highlight.push(game.reinforcement.territory.name);
  }
  return highlight;
}

const sendGamePageDetails = function (req, res) {
  const game = req.app.games.getGame(req.cookies.game);
  const currentPlayer = game.getCurrentPlayer();
  const instruction = game.getPlayerDetailsById(req.cookies.playerId).instruction;
  const highlight = selectedTerritories(game);
  const isCurrentPlayer = game.getCurrentPlayer().id == req.cookies.playerId;
  const gamePageDetails = {
    territories: game.territories,
    currentPlayer,
    instruction,
    highlight,
    phase: currentPlayer.phase,
    isCurrentPlayer
  };
  res.send(gamePageDetails);
};

module.exports = { sendGamePageDetails, addValidTerritory };

const addTerritory = function (game, territory, player) {
  territory.setRuler(player);
  territory.addMilitaryUnits(5);
  player.removeMilitaryUnits(5);
  game.changeTurn();
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
    game.changePhase();
  }

  sendTerritoryDetails(
    res,
    isValidTerritory,
    currentPlayer.color,
    territory.militaryUnits,
    nextPlayer
  );
};

const sendGamePageDetails = function (req, res) {
  const game = req.app.games.getGame(req.cookies.game);
  const currentPlayer = game.getCurrentPlayer();
  const instruction = game.getPlayerDetailsById(req.cookies.playerId).instruction;
  const highlight = []
  if (game.attack) {
    highlight = [game.attack.attackingTerritory, game.attack.defendingTerritory]
  }
  if (game.fortify) {
    highlight = [game.fortify.sourceTerritory, game.fortify.destinationTerritory]
  }
  const gamePageDetails = {
    territories: game.territories,
    currentPlayer,
    instruction,
    highlight
  };
  res.send(gamePageDetails);
};

module.exports = { sendGamePageDetails, addValidTerritory };

const addTerritory = function(game, territory, player) {
  territory.setRuler(player);
  territory.addMilitaryUnits(5);
  player.removeMilitaryUnits(5);
  game.changeTurn();
};

const sendTerritoryDetails = function(
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

const addValidTerritory = function(req, res) {
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

const sendGamePageDetails = function(INSTRUCTIONS, req, res) {
  const game = req.app.games.getGame(req.cookies.game);
  const currentPlayer = game.getCurrentPlayer();
  const playerDetails = {
    territories: game.territories,
    currentPlayer,
    instruction: INSTRUCTIONS.getInstruction("initialPhase")
  };
  res.send(playerDetails);
};

module.exports = { sendGamePageDetails, addValidTerritory };

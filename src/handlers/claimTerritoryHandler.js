const addTerritory = function(game, territory, player) {
  territory.addRuler(player);
  territory.addMilitaryUnits(1);
  player.removeMilitaryUnits(1);
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
  sendTerritoryDetails(
    res,
    isValidTerritory,
    currentPlayer.color,
    territory.militaryUnits,
    nextPlayer
  );
};

const send = function(res, content, statusCode, contentType) {
  res.setHeader("Content-Type", contentType);
  res.status(statusCode);
  res.write(content);
  res.end();
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

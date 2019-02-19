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
  const content = JSON.stringify({
    isValidTerritory,
    color,
    territoryMilitaryUnits,
    nextPlayer
  });
  send(res, content, 200, "application/json");
};

const addValidTerritory = function(game, req, res) {
  const currentPlayer = game.getCurrentPlayer();
  const nextPlayer = game.getNextPlayer();
  const territory = game.territories[req.body.territoryName];
  const isValidTerritory = !territory.isOccupied();
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
/*TERRITORIES,
  players,
  playerNames,
  ids,*/
const sendGamePageDetails = function(game, INSTRUCTIONS, req, res) {
  const currentPlayer = game.getCurrentPlayer();
  const playerDetails = {
    territories: game.territories,
    currentPlayer,
    instruction: INSTRUCTIONS.getInstruction("initialPhase")
  };
  send(res, JSON.stringify(playerDetails), 200, "application/json");
};

module.exports = { sendGamePageDetails, addValidTerritory };

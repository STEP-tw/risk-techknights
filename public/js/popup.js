const getPlayerCardPopup = document =>
  document.getElementById('playerDetailsPopup');

const getActivityLogPopup = document =>
  document.getElementById('activityLogPopup');

const getWinningPopup = document => document.getElementById('winningPopup');

const getEliminationPopup = document =>
  document.getElementById('eliminationPopup');

const getSaveGamePopup = document => document.getElementById('savedGamePopup');

const closeCardPopup = function() {
  const playerCardPopup = getPlayerCardPopup(document);
  hideElement(playerCardPopup);
};

const hideAcitvityLog = function() {
  const activityLogPopup = getActivityLogPopup(document);
  hideElement(activityLogPopup);
};

const closeWinningPopup = function() {
  const winningPopup = getWinningPopup(document);
  hideElement(winningPopup);
  clearInterval(mapFetcher);
};

const displayEliminationPopup = function(playerName) {
  const lostMessage = playerName + LOST_GAME_MESSAGE;
  const eliminationPopup = getEliminationPopup(document);
  setElementDisplay(eliminationPopup, DISPLAY_BLOCK);
  setElementInnerText(document.getElementById('eliminatedPlayer'), lostMessage);
};

const hideEliminationPopup = function() {
  hideElement(getEliminationPopup(document));
  fetch('/wantsToContinue');
};

const deactivateSaveGameOption = function() {
  document.getElementById('save').onclick = undefined;
};

const displayConfirmSaveGame = function() {
  setElementDisplay(document.getElementById('confirmSaveGame'), DISPLAY_BLOCK);
};

const hideConfirmSavePopup = function() {
  setElementDisplay(document.getElementById('confirmSaveGame'), DISPLAY_NONE);
};

const displayClosedGamePopup = function(gameDetails) {
  const { gameId, playerId } = gameDetails;
  const savedGamePopup = getSaveGamePopup(document);
  savedGamePopup.classList.add('popup-box', 'saved-game-popup');
  setElementDisplay(savedGamePopup, DISPLAY_BLOCK);
  setElementInnerText(document.getElementById('loadGameId'), gameId);
  setElementInnerText(document.getElementById('loadPlayerId'), playerId);
  clearInterval(mapFetcher);
};

const displayWinningPopup = function(player) {
  setElementDisplay(getWinningPopup(document), DISPLAY_BLOCK);
  setElementDisplay(document.getElementById('closeGame'), DISPLAY_BLOCK);
  setElementInnerText(document.getElementById('winnerPlayer'), player);
};

const getPlayerCardPopup = document => document.getElementById('playerDetailsPopup');

const getActivityLogPopup = document => document.getElementById('activityLogPopup');

const getWinningPopup = document => document.getElementById('winningPopup');

const closeCardPopup = function () {
  const playerCardPopup = getPlayerCardPopup(document);
  hideElement(playerCardPopup);
}

const hideAcitvityLog = function () {
  const activityLogPopup = getActivityLogPopup(document);
  hideElement(activityLogPopup);
}

const closeWinningPopup = function () {
  const winningPopup = getWinningPopup(document);
  hideElement(winningPopup);
  clearInterval(mapFetcher);
} 

const displayEliminationPopup = function(playerName) {
  const lostMessage  = playerName + LOST_GAME_MESSAGE;
  setElementDisplay(document.getElementById('eliminationPopup'), DISPLAY_BLOCK);
  setElementInnerText(document.getElementById('eliminatedPlayer'), lostMessage);
};

const hideEliminationPopup = function() {
  hideElement(document.getElementById('eliminationPopup'));
  fetch('/wantsToContinue');
};

const deactivateSaveGameOption = function() {
  document.getElementById('save').onclick = undefined;
};

const displayClosedGamePopup = function (gameDetails) {
  const { gameId, playerId } = gameDetails;
  const savedGamePopup = document.getElementById('savedGamePopup');
  savedGamePopup.classList.add('popup-box', 'saved-game-popup');
  setElementDisplay(savedGamePopup, DISPLAY_BLOCK);
  setElementInnerText(document.getElementById('loadGameId'), gameId);
  setElementInnerText(document.getElementById('loadPlayerId'), playerId);
  clearInterval(mapFetcher);
};

const displayWinningPopup = function (player) {
  setElementDisplay(document.getElementById('closeGame'), DISPLAY_BLOCK);
  setElementDisplay(document.getElementById('winningPopup'), DISPLAY_BLOCK);
  setElementInnerText(document.getElementById('winnerPlayer'), player);
}
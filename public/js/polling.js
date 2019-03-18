const loadGameDetails = function(currentGameDetails) {
  const {
    currentGame,
    highlight,
    currentPlayer,
    player,
    horsePosition
  } = currentGameDetails;
  renderTerritories(currentGame.territories, highlight);
  document.getElementById("allPlayers").innerHTML = "";
  updatePlayerNames(currentGame.players, currentGame.originalOrder);
  highlightCurrentPlayer(currentPlayer);
  updatePlayerDetails(player);
  updateHorsePosition(horsePosition);
  highlightPhase(player.phase);
  displayCurrentLog(currentGame.activityLog.currentLog);
  loadActivityData(currentGame.activityLog.logs);
};

const displayCurrentLog = function({ playerName, log }) {
  document.getElementById("current-log").innerHTML = playerName + ":  " + log;
};

const initializeGamePage = function() {
  fetch("/initializeGamePage")
    .then(res => res.json())
    .then(currentGameDetails => {
      const {
        currentPlayer,
        isGameRunning,
        winner,
        isEliminated,
        player
      } = currentGameDetails;
      if (!isGameRunning) {
        displayClosedGamePopup(currentGameDetails);
        return;
      }
      if (winner) {
        loadGameDetails(currentGameDetails);
        displayWinningPopup(currentPlayer.name);
        hideElement(document.getElementById("phaseSection"));
        hideElement(document.getElementById("placeMilitarySection"));
        return;
      }
      if (isEliminated && !player.wantsToContinue) {
        displayEliminationPopup(player.name);
      }
      if (player.wantsToContinue) {
        hideElement(document.getElementById("phaseSection"));
        hideElement(document.getElementById("placeMilitarySection"));
        setElementDisplay(document.getElementById("closeGame"), DISPLAY_BLOCK);
        deactivateSaveGameOption();
      }
      loadGameDetails(currentGameDetails);
    });
};

const mapFetcher = setInterval(initializeGamePage, 1000);

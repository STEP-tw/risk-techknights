const getParentElement = function (element) {
  if (element.tagName == 'a') return element.id;
  return element.parentElement.id;
};

const sendTerritoryAndValidate = function (event) {
  let territoryName = getParentElement(event.target);
  fetch('/claimTerritory', sendPostRequest({ territoryName }));
};

const updatePlayerDetails = function (player) {
  let name = player.name;
  document.getElementById('your-detail').innerText = name;
  document.getElementById('military-count').innerText = player.militaryUnits;
};

const updateCurrentPlayer = function ({ id }) {
  const nameDiv = document.getElementById(`name${id}`);
  nameDiv.style.fontWeight = "bold";
  nameDiv.className = 'player active-player';
};

const putPlayerDetails = function (player) {
  const {id, color, name} = player;
  const nameDiv = document.getElementById(`name${id}`);
  nameDiv.style.background = color;
  nameDiv.innerText = name;
  nameDiv.style.width= "125px";
  nameDiv.style.textAlign = "center"
  nameDiv.className = 'player';
};

const updatePlayerNames = function (players) {
  players.forEach(putPlayerDetails);
};

const updateHorsePosition = function (value) {
  document.getElementById('bonus').innerText = value;
};

const displayClosedGamePopup = function (gameDetails) {
  const { gameId, playerId } = gameDetails;
  document.getElementById('savedGamePopup').style.display = 'block';
  document.getElementById('loadGameId').innerText = gameId;
  document.getElementById('loadPlayerId').innerText = playerId;
};

const displayWinningPopup = function (player) {
  document.getElementById('winningPopup').style.display = 'block';
  document.getElementById('winnerPlayer').innerText = player;
}

const highlightPhase = function (phase) {
  document.getElementById('3').style.fontWeight = 'normal';
  document.getElementById('4').style.fontWeight = 'normal';
  document.getElementById('5').style.fontWeight = 'normal';
  if(phase> 2) {
    document.getElementById(phase).style.fontWeight = 'bold';    
  }
};

const updateActivityLog = function (activityLog) {
  const logs = activityLog.logs.join('\n');
  document.getElementById('activityLog').innerText = logs;
};

const loadGameDetails = function (currentGameDetails) {
  const { currentGame, highlight, currentPlayer, player, horsePosition } = currentGameDetails;
  renderOldTerritories(currentGame.territories, highlight);
  updatePlayerNames(currentGame.players);
  updateCurrentPlayer(currentPlayer);
  updatePlayerDetails(player);
  updateHorsePosition(horsePosition);
  highlightPhase(player.phase);
  updateActivityLog(currentGame.activityLog);
}

const initializeGamePage = function () {
  fetch('/initializeGamePage')
    .then(res => res.json())
    .then(currentGameDetails => {
      const { currentPlayer, isGameRunning, winner } = currentGameDetails;
      if (winner) {
        displayWinningPopup(currentPlayer.name);
        return;
      }
      if (isGameRunning) {
        loadGameDetails(currentGameDetails);
        return;
      }
      displayClosedGamePopup(currentGameDetails);
    });
};

const renderTerritory = function (territory, name, opacity = 1) {
  if(territory.ruler) {
  changeColorAndMilitaryUnits(name, territory.ruler.color, territory.militaryUnits, opacity);
  }
}

const renderOldTerritories = function (territories, highlight) {
  const renderTerritories = Object.keys(territories);
  let opacity = 1;
  if (highlight.length > 0) {
    opacity = 0.5
  }
  renderTerritories.forEach(territoryName => {
    const territory = territories[territoryName];
    renderTerritory(territory, territoryName, opacity);
  });

  highlight.forEach(territoryName => {
    const territory = territories[territoryName];
    renderTerritory(territory, territoryName, 1);
  });
};

setInterval(initializeGamePage, 1000);

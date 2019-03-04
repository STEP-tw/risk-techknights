const getParentElement = function(element) {
  if (element.tagName == 'a') return element.id;
  return element.parentElement.id;
};

const sendTerritoryAndValidate = function(event) {
  let territoryName = getParentElement(event.target);
  fetch('/claimTerritory', sendPostRequest({ territoryName }));
};

const updatePlayerDetails = function(player) {
  let name = player.name;
  document.getElementById('your-detail').innerText = name;
  document.getElementById('military-count').innerText = player.militaryUnits;
};

const updateCurrentPlayer = function({ id }) {
  const nameDiv = document.getElementById(`name${id}`);
  nameDiv.style.fontWeight = 'bold';
  nameDiv.className = 'player active-player';
};

const putPlayerDetails = function(player) {
  const { id, color, name } = player;
  const nameDiv = document.getElementById(`name${id}`);
  nameDiv.style.background = color;
  nameDiv.innerText = name;
  nameDiv.style.width = '125px';
  nameDiv.style.fontWeight = 'normal';
  nameDiv.style.textAlign = 'center';
  nameDiv.className = 'player';
};

const updatePlayerNames = function(players) {
  players.forEach(putPlayerDetails);
};

const updateHorsePosition = function(value) {
  document.getElementById('bonus').innerText = value;
};

const displayClosedGamePopup = function(gameDetails) {
  const { gameId, playerId } = gameDetails;
  let savedGamePopup = document.getElementById('savedGamePopup');
  savedGamePopup.classList.add('popup-box', 'saved-game-popup');
  savedGamePopup.style.display = 'block';
  document.getElementById('loadGameId').innerText = gameId;
  document.getElementById('loadPlayerId').innerText = playerId;
};

const displayWinningPopup = function(player) {
  document.getElementById('winningPopup').style.display = 'block';
  document.getElementById('winnerPlayer').innerText = player;
};

const displayEliminationPopup = function(player) {
  document.getElementById('eliminationPopup').style.display = 'block';
  document.getElementById('eliminatedPlayer').innerText = player;
};

const hideEliminationPopup = function() {
  document.getElementById('eliminationPopup').style.display = 'none';
  fetch('/wantsToContinue');
};

const deactivateSaveGameOption = function() {
  document.getElementById('save').onclick = '';
};

const highlightPhase = function(phase) {
  document.getElementById('3').style.fontWeight = 'normal';
  document.getElementById('4').style.fontWeight = 'normal';
  document.getElementById('5').style.fontWeight = 'normal';
  if (phase > 2) {
    document.getElementById(phase).style.fontWeight = 'bold';
  }
};

const loadGameDetails = function(currentGameDetails) {
  const {
    currentGame,
    highlight,
    currentPlayer,
    player,
    horsePosition
  } = currentGameDetails;
  renderOldTerritories(currentGame.territories, highlight);
  updatePlayerNames(currentGame.players);
  updateCurrentPlayer(currentPlayer);
  updatePlayerDetails(player);
  updateHorsePosition(horsePosition);
  highlightPhase(player.phase);
};

const initializeGamePage = function() {
  fetch('/initializeGamePage')
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
      }
      if (winner) {
        displayWinningPopup(currentPlayer.name);
        return;
      }
      if (isEliminated && !player.wantsToContinue) {
        displayEliminationPopup(player.name);
      }
      if (player.wantsToContinue) {
        deactivateSaveGameOption();
      }
      loadGameDetails(currentGameDetails);
    });
};

const renderTerritory = function(territory, name, opacity = 1) {
  if (territory.ruler) {
    changeColorAndMilitaryUnits(
      name,
      territory.ruler.color,
      territory.militaryUnits,
      opacity
    );
  }
};

const renderOldTerritories = function(territories, highlight) {
  const renderTerritories = Object.keys(territories);
  let opacity = 1;
  if (highlight.length > 0) {
    opacity = 0.5;
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

const mapFetcher = setInterval(initializeGamePage, 1000);

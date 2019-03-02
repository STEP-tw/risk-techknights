const getParentElement = function(element) {
  if (element.tagName == 'a') return element.id;
  return element.parentElement.id;
};

const sendTerritoryAndValidate = function(event) {
  let territoryName = getParentElement(event.target);
  fetch('/claimTerritory', sendPostRequest({ territoryName }))
    .then(res => res.json())
    .then(territoryDetails => {
      const {
        color,
        isValidTerritory,
        territoryMilitaryUnits
      } = territoryDetails;
      if (isValidTerritory) {
        changeColorAndMilitaryUnits(
          territoryName,
          color,
          territoryMilitaryUnits
        );
      }
    });
};

const updatePlayerDetails = function(player) {
  let name = player.name;
  document.getElementById('your-detail').innerText = name;
  document.getElementById('military-count').innerText = player.militaryUnits;
};

const updateRemainingPlayers = function(players, id) {
  console.log(players);
  const remainingPlayers = players.filter(player => player.id != id);
  remainingPlayers.forEach(player => {
    let playerNameDiv = document.getElementById(`player${player.id}`);
    playerNameDiv.style.fontSize = '16px';
    playerNameDiv.style.fontWeight = 'none';
    let playerColorDiv = document.getElementById(`color${id}`);
    playerColorDiv.style.width = '20px';
    playerColorDiv.style.height = '20px';
  });
};

const updateCurrentPlayer = function({ id, color }) {
  let playerNameDiv = document.getElementById(`player${id}`);
  let playerColorDiv = document.getElementById(`color${id}`);
  playerNameDiv.style.fontSize = '20px';
  playerNameDiv.style.fontWeight = 'bold';
  playerColorDiv.style.width = '25px';
  playerColorDiv.style.height = '20px';
  playerColorDiv.style.backgroundColor = color;
};

const putPlayerDetails = function(player) {
  let playerId = player.id;
  let color = player.color;
  let name = player.name;
  let colorDiv = document.getElementById(`color${playerId}`);
  colorDiv.style.backgroundColor = color;
  colorDiv.className = 'color';
  let nameDiv = document.getElementById(`name${playerId}`);
  nameDiv.innerText = name;
  nameDiv.className = 'player';
};

const updatePlayerNames = function(players) {
  players.forEach(putPlayerDetails);
};

const updateHorsePosition = function(value) {
  document.getElementById('bonus').innerText = value;
};

const updateCurrentPhase = function() {
  document.getElementById('1').className = 'btn';
  document.getElementById('2').className = 'btn';
  document.getElementById('3').className = 'btn';
  document.getElementById('4').className = 'btn';
  document.getElementById('5').className = 'btn';
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

const highlightPhase = function(phase) {
  document.getElementById('3').style.fontWeight = 'none';
  document.getElementById('4').style.fontWeight = 'none';
  document.getElementById('5').style.fontWeight = 'none';
  if (phase == 3) {
    document.getElementById('3').style.fontWeight = 'bold';
  }
  if (phase == 4) {
    document.getElementById('4').style.fontWeight = 'bold';
  }
  if (phase == 5) {
    document.getElementById('5').style.fontWeight = 'bold';
  }
};

const updateActivityLog = function(activityLog) {
  const logs = activityLog.logs.join('\n');
  document.getElementById('activityLog').innerText = logs;
};
const initializeGamePage = function() {
  fetch('/initializeGamePage')
    .then(res => res.json())
    .then(playerDetails => {
      const {
        currentPlayer,
        territories,
        highlight,
        isGameRunning,
        players,
        horsePosition,
        phase,
        player,
        activityLog,
        winner
      } = playerDetails;
      if (winner) {
        displayWinningPopup(currentPlayer.name);
        return;
      }
      if (isGameRunning) {
        renderOldTerritories(territories, highlight);
        updatePlayerNames(players);
        updateCurrentPlayer(currentPlayer);
        updateRemainingPlayers(players, currentPlayer.id);
        updatePlayerDetails(player);
        updateHorsePosition(horsePosition);
        highlightPhase(phase);
        updateActivityLog(activityLog);
        return;
      }
      displayClosedGamePopup(playerDetails);
    });
};

const renderOldTerritories = function(territories, highlight) {
  const renderTerritories = Object.keys(territories);

  renderTerritories.forEach(territoryName => {
    const territory = territories[territoryName];
    if (territory.ruler) {
      changeColorAndMilitaryUnits(
        territoryName,
        territory.ruler.color,
        territory.militaryUnits
      );
    }
  });

  if (highlight.length > 0) {
    renderTerritories.forEach(territoryName => {
      const territory = territories[territoryName];
      if (territory.ruler) {
        changeColorAndMilitaryUnits(
          territoryName,
          territory.ruler.color,
          territory.militaryUnits,
          0.5
        );
      }
    });
  }

  highlight.forEach(territoryName => {
    const territory = territories[territoryName];
    if (territory.ruler) {
      changeColorAndMilitaryUnits(
        territoryName,
        territory.ruler.color,
        territory.militaryUnits
      );
    }
  });
};

setInterval(initializeGamePage, 1000);

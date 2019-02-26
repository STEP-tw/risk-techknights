const getParentElement = function (element) {
  if (element.tagName == 'a') return element.id;
  return element.parentElement.id;
};

const sendTerritoryAndValidate = function (event) {
  let territoryName = getParentElement(event.target);
  fetch('/claimTerritory', sendPostRequest({ territoryName }))
    .then(res => res.json())
    .then(territoryDetails => {
      const { color, isValidTerritory, territoryMilitaryUnits, nextPlayer } = territoryDetails;
      if (isValidTerritory) {
        changeColorAndMilitaryUnits(territoryName, color, territoryMilitaryUnits);
        updatePlayerDetails(nextPlayer.militaryUnits);
      }
    });
};

const updatePlayerDetails = function (players) {
  let { playerId } = parseCookies(document.cookie);
  let player = players.find(player => player.id == playerId);
  let name = player.name;
  document.getElementById("your-detail").innerText = name;
  document.getElementById("military-count").innerText = player.militaryUnits;
};

const updateRemainingPlayers = function (players, id) {
  const remainingPlayers = players.filter(player => player.id != id);
  remainingPlayers.forEach(player => {
    let playerNameDiv = document.getElementById(`player${player.id}`);
    playerNameDiv.style.fontSize = "16px";
  });
};

const updateCurrentPlayer = function ({ id }) {
  let playerNameDiv = document.getElementById(`player${id}`);
  playerNameDiv.style.fontSize = "20px";
};

const putPlayerDetails = function (player) {
  let playerId = player.id;
  let color = player.color;
  let name = player.name;
  let playerSpan = document.getElementById(`player${playerId}`);
  playerSpan.innerText = name;
  playerSpan.style.background = color;
};

const updatePlayerNames = function (players) {
  players.forEach(putPlayerDetails);
};

const updateHorsePosition = function (value) {
  document.getElementById("bonus").innerText = value;
};

const updateInstruction = function (instruction) {
  document.getElementById('instruction').innerText = instruction;
};

// const updateCurrentPlayer = function ({ name, color }) {
//   playerNameDiv = document.getElementById('playerName');
//   playerNameDiv.innerText = `${name}'s Turn`;
//   playerNameDiv.style.backgroundColor = color;
// }

const updateCurrentPhase = function () {
  document.getElementById('1').className = 'btn';
  document.getElementById('2').className = 'btn';
  document.getElementById('3').className = 'btn';
  document.getElementById('4').className = 'btn';
  document.getElementById('5').className = 'btn';
}

const highlightPhase = function (phase) {
  updateCurrentPhase();
  document.getElementById(phase).className = 'highlight btn';
  document.getElementById('currentPhase').value = 'Done';
}

const displayClosedGamePopup = function (gameDetails) {
  const { gameId, playerId } = gameDetails;
  document.getElementById('savedGamePopup').style.display = 'block';
  document.getElementById('loadGameId').innerText = gameId;
  document.getElementById('loadPlayerId').innerText = playerId;
}

const initializeGamePage = function () {
  fetch('/initializeGamePage')
    .then(res => res.json())
    .then(playerDetails => {
      const { currentPlayer, territories, instruction, highlight, phase, isGameRunning, militaryUnits,players,horsePosition } = playerDetails;
      if (isGameRunning) {
        renderOldTerritories(territories, highlight);
        updatePlayerNames(players);
        updateCurrentPlayer(currentPlayer);
        updateRemainingPlayers(players,currentPlayer.id)
        // updateInstruction(instruction);
        updatePlayerDetails(players);
        highlightPhase(phase);
        updateHorsePosition(horsePosition)
        return;
      }
      displayClosedGamePopup(playerDetails)
    });
};

const blurTerritories = function (territoryName) {
  document.getElementById(territoryName).getElementsByTagName('path')[0].style.opacity = '0.5';
};

const renderOldTerritories = function (territories, highlight) {
  const renderTerritories = Object.keys(territories).filter(territory => !highlight.includes(territory));
  renderTerritories.forEach(territoryName => {
    const territory = territories[territoryName];
    if (territory.ruler) {
      changeColorAndMilitaryUnits(territoryName, territory.ruler.color, territory.militaryUnits);
      // blurTerritories(territoryName);
    }
  });
};

setInterval(initializeGamePage, 1000);

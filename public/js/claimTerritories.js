const getParentElement = function(element) {
  if (element.tagName == "a") return element.id;
  return element.parentElement.id;
};

const sendTerritoryAndValidate = function(event) {
  let territoryName = getParentElement(event.target);
  fetch("/claimTerritory", sendPostRequest({ territoryName }))
    .then(res => res.json())
    .then(territoryDetails => {
      const {
        color,
        isValidTerritory,
        territoryMilitaryUnits,
        nextPlayer
      } = territoryDetails;
      if (isValidTerritory) {
        changeColorAndMilitaryUnits(
          territoryName,
          color,
          territoryMilitaryUnits
        );
        updatePlayerDetails(nextPlayer.militaryUnits);
      }
    });
};

const updatePlayerDetails = function(players) {
  let { playerId } = parseCookies(document.cookie);
  let player = players.find(player => player.id == playerId);
  let name = player.name;
  document.getElementById("your-detail").innerText = name;
  document.getElementById("military-count").innerText = player.militaryUnits;
};

const updateRemainingPlayers = function(players, id) {
  const remainingPlayers = players.filter(player => player.id != id);
  remainingPlayers.forEach(player => {
    let playerNameDiv = document.getElementById(`player${player.id}`);
    playerNameDiv.style.fontSize = "16px";
    playerNameDiv.style.fontWeight = "none";
    let playerColorDiv = document.getElementById(`color${id}`);
    playerColorDiv.style.width = "20px";
    playerColorDiv.style.height = "20px";
  });
};

const updateCurrentPlayer = function({ id, color }) {
  let playerNameDiv = document.getElementById(`player${id}`);
  let playerColorDiv = document.getElementById(`color${id}`);
  playerNameDiv.style.fontSize = "20px";
  playerNameDiv.style.fontWeight = "bold";
  playerColorDiv.style.width = "25px";
  playerColorDiv.style.height = "20px";
  playerColorDiv.style.backgroundColor = color;

};

const putPlayerDetails = function(player) {
  let playerId = player.id;
  let color = player.color;
  let name = player.name;
  let colorDiv = document.getElementById(`color${playerId}`);
  colorDiv.style.background = color;
  colorDiv.className = "color";
  let nameDiv = document.getElementById(`name${playerId}`);
  nameDiv.innerText = name;
  nameDiv.className = 'player';
};

const updatePlayerNames = function(players) {
  players.forEach(putPlayerDetails);
};

const updateHorsePosition = function(value) {
  document.getElementById("bonus").innerText = value;
};

const updateCurrentPhase = function() {
  document.getElementById("1").className = "btn";
  document.getElementById("2").className = "btn";
  document.getElementById("3").className = "btn";
  document.getElementById("4").className = "btn";
  document.getElementById("5").className = "btn";
};

const displayClosedGamePopup = function(gameDetails) {
  const { gameId, playerId } = gameDetails;
  document.getElementById("savedGamePopup").style.display = "block";
  document.getElementById("loadGameId").innerText = gameId;
  document.getElementById("loadPlayerId").innerText = playerId;
};

const initializeGamePage = function() {
  fetch("/initializeGamePage")
    .then(res => res.json())
    .then(playerDetails => {
      const {
        currentPlayer,
        territories,
        highlight,
        isGameRunning,
        players,
        horsePosition
      } = playerDetails;
      if (isGameRunning) {
        renderOldTerritories(territories, highlight);
        updatePlayerNames(players);
        updateCurrentPlayer(currentPlayer);
        updateRemainingPlayers(players, currentPlayer.id);
        updatePlayerDetails(players);
        updateHorsePosition(horsePosition);
        return;
      }
      displayClosedGamePopup(playerDetails);
    });
};

const renderOldTerritories = function(territories, highlight) {
  const renderTerritories = Object.keys(territories).filter(
    territory => !highlight.includes(territory)
  );
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
};

setInterval(initializeGamePage, 1000);

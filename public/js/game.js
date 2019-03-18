const highlightPhase = function(phase) {
  document.getElementById("3").style.fontWeight = "normal";
  document.getElementById("4").style.fontWeight = "normal";
  document.getElementById("5").style.fontWeight = "normal";
  if (phase > 2) {
    document.getElementById(phase).style.fontWeight = "bold";
  }
};

const updateHorsePosition = function(value) {
  setElementInnerText(document.getElementById("bonus"), value);
};

const updatePlayerDetails = function(player) {
  setElementInnerText(document.getElementById("your-detail"), player.name);
  setElementInnerText(
    document.getElementById("military-count"),
    player.militaryUnits
  );
};

const getPlayerDiv = function(id) {
  return document.getElementById("name" + id);
};

const highlightCurrentPlayer = function(player) {
  const nameDiv = getPlayerDiv(player.id);
  nameDiv.className = "player player-property active-player";
};

const updatePlayer = function(currentTurn, players) {
  const player = players.find(player => player.id == currentTurn);
  const { id, color, name } = player;
  const tr = createElement(document, "tr");
  const nameDiv = createElement(document, "td");
  nameDiv.id = "name" + id;
  setElementInnerText(nameDiv, name);
  nameDiv.style.background = color;
  nameDiv.className = "player player-property";
  tr.appendChild(nameDiv);
  document.getElementById("allPlayers").appendChild(tr);
};

const updatePlayerNames = function(players, order) {
  order.forEach(currentTurn => updatePlayer(currentTurn, players));
};

const changeColorAndMilitaryUnits = function(
  territoryName,
  color,
  militaryUnits,
  opacity
) {
  const territory = document.getElementById(territoryName);
  const territoryMilitary = territory.getElementsByClassName(
    "military-unit"
  )[0];
  const territoryPath = territory.getElementsByTagName("path")[0];
  territoryMilitary.textContent = militaryUnits;
  territoryPath.style.fill = color;
  territoryPath.style.opacity = opacity;
};

const renderTerritory = function(territories, selectedTerritories, opacity) {
  selectedTerritories.forEach(territoryName => {
    const territory = territories[territoryName];
    const { ruler, militaryUnits } = territory;
    if (ruler) {
      changeColorAndMilitaryUnits(
        territoryName,
        ruler.color,
        militaryUnits,
        opacity
      );
    }
  });
};

const getOpacity = function(territories) {
  if (territories.length > 0) {
    return 0.5;
  }
  return 1;
};

const renderTerritories = function(territories, highlight) {
  const allTerritories = Object.keys(territories);
  const opacity = getOpacity(highlight);
  renderTerritory(territories, allTerritories, opacity);
  renderTerritory(territories, highlight, 1);
};

const territoryPhases = {
  1: sendTerritoryAndValidate,
  2: startReinforcement,
  3: startReinforcement,
  4: startAttack,
  5: startFortify
};

const territoryClickHandler = function() {
  const clickEvent = event;
  fetch("/getGamePhase")
    .then(res => res.json())
    .then(game => {
      const { phase, isCurrentPlayerRequest } = game;
      if (!isCurrentPlayerRequest) return;
      const currentPhaseHandler = territoryPhases[phase];
      currentPhaseHandler(clickEvent);
    });
};

const nextPhase = function() {
  fetch("/getGamePhase")
    .then(res => res.json())
    .then(game => {
      const { isCurrentPlayerRequest } = game;
      if (!isCurrentPlayerRequest) return;
      fetch("/changeCurrentPlayerPhase");
    });
  document.getElementById("number").value = INITIAL_MILITARY_UNIT;
  hideElement(document.getElementById("selectMilitaryUnit"));
};

const militaryUnitPhase = {
  2: reinforcementComplete,
  3: reinforcementComplete,
  4: fortifyComplete,
  5: fortifyComplete
};

const placeMilitary = function() {
  fetch("/getGamePhase")
    .then(res => res.json())
    .then(game => {
      const { phase, isCurrentPlayerRequest } = game;
      if (!isCurrentPlayerRequest) return;
      militaryUnitPhase[phase]();
      hideElement(document.getElementById("selectMilitaryUnit"));
    });
};

const saveGame = function() {
  hideConfirmSavePopup();
  fetch("/saveGame");
};

const loadActivityData = function(activityLog) {
  let str = "";
  Object.keys(activityLog)
    .reverse()
    .forEach(logId => {
      str += `<div>${
        activityLog[logId].header
      }<br/>&nbsp;&nbsp;&nbsp;${activityLog[logId].events.join(
        "<br/>&nbsp;&nbsp;&nbsp;"
      )} <br/><br/><hr></div> `;
    });
  setElementInnerHTML(document.getElementById("hdnActivityLog"), str);
};

const displayActivityLog = function() {
  const data = document.getElementById("hdnActivityLog").innerHTML;
  setElementInnerHTML(document.getElementById("activityLog"), data);
  setElementDisplay(document.getElementById("activityLogPopup"), DISPLAY_BLOCK);
};

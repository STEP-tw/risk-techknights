const getParentElement = function(element) {
  if (element.tagName == "a") return element.id;
  return element.parentElement.id;
};

const sendTerritoryAndValidate = function(event) {
  let territoryName = getParentElement(event.target);
  fetch("/claimTerritory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ territoryName })
  })
    .then(res => res.json())
    .then(territoryDetails => {
      const {
        color,
        isValidTerritory,
        name,
        territoryMilitaryUnits,
        militaryUnits,
        playerColor
      } = territoryDetails;
      if (isValidTerritory) {
        changeColorAndMilitaryUnits(
          territoryName,
          color,
          territoryMilitaryUnits
        );
        changePlayerName(name, playerColor);
        updateMilitaryUnits(militaryUnits);
      }
    });
};

const changePlayerName = function(name, color) {
  playerNameDiv = document.getElementById("playerName");
  playerNameDiv.innerText = `${name}'s Turn`;
  playerNameDiv.style.backgroundColor = color;
};

const updateMilitaryUnits = function(militaryUnits) {
  document.getElementById(
    "militaryUnits"
  ).innerText = `Remaining Military Units: ${militaryUnits}`;
};

const initializeGamePage = function() {
  fetch("/initializeGamePage")
    .then(res => res.json())
    .then(playerDetails => {
      const {
        name,
        color,
        militaryUnits,
        players,
        territories,
        instruction
      } = playerDetails;
      renderOldTerritories(players, territories);
      changePlayerName(name, color);
      updateMilitaryUnits(militaryUnits);
      document.getElementById("instruction").innerText = instruction;
    });
};

const renderOldTerritories = function(players, territories) {
  Object.keys(territories).forEach(territoryName => {
    const territory = territories[territoryName];
    const ruler = territory.ruler;
    if (ruler) {
      const { color } = players[ruler];
      const { militaryUnits } = territory;
      changeColorAndMilitaryUnits(territoryName, color, militaryUnits);
    }
  });
};

initializeGamePage();

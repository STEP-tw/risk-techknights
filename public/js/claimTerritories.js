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
        territoryMilitaryUnits,
        nextPlayer
      } = territoryDetails;
      if (isValidTerritory) {
        changeColorAndMilitaryUnits(
          territoryName,
          color,
          territoryMilitaryUnits
        );
        updatePlayerDetails(nextPlayer);
      }
    });
};

const updatePlayerDetails = function({ name, color, militaryUnits }) {
  document.getElementById(
    "militaryUnits"
  ).innerText = `Remaining Military Units: ${militaryUnits}`;
};

const updateInstruction = function(instruction) {
  document.getElementById("instruction").innerText = instruction;
};

const updateCurrentPlayer = function ({name, color}) {
  playerNameDiv = document.getElementById("playerName");
  playerNameDiv.innerText = `${name}'s Turn`;
  playerNameDiv.style.backgroundColor = color;
}

const initializeGamePage = function() {
  fetch("/initializeGamePage")
    .then(res => res.json())
    .then(playerDetails => {
      const { currentPlayer, territories, instruction } = playerDetails;
      renderOldTerritories(territories);
      updateCurrentPlayer(currentPlayer);
    });
};

const renderOldTerritories = function(territories) {
  Object.keys(territories).forEach(territoryName => {
    const territory = territories[territoryName];
    const ruler = territory.ruler;
    if (ruler) {
      changeColorAndMilitaryUnits(
        territoryName,
        ruler.color,
        territory.militaryUnits
      );
    }
  });
};

setInterval(initializeGamePage, 1000);

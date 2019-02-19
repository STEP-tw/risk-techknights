const getParentElement = function(element) {
  if (element.tagName == "a") return element.id;
  return element.parentElement.id;
};

const sendTerritoryAndValidate = function(event) {
  let territoryName = getParentElement(event.target);
  console.log(event.target.parentElement);
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
        militaryUnits
      } = territoryDetails;
      if (isValidTerritory) {
        changeColorAndMilitaryUnits(
          territoryName,
          color,
          territoryMilitaryUnits
        );
        changePlayerName(name);
        updateMilitaryUnits(militaryUnits);
      }
    });
};

const changePlayerName = function(name) {
  document.getElementById("playerName").innerText = name;
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
      console.log(playerDetails);
      const { name, militaryUnits, players, territories } = playerDetails;
      renderOldTerritories(players, territories);
      changePlayerName(name);
      updateMilitaryUnits(militaryUnits);
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

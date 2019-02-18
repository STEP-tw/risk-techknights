const sendTerritoryAndValidate = function(event) {
  let territoryName = event.target.parentElement.id;
  fetch("/claimTerritory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ territoryName })
  })
    .then(res => res.json())
    .then(territoryDetails => {
      const { color, isValidTerritory, name } = territoryDetails;
      if (isValidTerritory) {
        changeColor(event, color);
        changePlayerName(name);
      }
    });
};

const changePlayerName = function(name) {
  document.getElementById("playerName").innerText = name;
};

const getPlayer = function() {
  fetch("/getPlayer")
    .then(res => res.text())
    .then(name => changePlayerName(name));
};
getPlayer();

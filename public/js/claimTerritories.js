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

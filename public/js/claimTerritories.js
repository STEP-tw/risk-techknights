const getParentElement = function (element) {
  if (element.tagName == 'a') return element.id;
  return element.parentElement.id;
};

const sendTerritoryAndValidate = function (event) {
  const territoryName = getParentElement(event.target);
  fetch('/claimTerritory', sendPostRequest({ territoryName }));
};
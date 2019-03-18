const getMapElement = document => document.getElementById("mapSVG");

const getContinentTable = document => document.getElementById("continentTable");

const displayTerritory = function(document) {
  const territories = createElement(document, "div");
  for (const territoryPath in TERRITORIES_PATH) {
    const path = `<a id='${territoryPath}' class="pointer" onclick='territoryClickHandler()'> 
    <path d='${TERRITORIES_PATH[territoryPath]}'></path></a>`;
    territories.append(path);
  }
  return territories.innerText;
};

const displaySeaLine = function(document) {
  const seaLineContainer = createElement(document, "div");
  Object.keys(SEA_LINES).forEach(seaLine => {
    const { x1, x2, y1, y2 } = SEA_LINES[seaLine];
    const line = document.createElementNS(SVG_NAMESPACE, "line");
    line.setAttributeNS(SVG_NAMESPACE, "x1", x1);
    line.setAttributeNS(SVG_NAMESPACE, "x2", x2);
    line.setAttributeNS(SVG_NAMESPACE, "y1", y1);
    line.setAttributeNS(SVG_NAMESPACE, "y2", y2);
    seaLineContainer.append(line);
  });
  return seaLineContainer.innerHTML;
};

const displayMap = function(document) {
  const mapElement = getMapElement(document);
  const territories = displayTerritory(document);
  const seaLine = displaySeaLine(document);
  setElementInnerHTML(mapElement, seaLine + territories);
};

const addTerritoryDetails = function(document) {
  const territories = document.querySelectorAll("path");
  territories.forEach(territory => {
    const territoryName = addTerritoryName(territory);
    const militaryUnit = addMilitaryUnit(territory);
    const circle = addCircle(territory);
    territory.parentNode.insertBefore(territoryName, territory.nextSibling);
    territory.parentNode.insertBefore(militaryUnit, territory.nextSibling);
    territory.parentNode.insertBefore(circle, territory.nextSibling);
  });
};

const getTerritoryCords = function(territory) {
  return {
    x: TERRITORIES_COORDINATES[territory].x,
    y: TERRITORIES_COORDINATES[territory].y
  };
};

const addTerritoryName = function(territory) {
  const territoryName = territory.parentElement.id;
  const name = document.createElementNS(SVG_NAMESPACE, "text");
  const { x, y } = getTerritoryCords(territoryName);
  name.setAttribute("class", "territory-name");
  name.setAttribute("transform", "translate(" + x + " " + y + ")");
  name.textContent = territoryName;
  return name;
};

const addMilitaryUnit = function(territory) {
  const territoryName = territory.parentElement.id;
  const militaryUnit = document.createElementNS(SVG_NAMESPACE, "text");
  const { x, y } = getTerritoryCords(territoryName);
  militaryUnit.setAttribute("class", "military-unit");
  militaryUnit.setAttribute(
    "transform",
    "translate(" + x + " " + (y + 13) + ")"
  );
  militaryUnit.textContent = INITIAL_MILITARY_UNIT;
  return militaryUnit;
};

const addCircle = function(territory) {
  const territoryName = territory.parentElement.id;
  const { x, y } = getTerritoryCords(territoryName);
  const circle = document.createElementNS(SVG_NAMESPACE, "circle");
  circle.setAttribute("class", "circle");
  circle.setAttribute("transform", "translate(" + x + " " + (y + 10) + ")");
  return circle;
};

const getMilitaryUnit = function(element) {
  const militaryUnitField = element.getElementsByClassName("military-unit")[0];
  return militaryUnitField.textContent;
};

const getContinentColumn = function(document, continent) {
  const continentColumn = createElement(document, "td");
  continentColumn.className = "continent-detail";
  continentColumn.innerText = continent;
  return continentColumn;
};

const getsoldierColumn = function(document, continent) {
  const soldierColumn = createElement(document, "td");
  soldierColumn.className = "continent-detail";
  soldierColumn.innerText = CONTINENT_SOLDIER_COUNT[continent];
  return soldierColumn;
};

const getContinentDetail = function(document, continent) {
  const row = createElement(document, "tr");
  const continentColumn = getContinentColumn(document, continent);
  const soldierColumn = getsoldierColumn(document, continent);
  appendChildren(row, [continentColumn, soldierColumn]);
  return row;
};

const generateContinentTable = function(document) {
  const table = createElement(document, "table");
  setElementClass(table, "table");
  Object.keys(CONTINENT_SOLDIER_COUNT).forEach(continent => {
    const row = getContinentDetail(document, continent);
    table.appendChild(row);
  });
  getContinentTable(document).appendChild(table);
};

const initialize = function() {
  displayMap(document);
  addTerritoryDetails(document);
  generateContinentTable(document);
};

window.onload = initialize;

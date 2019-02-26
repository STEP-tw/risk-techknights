const getMapElement = document => document.getElementById("mapSVG");

const getContinentTable = document => document.getElementById("continentTable");

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const displayTerritory = function (document) {
  const territories = createElement(document, 'div');
  for (const territoryPath in TERRITORIES_PATH) {
    const path = `<a id='${territoryPath}' onclick='handleClicks()'> 
    <path d='${TERRITORIES_PATH[territoryPath]}'></path></a>`;
    territories.append(path);
  }
  return territories.innerText;
};

const displaySeaLine = function (document) {
  const seaLineContainer = createElement(document, 'div');
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

const displayMap = function (document) {
  const mapElement = getMapElement(document);
  const territories = displayTerritory(document);
  const seaLine = displaySeaLine(document);
  setElementInnerHTML(mapElement, seaLine + territories);
};

const addTerritoryDetails = function (document) {
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

const getTerritoryCords = function (territory) {
  return {
    x: TERRITORIES_COORDINATES[territory].x,
    y: TERRITORIES_COORDINATES[territory].y
  };
};

const addTerritoryName = function (territory) {
  const territoryName = territory.parentElement.id;
  const name = document.createElementNS(SVG_NAMESPACE, "text");
  const { x, y } = getTerritoryCords(territoryName);
  name.setAttribute("class", "territory-name");
  name.setAttribute("transform", "translate(" + x + " " + y + ")");
  name.textContent = territoryName;
  return name;
};

const addMilitaryUnit = function (territory) {
  const territoryName = territory.parentElement.id;
  const militaryUnit = document.createElementNS(SVG_NAMESPACE, "text");
  const { x, y } = getTerritoryCords(territoryName);
  militaryUnit.setAttribute("class", "military-unit");
  militaryUnit.setAttribute(
    "transform",
    "translate(" + x + " " + (y + 13) + ")"
  );
  militaryUnit.textContent = "0";
  return militaryUnit;
};

const addCircle = function (territory) {
  const territoryName = territory.parentElement.id;
  const { x, y } = getTerritoryCords(territoryName);
  const circle = document.createElementNS(SVG_NAMESPACE, "circle");
  circle.setAttribute("class", "circle");
  circle.setAttribute("transform", "translate(" + x + " " + (y + 10) + ")");
  return circle;
};

const getMilitaryUnit = function (element) {
  return element.getElementsByClassName("military-unit")[0].textContent;
};

const setMilitaryUnit = function (territoryName, value) {
  document
    .getElementById(territoryName)
    .getElementsByClassName("military-unit")[0].textContent = value;
};
const changeColorAndMilitaryUnits = function (
  territoryName,
  color,
  militaryUnits
) {
  setMilitaryUnit(territoryName, militaryUnits);
  document
    .getElementById(territoryName)
    .getElementsByTagName("path")[0].style.fill = color;
};

const getContinentColumn = function (document, continent) {
  const continentColumn = document.createElement("td");
  continentColumn.className = "continent-detail";
  continentColumn.innerText = continent;
  return continentColumn;
};

const getsoldierColumn = function (document, continent) {
  const soldierColumn = document.createElement("td");
  soldierColumn.className = "continent-detail";
  soldierColumn.innerText = CONTINENT_SOLDIER_COUNT[continent];
  return soldierColumn;
};

const getContinentDetail = function (document, continent) {
  const row = document.createElement("tr");
  const continentColumn = getContinentColumn(document, continent);
  const soldierColumn = getsoldierColumn(document, continent);
  appendChildren(row, [continentColumn, soldierColumn]);
  return row;
};

const generateContinentTable = function (document) {
  const table = document.createElement("table");
  setElementClass(table, "table");
  Object.keys(CONTINENT_SOLDIER_COUNT).forEach(continent => {
    const row = getContinentDetail(document, continent);
    table.appendChild(row);
  });
  getContinentTable(document).appendChild(table);
};

const initialize = function () {
  displayMap(document);
  addTerritoryDetails(document);
  generateContinentTable(document);
};

const handleClicks = function () {
  const clickEvent = event;
  fetch('/getGamePhase')
    .then(res => res.json())
    .then(game => {
      console.log(game);
      if (game.phase == 1) {
        sendTerritoryAndValidate(clickEvent);
        return;
      }
      if (game.phase == 2 || game.phase == 3) {
        startReinforcement(clickEvent);
        return
      }

      if (game.phase == 4) {
        startAttack(clickEvent);
        return
      }
      if (game.phase == 5) {
        startFortify(clickEvent);
        return
      }

    })
};

const changePlayerPhase = function () {
  fetch('/changeCurrentPlayerPhase');
}

const completeAction = function () {
  fetch('/getGamePhase')
    .then(res => res.json())
    .then(game => {
      if (game.phase == 2 || game.phase == 3) {
        reinforcementComplete();
      }
      if (game.phase == 4 || game.phase == 5) {
        fetch('/fortifyComplete', sendPostRequest({
          militaryUnits: document.getElementById('number').innerText
        }));
        document.getElementById('number').value = '0'
      }
      document.getElementById('selectMilitaryUnit').style.display = 'none';
    });
}


const saveGame = function () {
  fetch('/saveGame');
}

const displayCards = function () {
  document.getElementById('playerDetailsPopup').style.display = 'block';
  fetch('/getCards')
    .then(res => res.json())
    .then(cards => {
      cards.forEach(card => {
        const cardView = document.createElement('div');
        cardView.innerText = card;
        cardView.className = 'card';
        document.getElementById('playerCards').appendChild(cardView);
      })
    })
}

window.onload = initialize;

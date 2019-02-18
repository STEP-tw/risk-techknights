const express = require("express");
const fs = require("fs");
const app = express();
const cookieParser = require("cookie-parser");

const { Games } = require("./models/game");
const { createGame, logger, addHost } = require("./handlers/handlers.js");
const { getUniqueNum } = require("./utils.js");
let games = new Games();

const TERRITORIES = {};
const TERRITORY_FILE_PATH = "./src/data/territory.json";
const ENCODING = "utf8";

/* md required classes*/
const Player = require("./models/player");
const Territory = require("./models/territory");

const loadTerritories = function() {
  const territories = JSON.parse(
    fs.readFileSync(TERRITORY_FILE_PATH, ENCODING)
  );
  territories.forEach(territory => {
    const { name, neighbours, numberOfMilitaryUnits, continent } = territory;
    TERRITORIES[name] = new Territory(
      name,
      neighbours,
      numberOfMilitaryUnits,
      continent
    );
  });
};

loadTerritories();

const playerNames = ["mahesh", "arif", "prince", "durga"];
const colors = { mahesh: "red", arif: "green", prince: "blue", durga: "black" };
const ids = { mahesh: "1", arif: "2", prince: "3", durga: "4" };
const players = {};
playerNames.forEach(name => {
  players[name] = new Player(ids[name], name, colors[name], 30);
});

const changeTurn = function() {
  playerNames.push(playerNames.shift());
};

const addTerritory = function(territory, player) {
  player.addTerritory(territory);
  TERRITORIES[territory].addRuler(player.id);
  TERRITORIES[territory].addMilitaryUnits(1);
  player.removeMilitaryUnits(1);
  changeTurn();
};

const sendTerritoryDetails = function(
  res,
  isValidTerritory,
  color,
  name,
  militaryUnits
) {
  const content = JSON.stringify({
    isValidTerritory,
    name,
    color,
    militaryUnits
  });
  send(res, content, 200, "application/json");
};

const addValidTerritory = function(req, res) {
  const currentPlayer = players[playerNames[0]];
  const nextPlayer = players[playerNames[1]];
  const territory = req.body.territoryName;
  const isValidTerritory = !TERRITORIES[territory].isOccupied();
  if (isValidTerritory) {
    addTerritory(territory, currentPlayer);
  }
  sendTerritoryDetails(
    res,
    isValidTerritory,
    currentPlayer.color,
    nextPlayer.name,
    nextPlayer.militaryUnits
  );
};

const send = function(res, content, statusCode, contentType) {
  res.setHeader("Content-Type", contentType);
  res.status(statusCode);
  res.write(content);
  res.end();
};

const sendPlayerName = function(req, res) {
  const playerDetails = {
    name: playerNames[0],
    militaryUnits: players[playerNames[0]].militaryUnits
  };
  send(res, JSON.stringify(playerDetails), 200, "text/plain");
};

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger.bind(null, games));

app.post("/createGame", createGame.bind(null, getUniqueNum, games));
app.post("/hostGame", addHost.bind(null, games));
app.get("/getPlayer", sendPlayerName);
app.post("/claimTerritory", addValidTerritory);
app.use(express.static("public"));

module.exports = app;

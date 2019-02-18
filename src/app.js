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
  players[name] = new Player(ids[name], name, colors[name]);
});

const logRequest = function(req, res, next) {
  console.log(req.url, req.method);
  next();
};

const changeTurn = function() {
  playerNames.push(playerNames.shift());
};

const addTerritory = function(territory, player) {
  player.addTerritory(territory);
  TERRITORIES[territory].addRuler(player.id);
  changeTurn();
};

const sendTerritoryDetails = function(res, isValidTerritory, color, name) {
  const content = JSON.stringify({ isValidTerritory, name, color });
  send(res, content, 200, "application/json");
};

const addValidTerritory = function(req, res) {
  const player = players[playerNames[0]];
  const territory = req.body.territoryName;
  const isValidTerritory = !TERRITORIES[territory].isOccupied();
  console.log(isValidTerritory);
  if (isValidTerritory) {
    addTerritory(territory, player);
  }
  sendTerritoryDetails(res, isValidTerritory, player.color, playerNames[0]);
};

const send = function(res, content, statusCode, contentType) {
  res.setHeader("Content-Type", contentType);
  res.status(statusCode);
  res.write(content);
  res.end();
};

const sendPlayerName = function(req, res) {
  send(res, `${playerNames[0]}`, 200, "text/plain");
};

app.use(logRequest);
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

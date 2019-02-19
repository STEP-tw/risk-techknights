const express = require("express");
const fs = require("fs");
const app = express();
const cookieParser = require("cookie-parser");

const { Games } = require("./models/game");
const {
  createGame,
  logger,
  addHost,
  joinGame,
  addPlayer
} = require("./handlers/handlers.js");
const { getUniqueNum } = require("./utils.js");
let games = new Games();

const TERRITORIES = {};
const TERRITORY_FILE_PATH = "./src/data/territory.json";
const ENCODING = "utf8";
const instructions = require("../src/data/instructions.json");
const Instructions = require("./models/instruction.js");
const INSTRUCTIONS = new Instructions();
instructions.forEach(instruction =>
  INSTRUCTIONS.addInstruction(instruction.phase, instruction.data)
);

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

const playerNames = { 1: "mahesh", 2: "arif", 3: "prince", 4: "durga" };
const colors = { 1: "aqua", 2: "#98fb98", 3: "#f08080", 4: "#d9ff00" };
const ids = [1, 2, 3, 4];
const players = {};
ids.forEach(id => {
  players[id] = new Player(id, playerNames[id], 30);
  players[id].setColor(colors[id]);
});

const changeTurn = function() {
  ids.push(ids.shift());
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
  territoryMilitaryUnits,
  name,
  playerColor,
  militaryUnits
) {
  const content = JSON.stringify({
    isValidTerritory,
    name,
    color,
    territoryMilitaryUnits,
    playerColor,
    militaryUnits
  });
  send(res, content, 200, "application/json");
};

const addValidTerritory = function(req, res) {
  const currentPlayer = players[ids[0]];
  const nextPlayer = players[ids[1]];
  const territory = TERRITORIES[req.body.territoryName];
  const isValidTerritory = !territory.isOccupied();
  if (isValidTerritory) {
    addTerritory(territory.name, currentPlayer);
  }
  sendTerritoryDetails(
    res,
    isValidTerritory,
    currentPlayer.color,
    territory.militaryUnits,
    nextPlayer.name,
    nextPlayer.color,
    nextPlayer.militaryUnits
  );
};

const send = function(res, content, statusCode, contentType) {
  res.setHeader("Content-Type", contentType);
  res.status(statusCode);
  res.write(content);
  res.end();
};

const sendGamePageDetails = function(req, res) {
  const playerDetails = {
    territories: TERRITORIES,
    players: players,
    name: playerNames[ids[0]],
    color: players[ids[0]].color,
    militaryUnits: players[ids[0]].militaryUnits,
    instruction: INSTRUCTIONS.getInstruction("initialPhase")
  };
  send(res, JSON.stringify(playerDetails), 200, "application/json");
};

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger.bind(null, games));

app.post("/createGame", createGame.bind(null, getUniqueNum, games));
app.post("/hostGame", addHost.bind(null, games));
app.get("/initializeGamePage", sendGamePageDetails);
app.post("/joinGame", joinGame);
app.post("/addPlayer", addPlayer.bind(null, games));
app.post("/claimTerritory", addValidTerritory);
app.use(express.static("public"));

module.exports = app;

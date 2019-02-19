const express = require("express");
const fs = require("fs");
const app = express();
const cookieParser = require("cookie-parser");

const { Games, Game } = require("./models/game");
const {
  createGame,
  logger,
  addHost,
  joinGame,
  addPlayer,
  updateWaitingList
} = require("./handlers/handlers.js");

const {
  sendGamePageDetails,
  addValidTerritory
} = require("./handlers/claimTerritoryHandler");

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

let sample = new Game(12345, TERRITORIES);

const playerNames = { 1: "mahesh", 2: "arif", 3: "prince", 4: "durga" };
const ids = [1, 2, 3, 4];
const players = {};
ids.forEach(id => {
  player = new Player(id, playerNames[id], 30);
  sample.addPlayer(player);
});

sample.decideOrder();
console.log(sample);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger.bind(null, games));

app.post("/createGame", createGame.bind(null, getUniqueNum, games));
app.post("/hostGame", addHost.bind(null, games));
app.post("/joinGame", joinGame);
app.post("/addPlayer", addPlayer.bind(null, games));
app.post("/claimTerritory", addValidTerritory.bind(null, sample));
app.get(
  "/initializeGamePage",
  sendGamePageDetails.bind(null, sample, INSTRUCTIONS)
);
app.post("/updateWaitingList", updateWaitingList.bind(null, games));
app.post("/claimTerritory", addValidTerritory);
app.use(express.static("public"));

module.exports = app;

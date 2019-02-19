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
  addPlayer,
  updateWaitingList
} = require("./handlers/handlers.js");

const {
  sendGamePageDetails,
  addValidTerritory
} = require("./handlers/claimTerritoryHandler");

const { getUniqueNum } = require("./utils.js");

let games = new Games();
app.games = games;

const TERRITORIES = {};
const TERRITORY_FILE_PATH = "./src/data/territory.json";
const ENCODING = "utf8";

const instructions = require("../src/data/instructions.json");
const Instructions = require("./models/instruction.js");
const INSTRUCTIONS = new Instructions();
instructions.forEach(instruction =>
  INSTRUCTIONS.addInstruction(instruction.phase, instruction.data)
);

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

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger.bind(null, games));

app.post(
  "/createGame",
  createGame.bind(null, getUniqueNum, games, TERRITORIES)
);
app.post("/hostGame", addHost.bind(null, games));
app.post("/joinGame", joinGame);
app.post("/addPlayer", addPlayer.bind(null, games));
app.post("/claimTerritory", addValidTerritory);
app.get("/initializeGamePage", sendGamePageDetails.bind(null, INSTRUCTIONS));
app.post("/updateWaitingList", updateWaitingList.bind(null, games));
app.post("/claimTerritory", addValidTerritory);
app.use(express.static("public"));

module.exports = app;

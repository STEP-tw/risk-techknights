const express = require("express");
const fs = require("fs");
const app = express();
const cookieParser = require("cookie-parser");
const { startAttack, updateCount, attackAgain, battleComplete } =require('./handlers/attackHandler');


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

const instructionsData = require("../src/data/instructions.json");
const Instructions = require("./models/instruction.js");
const INSTRUCTIONS = new Instructions();
instructionsData.forEach(instruction =>
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
const getGamePhase = function(req, res) {
  const gameID = req.cookies.game;
  const currentGame = req.app.games.getGame(gameID);
  const phase   = currentGame.getPhase();
  res.send({phase});
}

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(logger);

app.get('/getGamePhase',getGamePhase);
app.post("/createGame", createGame.bind(null, getUniqueNum, TERRITORIES));
app.post("/hostGame", addHost);
app.post("/joinGame", joinGame);
app.post("/addPlayer", addPlayer);
app.post("/claimTerritory", addValidTerritory);
app.get("/initializeGamePage", sendGamePageDetails.bind(null, INSTRUCTIONS));
app.post("/updateWaitingList", updateWaitingList);
app.post("/claimTerritory", addValidTerritory);



app.post('/attack', startAttack);
app.post('/updateCount', updateCount);
app.post('/attackAgain', attackAgain);
app.post('/battleComplete', battleComplete);
app.use(express.static("public"));

module.exports = app;

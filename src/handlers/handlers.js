const { Game } = require("../models/game.js");
const Player = require("../models/player");
const fs = require("fs");
const { TERRITORY_FILE_PATH, ENCODING } = require("../constants");

const Territory = require("../models/territory");
const loadTerritories = function() {
  const TERRITORIES = {};
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
  return TERRITORIES;
};

loadTerritories();

const logger = function(req, res, next) {
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  console.log("Cookie:", req.cookies);
  console.log("-------------------------------------------------------------");
  next();
};

const getGameData = function(games, gameId) {
  let currentGame = games.getGame(gameId);
  let totalPlayers = currentGame.getPlayers().length;

  return { totalPlayers, currentGame };
};

const addNewPlayer = function(game, playerName, totalPlayers) {
  let playerId = totalPlayers + 1;
  const initialMilitaryCount = game.getInitialMilitaryCount();
  game.addPlayer(new Player(playerId, playerName, initialMilitaryCount));
  return playerId;
};

const createGame = function(req) {
  const games = req.app.games;
  const numberOfPlayers = req.body.numberOfPlayers;
  const getUniqueNum = req.app.getUniqueNum;

  let id = getUniqueNum(5, Object.keys(games));
  const territories = loadTerritories();
  let game = new Game(id, territories, numberOfPlayers);
  games.addGame(game);

  return id;
};

const hostGame = function(req, res) {
  const games = req.app.games;

  const gameId = createGame(req);
  const playerName = req.body.playerName;
  let { currentGame } = getGameData(games, gameId);

  let playerId = addNewPlayer(currentGame, playerName, 0);
  res.cookie("game", `${gameId}`);
  res.cookie("playerId", `${playerId}`);
  res.redirect("waitingPage.html");
};

const isGameExists = (games, gameId) =>
  Object.keys(games.games).includes(gameId);

const validateGameId = function(req, res) {
  const games = req.app.games;
  let gameId = req.body.gameId;
  if (!isGameExists(games, gameId)) {
    res.send({ action: "invalidGameId" });
    return;
  }
  let playerName = req.body.playerName;
  let { totalPlayers, currentGame } = getGameData(games, gameId);
  if (totalPlayers >= currentGame.getTotalPlayerCount()) {
    res.send({ action: "gameStarted" });
    return;
  }
  let playerId = addNewPlayer(currentGame, playerName, totalPlayers);
  res.cookie("game", `${gameId}`);
  res.cookie("playerId", `${playerId}`);
  res.send({ action: "validGameId" });
};

const updateWaitingList = function(req, res) {
  const games = req.app.games;
  const gameId = req.cookies.game;

  let { currentGame } = getGameData(games, gameId);

  currentGame.getCurrentPlayer().instruction =
    "Please Select a Territory to claim";

  res.send({
    players: currentGame.players,
    totalPlayers: currentGame.getTotalPlayerCount()
  });
};

module.exports = {
  logger,
  createGame,
  hostGame,
  validateGameId,
  updateWaitingList,
  getGameData,
  addNewPlayer
};

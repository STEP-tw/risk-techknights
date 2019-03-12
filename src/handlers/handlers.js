const { Continent } = require("../models/continent");
const { ActivityLog } = require("../models/activityLog");
const { Game } = require("../models/game.js");
const Cards = require("../models/card");
const Player = require("../models/player");
const { TERRITORY_FILE_PATH, ENCODING } = require("../constants");
const { getCurrentGame, isCurrentPlayer } = require("../handlers/util");

const Territory = require("../models/territory");

const loadTerritories = function (fs) {
  const TERRITORIES = {};
  const territories = JSON.parse(
    fs.readFileSync(TERRITORY_FILE_PATH, ENCODING)
  );
  territories.forEach(territory => {
    const { name, neighbours, numberOfMilitaryUnits } = territory;
    TERRITORIES[name] = new Territory(name, neighbours, numberOfMilitaryUnits);
  });
  return TERRITORIES;
};

const getGameData = function (games, gameId) {
  let currentGame = games.getGame(gameId);
  let totalPlayers = currentGame.getPlayers().filter(player => player.isActive)
    .length;

  return { totalPlayers, currentGame };
};

const addNewPlayer = function (game, playerName, totalPlayers) {
  let playerId = totalPlayers + 1;
  const initialMilitaryCount = game.getInitialMilitaryCount();
  const player = new Player(playerId, playerName, initialMilitaryCount);
  player.isActive = true;
  game.addPlayer(player);
  return playerId;
};

const parseTerritories = function (TERRITORIES, continentTerritories) {
  let Territories = [];
  continentTerritories.forEach(territory => {
    Territories.push(TERRITORIES[territory]);
  });
  return Territories;
};

const loadContinents = function (fs, TERRITORIES) {
  const CONTINENTS = {};
  const continents = JSON.parse(
    fs.readFileSync("./src/data/continent.json", ENCODING)
  );
  continents.forEach(continent => {
    const { name, territories, numberOfMilitaryUnits } = continent;
    const Territories = parseTerritories(TERRITORIES, territories);
    CONTINENTS[name] = new Continent(name, Territories, numberOfMilitaryUnits);
  });
  return CONTINENTS;
};

const createGame = function (req) {
  const games = req.app.games;
  const numberOfPlayers = req.body.numberOfPlayers;
  const getUniqueNum = req.app.getUniqueNum;

  let id = getUniqueNum(5, Object.keys(games));
  const territories = loadTerritories(req.app.fs);
  const continents = loadContinents(req.app.fs, territories);
  let game = new Game(id, territories, numberOfPlayers);
  game.continents = continents;
  game.activityLog = new ActivityLog();
  game.decidePlayersColor(Math.random);
  games.addGame(game);

  return id;
};

const hostGame = function (req, res) {
  const games = req.app.games;

  const gameId = createGame(req);
  const playerName = req.body.playerName;
  let { currentGame } = getGameData(games, gameId);

  let playerId = addNewPlayer(currentGame, playerName, 0);
  res.cookie("game", `${gameId}`);
  res.cookie("playerId", `${playerId}`);
  res.redirect("waitingPage");
};

const isGameExists = (games, gameId) =>
  Object.keys(games.games).includes(gameId);

const validateGameId = function (req, res) {
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

const updateWaitingList = function (req, res) {
  const games = req.app.games;
  const gameId = req.cookies.game;
  let { currentGame, totalPlayers } = getGameData(games, gameId);
  if (currentGame.getTotalPlayerCount() == totalPlayers && !currentGame.isOldGame) {
    currentGame.decideOrder(Math.random);
    currentGame.activityLog = new ActivityLog();
    currentGame.activityLog.changeTurn(currentGame.getCurrentPlayer());
  }
  const joinedPlayers = currentGame.players.filter(player => player.isActive);
  res.send({ joinedPlayers, totalPlayers: currentGame.getTotalPlayerCount() });
};

const parseCards = function (cards) {
  const cardObject = new Cards();
  cards.forEach(card => {
    cardObject.cards.push(card);
  });
  return cardObject;
};

const parsePlayer = function (player) {
  const { id, name, militaryUnits, phase, color, receivedCards } = player;
  const savedPlayer = new Player(id, name, militaryUnits);
  savedPlayer.receivedCards = parseCards(receivedCards.cards);
  savedPlayer.color = color;
  savedPlayer.phase = phase;
  return savedPlayer;
};

const parseActivity = function (activityLog) {
  const Activity = new ActivityLog();
  Activity.logId = activityLog.logId;
  Object.keys(activityLog.logs).forEach(logId => {
    Activity.logs[logId] = {
      header: activityLog.logs[logId].header,
      events: activityLog.logs[logId].events
    };
  });
  return Activity;
};

const parseTerritory = function (territory) {
  const { name, neighbours, militaryUnits, ruler } = territory;
  const savedTerritoy = new Territory(name, neighbours, militaryUnits);
  if (ruler) {
    savedTerritoy.ruler = parsePlayer(ruler);
  }
  return savedTerritoy;
};

const parseContinent = function (continent) {
  const { name, territories, numberOfMilitaryUnits } = continent;
  let Territories = [];
  Object.keys(territories).forEach(territory => {
    Territories.push(parseTerritory(territories[territory]));
  });
  const savedContinent = new Continent(
    name,
    Territories,
    numberOfMilitaryUnits
  );
  return savedContinent;
};

const parseGame = function (game) {
  const Territories = {};
  Object.keys(game.territories).forEach(territory => {
    Territories[territory] = parseTerritory(game.territories[territory]);
  });

  const players = [];
  game.players.forEach(player => {
    const savedPlayer = parsePlayer(player);
    players.push(savedPlayer);
  });

  const Continents = {};
  Object.keys(game.continents).forEach(continent => {
    Continents[continent] = parseContinent(game.continents[continent]);
  });

  const savedGame = new Game(game.id, Territories, game.totalPlayerCount);
  savedGame.activityLog = parseActivity(game.activityLog);
  savedGame.players = players;
  savedGame.order = game.order;
  savedGame.originalOrder = game.originalOrder;
  savedGame.colors = game.colors;
  savedGame.currentHorseIndex = game.currentHorseIndex;
  savedGame.continents = Continents;
  return savedGame;
};

const readGameData = function (fs) {
  return JSON.parse(fs.readFileSync("./gameData/data.json"));
};

const isGameSaved = function (req) {
  let fs = req.app.fs;
  const gameId = req.body.gameId;
  const runningGames = req.app.games;

  const allGames = readGameData(fs);

  if (Object.keys(allGames).includes(gameId)) {
    if (!Object.keys(runningGames.games).includes(gameId)) {
      runningGames.addGame(parseGame(allGames[gameId]));
    }
    return true;
  }
  return false;
};

const getCurrentGameAndPlayer = function (req) {
  const gameId = req.cookies.game;
  const runningGames = req.app.games;
  const currentGame = runningGames.getGame(gameId);
  const currentPlayer = currentGame.getCurrentPlayer();
  return { currentGame, currentPlayer };
};

const loadSavedGame = function (req, res) {
  const playerId = req.body.playerId;
  const gameId = req.body.gameId;

  if (isGameSaved(req)) {
    const currentGame = req.app.games.getGame(gameId);
    currentGame.isOldGame = true;
    const player = currentGame.getPlayerDetailsById(playerId);
    if (player) {
      player.isActive = true;
      res.cookie("game", gameId);
      res.cookie("playerId", playerId);
      res.redirect("waitingPage");
      return;
    }
    return res.send({ msg: "Invalid Player Id" });
  }
  res.send({ msg: "Invalid Game Id" });
};

const saveGame = function (req, res) {
  let fs = req.app.fs;
  const allSavedGames = readGameData(fs);
  const { currentGame } = getCurrentGameAndPlayer(req);
  const gameId = currentGame.id;
  allSavedGames[gameId] = currentGame;
  fs.writeFile("./gameData/data.json", JSON.stringify(allSavedGames), () => { }); 
  req.app.games.removeGame(gameId);
  res.end();
};

const getPlayersCard = function (req, res) {
  const playerId = req.cookies.playerId;
  const { currentGame } = getCurrentGameAndPlayer(req);
  const currentPlayer = currentGame.getPlayerDetailsById(playerId);
  const cards = currentPlayer.showCards();
  res.send(cards);
};

const getCardBonus = function (req, res) {
  const { currentGame } = getCurrentGameAndPlayer(req);
  currentGame.tradeCards();
  res.end();
};

const getActivityLog = function (req, res) {
  const currentGame = getCurrentGame(req);
  const activityLog = currentGame.activityLog.getLogs();
  res.send(activityLog);
};

module.exports = {
  createGame,
  hostGame,
  validateGameId,
  updateWaitingList,
  getGameData,
  addNewPlayer,
  loadSavedGame,
  saveGame,
  getPlayersCard,
  getCardBonus,
  getActivityLog
};

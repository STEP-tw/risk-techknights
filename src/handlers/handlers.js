const { Game } = require('../models/game.js');
const Player = require('../models/player');
const fs = require('fs');
const { TERRITORY_FILE_PATH, ENCODING, INSTRUCTIONS } = require('../constants');

const Territory = require('../models/territory');
const loadTerritories = function() {
  const TERRITORIES = {};
  const territories = JSON.parse(fs.readFileSync(TERRITORY_FILE_PATH, ENCODING));
  territories.forEach(territory => {
    const { name, neighbours, numberOfMilitaryUnits } = territory;
    TERRITORIES[name] = new Territory(name, neighbours, numberOfMilitaryUnits);
  });
  return TERRITORIES;
};

loadTerritories();

const logger = function(req, res, next) {
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  console.log('Cookie:', req.cookies);
  console.log('-------------------------------------------------------------');
  next();
};

const getGameData = function(games, gameId) {
  let currentGame = games.getGame(gameId);
  let totalPlayers = currentGame.getPlayers().filter(player=>player.isActive).length;

  return { totalPlayers, currentGame };
};

const addNewPlayer = function(game, playerName, totalPlayers) {
  let playerId = totalPlayers + 1;
  const initialMilitaryCount = game.getInitialMilitaryCount();
  const player = new Player(playerId, playerName, initialMilitaryCount);
  player.isActive = true;
  game.addPlayer(player);
  return playerId;
};

const createGame = function(req) {
  const games = req.app.games;
  const numberOfPlayers = req.body.numberOfPlayers;
  const getUniqueNum = req.app.getUniqueNum;

  let id = getUniqueNum(5, Object.keys(games));
  const territories = loadTerritories();
  let game = new Game(id, territories, numberOfPlayers);
  game.decidePlayersColor(Math.random);
  games.addGame(game);

  return id;
};

const hostGame = function(req, res) {
  const games = req.app.games;

  const gameId = createGame(req);
  const playerName = req.body.playerName;
  let { currentGame } = getGameData(games, gameId);

  let playerId = addNewPlayer(currentGame, playerName, 0);
  res.cookie('game', `${gameId}`);
  res.cookie('playerId', `${playerId}`);
  res.redirect('waitingPage');
};

const isGameExists = (games, gameId) => Object.keys(games.games).includes(gameId);

const validateGameId = function(req, res) {
  const games = req.app.games;
  let gameId = req.body.gameId;
  if (!isGameExists(games, gameId)) {
    res.send({ action: 'invalidGameId' });
    return;
  }
  let playerName = req.body.playerName;
  let { totalPlayers, currentGame } = getGameData(games, gameId);
  if (totalPlayers >= currentGame.getTotalPlayerCount()) {
    res.send({ action: 'gameStarted' });
    return;
  }
  let playerId = addNewPlayer(currentGame, playerName, totalPlayers);
  res.cookie('game', `${gameId}`);
  res.cookie('playerId', `${playerId}`);
  res.send({ action: 'validGameId' });
};

const updateWaitingList = function(req, res) {
  const games = req.app.games;
  const gameId = req.cookies.game;
  let { currentGame, totalPlayers } = getGameData(games, gameId);
  const currentPlayer = currentGame.getCurrentPlayer();
  currentPlayer.setInstruction(INSTRUCTIONS[1].defaultMsg);

  if (currentGame.getTotalPlayerCount() == totalPlayers) {
    currentGame.decideOrder(Math.random);
  }

  res.send({
    players: currentGame.players.filter(player=>player.isActive),
    totalPlayers: currentGame.getTotalPlayerCount()
  });
};

const parsePlayer = function(player) {
  const { id, name, militaryUnits, phase, color, instruction } = player;
  const savedPlayer = new Player(id, name, militaryUnits);
  savedPlayer.color = color;
  savedPlayer.phase = phase;
  savedPlayer.instruction = instruction;
  return savedPlayer;
};

const parseTerritory = function(territory) {
  const { name, neighbours, militaryUnits, ruler } = territory;
  const savedTerritoy = new Territory(name, neighbours, militaryUnits);
  if (ruler) {
    savedTerritoy.ruler = parsePlayer(ruler);
  }
  return savedTerritoy;
};

const parseGame = function(game) {
  const Territories = {};
  Object.keys(game.territories).forEach(territory => {
    Territories[territory] = parseTerritory(game.territories[territory]);
  });

  const players = [];
  game.players.forEach(player => {
    const savedPlayer = parsePlayer(player);
    players.push(savedPlayer);
  });

  const savedGame = new Game(game.id, Territories, game.totalPlayerCount);
  savedGame.players = players;
  savedGame.order = game.order;
  savedGame.originalOrder = game.originalOrder;
  savedGame.colors = game.colors;
  return savedGame;
};

const readGameData = function() {
return JSON.parse(fs.readFileSync('./gameData/data.json'));
}

const isGameSaved = function(req) {
  const gameId = req.body.gameId;
  const runningGames = req.app.games;
  const allGames = readGameData();
  if (Object.keys(allGames).includes(gameId)) {
    if (!Object.keys(runningGames.games).includes(gameId)) {
      runningGames.addGame(parseGame(allGames[gameId]));
    }
    return true;
  }
  return false;
};

const getCurrentGameAndPlayer= function(req) {
  const gameId = req.cookies.game;
  const runningGames = req.app.games;
  const currentGame = runningGames.getGame(gameId);
  const currentPlayer = currentGame.getCurrentPlayer();
  return { currentGame, currentPlayer };
};

const loadSavedGame = function(req, res) {
  const playerId = req.body.playerId;
  const gameId = req.body.gameId;
  if (isGameSaved(req)) {
    const { currentGame } = getCurrentGameAndPlayer(req);
    const player = currentGame.getPlayerDetailsById(playerId);
    if (player) {
      player.isActive = true;
      res.cookie('game', gameId);
      res.cookie('playerId', playerId);
      res.redirect('waitingPage');
      return;
    }
    res.send({ msg: 'Invalid Player Id' });
  }
  res.send({ msg: 'Invalid Game Id' });
};

const saveGame = function(req, res) {
  const allSavedGames = readGameData();
  const { currentGame }= getCurrentGameAndPlayer(req);
  const gameId = currentGame.id;
  allSavedGames[gameId] = currentGame;
  fs.writeFile('./gameData/data.json', JSON.stringify(allSavedGames), ()=>{});
  req.app.games.removeGame(gameId);
  res.end();
}

module.exports = {
  logger,
  createGame,
  hostGame,
  validateGameId,
  updateWaitingList,
  getGameData,
  addNewPlayer,
  loadSavedGame,
  saveGame
};

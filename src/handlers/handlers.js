const { Game } = require("../models/game.js");
const Player = require("../models/player");

const logger = function(req, res, next) {
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  console.log("Cookie:", req.cookies);
  console.log("-------------------------------------------------------------");
  next();
};

const createGame = function(getUniqueNum, TERRITORIES, req, res) {
  const games = req.app.games;
  let id = getUniqueNum(5, Object.keys(games));
  let game = new Game(id, TERRITORIES);

  games.addGame(game);
  res.cookie("game", `${id}`);
  res.redirect("/hostGame.html");
  res.end();
};

const addHost = function(req, res) {
  const games = req.app.games;
  if (!req.cookies.game) {
    res.redirect("/");
    return;
  }
  let gameId = req.cookies.game;
  let playerId = 1;
  let currentGame = games.getGame(gameId);
  currentGame.addPlayer(new Player(playerId, req.body.playerName, 30));
  res.cookie("playerId", `${playerId}`);

  res.redirect("waitingPage.html");
};

const joinGame = function(req, res) {
  res.redirect("/joinGame.html");
};

const getGameData = function(games, gameId) {
  let currentGame = games.getGame(gameId);
  let totalPlayers = currentGame.getPlayers().length;

  return { totalPlayers, currentGame };
};

const addPlayer = function(req, res) {
  const games = req.app.games;

  let gameId = req.body.gameId;
  let playerName = req.body.playerName;
  let { totalPlayers, currentGame } = getGameData(games, gameId);

  res.cookie("game", `${gameId}`);
  if (totalPlayers >= 4) {
    const oopsMsg = `Oops...  ${gameId} Game is already full. Plase Join any other game`;
    res.send(oopsMsg);
    return;
  }

  let playerId = currentGame.getPlayers().length + 1;
  res.cookie("playerId", `${playerId}`);
  currentGame.addPlayer(new Player(playerId, playerName, 30));
  res.redirect("waitingPage.html");
};

const updateWaitingList = function(req, res) {
  const games = req.app.games;

  const gameId = req.cookies.game;
  let { totalPlayers } = getGameData(games, gameId);
  if (totalPlayers >= 4) {
    res.redirect("/game.html");
  }
  res.end();
};

module.exports = {
  logger,
  createGame,
  addHost,
  joinGame,
  addPlayer,
  updateWaitingList
};

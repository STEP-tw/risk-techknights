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

const JOIN_GAME_ERROR = `<!DOCTYPE html>
<html>
  <head>
    <title>Risk:HostGame</title>
    <link
      rel="stylesheet"
      type="text/css"
      media="screen"
      href="/css/main.css"
    />
  </head>
  <body>
    <header class="home-page-header">
      <a href="/" style="text-decoration: none; color: black">
        <h1 style="margin-top: 100px">RISK</h1>
      </a>
    </header>
		<main>
		
			<section class="game-pages">
      <div class="container">
      <h1 style="color: white; margin-top: 0px;">JOIN GAME</h1>
			<span style="color:red">Game Id is invalid</span>
          <form action="/addPlayer" method="post">
            <div>
              <input
                type="text"
                name="gameId"
                placeholder="Enter Game Id"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="playerName"
                placeholder="Enter name"
                required
              />
            </div>
            <div class="submit-button">
              <button type="submit">Join</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  </body>
</html>
`;

const logger = function(req, res, next) {
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  console.log("Cookie:", req.cookies);
  console.log("-------------------------------------------------------------");
  next();
};

const createGame = function(req, res) {
  const games = req.app.games;
  const getUniqueNum = req.app.getUniqueNum;
  let id = getUniqueNum(5, Object.keys(games));
  let game = new Game(id, []);
  game.territories = loadTerritories();

  games.addGame(game);
  res.cookie("game", `${id}`);
  res.redirect("/hostGame.html");
  res.end();
};

const getGameData = function(games, gameId) {
  let currentGame = games.getGame(gameId);
  let totalPlayers = currentGame.getPlayers().length;

  return { totalPlayers, currentGame };
};

const addNewPlayer = function(game, playerName, totalPlayers) {
  let playerId = totalPlayers + 1;
  game.addPlayer(new Player(playerId, playerName, 30));
  return playerId;
};

const addHost = function(req, res) {
  const games = req.app.games;
  if (!req.cookies.game) {
    res.redirect("/");
    return;
  }
  let gameId = req.cookies.game;
  let playerName = req.body.playerName;
  let { totalPlayers, currentGame } = getGameData(games, gameId);
  let playerId = addNewPlayer(currentGame, playerName, totalPlayers);
  currentGame.totalPlayerCount = req.body.numberOfPlayers;
  res.cookie("playerId", `${playerId}`);
  res.redirect("waitingPage.html");
};

const joinGame = function(req, res) {
  res.redirect("/joinGame.html");
};

const isGameExists = (games, gameId) =>
  Object.keys(games.games).includes(gameId);

const cantJoinError = gameId =>
  `Oops...  ${gameId} Game is already full. Plase Join any other game`;

const addPlayerToGame = function(req, res) {
  const games = req.app.games;
  let gameId = req.body.gameId;
  if (!isGameExists(games, gameId)) {
    res.send(JOIN_GAME_ERROR);
    return;
  }
  let playerName = req.body.playerName;
  let { totalPlayers, currentGame } = getGameData(games, gameId);
  res.cookie("game", `${gameId}`);
  if (totalPlayers >= currentGame.getTotalPlayerCount()) {
    res.send(cantJoinError(gameId));
    return;
  }
  let playerId = addNewPlayer(currentGame, playerName, totalPlayers);
  res.cookie("playerId", `${playerId}`);
  res.redirect("waitingPage.html");
};

const updateWaitingList = function(req, res) {
  const games = req.app.games;
  const gameId = req.cookies.game;
  let { totalPlayers, currentGame } = getGameData(games, gameId);
  if (totalPlayers >= currentGame.getTotalPlayerCount()) {
    res.redirect("/game.html");
  }
  res.end();
};

module.exports = {
  logger,
  createGame,
  addHost,
  joinGame,
  addPlayerToGame,
  updateWaitingList,
  getGameData,
  addNewPlayer
};
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { Games } = require('./models/game');

const { startAttack, updateCount, attackAgain, battleComplete } = require('./handlers/attackHandler');
const { logger, hostGame, validateGameId, updateWaitingList } = require('./handlers/handlers');
const { sendGamePageDetails, addValidTerritory } = require('./handlers/claimTerritoryHandler');
const { getUniqueNum } = require('./utils.js');

const games = new Games();
app.games = games;
app.getUniqueNum = getUniqueNum;

const getGamePhase = function (req, res) {
  const gameID = req.cookies.game;
  const currentGame = req.app.games.getGame(gameID);
  const phase = currentGame.getPhase();
  res.send({ phase });
};

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger);

app.get('/getGamePhase', getGamePhase);
app.post('/hostGame', hostGame);
app.post('/validateGameId', validateGameId);
app.post('/updateWaitingList', updateWaitingList);

app.post('/claimTerritory', addValidTerritory);
app.get('/initializeGamePage', sendGamePageDetails);

app.post('/attack', startAttack);
app.post('/updateCount', updateCount);
app.post('/attackAgain', attackAgain);
app.post('/battleComplete', battleComplete);

app.use(express.static('public'));

module.exports = app;

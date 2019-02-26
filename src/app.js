const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { Games } = require('./models/game');

const { startAttack, updateCount, attackAgain,
  battleComplete } = require('./handlers/attackHandler');
const { startFortify, fortifyComplete, changePhase,
  changeCurrentPlayerPhase } = require('./handlers/fortifyHandler');
const { startReinforcement, reinforcementComplete,
  changeTurnAndPhase } = require("./handlers/reinforcementHandler");
const { logger, hostGame, validateGameId, updateWaitingList,
  loadSavedGame, saveGame, getPlayersCard } = require('./handlers/handlers');
const { sendGamePageDetails, addValidTerritory } = require('./handlers/claimTerritoryHandler');
const { getUniqueNum } = require('./utils.js');

const games = new Games();
app.games = games;
app.getUniqueNum = getUniqueNum;

const getGamePhase = function (req, res) {
  const gameID = req.cookies.game;
  const currentGame = req.app.games.getGame(gameID);
  const phase = currentGame.getCurrentPlayer().phase;
  res.send({ phase });
};

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger);

app.get('/getGamePhase', getGamePhase);
app.post('/hostGame', hostGame);
app.post('/validateGameId', validateGameId);
app.get('/updateWaitingList', updateWaitingList);

app.post('/claimTerritory', addValidTerritory);
app.get('/initializeGamePage', sendGamePageDetails);

app.post('/attack', startAttack);
app.post('/updateCount', updateCount);
app.post('/attackAgain', attackAgain);
app.post('/battleComplete', battleComplete);

app.post('/fortify', startFortify);
app.post('/fortifyComplete', fortifyComplete);

app.get('/changePhase', changePhase);
app.get('/changeTurnAndPhase', changeTurnAndPhase);
app.get('/changeCurrentPlayerPhase', changeCurrentPlayerPhase);

app.post("/reinforcement", startReinforcement);
app.post("/reinforcementComplete", reinforcementComplete);

app.post('/loadSavedGame', loadSavedGame);
app.get('/saveGame', saveGame);

app.get('/getCards', getPlayersCard);

app.use(express.static('public', { extensions: ['html'] }));

module.exports = app;

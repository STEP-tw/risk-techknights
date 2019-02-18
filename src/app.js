const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const { Games } = require("./models/game");
const { createGame, logger, addHost } = require("./handlers/handlers.js");
const { getUniqueNum } = require("./utils.js");
let games = new Games();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger.bind(null, games));

app.post("/createGame", createGame.bind(null, getUniqueNum, games));
app.post("/hostGame", addHost.bind(null, games));
app.use(express.static("public"));

module.exports = app;

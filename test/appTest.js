const request = require("supertest");
const app = require("../src/app");
const { Game, Games } = require("../src/models/game");
const Territory = require("../src/models/territory");
const Player = require("../src/models/player");

const territory = new Territory("India", ["China"], 10);

const player = new Player(1, "Player 1", 10);
const game = new Game(12345, []);
game.territories = { India: territory };
game.addPlayer(player);
const games = new Games();
games.addGame(game);
app.games = games;

describe("/initializeGamePage", () => {
  it("should respond with 200 ", done => {
    request(app)
      .get("/initializeGamePage")
      .set("Cookie", "game=12345")
      .expect("Content-Type", /application\/json/)
      .expect(200, done);
  });
});

describe("/claimTerritory", () => {
  it("should respond with 200 ", done => {
    request(app)
      .post("/claimTerritory")
      .set("Cookie", "game=12345")
      .send({ territoryName: "India" })
      .expect("Content-Type", /application\/json/)
      .expect(200, done);
  });
});

describe("/claimTerritory", () => {
  it("should respond with 200 ", done => {
    request(app)
      .post("/claimTerritory")
      .set("Cookie", "game=12345")
      .send({ territoryName: "India" })
      .expect("Content-Type", /application\/json/)
      .expect(200, done);
  });
});

describe("POST /createGame", () => {
  it("should set cookie with game id and redirect to hostGame.html", done => {
    request(app)
      .post("/createGame")
      .expect(302)
      .expect("Location", "/hostGame.html")
      .end(done);
  });
});

describe("POST /hostGame", () => {
  it("should have cookie with game id and redirect to waiting page", done => {
    request(app)
      .post("/hostGame")
      .expect(302)
      .end(done);
  });
});

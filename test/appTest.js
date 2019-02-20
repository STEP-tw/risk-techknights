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
      .set("Cookie", "game=12345; playerId=1")
      .send({ territoryName: "India" })
      .expect("Content-Type", /application\/json/)
      .expect(200, done);
  });
});

describe("/claimTerritory", () => {
  it("should respond with 200 ", done => {
    request(app)
      .post("/claimTerritory")
      .set("Cookie", "game=12345; playerId=1")
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

  it("should have cookie with game id and redirect to waiting page", done => {
    request(app)
      .post("/hostGame")
      .set("Cookie", "game=12345")
      .send("numberOfPlayers=4")
      .expect(302)
      .expect("Location", "waitingPage.html")
      .end(done);
  });
});

describe("POST /joinGame", () => {
  it("should redirect to joinGame.html", done => {
    request(app)
      .post("/joinGame")
      .send("game=12345")
      .expect(302)
      .end(done);
  });
});

describe("POST /addPlayer", () => {
  it("should not redirect to anything", done => {
    request(app)
      .post("/addPlayer")
      .send("game=123")
      .send("playerName=Player 1")
      .expect(200)
      .end(done);
  });

  it("should redirect to watingPage", done => {
    request(app)
      .post("/addPlayer")
      .send("gameId=12345")
      .set("cookie", "game=12345")
      .expect("Location", "waitingPage.html")
      .end(done);
  });

  it("should give error message if game is already started", done => {
    const player1 = new Player(2, "Player 2", 10);
    game.addPlayer(player1);
    const player2 = new Player(3, "Player 3", 10);
    game.addPlayer(player2);
    const player3 = new Player(4, "Player 4", 10);
    game.addPlayer(player3);
    const player4 = new Player(5, "Player 5", 10);
    game.addPlayer(player4);
    let expected =
      "Oops...  12345 Game is already full. Plase Join any other game";
    game.addPlayer(player3);
    request(app)
      .post("/addPlayer")
      .send("gameId=12345")
      .send("playerName=Player 5")
      .expect(200)
      .end(done);
  });
});

describe("POST /updateWaitingList", () => {
  it("should redirect to game.html", done => {
    request(app)
      .post("/updateWaitingList")
      .send("gameId=12345")
      .set("cookie", "game=12345")
      .expect("Location", "/game.html")
      .end(done);
  });
});

describe("/getGamePhase", () => {
  it("should respond with 200 and game phase ", done => {
    request(app)
      .get("/getGamePhase")
      .set("Cookie", "game=12345; playerId=1")
      .send({ territoryName: "India" })
      .expect("Content-Type", /application\/json/)
      .expect('{"phase":1}')
      .expect(200, done);
  });
});

describe("/claimTerritory", () => {
  it("should respond with 200 ", done => {
    const countries = ["India", "a", "b", "c"];
    let territories = {};
    countries.forEach(country => {
      territories[country] = new Territory(country, [], 0);
      territories[country].ruler = true;
    });
    game.territories = territories;
    request(app)
      .post("/claimTerritory")
      .set("Cookie", "game=12345;playerId=1")
      .send({ territoryName: "India" })
      .expect("Content-Type", /application\/json/)
      .expect(200, done);
  });
});

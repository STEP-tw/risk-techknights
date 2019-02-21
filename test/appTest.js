const request = require("supertest");
const app = require("../src/app");
const { Game, Games } = require("../src/models/game");
const Territory = require("../src/models/territory");
const Player = require("../src/models/player");

const India = new Territory("India", ["China"], 10);
const China = new Territory("China", ["India"], 10);
const Alaska = new Territory("Alaska", ["Alberta"], 10);
const Alberta = new Territory("Alberta", ["Kamchatka"], 10);

const player = new Player(1, "Player 1", 10);
const game = new Game(12345, []);
game.territories = { India, China, Alaska, Alberta };
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
describe("/attack", () => {
  it("should set the territoryName as attcking territory ", done => {
    request(app)
      .post("/attack")
      .set("Cookie", "game=12345; playerId=1")
      .send({ territoryName: "India" })
      .expect("Content-Type", /application\/json/)
      .expect({})
      .expect(200, done);
  });

  describe("/attackAgain", () => {
    it("should attack again with the same territory ", done => {
      request(app)
        .post("/attackAgain")
        .set("Cookie", "game=12345; playerId=1")
        .send({ territoryName: "India" })
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });

  describe("/battleComplete", () => {
    it("should finish attack ", done => {
      request(app)
        .post("/battleComplete")
        .set("Cookie", "game=12345; playerId=1")
        .send({ territoryName: "India" })
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });

  describe("/updateCount", () => {
    it("should update the number of units both the territories lost ", done => {
      game.attack.defendingTerritory = China;
      request(app)
        .post("/updateCount")
        .send({ attackerLostUnits: 1, defenderLostUnits: 1 })
        .set("Cookie", "game=12345; playerId=1")
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });

  describe("/attack", () => {
    it("should  update the number of units both the territories lost", done => {
      game.attack.attackingTerritory = India;
      request(app)
        .post("/attack")
        .send({ territoryName: "China" })
        .send({ attackerLostUnits: 1, defenderLostUnits: 1 })
        .set("Cookie", "game=12345; playerId=1")
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });

  describe("/updateCount", () => {
    it("should stop attacking if the militaryUnits becomes zero", done => {
      China.militaryUnits = 0;
      game.attack.defendingTerritory = China;
      request(app)
        .post("/updateCount")
        .send({ territoryName: "China" })
        .send({ attackerLostUnits: 1, defenderLostUnits: 1 })
        .set("Cookie", "game=12345; playerId=1")
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });

  describe("/attack", () => {
    it("should allow to attack again from a different territory", done => {
      game.attack.attackingTerritory = India;
      request(app)
        .post("/attack")
        .send({ territoryName: "Alaska" })
        .send({ attackerLostUnits: 1, defenderLostUnits: 1 })
        .set("Cookie", "game=12345; playerId=1")
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });

  describe("/attack", () => {
    it("should set defender if attacker is set ", done => {
      game.attack.attacker = player;
      request(app)
        .post("/attack")
        .send({ territoryName: "India" })
        .set("Cookie", "game=12345; playerId=1")
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });

  describe("/attack", () => {
    it("should not attack if ruler is different ", done => {
      game.attack.attacker = player;
      game.attack.attackingTerritory = Alaska;
      China.ruler = null;
      request(app)
        .post("/attack")
        .send({ territoryName: "India" })
        .set("Cookie", "game=12345; playerId=1")
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });

  describe("/attack", () => {
    it("should not allow attack if militaryUnit is zero ", done => {
      game.attack.attacker = player;
      game.attack.attackingTerritory = Alaska;
      India.militaryUnits = 0;
      China.ruler = null;
      request(app)
        .post("/attack")
        .send({ territoryName: "India" })
        .set("Cookie", "game=12345; playerId=1")
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });

  describe("/attack", () => {
    it("should not set defendingTerritory if attackingTerritory is not set ", done => {
      game.attack.attackingTerritory = "";
      China.ruler = null;
      request(app)
        .post("/attack")
        .send({ territoryName: "China" })
        .set("Cookie", "game=12345; playerId=1")
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });
  describe("/claimTerritory", () => {
    it("should respond with 200 ", done => {
      let countries = new Array(42).fill(1);
      countries = countries.map((x, i) => i);
      let territories = {};
      countries.forEach(country => {
        territories[country] = new Territory(country, [], 0);
        territories[country].ruler = true;
      });
      game.territories = territories;
      request(app)
        .post("/claimTerritory")
        .set("Cookie", "game=12345;playerId=1")
        .send({ territoryName: 1 })
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    });
  });
});

describe("updateWaitingList", () => {
  it("should respond with 200", done => {
    const player = new Player(1, "Player 1", 10);
    const game = new Game(12345, []);
    game.territories = { India };
    game.addPlayer(player);
    const games = new Games();
    games.addGame(game);
    app.games = games;

    request(app)
      .post("/updateWaitingList")
      .send("gameId=12345")
      .set("cookie", "game=12345")
      .expect(200)
      .end(done);
  });
});

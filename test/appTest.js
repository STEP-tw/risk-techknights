const request = require("supertest");
const sinon = require("sinon");
const app = require("../src/app");
const { Game, Games } = require("../src/models/game");
const Territory = require("../src/models/territory");
const Attack = require("../src/models/attack");
const Fortify = require("../src/models/fortify");
const Player = require("../src/models/player");
const { ActivityLog } = require("../src/models/activityLog");

const India = new Territory("India", ["China"], 10);
const China = new Territory("China", ["India"], 10);
const Alaska = new Territory("Alaska", ["Alberta"], 10);
const Alberta = new Territory("Alberta", ["Kamchatka"], 10);

const player = new Player(1, "Player 1", 10);
const game = new Game(12345, [], 4);
game.territories = { India, China, Alaska, Alberta };
game.addPlayer(player);
game.activityLog = new ActivityLog();
const games = new Games();
games.addGame(game);
const fs = require("fs");
app.games = games;
app.fs = fs;

describe("/initializeGamePage", () => {
  it("should respond with 200 ", done => {
    request(app)
      .get("/initializeGamePage")
      .set("Cookie", "game=12345; playerId=1")
      .expect("Content-Type", /application\/json/)
      .expect(200, done);
  });
});

describe("/claimTerritory", () => {
  it("should respond with 200 when territory not occupied", done => {
    request(app)
      .post("/claimTerritory")
      .set("Cookie", "game=12345; playerId=1")
      .send({ territoryName: "India" })
      .expect(200, done);
  });
});

describe("/claimTerritory", () => {
  it("should respond with 200 when territory occupied", done => {
    request(app)
      .post("/claimTerritory")
      .set("Cookie", "game=12345; playerId=1")
      .send({ territoryName: "India" })
      // .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });
});

describe("POST /hostGame", () => {
  it("should have cookie with game id and redirect to waiting page", done => {
    request(app)
      .post("/hostGame")
      .send("playerName=player")
      .send("numberOfPlayers=4")
      .expect(302)
      .end(done);
  });
});

describe("POST /validateGameId", () => {
  it("should not redirect to anything", done => {
    request(app)
      .post("/validateGameId")
      .send("game=123")
      .send("playerName=Player")
      .expect(200)
      .end(done);
  });

  it("should return valid id", done => {
    request(app)
      .post("/validateGameId")
      .send("gameId=12345")
      .set("cookie", "game=12345")
      .end(done);
  });

  it("should set cookie when everything is right", done => {
    request(app)
      .post("/validateGameId")
      .send("gameId=12345")
      .send("playerName=player 3")
      .set("cookie", "game=12345")
      .set("cookie", "playerId=2")
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
      .post("/validateGameId")
      .send("gameId=12345")
      .send("playerName=Player 5")
      .expect(200)
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
  it("should set the territoryName as attacking territory ", done => {
    request(app)
      .post("/attack")
      .set("Cookie", "game=12345; playerId=1")
      .send({ territoryName: "India" })
      .expect("Content-Type", /application\/json/)
      .expect({})
      .expect(200, done);
  });

  it("should set the territoryName as attacking territory ", done => {
    request(app)
      .post("/attack")
      .set("Cookie", "game=12345; playerId=2")
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
    it("should finish attack ", done => {
      console.log(game);
      game.attack = new Attack(player);
      game.attack.attackingTerritory = India;
      game.attack.defendingTerritory = India;

      game.attack.won = true;
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
      game.attack = new Attack(player);
      game.attack.attackingTerritory = India;
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
      .get("/updateWaitingList")
      .send("gameId=12345")
      .set("cookie", "game=12345")
      .expect(200)
      .end(done);
  });

  it("should respond with 200 and decide the players order when all players are joined the game", done => {
    const player1 = new Player(1, "Player 1", 10);
    const player2 = new Player(2, "Player 2", 10);
    const game = new Game(12345, []);
    game.territories = { India };
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.activityLog = new ActivityLog();
    game.totalPlayerCount = 2;
    const games = new Games();
    games.addGame(game);
    app.games = games;

    request(app)
      .get("/updateWaitingList")
      .send("gameId=12345")
      .set("cookie", "game=12345")
      .expect(200)
      .end(done);
  });
});

describe("/reinforcement", function() {
  it("it should reinforce military units in given territory", function(done) {
    request(app)
      .post("/reinforcement")
      .set("cookie", "game=12345;playerId=1")
      .send({ territoryName: "India" })
      .expect(200, done);
  });

  it("it should not reinforce of territory selected is wrong", function(done) {
    India.ruler = null;
    request(app)
      .post("/reinforcement")
      .set("cookie", "game=12345;playerId=1")
      .send({ territoryName: "India" })
      .expect(200, done);
  });

  it("/changeTurnAndPhase", function(done) {
    request(app)
      .get("/changeTurnAndPhase")
      .set("cookie", "game=12345;playerId=1")
      .expect(200, done);
  });
});

describe("/reinforcementComplete", function() {
  it("it should reinforce military units in given territory", function(done) {
    request(app)
      .post("/reinforcementComplete")
      .set("cookie", "game=12345;playerId=1")
      .send({ militaryUnits: 5 })
      .expect(200, done);
  });
});

describe("/fortify", function() {
  it("it should fortify military units in given territory", function(done) {
    const game = new Game(12345, [], 4);

    game.fortify = new Fortify(player);
    India.ruler = player;
    game.fortify.sourceTerritory = China;
    China.ruler = player;
    game.fortify.destinationTerritory = India;

    game.territories = { India, China };
    game.addPlayer(player);
    const games = new Games();
    games.addGame(game);
    app.games = games;

    request(app)
      .post("/fortify")
      .set("cookie", "game=12345;playerId=1")
      .send({ territoryName: "India" })
      .expect(200, done);
  });
  it("it should set source territory", function(done) {
    const game = new Game(12345, [], 4);

    game.fortify = new Fortify(player);
    India.ruler = player;
    China.ruler = player;
    India.militaryUnits = 10;
    game.fortify.destinationTerritory = India;
    game.territories = { India, China };
    game.addPlayer(player);
    const games = new Games();
    games.addGame(game);
    app.games = games;

    request(app)
      .post("/fortify")
      .set("cookie", "game=12345;playerId=1")
      .send({ territoryName: "India" })
      .expect(200, done);
  });

  it("it should return error when military units are less than 1", function(done) {
    const game = new Game(12345, [], 4);

    game.fortify = new Fortify(player);
    India.ruler = player;
    China.ruler = player;
    India.militaryUnits = 0;
    game.fortify.destinationTerritory = India;
    game.territories = { India, China };
    game.addPlayer(player);
    const games = new Games();
    games.addGame(game);
    app.games = games;

    request(app)
      .post("/fortify")
      .set("cookie", "game=12345;playerId=1")
      .send({ territoryName: "India" })
      .expect(200, done);
  });

  it("it should create a new instance of fortify", function(done) {
    const game = new Game(12345, [], 4);
    India.ruler = player;
    China.ruler = player;
    game.territories = { India, China };
    game.addPlayer(player);
    const games = new Games();
    games.addGame(game);
    app.games = games;

    request(app)
      .post("/fortify")
      .set("cookie", "game=12345;playerId=1")
      .send({ territoryName: "India" })
      .expect(200, done);
  });

  it("it should not fortify military units when given territory is wrong", function(done) {
    const game = new Game(12345, [], 4);
    game.fortify = new Fortify(player);
    India.ruler = player;
    game.fortify.sourceTerritory = Alaska;
    China.ruler = player;
    game.fortify.destinationTerritory = India;

    game.territories = { India, Alaska };
    game.addPlayer(player);
    const games = new Games();
    games.addGame(game);
    app.games = games;

    request(app)
      .post("/fortify")
      .set("cookie", "game=12345;playerId=1")
      .send({ territoryName: "Alaska" })
      .expect(200, done);
  });
});
describe("/fortifyComplete", function() {
  it("it should fortify military units and change no. of military units in player and territory", function(done) {
    const game = new Game(12345, [], 4);
    game.fortify = new Fortify(player);
    game.fortify.sourceTerritory = China;
    game.fortify.destinationTerritory = India;
    game.activityLog = new ActivityLog();
    game.territories = { India, China };
    game.addPlayer(player);
    game.getCurrentPlayer().phase = 4;
    const games = new Games();
    games.addGame(game);
    app.games = games;

    request(app)
      .post("/fortifyComplete")
      .set("cookie", "game=12345;playerId=1")
      .send({ militaryUnits: 10 })
      .expect(200, done);
  });
});

describe("/changeCurrentPlayerPhase", function() {
  it("it should reinforce military units in given territory", function(done) {
    request(app)
      .get("/changeCurrentPlayerPhase")
      .set("cookie", "game=12345;playerId=1")
      .expect(200, done);
  });
});

describe("/initializeGamePage", function() {
  it("/initializeGamePage attack true", done => {
    const India = new Territory("India", ["China"], 10);
    const China = new Territory("China", ["India"], 10);
    const player = new Player(1, "Player 1", 10);
    const game = new Game(12345, [], 4);
    game.territories = { India, China, Alaska, Alberta };
    game.addPlayer(player);
    const games = new Games();
    games.addGame(game);
    app.games = games;
    game.attack = new Attack();
    game.attack.attackingTerritory = India;
    game.attack.defendingTerritory = China;
    request(app)
      .get("/initializeGamePage")
      .set("Cookie", "game=12345; playerId=1")
      .expect("Content-Type", /application\/json/)
      .expect(200, done);
  });
  it("/initializeGamePage fortify true", done => {
    const India = new Territory("India", ["China"], 10);
    const China = new Territory("China", ["India"], 10);
    const player = new Player(1, "Player 1", 10);
    const game = new Game(12345, [], 4);
    game.territories = { India, China, Alaska, Alberta };
    game.addPlayer(player);
    const games = new Games();
    games.addGame(game);
    app.games = games;
    game.fortify = new Fortify();
    game.fortify.sourceTerritory = India;
    game.fortify.destinationTerritory = China;
    request(app)
      .get("/initializeGamePage")
      .set("Cookie", "game=12345; playerId=1")
      .expect("Content-Type", /application\/json/)
      .expect(200, done);
  });
});

describe("/changePhase", function() {
  it("should change the current players phase", function(done) {
    const player1 = new Player(1, "Player 1", 10);
    const player2 = new Player(2, "Player 2", 10);
    player1.phase = 1;
    player2.phase = 1;
    const game = new Game(12345, [], 4);
    game.attack = new Attack(player1);
    game.fortify = new Fortify(player1);
    game.addPlayer(player1);
    game.addPlayer(player2);
    const games = new Games();
    games.addGame(game);
    app.games = games;

    request(app)
      .get("/changePhase")
      .set("Cookie", "game=12345; playerId=1")
      .expect(200, done);
  });
});

describe("/saveGame", () => {
  it("should save the game at the point when save button is clicked", done => {
    fs.readFileSync = sinon.stub();
    fs.readFileSync.returns(
      JSON.stringify({
        "12345": {
          id: 12345,
          players: [
            {
              id: 1,
              name: "Player 1",
              militaryUnits: 10,
              phase: 2,
              instruction: "Please wait for your turn",
              isActive: false,
              receivedCards: { cards: [] },
              hasWonAttack: false,
              color: "aqua"
            },
            {
              id: 2,
              name: "Player 2",
              militaryUnits: 10,
              phase: 2,
              instruction: "Please wait for your turn",
              isActive: false,
              receivedCards: { cards: [] },
              hasWonAttack: false,
              color: "#98fb98"
            }
          ],
          order: [1, 2],
          originalOrder: [],
          colors: ["#d9ff00", "#f08080", "#efb073", "#ef8fed"],
          phase: 1,
          territories: [],
          totalPlayerCount: 4,
          horsePosition: [
            2,
            4,
            6,
            8,
            10,
            15,
            20,
            25,
            30,
            35,
            40,
            45,
            50,
            55,
            60
          ],
          currentHorseIndex: 0
        }
      })
    );
    fs.writeFile = sinon.stub();
    fs.writeFile.returns("");
    app.fs = fs;
    request(app)
      .get("/saveGame")
      .set("Cookie", "game=12345; playerId=1")
      .expect(200, done);
  });
});

describe("/loadSavedGame", () => {
  it.skip("should respond with 302 if game exists and all data is present", done => {
    fs.readFileSync = sinon.stub();
    fs.readFileSync.returns(
      JSON.stringify({
        "12345": {
          id: 12345,
          players: [
            {
              id: 1,
              name: "Player 1",
              militaryUnits: 10,
              phase: 2,
              instruction: "Please wait for your turn",
              isActive: false,
              receivedCards: { cards: [] },
              hasWonAttack: false,
              color: "aqua"
            },
            {
              id: 2,
              name: "Player 2",
              militaryUnits: 10,
              phase: 2,
              instruction: "Please wait for your turn",
              isActive: false,
              receivedCards: { cards: [] },
              hasWonAttack: false,
              color: "#98fb98"
            }
          ],
          order: [1, 2],
          originalOrder: [],
          colors: ["#d9ff00", "#f08080", "#efb073", "#ef8fed"],
          phase: 1,
          territories: {
            Alaska: {
              name: "Alaska",
              neighbours: ["Alberta", "Northwest Territory", "Kamchatka"],
              militaryUnits: 1,
              ruler: {
                id: 2,
                name: "B",
                militaryUnits: 7,
                phase: 3,
                instruction: "Please wait for your turn",
                isActive: true,
                receivedCards: { cards: ["Infantry", "Cavalry"] },
                hasWonAttack: false,
                color: "#ef8fed"
              }
            }
          },
          continents: {
            australia: {
              name: "australia",
              territories: [
                {
                  name: "Alaska",
                  neighbours: ["Alberta", "Northwest Territory", "Kamchatka"],
                  militaryUnits: 1,
                  ruler: {
                    id: 2,
                    name: "B",
                    militaryUnits: 7,
                    phase: 3,
                    instruction: "Please wait for your turn",
                    isActive: true,
                    receivedCards: { cards: ["Infantry", "Cavalry"] },
                    hasWonAttack: false,
                    color: "#ef8fed"
                  }
                }
              ]
            }
          },
          totalPlayerCount: 4,
          horsePosition: [
            2,
            4,
            6,
            8,
            10,
            15,
            20,
            25,
            30,
            35,
            40,
            45,
            50,
            55,
            60
          ],
          currentHorseIndex: 0
        }
      })
    );
    app.fs = fs;
    request(app)
      .post("/loadSavedGame")
      .send({ gameId: "12345", playerId: 1 })
      .expect(302, done);
  });

  it.skip("should respond with 200 with action of game nots exists game if game not exists in saved games", done => {
    fs.readFileSync = sinon.stub();
    fs.readFileSync.returns(
      JSON.stringify({
        "12345": {
          id: 12345,
          players: [
            {
              id: 1,
              name: "Player 1",
              militaryUnits: 10,
              phase: 2,
              instruction: "Please wait for your turn",
              isActive: false,
              receivedCards: { cards: [] },
              hasWonAttack: false,
              color: "aqua"
            },
            {
              id: 2,
              name: "Player 2",
              militaryUnits: 10,
              phase: 2,
              instruction: "Please wait for your turn",
              isActive: false,
              receivedCards: { cards: [] },
              hasWonAttack: false,
              color: "#98fb98"
            }
          ],
          order: [1, 2],
          originalOrder: [],
          colors: ["#d9ff00", "#f08080", "#efb073", "#ef8fed"],
          phase: 1,
          territories: {},
          continents: {},
          totalPlayerCount: 4,
          horsePosition: [
            2,
            4,
            6,
            8,
            10,
            15,
            20,
            25,
            30,
            35,
            40,
            45,
            50,
            55,
            60
          ],
          currentHorseIndex: 0
        }
      })
    );
    app.fs = fs;
    request(app)
      .post("/loadSavedGame")
      .send({ gameId: "98746", playerId: 1 })
      .expect(200, done);
  });
});

describe("/getCards", () => {
  it.skip("should respond with 200 for and send card details", done => {
    request(app)
      .get("/getCards")
      .set("Cookie", "game=12345; playerId=1")
      .expect(200, done);
  });
});

describe("/tradeCards", () => {
  it.skip("should respond with 200 for and update cards for player", done => {
    request(app)
      .get("/tradeCards")
      .set("Cookie", "game=12345; playerId=1")
      .expect(200, done);
  });
});

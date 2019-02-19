const request = require("supertest");
const app = require("../src/app");

describe("/initializeGamePage", () => {
  it("should respond with 200 ", done => {
    request(app)
      .get("/initializeGamePage")
      .expect("Content-Type", "application/json")
      .expect(200, done);
  });
});

describe("/claimTerritory", () => {
  it("should respond with 200 ", done => {
    request(app)
      .post("/claimTerritory")
      .send({ territoryName: "India" })
      .expect("Content-Type", "application/json")
      .expect(200, done);
  });
});

describe("/claimTerritory", () => {
  it("should respond with 200 ", done => {
    request(app)
      .post("/claimTerritory")
      .send({ territoryName: "India" })
      .expect("Content-Type", "application/json")
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

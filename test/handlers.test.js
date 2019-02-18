const request = require("supertest");
const app = require("../src/app.js");

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

const request = require("superTest");
const app = require("../src/app");

describe("/getPlayer", () => {
  it("should respond with 200 ", done => {
    request(app)
      .get("/getPlayer")
      .expect("Content-Type", "text/plain")
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

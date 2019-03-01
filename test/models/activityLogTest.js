const assert = require("assert");
const { ActivityLog } = require("../../src/models/activityLog");
let activityLog = new ActivityLog();

activityLog.logs.unshift("a");
activityLog.logs.unshift("b");
activityLog.logs.unshift("c");

describe("getLogs()", function() {
  it("should return logs with new line", function() {
    let expectedOutput = "c\nb\na";
    let actualOutput = activityLog.getLogs();
    assert.equal(actualOutput, expectedOutput);
  });
});

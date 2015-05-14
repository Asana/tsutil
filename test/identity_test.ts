import chai = require("chai");
import tsutil = require("../src/index");

var assert = chai.assert;

suite("identity", () => {
    test("should return the same value", () => {
        var value = {};
        assert.equal(value, tsutil.identity(value));
    });
});

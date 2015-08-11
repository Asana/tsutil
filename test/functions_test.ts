import chai = require("chai");
import tsutil = require("../src/index");

var functions = tsutil.functions;
var assert = chai.assert;

suite("functions", () => {
    suite("identity", () => {
        test("should return the same value", () => {
            var value = {};
            assert.equal(value, functions.identity(value));
        });
    });

    suite("noop", () => {
        test("can be called with no arguments", () => {
            assert.isUndefined(functions.noop());
        });

        test("can be called with two arguments", () => {
            assert.isUndefined(functions.noop({}, {}));
        });

        test("can be called for a fake expected return type", () => {
            var result: { fake_type: number } = functions.noop();
            assert.isUndefined(result);
        });

        test("can be called for a void expected return type", () => {
            var func: () => void = functions.noop;
            assert.isUndefined(func());
        });
    });
});

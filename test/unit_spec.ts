import chai = require("chai");
import tsutil = require("../src/index");

var assert = chai.assert;

describe("Unit", () => {
    beforeEach(() => {
        delete tsutil.Unit._instance;
    });

    describe("#constructor()", () => {
        it("should return the same instance repeatedly", () => {
            var unit0 = new tsutil.Unit();
            var unit1 = new tsutil.Unit();
            assert.equal(unit0, unit1);
        });
    });

    describe("#instance()", () => {
        it("should return the same instance repeatedly", () => {
            var unit0 = tsutil.Unit.instance();
            var unit1 = tsutil.Unit.instance();
            assert.equal(unit0, unit1);
        });
    });
});

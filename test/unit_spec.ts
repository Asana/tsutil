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

    // This test is commented out because it intentionally does
    // not compile. To test this correctly, we would pull in the
    // Typescript compiler and try to compile some code, but that
    // seemed like overkill.
    // it("should not compile when a non-Unit object is assigned to a Unit variable", () => {
    //     /* tslint:disable no-unused-variable */
    //     var unit: tsutil.Unit = {};
    //     /* tslint:enable no-unused-variable */
    // });
});

import chai = require("chai");
import tsutil = require("../src/index");

var assert = chai.assert;

suite("Unit", () => {
    setup(() => {
        delete tsutil.Unit._instance;
    });

    suite("#constructor()", () => {
        test("should return the same instance repeatedly", () => {
            var unit0 = new tsutil.Unit();
            var unit1 = new tsutil.Unit();
            assert.equal(unit0, unit1);
        });
    });

    suite("#instance()", () => {
        test("should return the same instance repeatedly", () => {
            var unit0 = tsutil.Unit.instance();
            var unit1 = tsutil.Unit.instance();
            assert.equal(unit0, unit1);
        });
    });

    /**
     * This test is commented out because it intentionally does
     * not compile. To test this correctly, we would pull in the
     * Typescript compiler and try to compile some code, but that
     * seemed like overkill.
     * test("should not compile when a non-Unit object is assigned to a Unit variable", () => {
     *     var unit: tsutil.Unit = {};
     * });
     */
});

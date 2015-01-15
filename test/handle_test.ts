import chai = require("chai");
import tsutil = require("../src/index");
import sinon = require("sinon");

var assert = chai.assert;

describe("Handle", () => {
    var VALUE = "asana";
    var onRelease: SinonSpy;

    beforeEach(() => {
        onRelease = sinon.spy();
    });

    describe("constructor", () => {
        it("should create a new handle", () => {
            var handle = new tsutil.Handle(VALUE, onRelease);
            assert.instanceOf(handle, tsutil.Handle);
        });
    });

    describe("value", () => {
        it("should return the value", () => {
            var handle = new tsutil.Handle(VALUE, onRelease);
            assert.equal(handle.value(), VALUE);
        });
    });

    describe("release", () => {
        it("should call onRelease", () => {
            var handle = new tsutil.Handle(VALUE, onRelease);
            handle.release();
            sinon.assert.called(onRelease);
        });
    });
});

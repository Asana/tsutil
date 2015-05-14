import chai = require("chai");
import tsutil = require("../src/index");
import sinon = require("sinon");

var assert = chai.assert;

describe("Optional", () => {
    var VALUE = "asana";
    var OTHER = "luna";

    describe("#flatten", () => {
        it("should only include non empty optionals", () => {
            var optionals = [
                new tsutil.Optional(2),
                tsutil.Optional.NONE,
                new tsutil.Optional(1)
            ];
            assert.deepEqual(tsutil.Optional.flatten(optionals), [2, 1]);
        });
    });

    describe("constructor", () => {
        it("should return NONE for undefined", () => {
            assert.equal(new tsutil.Optional<any>(undefined), tsutil.Optional.NONE);
        });

        it("should return NONE for null", () => {
            assert.equal(new tsutil.Optional<any>(null), tsutil.Optional.NONE);
        });

        it("should return a new optional for defined", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.notEqual(optional, tsutil.Optional.NONE);
        });
    });

    describe("isEmpty", () => {
        it("should return true for undefined", () => {
            var optional = new tsutil.Optional(undefined);
            assert.isTrue(optional.isEmpty());
        });

        it("should return true for null", () => {
            var optional = new tsutil.Optional(null);
            assert.isTrue(optional.isEmpty());
        });

        it("should return false for a value", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.isFalse(optional.isEmpty());
        });
    });

    describe("isNonEmpty", () => {
        it("should return false for undefined", () => {
            var optional = new tsutil.Optional(undefined);
            assert.isFalse(optional.isNonEmpty());
        });

        it("should return false for null", () => {
            var optional = new tsutil.Optional(null);
            assert.isFalse(optional.isNonEmpty());
        });

        it("should return true for a value", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.isTrue(optional.isNonEmpty());
        });
    });

    describe("filter", () => {
        it("should return NONE for NONE", () => {
            assert.equal(tsutil.Optional.NONE.filter(() => {
                return true;
            }), tsutil.Optional.NONE);
        });

        it("should return NONE for false", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.equal(optional.filter(() => {
                return false;
            }), tsutil.Optional.NONE);
        });

        it("should return this for true", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.equal(optional.filter(() => {
                return true;
            }), optional);
        });
    });

    describe("forEach", () => {
        it("should not be called for NONE", () => {
            var spy = sinon.spy();
            tsutil.Optional.NONE.forEach(spy);
            sinon.assert.notCalled(spy);
        });

        it("should be called for a value", () => {
            var optional = new tsutil.Optional(VALUE);
            var spy = sinon.spy();
            optional.forEach(spy);
            sinon.assert.calledWithExactly(spy, optional.getOrThrow());
        });
    });

    describe("map", () => {
        it("should not be called for NONE", () => {
            var spy = sinon.spy();
            tsutil.Optional.NONE.map(spy);
            sinon.assert.notCalled(spy);
        });

        it("should be called for a value", () => {
            var optional = new tsutil.Optional(VALUE);
            var spy = sinon.stub();
            spy.returns(OTHER);
            var other = optional.map(spy);
            sinon.assert.calledWithExactly(spy, optional.getOrThrow());
            assert.equal(other.getOrThrow(), OTHER);
        });
    });

    describe("flatMap", () => {
        it("should not be called for NONE", () => {
            var spy = sinon.spy();
            tsutil.Optional.NONE.flatMap(spy);
            sinon.assert.notCalled(spy);
        });

        it("should be called for a value", () => {
            var optional = new tsutil.Optional(VALUE);
            var spy = sinon.stub();
            var flatten = new tsutil.Optional(OTHER);
            spy.returns(flatten);
            var other = optional.flatMap(spy);
            sinon.assert.calledWithExactly(spy, optional.getOrThrow());
            assert.equal(other, flatten);
            assert.equal(other.getOrThrow(), OTHER);
        });
    });

    describe("getOrNull", () => {
        it("should return null for NONE", () => {
            var value = tsutil.Optional.NONE.getOrNull();
            assert.equal(value, null);
        });

        it("should return the value", () => {
            var optional = new tsutil.Optional(VALUE);
            var value = optional.getOrNull();
            assert.equal(value, VALUE);
        });
    });

    describe("getOrThrow", () => {
        it("should throw for NONE", () => {
            assert.throws(() => {
                tsutil.Optional.NONE.getOrThrow();
            }, "Called getOrThrow on an empty Optional");
        });

        it("should return the value", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.equal(optional.getOrThrow(), VALUE);
        });
    });

    describe("getOrElse", () => {
        it("should return else for NONE", () => {
            var other = tsutil.Optional.NONE.getOrElse(() => {
                return OTHER;
            });
            assert.equal(other, OTHER);
        });

        it("should return the value", () => {
            var optional = new tsutil.Optional(VALUE);
            var spy = sinon.spy();
            var other = optional.getOrElse(spy);
            assert.equal(other, VALUE);
            sinon.assert.notCalled(spy);
        });
    });

    describe("orElse", () => {
        it("should return else for NONE", () => {
            var other = tsutil.Optional.NONE.orElse(() => {
                return new tsutil.Optional(OTHER);
            });
            assert.equal(other.getOrThrow(), OTHER);
        });

        it("should return the value", () => {
            var optional = new tsutil.Optional(VALUE);
            var spy = sinon.spy();
            var other = optional.orElse(spy);
            assert.equal(other.getOrThrow(), VALUE);
            sinon.assert.notCalled(spy);
        });
    });

    describe("toArray", () => {
        it("should return an empty array for NONE", () => {
            var array = tsutil.Optional.NONE.toArray();
            assert.deepEqual(array, []);
        });

        it("should return an array containing the value", () => {
            var optional = new tsutil.Optional(VALUE);
            var array = optional.toArray();
            assert.deepEqual(array, [VALUE]);
        });
    });
});

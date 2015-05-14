import chai = require("chai");
import tsutil = require("../src/index");
import sinon = require("sinon");

var assert = chai.assert;

suite("Optional", () => {
    var VALUE = "asana";
    var OTHER = "luna";

    suite("#flatten", () => {
        test("should only include non empty optionals", () => {
            var optionals = [
                new tsutil.Optional(2),
                tsutil.Optional.NONE,
                new tsutil.Optional(1)
            ];
            assert.deepEqual(tsutil.Optional.flatten(optionals), [2, 1]);
        });
    });

    suite("constructor", () => {
        test("should return NONE for undefined", () => {
            assert.equal(new tsutil.Optional<any>(undefined), tsutil.Optional.NONE);
        });

        test("should return NONE for null", () => {
            assert.equal(new tsutil.Optional<any>(null), tsutil.Optional.NONE);
        });

        test("should return a new optional for defined", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.notEqual(optional, tsutil.Optional.NONE);
        });
    });

    suite("isEmpty", () => {
        test("should return true for undefined", () => {
            var optional = new tsutil.Optional(undefined);
            assert.isTrue(optional.isEmpty());
        });

        test("should return true for null", () => {
            var optional = new tsutil.Optional(null);
            assert.isTrue(optional.isEmpty());
        });

        test("should return false for a value", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.isFalse(optional.isEmpty());
        });
    });

    suite("isNonEmpty", () => {
        test("should return false for undefined", () => {
            var optional = new tsutil.Optional(undefined);
            assert.isFalse(optional.isNonEmpty());
        });

        test("should return false for null", () => {
            var optional = new tsutil.Optional(null);
            assert.isFalse(optional.isNonEmpty());
        });

        test("should return true for a value", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.isTrue(optional.isNonEmpty());
        });
    });

    suite("filter", () => {
        test("should return NONE for NONE", () => {
            assert.equal(tsutil.Optional.NONE.filter(() => {
                return true;
            }), tsutil.Optional.NONE);
        });

        test("should return NONE for false", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.equal(optional.filter(() => {
                return false;
            }), tsutil.Optional.NONE);
        });

        test("should return this for true", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.equal(optional.filter(() => {
                return true;
            }), optional);
        });
    });

    suite("forEach", () => {
        test("should not be called for NONE", () => {
            var spy = sinon.spy();
            tsutil.Optional.NONE.forEach(spy);
            sinon.assert.notCalled(spy);
        });

        test("should be called for a value", () => {
            var optional = new tsutil.Optional(VALUE);
            var spy = sinon.spy();
            optional.forEach(spy);
            sinon.assert.calledWithExactly(spy, optional.getOrThrow());
        });
    });

    suite("map", () => {
        test("should not be called for NONE", () => {
            var spy = sinon.spy();
            tsutil.Optional.NONE.map(spy);
            sinon.assert.notCalled(spy);
        });

        test("should be called for a value", () => {
            var optional = new tsutil.Optional(VALUE);
            var spy = sinon.stub();
            spy.returns(OTHER);
            var other = optional.map(spy);
            sinon.assert.calledWithExactly(spy, optional.getOrThrow());
            assert.equal(other.getOrThrow(), OTHER);
        });
    });

    suite("flatMap", () => {
        test("should not be called for NONE", () => {
            var spy = sinon.spy();
            tsutil.Optional.NONE.flatMap(spy);
            sinon.assert.notCalled(spy);
        });

        test("should be called for a value", () => {
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

    suite("getOrNull", () => {
        test("should return null for NONE", () => {
            var value = tsutil.Optional.NONE.getOrNull();
            assert.equal(value, null);
        });

        test("should return the value", () => {
            var optional = new tsutil.Optional(VALUE);
            var value = optional.getOrNull();
            assert.equal(value, VALUE);
        });
    });

    suite("getOrThrow", () => {
        test("should throw for NONE", () => {
            assert.throws(() => {
                tsutil.Optional.NONE.getOrThrow();
            }, "Called getOrThrow on an empty Optional");
        });

        test("should return the value", () => {
            var optional = new tsutil.Optional(VALUE);
            assert.equal(optional.getOrThrow(), VALUE);
        });
    });

    suite("getOrElse", () => {
        test("should return else for NONE", () => {
            var other = tsutil.Optional.NONE.getOrElse(() => {
                return OTHER;
            });
            assert.equal(other, OTHER);
        });

        test("should return the value", () => {
            var optional = new tsutil.Optional(VALUE);
            var spy = sinon.spy();
            var other = optional.getOrElse(spy);
            assert.equal(other, VALUE);
            sinon.assert.notCalled(spy);
        });
    });

    suite("orElse", () => {
        test("should return else for NONE", () => {
            var other = tsutil.Optional.NONE.orElse(() => {
                return new tsutil.Optional(OTHER);
            });
            assert.equal(other.getOrThrow(), OTHER);
        });

        test("should return the value", () => {
            var optional = new tsutil.Optional(VALUE);
            var spy = sinon.spy();
            var other = optional.orElse(spy);
            assert.equal(other.getOrThrow(), VALUE);
            sinon.assert.notCalled(spy);
        });
    });

    suite("toArray", () => {
        test("should return an empty array for NONE", () => {
            var array = tsutil.Optional.NONE.toArray();
            assert.deepEqual(array, []);
        });

        test("should return an array containing the value", () => {
            var optional = new tsutil.Optional(VALUE);
            var array = optional.toArray();
            assert.deepEqual(array, [VALUE]);
        });
    });
});

import chai = require("chai");
import tsutil = require("../src/index");
import sinon = require("sinon");

var assert = chai.assert;

suite("Try", () => {
    var VALUE = "asana";
    var VALUE_ACCESSOR = () => {
        return VALUE;
    };
    var OTHER = "luna";
    var OTHER_ACCESSOR = () => {
        return OTHER;
    };
    var ERR = new Error();

    suite("#all", () => {
        test("should return all of the values if there is not an exception", () => {
            var t = tsutil.Try.success(VALUE);
            var k = tsutil.Try.success(OTHER);
            assert.deepEqual(tsutil.Try.all([t, k]).valueOrThrow(), [VALUE, OTHER]);
        });

        test("should throw if there is an exception", () => {
            var t = tsutil.Try.success(VALUE);
            var k = tsutil.Try.failure(ERR);
            assert.isTrue(tsutil.Try.all([t, k]).isFailure());
        });
    });

    suite("#attempt", () => {
        test("should return a value if successful", () => {
            var t = tsutil.Try.attempt(VALUE_ACCESSOR);
            assert.equal(t.valueOrThrow(), VALUE);
        });

        test("should handle throwing an error", () => {
            var t = tsutil.Try.attempt(() => {
                throw ERR;
            });
            assert.equal(t.errorOrNull(), ERR);
        });

        test("should handle a positive filter", () => {
            var t = tsutil.Try.attempt(() => {
                throw ERR;
            }, () => { return true; });
            assert.equal(t.errorOrNull(), ERR);
        });

        test("should handle a negative filter", () => {
            assert.throws(() => {
                tsutil.Try.attempt(() => {
                    throw ERR;
                }, () => { return false; });
            });
        });

        test("should return a value if successful, with a negative filter", () => {
            var t = tsutil.Try.attempt(VALUE_ACCESSOR, () => {
                return false;
            });
            assert.equal(t.valueOrThrow(), VALUE);
        });
    });

    suite("#success", () => {
        test("should return a successful Try", () => {
            var t = tsutil.Try.success(VALUE);
            assert.equal(t.valueOrThrow(), VALUE);
        });
    });

    suite("#failure", () => {
        test("should return a failed Try", () => {
            var t = tsutil.Try.failure(ERR);
            assert.equal(t.errorOrNull(), ERR);
        });

        test("should throw an error if provided with a null error", () => {
            assert.throws(() => {
                tsutil.Try.failure(null);
            });
        });
    });

    suite("constructor", () => {
        /* tslint:disable no-unused-expression */
        test("should handle a value", () => {
            var t = new tsutil.Try(undefined, VALUE);
            assert.equal(t.valueOrThrow(), VALUE);
        });

        test("should handle an error", () => {
            var t = new tsutil.Try(ERR, undefined);
            assert.equal(t.errorOrNull(), ERR);
        });

        test("should throw an error if provided with a null error", () => {
            assert.throws(() => {
                new tsutil.Try(null, undefined);
            });
        });
        /* tslint:enable no-unused-expression */
    });

    suite("error", () => {
        test("should return NONE for a success", () => {
            assert.equal(tsutil.Try.success(VALUE).error(), tsutil.Optional.NONE);
        });

        test("should return an Optional of the error for a failure", () => {
            assert.equal(tsutil.Try.failure(ERR).error().getOrThrow(), ERR);
        });
    });

    suite("errorOrNull", () => {
        test("should return null for a success", () => {
            var t = tsutil.Try.success(VALUE);
            assert.isNull(t.errorOrNull());
        });

        test("should return the error for a failure", () => {
            var t = tsutil.Try.failure(ERR);
            assert.equal(t.errorOrNull(), ERR);
        });
    });

    suite("isFailure", () => {
        test("should be true for a failure", () => {
            assert.isTrue(tsutil.Try.failure(ERR).isFailure());
        });

        test("should be false for a success", () => {
            assert.isFalse(tsutil.Try.success(VALUE).isFailure());
        });
    });

    suite("isSuccess", () => {
        test("should be true for a success", () => {
            assert.isTrue(tsutil.Try.success(VALUE).isSuccess());
        });

        test("should be false for a failure", () => {
            assert.isFalse(tsutil.Try.failure(ERR).isSuccess());
        });
    });

    suite("filter", () => {
        test("should not called the callback for failure", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.failure(ERR);
            var k = t.filter(spy);
            assert.equal(k, t);
            sinon.assert.notCalled(spy);
        });

        test("should handle a positive filter", () => {
            var t = tsutil.Try.success(VALUE);
            var k = t.filter(() => { return true; });
            assert.equal(k, t);
        });

        test("should handle a negative filter", () => {
            var t = tsutil.Try.success(VALUE);
            var k = t.filter(() => { return false; });
            assert.notEqual(k, t);
            assert.isTrue(k.isFailure());
        });
    });

    suite("forEach", () => {
        test("should call the callback for success", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.success(VALUE);
            t.forEach(spy);
            sinon.assert.calledWithExactly(spy, VALUE);
        });

        test("should not call the callback for failure", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.failure(ERR);
            t.forEach(spy);
            sinon.assert.notCalled(spy);
        });

        test("should call the callback for a null value", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.success(null);
            t.forEach(spy);
            sinon.assert.calledWithExactly(spy, null);
        });
    });

    suite("map", () => {
        test("should return the new value", () => {
            var t = tsutil.Try.success(VALUE).map(OTHER_ACCESSOR);
            assert.equal(t.valueOrThrow(), OTHER);
        });

        test("should return a failed try if the mapper throws", () => {
            var t = tsutil.Try.success(VALUE).map(() => { throw ERR; });
            assert.equal(t.errorOrNull(), ERR);
        });

        test("should not call the new value if the try is failed", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.failure(ERR);
            var k = t.map(spy);
            assert.equal(k, t);
            sinon.assert.notCalled(spy);
        });

        test("should call the mapper for a null value", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.success(null);
            t.map(spy);
            sinon.assert.calledWithExactly(spy, null);
        });
    });

    suite("flatMap", () => {
        test("should return the new value", () => {
            var t = tsutil.Try.success(VALUE);
            var k = tsutil.Try.success(OTHER).flatMap(() => { return t; });
            assert.equal(k, t);
        });

        test("should return a failed try if the mapper throws", () => {
            var t = tsutil.Try.failure(ERR);
            var k = t.flatMap(() => { return tsutil.Try.success(VALUE); });
            assert.equal(k, t);
        });

        test("should call the mapper for a null value", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.success(null);
            t.flatMap(spy);
            sinon.assert.calledWithExactly(spy, null);
        });
    });

    suite("value", () => {
        test("should return an optional for success", () => {
            assert.equal(tsutil.Try.success(VALUE).value().getOrThrow(), VALUE);
        });

        test("should return NONE for failure", () => {
            assert.equal(tsutil.Try.failure(ERR).value(), tsutil.Optional.NONE);
        });

        test("should return NONE for a null value", () => {
            assert.equal(tsutil.Try.success(null).value(), tsutil.Optional.NONE);
        });
    });

    suite("valueOrNull", () => {
        test("should return the value for success", () => {
            var t = tsutil.Try.success(VALUE);
            assert.equal(t.valueOrNull(), VALUE);
        });

        test("should return null for failure", () => {
            var t = tsutil.Try.failure(ERR);
            assert.isNull(t.valueOrNull());
        });

        test("should return null for a null value", () => {
            var t = tsutil.Try.success(null);
            assert.isNull(t.valueOrNull());
        });
    });

    suite("valueOrThrow", () => {
        test("should return the value for success", () => {
            var t = tsutil.Try.success(VALUE);
            assert.equal(t.valueOrThrow(), VALUE);
        });

        test("should throw for failure", () => {
            assert.throws(() => {
                tsutil.Try.failure(ERR).valueOrThrow();
            });
        });

        test("should return null for a null value", () => {
            var t = tsutil.Try.success(null);
            assert.isNull(t.valueOrThrow());
        });
    });

    suite("valueOrElse", () => {
        test("should return value for success", () => {
            var t = tsutil.Try.success(VALUE);
            var k = t.valueOrElse(OTHER_ACCESSOR);
            assert.equal(k, VALUE);
        });

        test("should return other for failure", () => {
            var t = tsutil.Try.failure(ERR);
            var k = t.valueOrElse(OTHER_ACCESSOR);
            assert.equal(k, OTHER);
        });

        test("should return null for a null value", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.success(null);
            assert.isNull(t.valueOrElse(spy));
            sinon.assert.notCalled(spy);
        });
    });

    suite("orElse", () => {
        test("should return self for success", () => {
            var t = tsutil.Try.success(VALUE);
            var k = t.orElse(() => { return tsutil.Try.success(OTHER); });
            assert.equal(k, t);
        });

        test("should return other for failure", () => {
            var t = tsutil.Try.failure(ERR);
            var k = t.orElse(() => { return tsutil.Try.success(OTHER); });
            assert.notEqual(k, t);
        });

        test("should return this for a null value", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.success(null);
            var u = t.orElse(spy);
            sinon.assert.notCalled(spy);
            assert.equal(t, u);
        });
    });
});

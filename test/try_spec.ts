import chai = require("chai");
import tsutil = require("../src/index");
import sinon = require("sinon");

var assert = chai.assert;

describe("Try", () => {
    var VALUE = "asana";
    var VALUE_ACCESSOR = () => {
        return VALUE;
    };
    var OTHER = "luna";
    var OTHER_ACCESSOR = () => {
        return OTHER;
    };
    var ERR = new Error();

    describe("#all", () => {
        it("should return all of the values if there is not an exception", () => {
            var t = tsutil.Try.success(VALUE);
            var k = tsutil.Try.success(OTHER);
            assert.deepEqual(tsutil.Try.all([t, k]).getOrThrow(), [VALUE, OTHER]);
        });

        it("should throw if there is an exception", () => {
            var t = tsutil.Try.success(VALUE);
            var k = tsutil.Try.failure(ERR);
            assert.isTrue(tsutil.Try.all([t, k]).isFailure());
        });
    });

    describe("#attempt", () => {
        it("should return a value if successful", () => {
            var t = tsutil.Try.attempt(VALUE_ACCESSOR);
            assert.equal(t.getOrThrow(), VALUE);
        });

        it("should handle throwing an error", () => {
            var t = tsutil.Try.attempt(() => {
                throw ERR;
            });
            assert.equal(t.error(), ERR);
        });

        it("should handle a positive filter", () => {
            var t = tsutil.Try.attempt(() => {
                throw ERR;
            }, () => { return true; });
            assert.equal(t.error(), ERR);
        });

        it("should handle a negative filter", () => {
            assert.throws(() => {
                tsutil.Try.attempt(() => {
                    throw ERR;
                }, () => { return false; });
            });
        });

        it("should return a value if successful, with a negative filter", () => {
            var t = tsutil.Try.attempt(VALUE_ACCESSOR, () => {
                return false;
            });
            assert.equal(t.getOrThrow(), VALUE);
        });
    });

    describe("#success", () => {
        it("should return a successful Try", () => {
            var t = tsutil.Try.success(VALUE);
            assert.equal(t.getOrThrow(), VALUE);
        });
    });

    describe("#failure", () => {
        it("should return a failed Try", () => {
            var t = tsutil.Try.failure(ERR);
            assert.equal(t.error(), ERR);
        });
    });

    describe("constructor", () => {
        it("should handle a value", () => {
            var t = new tsutil.Try(null, VALUE);
            assert.equal(t.getOrThrow(), VALUE);
        });

        it("should handle an error", () => {
            var t = new tsutil.Try(ERR, null);
            assert.equal(t.error(), ERR);
        });
    });

    describe("error", () => {
        it("should return the error", () => {
            var t = tsutil.Try.failure(ERR);
            assert.equal(t.error(), ERR);
        });
    });

    describe("isFailure", () => {
        it("should be true for a failure", () => {
            assert.isTrue(tsutil.Try.failure(ERR).isFailure());
        });

        it("should be false for a success", () => {
            assert.isFalse(tsutil.Try.success(VALUE).isFailure());
        });
    });

    describe("isSuccess", () => {
        it("should be true for a success", () => {
            assert.isTrue(tsutil.Try.success(VALUE).isSuccess());
        });

        it("should be false for a failure", () => {
            assert.isFalse(tsutil.Try.failure(ERR).isSuccess());
        });
    });

    describe("filter", () => {
        it("should not called the callback for failure", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.failure(ERR);
            var k = t.filter(spy);
            assert.equal(k, t);
            sinon.assert.notCalled(spy);
        });

        it("should handle a positive filter", () => {
            var t = tsutil.Try.success(VALUE);
            var k = t.filter(() => { return true; });
            assert.equal(k, t);
        });

        it("should handle a negative filter", () => {
            var t = tsutil.Try.success(VALUE);
            var k = t.filter(() => { return false; });
            assert.notEqual(k, t);
            assert.isTrue(k.isFailure());
        });
    });

    describe("forEach", () => {
        it("should call the callback for success", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.success(VALUE);
            t.forEach(spy);
            sinon.assert.calledWithExactly(spy, VALUE);
        });

        it("should not call the callback for failure", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.failure(ERR);
            t.forEach(spy);
            sinon.assert.notCalled(spy);
        });
    });

    describe("map", () => {
        it("should return the new value", () => {
            var t = tsutil.Try.success(VALUE).map(OTHER_ACCESSOR);
            assert.equal(t.getOrThrow(), OTHER);
        });

        it("should return a failed try if the mapper throws", () => {
            var t = tsutil.Try.success(VALUE).map(() => { throw ERR; });
            assert.equal(t.error(), ERR);
        });

        it("should not call the new value if the try is failed", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.failure(ERR);
            var k = t.map(spy);
            assert.equal(k, t);
            sinon.assert.notCalled(spy);
        });
    });

    describe("flatMap", () => {
        it("should return the new value", () => {
            var t = tsutil.Try.success(VALUE);
            var k = tsutil.Try.success(OTHER).flatMap(() => { return t; });
            assert.equal(k, t);
        });

        it("should return a failed try if the mapper throws", () => {
            var t = tsutil.Try.failure(ERR);
            var k = t.flatMap(() => { return tsutil.Try.success(VALUE); });
            assert.equal(k, t);
        });
    });

    describe("getOrThrow", () => {
        it("should return the value for success", () => {
            var t = tsutil.Try.success(VALUE);
            assert.equal(t.getOrThrow(), VALUE);
        });

        it("should throw for failure", () => {
            assert.throws(() => {
                tsutil.Try.failure(ERR).getOrThrow();
            });
        });
    });

    describe("getOrElse", () => {
        it("should return value for success", () => {
            var t = tsutil.Try.success(VALUE);
            var k = t.getOrElse(OTHER_ACCESSOR);
            assert.equal(k, VALUE);
        });

        it("should return other for failure", () => {
            var t = tsutil.Try.failure(ERR);
            var k = t.getOrElse(OTHER_ACCESSOR);
            assert.equal(k, OTHER);
        });
    });

    describe("orElse", () => {
        it("should return self for success", () => {
            var t = tsutil.Try.success(VALUE);
            var k = t.orElse(() => { return tsutil.Try.success(OTHER); });
            assert.equal(k, t);
        });

        it("should return other for failure", () => {
            var t = tsutil.Try.failure(ERR);
            var k = t.orElse(() => { return tsutil.Try.success(OTHER); });
            assert.notEqual(k, t);
        });
    });

    describe("toOptional", () => {
        it("should return an optional for success", () => {
            assert.equal(tsutil.Try.success(VALUE).toOptional().getOrThrow(), VALUE);
        });

        it("should return NONE for failure", () => {
            assert.equal(tsutil.Try.failure(ERR).toOptional(), tsutil.Optional.NONE);
        });
    });

    describe("transform", () => {
        it("should call the success callback on success", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.success(VALUE);
            var k = tsutil.Try.success(OTHER);
            var u = t.transform(() => { return k; }, spy);
            assert.equal(u, k);
            sinon.assert.notCalled(spy);
        });

        it("should call the failure callback on failure", () => {
            var spy = sinon.spy();
            var t = tsutil.Try.failure(ERR);
            var k = tsutil.Try.success(OTHER);
            var u = t.transform(spy, () => { return k; });
            assert.equal(u, k);
            sinon.assert.notCalled(spy);
        });
    });
});

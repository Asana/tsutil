import chai = require("chai");
import Either = require("../src/either");
import Optional = require("../src/optional");
import sinon = require("sinon");

var assert = chai.assert;

describe("Either", () => {
    var LEFT_VALUE = "hello";
    var RIGHT_VALUE = "world";

    describe("static", () => {
        describe("#left()", () => {
            it("should return an Either whose left is the provided value", () => {
                var left = Either.left(LEFT_VALUE);
                assert.equal(left.leftOrNull(), LEFT_VALUE);
            });

            it("should throw an error when passed undefined", () => {
                assert.throws(() => {
                    Either.left(undefined);
                });
            });
        });

        describe("#right()", () => {
            it("should return an Either whose right is the provided value", () => {
                var right = Either.right(RIGHT_VALUE);
                assert.equal(right.rightOrNull(), RIGHT_VALUE);
            });

            it("should throw an error when passed undefined", () => {
                assert.throws(() => {
                    Either.right(undefined);
                });
            });
        });
    });

    /**
     * The tslint rule `no-unused-expression` fires incorrectly for unassigned
     * constructor calls. See https://github.com/palantir/tslint/issues/347.
     */
    /* tslint:disable no-unused-expression */
    describe("#constructor()", () => {
        it("should throw an error when passed two undefined arguments", () => {
            assert.throws(() => {
                new Either(undefined, undefined);
            });
        });

        it("should throw an error when passed two real arguments", () => {
            assert.throws(() => {
                new Either(LEFT_VALUE, RIGHT_VALUE);
            });
        });

        it("should return an Either with the provided left value", () => {
            var left = new Either(LEFT_VALUE, undefined);
            assert.equal(left.leftOrNull(), LEFT_VALUE);
        });

        it("should return an Either with the provided right value", () => {
            var right = new Either(undefined, RIGHT_VALUE);
            assert.equal(right.rightOrNull(), RIGHT_VALUE);
        });
    });
    /* tslint:enable no-unused-expression */

    var left = Either.left(LEFT_VALUE);
    var right = Either.right(RIGHT_VALUE);

    describe("#fold()", () => {
        var ON_LEFT_RESULT = "onLeft";
        var onLeft = () => {
            return ON_LEFT_RESULT;
        };
        var ON_RIGHT_RESULT = "onRight";
        var onRight = () => {
            return ON_RIGHT_RESULT;
        };

        it("should return the result of onLeft if the left value is defined", () => {
            var result = left.fold(onLeft, onRight);
            assert.equal(result, ON_LEFT_RESULT);
        });

        it("should not call onRight if the left value is defined", () => {
            var onRight = sinon.spy();
            left.fold(onLeft, onRight);
            sinon.assert.notCalled(onRight);
        });

        it("should return the result of onRight if the right value is defined", () => {
            var result = right.fold(onLeft, onRight);
            assert.equal(result, ON_RIGHT_RESULT);
        });

        it("should not call onLeft if the right value is defined", () => {
            var onLeft = sinon.spy();
            right.fold(onLeft, onRight);
            sinon.assert.notCalled(onLeft);
        });
    });

    describe("#isLeft()", () => {
        it("should return true if the left value is defined", () => {
            assert.isTrue(left.isLeft());
        });

        it("should return false if the left value is not defined", () => {
            assert.isFalse(right.isLeft());
        });
    });

    describe("#isRight()", () => {
        it("should return true if the right value is defined", () => {
            assert.isTrue(right.isRight());
        });

        it("should return false if the right value is not defined", () => {
            assert.isFalse(left.isRight());
        });
    });

    describe("#left()", () => {
        it("should return an Optional over the left value", () => {
            assert.equal(left.left().getOrThrow(), LEFT_VALUE);
        });

        it("should return an empty Optional if the left value is not defined", () => {
            assert.equal(right.left(), Optional.NONE);
        });
    });

    describe("#leftOrNull()", () => {
        it("should return the left value if it is defined", () => {
            assert.equal(left.leftOrNull(), LEFT_VALUE);
        });

        it("should return null if the left value is not defined", () => {
            assert.isNull(right.leftOrNull());
        });
    });

    describe("#right()", () => {
        it("should return an Optional over the right value", () => {
            assert.equal(right.right().getOrThrow(), RIGHT_VALUE);
        });

        it("should return an empty Optional if the right value is not defined", () => {
            assert.equal(left.right(), Optional.NONE);
        });
    });

    describe("#rightOrNull()", () => {
        it("should return the right value if it is defined", () => {
            assert.equal(right.rightOrNull(), RIGHT_VALUE);
        });

        it("should return null if the right value is not defined", () => {
            assert.isNull(left.rightOrNull());
        });
    });

    describe("#swap()", () => {
        it("should return a Left if called on a Right", () => {
            var left = right.swap();
            assert.equal(left.leftOrNull(), RIGHT_VALUE);
        });

        it("should return a Right if called on a Left", () => {
            var right = left.swap();
            assert.equal(right.rightOrNull(), LEFT_VALUE);
        });
    });
});
